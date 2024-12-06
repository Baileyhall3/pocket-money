const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accountsController');
const budgetsController = require('../controllers/budgetsController');
const potsController = require('../controllers/potsController');
const transactionsController = require('../controllers/transactionsController');
const RecTransactionEnums = require('../enums/recurrentTransactions');

router.get('/transactions', 
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
            friends: req.friends,
        });
    }
);

router.get('/recurrentTransactions', 
    transactionsController.getRecurrentTransactionsForUser,
    (req, res) => {
        res.render('recurrentTransactions', { 
            title: "Recurrent Transactions",
            transactions: req.recurrentTransactions,
            RecTransactionEnums: RecTransactionEnums,
        });
    }
);

module.exports = router;
