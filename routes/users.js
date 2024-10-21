const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const alertsController = require('../controllers/alertsController');

// Profile Page Route
router.get('/profile', 
    userController.getUser, 
    userController.getUsers, 
    userController.getFriends, 
    alertsController.getAlertsForUser, 
    (req, res) => {
    res.render('profile', {
        title: "Profile",
        user: req.user,
        users: req.users,
        friends: req.friendsList,
        userAlerts: req.userAlerts
    });
});

router.get('/search', 
    userController.getUser, 
    userController.searchUsers, 
    alertsController.getAlertsForUser, 
    (req, res) => {
    res.render('search', {
        title: "Search",
        user: req.user,
        searchResults: req.searchResults,
        userAlerts: req.userAlerts
    });
});

module.exports = router;