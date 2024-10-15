const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Profile Page Route
router.get('/profile', userController.getUser, userController.getUsers, userController.getFriends, (req, res) => {
    res.render('profile', {
        title: "Profile",
        user: req.user,
        users: req.users,
        friends: req.friendsList
    });
});

router.get('/search', userController.getUser, userController.searchUsers, (req, res) => {
    res.render('search', {
        title: "Search",
        user: req.user,
        searchResults: req.searchResults,
    });
});

module.exports = router;