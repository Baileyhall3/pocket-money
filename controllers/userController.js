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

exports.getUserPreferences = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const { data: preferences, error } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            // If no preferences exist yet, create default preferences
            if (error.code === 'PGRST116') {  // PostgreSQL "no rows returned" error
                const defaultPreferences = {
                    user_id: userId,
                    low_balance_threshold: 100,
                    transaction_alerts: true,
                    email_notifications: true,
                    budget_alerts: true,
                    default_theme: 'auto',
                    default_account_id: null,
                    active_budget_id: null,
                    default_currency: 'GBP'
                };

                const { data: newPreferences, error: insertError } = await supabase
                    .from('user_preferences')
                    .insert([defaultPreferences])
                    .select()
                    .single();

                if (insertError) throw insertError;
                req.userPreferences = newPreferences;
                return next();
            }
            throw error;
        }

        req.userPreferences = preferences;
        next();
    } catch (error) {
        next(error);
    }
};

exports.updateUserPreferences = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        // Validate the updates
        const validFields = [
            'low_balance_threshold',
            'transaction_alerts',
            'email_notifications',
            'budget_alerts',
            'default_theme',
            'default_account_id',
            'active_budget_id',
            'default_currency'
        ];

        // Filter out any invalid fields
        const validUpdates = Object.keys(updates)
            .filter(key => validFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = updates[key];
                return obj;
            }, {});

        const { data: updatedPreferences, error } = await supabase
            .from('user_preferences')
            .update(validUpdates)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;

        req.userPreferences = updatedPreferences;
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

        // Get all friendship relationships for the current user where status is true
        const { data: friendships, error: friendshipsError } = await supabase
            .from('friends')
            .select(`
                id,
                created_at,
                user_id,
                friend_id,
                user:user_id (
                    id,
                    first_name,
                    last_name,
                    profile_picture
                ),
                friend:friend_id (
                    id,
                    first_name,
                    last_name,
                    profile_picture
                )
            `)
            .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
            .eq('status', true);

        if (friendshipsError) throw friendshipsError;

        // Transform the friendships data
        const friendsList = await Promise.all(friendships.map(async (friendship) => {
            const isCurrentUserUserId = friendship.user_id === userId;
            const friend = isCurrentUserUserId ? friendship.friend : friendship.user;

            // Get this friend's own friends where status is true, excluding the current user
            const { data: friendsOfFriend, error: friendsOfFriendError } = await supabase
                .from('friends')
                .select(`
                    user:user_id (
                        id,
                        first_name,
                        last_name,
                        profile_picture
                    ),
                    friend:friend_id (
                        id,
                        first_name,
                        last_name,
                        profile_picture
                    )
                `)
                .or(`user_id.eq.${friend.id},friend_id.eq.${friend.id}`)
                .eq('status', true);

            if (friendsOfFriendError) throw friendsOfFriendError;

            // Transform friendsOfFriend and include the current user
            const transformedFriendsOfFriend = friendsOfFriend.map(f => {
                const isFriendUserId = f.user.id === friend.id;
                const friendOfFriend = isFriendUserId ? f.friend : f.user;

                return {
                    friendId: friendOfFriend.id,
                    friendName: `${friendOfFriend.first_name} ${friendOfFriend.last_name}`,
                    friendProfileImage: friendOfFriend.profile_picture
                };
            });

            // Add the current user to the friends of friend list
            transformedFriendsOfFriend.push({
                friendId: userId,
                friendName: 'You'
            });

            return {
                friendshipId: friendship.id,
                userId: friend.id,
                userName: `${friend.first_name} ${friend.last_name}`,
                created: friendship.created_at,
                friendsOfFriend: transformedFriendsOfFriend,
                profileImage: friend.profile_picture
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
                        last_name,
                        profile_picture
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
            .from('friends')
            .insert([{
                user_id: userId,
                friend_id: friendId,
                status: false
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

exports.updateFriendStatus = async (req, res, next) => {
    try {
        const { friendId, status } = req.body;
        const userId = req.user.id;

        // First try to find the friend record where the current user is the friend_id
        // (this would be the case for friend requests sent to the current user)
        let { data: friendRecord, error: fetchError } = await supabase
            .from('friends')
            .select('id, status')
            .eq('user_id', friendId)
            .eq('friend_id', userId)
            .single();

        // If not found, try to find where current user is the user_id
        // (this would be the case for friend requests sent by the current user)
        if (!friendRecord) {
            const { data: altRecord, error: altFetchError } = await supabase
                .from('friends')
                .select('id, status')
                .eq('user_id', userId)
                .eq('friend_id', friendId)
                .single();

            if (altFetchError) throw altFetchError;
            friendRecord = altRecord;
        }

        if (!friendRecord) {
            return res.status(404).send('Friend record not found.');
        }

        // Update the friend record
        const { data: updatedFriend, error: updateError } = await supabase
            .from('friends')
            .update({ status: status })
            .eq('id', friendRecord.id)
            .select()
            .single();

        if (updateError) throw updateError;

        // If the friend request was accepted, delete the corresponding alert
        if (status === true) {
            const { error: deleteError } = await supabase
                .from('alerts')
                .delete()
                .eq('user_id', userId)
                .eq('received_from_id', friendId)
                .eq('type', 'Friend Request');

            if (deleteError) {
                console.error('Error deleting friend request alert:', deleteError);
            }
        }

        req.friend = updatedFriend;
        next();
    } catch (error) {
        console.error('Error updating friend status:', error);
        next(error);
    }
};

exports.removeFriend = async (req, res, next) => {
    try {
        const friendshipId = req.params.id;
        const userId = req.user.id; // Assuming you have the authenticated user in `req.user.id`

        // Fetch the friendship to get the IDs involved (both `user_id` and `friend_id`)
        const { data: existingFriendship, error: fetchError } = await supabase
            .from('friends')
            .select('*')
            .eq('id', friendshipId)
            .single();

        if (fetchError) throw fetchError;
        if (!existingFriendship) {
            return res.status(403).send('Not authorized to delete this friendship');
        }

        // Identify which friend's ID to use for shared items (user_id or friend_id)
        const friendId = (existingFriendship.user_id === userId) 
            ? existingFriendship.friend_id 
            : existingFriendship.user_id;

        // Remove the friendship record
        const { error: deleteError } = await supabase
            .from('friends')
            .delete()
            .eq('id', friendshipId);

        if (deleteError) throw deleteError;

        // Now, handle updating shared items for both cases:
        // 1. Items where the user is the owner, and friend is `shared_with_id`
        // 2. Items where the friend is the owner, and user is `shared_with_id`

        // 1. Update items where the user is the owner, and the friend is `shared_with_id`
        for (const table of ['accounts', 'pots', 'budgets']) {
            const { data: items, error: fetchItemsError } = await supabase
                .from(table)
                .select('id, user_id, shared_with_id')
                .eq('shared_with_id', friendId);

            if (fetchItemsError) throw fetchItemsError;

            // Only update items if the user is the owner
            for (const item of items) {
                if (item.user_id === userId) {
                    const { error: updateError } = await supabase
                        .from(table)
                        .update({ shared_with_id: null })
                        .eq('id', item.id);

                    if (updateError) throw updateError;
                }
            }
        }

        // 2. Update items where the friend is the owner, and the user is `shared_with_id`
        for (const table of ['accounts', 'pots', 'budgets']) {
            const { data: items, error: fetchItemsError } = await supabase
                .from(table)
                .select('id, user_id, shared_with_id')
                .eq('shared_with_id', userId);

            if (fetchItemsError) throw fetchItemsError;

            // Only update items if the friend is the owner
            for (const item of items) {
                if (item.user_id === friendId) {
                    const { error: updateError } = await supabase
                        .from(table)
                        .update({ shared_with_id: null })
                        .eq('id', item.id);

                    if (updateError) throw updateError;
                }
            }
        }

        // Proceed to the next middleware (if any)
        next();
    } catch (error) {
        next(error);
    }
};

exports.uploadProfilePicture = async (req, res, next) => {
    try {
        // Check if a file is provided
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const userId = req.user.id;

        // Skip bucket check since it's already created in Supabase dashboard
        // Just ensure we have the correct bucket policies set
        const { error: policyError } = await supabase.storage
            .from('profile_pictures')
            .createSignedUrl(`test.txt`, 60); // Test if we can create signed URLs

        if (policyError && policyError.message.includes('bucket not found')) {
            throw new Error('Profile pictures bucket not accessible. Please check bucket exists and policies are set correctly in Supabase dashboard.');
        }

        try {
            // Delete any existing profile picture for this user
            const { data: existingFiles } = await supabase.storage
                .from('profile_pictures')
                .list(userId);

            if (existingFiles && existingFiles.length > 0) {
                await Promise.all(existingFiles.map(file => 
                    supabase.storage
                        .from('profile_pictures')
                        .remove([`${userId}/${file.name}`])
                ));
            }
        } catch (error) {
            console.error('Error cleaning up existing files:', error);
            // Continue even if cleanup fails
        }

        // Upload new profile picture
        const fileName = `profile_${Date.now()}.${req.file.mimetype.split('/')[1]}`;
        const { error: uploadError } = await supabase.storage
            .from('profile_pictures')
            .upload(`${userId}/${fileName}`, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: true,
            });

        if (uploadError) {
            console.error('Supabase Upload Error:', uploadError.message);
            throw new Error('Failed to upload profile picture.');
        }

        // Get the public URL for the uploaded image
        const { data: publicUrlData } = supabase.storage
            .from('profile_pictures')
            .getPublicUrl(`${userId}/${fileName}`);

        if (!publicUrlData) {
            throw new Error('Failed to get public URL for profile picture.');
        }

        // Update the user's profile picture URL in the users table
        const { error: userError } = await supabase
            .from('users')
            .update({ profile_picture: publicUrlData.publicUrl })
            .eq('id', userId);

        if (userError) {
            console.error('User Update Error:', userError.message);
            throw new Error('Failed to update user with new picture URL.');
        }

        // Success response
        res.status(200).json({ 
            success: true, 
            url: publicUrlData.publicUrl,
            message: 'Profile picture updated successfully!'
        });
    } catch (error) {
        console.error('Upload Profile Picture Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};
