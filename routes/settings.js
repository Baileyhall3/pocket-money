const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const accountsController = require('../controllers/accountsController');
const transactionsController = require('../controllers/transactionsController');
const alertsController = require('../controllers/alertsController');


router.get('/settings', 
    userController.getUser, 
    accountsController.getAccountsForUser, 
    transactionsController.getRecentTransactionsForUser,
    alertsController.getAlertsForUser, 
    (req, res) => {
        res.render('settings',
            { title: "Settings",
                user: req.user,
                accounts: req.userAccounts,
                transactions: req.recentTransactions,
                userAlerts: req.userAlerts,
            }
        );
});

module.exports = router;