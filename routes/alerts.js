const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const alertsController = require('../controllers/alertsController');

router.get('/alerts', 
    userController.getUser, 
    alertsController.getAlertsForUser, 
    (req, res) => {
        res.render('alerts',
            { title: "Alerts",
                user: req.user,
                userAlerts: req.userAlerts,
            }
        );
});

module.exports = router;