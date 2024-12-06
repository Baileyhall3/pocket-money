const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Profile Page Route
router.get('/profile', 
    userController.getUsers, 
    userController.getFriends, 
    (req, res) => {
    res.render('profile', {
        title: "Profile",
        users: req.users,
        friends: req.friendsList,
    });
});

router.get('/search', 
    userController.searchUsers, 
    (req, res) => {
    res.render('search', {
        title: "Search",
        searchResults: req.searchResults,
    });
});

module.exports = router;