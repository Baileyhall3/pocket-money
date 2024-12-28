const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accountsController');
const transactionsController = require('../controllers/transactionsController');
const budgetController = require('../controllers/budgetsController');

router.get('/dashboard', 
    accountsController.getAccountsForUser, 
    transactionsController.getRecentTransactionsForUser,
    transactionsController.getTotalSpendingByCategoryByUser,
    budgetController.getActiveBudget,
    (req, res) => {
        res.render('dashboard',
            { title: "Dashboard",
                accounts: req.userAccounts,
                transactions: req.recentTransactions,
                categorySpending: req.spendingByCategory,
                activeBudget: req.activeBudget,
            }
        );
});

module.exports = router;