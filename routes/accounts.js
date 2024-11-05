const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const accountsController = require('../controllers/accountsController');
const budgetsController = require('../controllers/budgetsController');
const potsController = require('../controllers/potsController');
const transactionsController = require('../controllers/transactionsController');
const alertsController = require('../controllers/alertsController');

// Accounts Page Route
router.get('/accounts', 
    userController.getUser, 
    accountsController.getAccountsForUser, 
    transactionsController.getAccountTransactionsForUser,
    userController.getFriends, 
    alertsController.getAlertsForUser, 
    (req, res) => {
        res.render('accounts', { 
            title: "Accounts",
            accounts: req.userAccounts,
            user: req.user,
            friends: req.friendsList,
            transactions: req.accountTransactions,
            userAlerts: req.userAlerts,
        });
    }
);

// Savings Page Route
router.get('/savings', 
    userController.getUser, 
    budgetsController.getBudgetsForUser, 
    potsController.getPotsForUser, 
    transactionsController.getSavingsTransactionsForUser,
    alertsController.getAlertsForUser, 
    (req, res) => {
        res.render('savings', {
            title: "Savings",
            budgets: req.userBudgets,
            pots: req.userPots,
            user: req.user,
            potTransactions: req.potTransactions,
            budgetTransactions: req.budgetTransactions,
            userAlerts: req.userAlerts,
        });
    }
);

router.get('/accounts/:id', 
    userController.getUser, 
    accountsController.getAccountById, 
    alertsController.getAlertsForUser, 
    transactionsController.getTransactionsForAccount,
    (req, res) => {
        // const accountId = parseInt(req.params.account.id);
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 10;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // Filter transactions for this account only
        const accountTransactions = req.accountTransactions

        // Get transactions for the current page
        const paginatedTransactions = accountTransactions.slice(start, end);
        const totalPages = Math.ceil(accountTransactions.length / itemsPerPage);

        res.render('accountDetails', {
            title: "Account Details",
            user: req.user,
            account: req.account,
            userAlerts: req.userAlerts,
            transactions: paginatedTransactions,
            currentPage: page,
            totalPages
        });
    }
);

router.get('/savings/pot/:id', 
    userController.getUser, 
    potsController.getPotById, 
    alertsController.getAlertsForUser, 
    transactionsController.getTransactionsForPot,
    (req, res) => {
        // const accountId = parseInt(req.params.account.id);
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 10;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // Filter transactions for this account only
        const potTransactions = req.potTransactions

        // Get transactions for the current page
        const paginatedTransactions = potTransactions.slice(start, end);
        const totalPages = Math.ceil(potTransactions.length / itemsPerPage);

        res.render('potDetails', {
            title: "Pot Details",
            user: req.user,
            pot: req.pot,
            userAlerts: req.userAlerts,
            transactions: paginatedTransactions,
            currentPage: page,
            totalPages
        });
    }
);

module.exports = router;
