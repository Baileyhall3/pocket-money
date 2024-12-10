const supabase = require('../config/database');

exports.getUser = async (req, res, next) => {
    try {
        // Get the current authenticated user from Supabase session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!session) {
            return res.redirect('/login');
        }

        // Get the user's profile data
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (userError) throw userError;
        if (!user) {
            return res.status(404).send('User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('*');

        if (error) throw error;

        req.users = users;
        next();
    } catch (error) {
        next(error);
    }
};

// Helper function to get user by ID
const getUserById = async (id) => {
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return user;
};

exports.getFriends = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get all friendship relationships for the current user
        const { data: friendships, error: friendshipsError } = await supabase
            .from('friends')
            .select(`
                id,
                created_at,
                friend:friend_id (
                    id,
                    first_name,
                    last_name
                )
            `)
            .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

        if (friendshipsError) throw friendshipsError;

        // Transform the friendships data
        const friendsList = await Promise.all(friendships.map(async (friendship) => {
            // Get the friend's ID (the one who isn't the current user)
            const friendId = friendship.friend.id;

            // Get this friend's own friends
            const { data: friendsOfFriend, error: friendsOfFriendError } = await supabase
                .from('friends')
                .select(`
                    friend:friend_id (
                        id,
                        first_name,
                        last_name
                    )
                `)
                .or(`user_id.eq.${friendId},friend_id.eq.${friendId}`)
                .neq('friend_id', userId);

            if (friendsOfFriendError) throw friendsOfFriendError;

            return {
                userId: friendId,
                userName: `${friendship.friend.first_name} ${friendship.friend.last_name}`,
                created: friendship.created_at,
                friendsOfFriend: friendsOfFriend.map(f => ({
                    friendId: f.friend.id,
                    friendName: `${f.friend.first_name} ${f.friend.last_name}`
                }))
            };
        }));

        req.friendsList = friendsList;
        next();
    } catch (error) {
        next(error);
    }
};

exports.searchUsers = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const searchTerm = req.query.search || "";

        // Search for users
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*')
            .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
            .neq('id', userId);

        if (usersError) throw usersError;

        // Get current user's friends
        const { data: friendships, error: friendshipsError } = await supabase
            .from('friends')
            .select('friend_id')
            .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

        if (friendshipsError) throw friendshipsError;

        // Transform friend IDs into a Set for easy lookup
        const friendIds = new Set(friendships.map(f => f.friend_id));

        // Map users with additional friend information
        const searchResultsWithFriends = await Promise.all(users.map(async user => {
            // Check if this user is a friend
            const isFriend = friendIds.has(user.id);

            // Get this user's friends
            const { data: userFriends, error: userFriendsError } = await supabase
                .from('friends')
                .select(`
                    friend:friend_id (
                        first_name,
                        last_name
                    )
                `)
                .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
                .neq('friend_id', userId);

            if (userFriendsError) throw userFriendsError;

            const friendsOfUser = userFriends.map(f => 
                `${f.friend.first_name} ${f.friend.last_name}`
            );

            return {
                ...user,
                isFriend,
                friendsOfUser
            };
        }));

        req.searchResults = searchResultsWithFriends;
        next();
    } catch (error) {
        next(error);
    }
};

exports.getSharedWithUser = async (req, res, next) => {
    try {
        const sharedWithId = req.sharedWithId;

        if (!sharedWithId) {
            req.sharedWithUser = null;
            return next();
        }

        const sharedWithUser = await getUserById(sharedWithId);
        req.sharedWithUser = sharedWithUser;
        next();
    } catch (error) {
        next(error);
    }
};

// New authentication methods

exports.signUp = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
        });

        if (authError) throw authError;

        // Create user profile
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert([{
                id: authData.user.id,
                first_name: firstName,
                last_name: lastName,
                email
            }])
            .select()
            .single();

        if (userError) throw userError;

        req.user = userData;
        next();
    } catch (error) {
        next(error);
    }
};

exports.signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        req.session = data.session;
        next();
    } catch (error) {
        next(error);
    }
};

exports.signOut = async (req, res, next) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        next();
    } catch (error) {
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        const { data: updatedUser, error } = await supabase
            .from('users')
            .update({
                first_name: updates.firstName,
                last_name: updates.lastName,
                email: updates.email
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;

        req.user = updatedUser;
        next();
    } catch (error) {
        next(error);
    }
};


exports.createFriend = async (req, res, next) => {
    try {
        const { friendId } = req.body;
        const userId = req.user.id;

        const { data: newFriend, error } = await supabase
            .from('accounts')
            .insert([{
                user_id: userId,
                friend_id: friendId,
            }])
            .select()
            .single();

        if (error) throw error;

        req.friend = newFriend;
        next();
    } catch (error) {
        next(error);
    }
};