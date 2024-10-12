const user = {
    id: 1,
    firstName: 'Bailey',
    lastName: 'Hall',
    email: 'baileyhall271001@gmail.com'
};

const users = [
    { id: 1, firstName: 'Bailey', lastName: 'Hall', email: 'baileyhall271001@gmail.com' },
    { id: 2, firstName: 'Lottie', lastName: 'Anderson', email: 'charlotteandersonn@icloud.com' },
    { id: 3, firstName: 'Gayle', lastName: 'Brown', email: 'gayle22brown@gmail.com' },
    { id: 4, firstName: 'Jacob', lastName: 'Wilson', email: 'jacobwilson22@gmail.com' },
    { id: 5, firstName: 'Craig', lastName: 'Davison', email: 'cd@omega.com' },
    { id: 6, firstName: 'James', lastName: 'Clarke', email: 'jc@omega.com' },
    { id: 7, firstName: 'Jayden', lastName: 'Richardson', email: 'jr@omega.com' },
    { id: 8, firstName: 'Liam', lastName: 'Heywood', email: 'lh@omega.com' },
];

const friends = [
    { userId: 1, friendId: 2, created: '10/10/2024' },
    { userId: 1, friendId: 3, created: '10/10/2024' },
    { userId: 1, friendId: 4, created: '10/10/2024' },
    { userId: 2, friendId: 3, created: '10/10/2024' },
    { userId: 2, friendId: 4, created: '10/10/2024' },
    { userId: 5, friendId: 6, created: '10/10/2024' },
    { userId: 5, friendId: 8, created: '10/10/2024' },
    { userId: 7, friendId: 6, created: '10/10/2024' },
    { userId: 7, friendId: 8, created: '10/10/2024' },
    { userId: 7, friendId: 5, created: '10/10/2024' },
    { userId: 7, friendId: 1, created: '10/10/2024' },
    { userId: 4, friendId: 3, created: '10/10/2024' },
    { userId: 8, friendId: 1, created: '10/10/2024' },
];

exports.getUser = (req, res, next) => {
    
    // Attach user data to the response locals (to be accessed in views)
    req.user = user;
    
    // Call next middleware
    next();
};

exports.getUsers = (req, res, next) => {
    req.users = users;
    next();
};

// Helper function to get the user by ID
const getUserById = (id) => users.find(user => user.id === id);

exports.getFriends = (req, res, next) => {
    const userId = req.user.id; // Current user ID

    // friends of the current user
    const userFriends = friends.filter(friend => friend.userId === userId || friend.friendId === userId);

    // Map user friends with their names and include each friend's own friends
    const friendsList = userFriends.map(friend => {
        // Determine the actual friend's ID (who is not current user)
        const friendId = (friend.userId === userId) ? friend.friendId : friend.userId;
        const friendUser = getUserById(friendId); // Get the friend's details

        // Get this friend's own friends (excluding current user)
        const friendsOfFriend = friends.filter(f => f.userId === friendId || f.friendId === friendId)
            .filter(f => f.userId !== userId && f.friendId !== userId) // Exclude current user
            .map(f => {
                const otherFriendId = (f.userId === friendId) ? f.friendId : f.userId;
                const otherFriendInfo = getUserById(otherFriendId); // Get the other friend's info
                return {
                    friendId: otherFriendInfo.id,
                    friendName: `${otherFriendInfo.firstName} ${otherFriendInfo.lastName}`
                };
            });

        return {
            userId: friendUser.id,
            userName: `${friendUser.firstName} ${friendUser.lastName}`, // Friend's name
            created: friend.created,
            friendsOfFriend: friendsOfFriend // Friends of this friend
        };
    });

    req.friendsList = friendsList;
    next();
};
