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
    alertsController.getAlertsForUser, 
    (req, res) => {
        res.render('savings', {
            title: "Savings",
            budgets: req.userBudgets,
            pots: req.userPots,
            user: req.user,
            userAlerts: req.userAlerts,
        });
    }
);

router.get('/accounts/:id', 
    userController.getUser, 
    accountsController.getAccountById, 
    (req, res, next) => {
        req.sharedWithId = req.account.sharedWithId;
        req.type = 'account';
        req.id = req.account.id;
        next();
    },
    userController.getSharedWithUser,
    alertsController.getAlertsForUser, 
    transactionsController.getTransactionsForAccount,
    transactionsController.getTotalSpendingByCategoryByUser,
    (req, res) => {
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
            sharedWithUser: req.sharedWithUser,
            categorySpending: req.spendingByCategory,
            transactions: paginatedTransactions,
            currentPage: page,
            totalPages
        });
    }
);

router.get('/savings/pot/:id', 
    userController.getUser, 
    potsController.getPotById,
    (req, res, next) => {
        req.sharedWithId = req.pot.sharedWithId;
        next();
    },
    userController.getSharedWithUser,
    alertsController.getAlertsForUser, 
    transactionsController.getTransactionsForPot,
    (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 10;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        const potTransactions = req.potTransactions || [];

        // Paginate transactions for the current page
        const paginatedTransactions = potTransactions.slice(start, end);
        const totalPages = Math.ceil(potTransactions.length / itemsPerPage);

        res.render('potDetails', {
            title: "Pot Details",
            user: req.user,
            pot: req.pot,
            userAlerts: req.userAlerts,
            sharedWithUser: req.sharedWithUser,
            transactions: paginatedTransactions,
            currentPage: page,
            totalPages
        });
    }
);

router.get('/savings/budget/:id', 
    userController.getUser, 
    budgetsController.getBudgetById,
    (req, res, next) => {
        req.sharedWithId = req.budget.sharedWithId;
        req.type = 'budget';
        req.id = req.budget.id;
        next();
    },
    userController.getSharedWithUser,
    alertsController.getAlertsForUser, 
    transactionsController.getTransactionsForBudget,
    transactionsController.getTotalSpendingByCategoryByUser,
    (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 10;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        const budgetTransactions = req.budgetTransactions || [];

        // Paginate transactions for the current page
        const paginatedTransactions = budgetTransactions.slice(start, end);
        const totalPages = Math.ceil(budgetTransactions.length / itemsPerPage);

        res.render('budgetDetails', {
            title: "Budget Details",
            user: req.user,
            budget: req.budget,
            userAlerts: req.userAlerts,
            sharedWithUser: req.sharedWithUser,
            categorySpending: req.spendingByCategory,
            transactions: paginatedTransactions,
            currentPage: page,
            totalPages
        });
    }
);

module.exports = router;
