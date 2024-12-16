const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const { requireAuth } = require('../middleware/auth');

// Profile Page Route
router.get('/profile', 
    requireAuth,
    userController.getUsers, 
    userController.getFriends, 
    (req, res) => {
    res.render('profile', {
        title: "Profile",
        users: req.users,
        friends: req.friendsList,
    });
});

router.put('/update-profile', 
    requireAuth,
    userController.updateProfile,
    (req, res) => {
        res.status(200).json({ success: true, user: req.user });
    }
);

router.get('/search', 
    requireAuth,
    userController.searchUsers, 
    (req, res) => {
    res.render('search', {
        title: "Search",
        searchResults: req.searchResults,
    });
});

router.post('/friends/create', 
    requireAuth,
    userController.createFriend, 
    (req, res) => {
        res.json({ success: true, message: 'Friend added successfully!' });
});

router.put('/users/friends/update-status', 
    requireAuth, 
    userController.updateFriendStatus, 
    (req, res) => {
        res.status(200).json({ success: true, friend: req.friend });
});

router.delete('/friends/:id', requireAuth, userController.removeFriend);


module.exports = router;
