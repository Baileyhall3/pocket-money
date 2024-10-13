const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const accountsController = require('../controllers/accountsController');
const transactionsController = require('../controllers/transactionsController');

router.get('/', 
    userController.getUser, 
    accountsController.getAccountsForUser, 
    transactionsController.getRecentTransactionsForUser,
    (req, res) => {
        res.render('index',
            { title: "Dashboard",
                user: req.user,
                accounts: req.userAccounts,
                transactions: req.recentTransactions
            }
        );
});

module.exports = router;