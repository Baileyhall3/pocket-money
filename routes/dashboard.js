const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const accountsController = require('../controllers/accountsController');
const transactionsController = require('../controllers/transactionsController');
const alertsController = require('../controllers/alertsController');


router.get('/index', 
    userController.getUser, 
    accountsController.getAccountsForUser, 
    transactionsController.getRecentTransactionsForUser,
    alertsController.getAlertsForUser, 
    transactionsController.getTotalSpendingByCategoryByUser,
    (req, res) => {
        res.render('index',
            { title: "Dashboard",
                user: req.user,
                accounts: req.userAccounts,
                transactions: req.recentTransactions,
                userAlerts: req.userAlerts,
                categorySpending: req.spendingByCategory,
            }
        );
});

module.exports = router;