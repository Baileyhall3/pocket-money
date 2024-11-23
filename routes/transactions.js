const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const accountsController = require('../controllers/accountsController');
const budgetsController = require('../controllers/budgetsController');
const potsController = require('../controllers/potsController');
const transactionsController = require('../controllers/transactionsController');
const alertsController = require('../controllers/alertsController');
const RecTransactionEnums = require('../enums/recurrentTransactions');

router.get('/transactions', 
    userController.getUser, 
    accountsController.getAccountsForUser, 
    potsController.getPotsForUser,
    budgetsController.getBudgetsForUser, 
    transactionsController.getAllTransactionsForUser,
    alertsController.getAlertsForUser, 
    (req, res) => {
        res.render('transactions', { 
            title: "Transactions",
            userAccounts: req.userAccounts,
            userPots: req.userPots,
            userBudgets: req.userBudgets,
            transactions: req.allTransactions,
            user: req.user,
            friends: req.friends,
            userAlerts: req.userAlerts
        });
    }
);

router.get('/recurrentTransactions', 
    userController.getUser, 
    transactionsController.getRecurrentTransactionsForUser,
    alertsController.getAlertsForUser, 
    (req, res) => {
        res.render('recurrentTransactions', { 
            title: "Recurrent Transactions",
            transactions: req.recurrentTransactions,
            user: req.user,
            userAlerts: req.userAlerts,
            RecTransactionEnums: RecTransactionEnums,
        });
    }
);

module.exports = router;
