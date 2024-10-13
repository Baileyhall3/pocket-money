const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const accountsController = require('../controllers/accountsController');
const budgetsController = require('../controllers/budgetsController');
const potsController = require('../controllers/potsController');
const transactionsController = require('../controllers/transactionsController');

// Accounts Page Route
router.get('/accounts', 
    userController.getUser, 
    accountsController.getAccountsForUser, 
    transactionsController.getAccountTransactionsForUser,
    userController.getFriends, 
    (req, res) => {
        res.render('accounts', { 
            title: "Accounts",
            accounts: req.userAccounts,
            user: req.user,
            friends: req.friendsList,
            transactions: req.accountTransactions
        });
    }
);

// Savings Page Route
router.get('/savings', 
    userController.getUser, 
    budgetsController.getBudgetsForUser, 
    potsController.getPotsForUser, 
    transactionsController.getSavingsTransactionsForUser,
    (req, res) => {
        res.render('savings', {
            title: "Savings",
            budgets: req.userBudgets,
            pots: req.userPots,
            user: req.user,
            potTransactions: req.potTransactions,
            budgetTransactions: req.budgetTransactions 
        });
    }
);

module.exports = router;
