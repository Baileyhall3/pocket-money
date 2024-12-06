const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accountsController');
const transactionsController = require('../controllers/transactionsController');
const budgetsController = require('../controllers/budgetsController');

router.get('/settings', 
    accountsController.getAccountsForUser, 
    transactionsController.getRecentTransactionsForUser,
    budgetsController.getBudgetsForUser,
    (req, res) => {
        res.render('settings',
            { title: "Settings",
                accounts: req.userAccounts,
                transactions: req.recentTransactions,
                budgets: req.userBudgets,
            }
        );
});

module.exports = router;