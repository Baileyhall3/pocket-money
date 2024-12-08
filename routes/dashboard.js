const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accountsController');
const transactionsController = require('../controllers/transactionsController');

router.get('/dashboard', 
    accountsController.getAccountsForUser, 
    transactionsController.getRecentTransactionsForUser,
    transactionsController.getTotalSpendingByCategoryByUser,
    (req, res) => {
        res.render('dashboard',
            { title: "Dashboard",
                accounts: req.userAccounts,
                transactions: req.recentTransactions,
                categorySpending: req.spendingByCategory,
            }
        );
});

module.exports = router;