const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accountsController');
const transactionsController = require('../controllers/transactionsController');
const budgetsController = require('../controllers/budgetsController');
const userController = require('../controllers/userController');

router.get('/settings', 
    accountsController.getAccountsForUser, 
    transactionsController.getRecentTransactionsForUser,
    budgetsController.getBudgetsForUser,
    (req, res) => {
        res.render('settings',
            { title: "Settings",
                accounts: req.userAccounts,
                transactions: req.recentTransactions,
                budgets: req.userBudgets
            }
        );
});

router.post('/settings/preferences',
    userController.getUser,
    userController.updateUserPreferences,
    (req, res) => {
        res.json({
            success: true,
            preferences: req.userPreferences
        });
    }
);

module.exports = router;
