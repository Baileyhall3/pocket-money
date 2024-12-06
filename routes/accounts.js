const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const accountsController = require('../controllers/accountsController');
const budgetsController = require('../controllers/budgetsController');
const potsController = require('../controllers/potsController');
const transactionsController = require('../controllers/transactionsController');
const AccountTypes = require('../enums/accountTypes');

// Accounts Page Route
router.get('/accounts', 
    accountsController.getAccountsForUser, 
    transactionsController.getAccountTransactionsForUser,
    userController.getFriends, 
    (req, res) => {
        res.render('accounts', { 
            title: "Accounts",
            accounts: req.userAccounts,
            friends: req.friendsList,
            transactions: req.accountTransactions,
            accountTypes: AccountTypes
        });
    }
);

// Savings Page Route
router.get('/savings', 
    budgetsController.getBudgetsForUser, 
    potsController.getPotsForUser, 
    userController.getFriends, 
    (req, res) => {
        res.render('savings', {
            title: "Savings",
            budgets: req.userBudgets,
            pots: req.userPots,
            user: req.user,
            friends: req.friendsList,
        });
    }
);

router.get('/accounts/:id', 
    accountsController.getAccountById, 
    (req, res, next) => {
        req.sharedWithId = req.account.sharedWithId;
        req.type = 'account';
        req.id = req.account.id;
        next();
    },
    userController.getSharedWithUser,
    transactionsController.getTransactionsForAccount, 
    transactionsController.getTotalSpendingByCategoryByUser,
    (req, res) => {
        const page = 1; // Default to the first page
        const itemsPerPage = 10;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        const accountTransactions = req.accountTransactions;

        // Paginate the transactions for the first page
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

// Account transactions pagination
router.get('/accounts/:id/transactions', 
    accountsController.getAccountById, 
    transactionsController.getTransactionsForAccount,
    (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 10;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // Get transactions for this account
        const accountTransactions = req.accountTransactions;

        // Paginate transactions
        const paginatedTransactions = accountTransactions.slice(start, end);
        const totalPages = Math.ceil(accountTransactions.length / itemsPerPage);

        // Render only the transactions partial
        res.render('partials/transactions', {
            transactions: paginatedTransactions,
            currentPage: page,
            totalPages
        });
    }
);

// Budget transactions pagination
router.get('/savings/budget/:id/transactions',
    budgetsController.getBudgetById,
    transactionsController.getTransactionsForBudget,
    (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 10;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        const budgetTransactions = req.budgetTransactions || [];

        // Paginate transactions
        const paginatedTransactions = budgetTransactions.slice(start, end);
        const totalPages = Math.ceil(budgetTransactions.length / itemsPerPage);

        // Render only the transactions partial
        res.render('partials/transactions', {
            transactions: paginatedTransactions,
            currentPage: page,
            totalPages
        });
    }
);

// Pot transactions pagination
router.get('/savings/pot/:id/transactions',
    potsController.getPotById,
    transactionsController.getTransactionsForPot,
    (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 10;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        const potTransactions = req.potTransactions || [];

        // Paginate transactions
        const paginatedTransactions = potTransactions.slice(start, end);
        const totalPages = Math.ceil(potTransactions.length / itemsPerPage);

        // Render only the transactions partial
        res.render('partials/transactions', {
            transactions: paginatedTransactions,
            currentPage: page,
            totalPages
        });
    }
);

router.get('/savings/pot/:id', 
    potsController.getPotById,
    (req, res, next) => {
        req.sharedWithId = req.pot.sharedWithId;
        next();
    },
    userController.getSharedWithUser,
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
            sharedWithUser: req.sharedWithUser,
            transactions: paginatedTransactions,
            currentPage: page,
            totalPages
        });
    }
);

router.get('/savings/budget/:id', 
    budgetsController.getBudgetById,
    (req, res, next) => {
        req.sharedWithId = req.budget.sharedWithId;
        req.type = 'budget';
        req.id = req.budget.id;
        next();
    },
    userController.getSharedWithUser,
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
            budget: req.budget,
            sharedWithUser: req.sharedWithUser,
            categorySpending: req.spendingByCategory,
            transactions: paginatedTransactions,
            currentPage: page,
            totalPages
        });
    }
);

module.exports = router;
