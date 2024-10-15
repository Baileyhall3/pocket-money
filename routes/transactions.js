const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const accountsController = require('../controllers/accountsController');
const budgetsController = require('../controllers/budgetsController');
const potsController = require('../controllers/potsController');
const transactionsController = require('../controllers/transactionsController');

router.get('/transactions', 
    userController.getUser, 
    accountsController.getAccountsForUser, 
    potsController.getPotsForUser,
    budgetsController.getBudgetsForUser, 
    transactionsController.getAllTransactionsForUser,
    (req, res) => {
        res.render('transactions', { 
            title: "Transactions",
            userAccounts: req.userAccounts,
            userPots: req.userPots,
            userBudgets: req.userBudgets,
            transactions: req.allTransactions,
            user: req.user,
            friends: req.friends
        });
    }
);

module.exports = router;
