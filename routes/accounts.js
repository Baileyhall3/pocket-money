const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const accountsController = require('../controllers/accountsController');
const budgetsController = require('../controllers/budgetsController');
const potsController = require('../controllers/potsController');
const transactionsController = require('../controllers/transactionsController');

const { requireAuth } = require('../middleware/auth');

// Accounts Page Route
router.get('/accounts', 
    accountsController.getAccountsForUser, 
    transactionsController.getAccountTransactionsForUser,
    (req, res) => {
        res.render('accounts', { 
            title: "Accounts",
            accounts: req.userAccounts,
            transactions: req.accountTransactions,
        });
    }
);

// Accounts
router.post('/accounts/create', requireAuth, accountsController.createAccount, (req, res) => {
    res.json({ success: true, account: req.account });
});

router.put('/update-account/:id', 
    requireAuth,
    accountsController.updateAccount,
    (req, res) => {
        res.status(200).json({ success: true, account: req.account });
    }
);

router.put('/accounts/:id', accountsController.updateAccount, (req, res) => {
    res.status(200).json({ success: true, message: 'Account updated successfully' });
});

router.put('/accounts/:id/leave', requireAuth, accountsController.leaveAccount, (req, res) => {
    res.status(200).json({ success: true, message: 'Successfully left the account' });
});

router.delete('/accounts/:id', requireAuth, accountsController.deleteAccount, (req, res) => {
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
});

router.post('/accounts/transfer', requireAuth, accountsController.transferBalance);


// Pots
router.post('/pots/create', requireAuth, potsController.createPot, (req, res) => {
    res.json({ success: true, pot: req.pot });
});

router.put('/update-pot/:id', 
    requireAuth,
    potsController.updatePot,
    (req, res) => {
        res.status(200).json({ success: true, pot: req.pot });
    }
);

router.put('/pots/:id', potsController.updatePot, (req, res) => {
    res.status(200).json({ success: true, message: 'Pot updated successfully' });
});

router.put('/pots/:id/leave', requireAuth, potsController.leavePot, (req, res) => {
    res.status(200).json({ success: true, message: 'Successfully left the pot' });
});

router.delete('/pots/:id', requireAuth, potsController.deletePot, (req, res) => {
    res.status(200).json({ success: true, message: 'Pot deleted successfully' });
});


// Budgets
router.post('/budgets/create', requireAuth, budgetsController.createBudget, (req, res) => {
    res.json({ success: true, budget: req.budget });
});

router.put('/update-budget/:id', 
    requireAuth,
    budgetsController.updateBudget,
    (req, res) => {
        res.status(200).json({ success: true, budget: req.budget });
    }
);

router.put('/budgets/:id', budgetsController.updateBudget, (req, res) => {
    res.status(200).json({ success: true, message: 'Budget updated successfully' });
});

router.put('/budgets/:id/leave', requireAuth, budgetsController.leaveBudget, (req, res) => {
    res.status(200).json({ success: true, message: 'Successfully left the budget' });
});

router.delete('/budgets/:id', requireAuth, budgetsController.deleteBudget, (req, res) => {
    res.status(200).json({ success: true, message: 'Budget deleted successfully' });
});


// Savings Page Route
router.get('/savings', 
    budgetsController.getBudgetsForUser, 
    potsController.getPotsForUser,
    (req, res) => {
        res.render('savings', {
            title: "Savings",
            budgets: req.userBudgets,
            pots: req.userPots,
        });
    }
);

router.get('/accounts/:id', 
    accountsController.getAccountById, 
    (req, res, next) => {
        req.sharedWithId = req.account.shared_with_id;
        req.owner_id = req.account.user_id;
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
        req.sharedWithId = req.pot.shared_with_id;
        req.owner_id = req.pot.user_id;
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
        req.sharedWithId = req.budget.shared_with_id;
        req.owner_id = req.budget.user_id;
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

router.get('/accounts/account-data/:id', 
    accountsController.getAccountById,
    transactionsController.getTransactionsForAccount,
    (req, res) => {
        if (!req.account) {
            return res.status(404).json({ error: 'Chart not found' });
        }

        res.json({
            id: req.account.id,
            account: req.account,
            transactions: req.accountTransactions,
        });
    }
);

router.get('/savings/pot-data/:id', 
    potsController.getPotById,
    (req, res) => {
        if (!req.pot) {
            return res.status(404).json({ error: 'Pot not found' });
        }

        res.json({
            id: req.pot.id,
            name: req.pot.name,
            actual_amount: req.pot.actual_amount,
            target_amount: req.pot.target_amount,
            shared_with_id: req.pot.shared_with_id
        });
    }
);

router.get('/savings/budget-data/:id', 
    budgetsController.getBudgetById,
    (req, res) => {
        if (!req.budget) {
            return res.status(404).json({ error: 'Pot not found' });
        }

        res.json({
            id: req.budget.id,
            name: req.budget.name,
            actual_amount: req.budget.actual_amount,
            target_amount: req.budget.target_amount,
            shared_with_id: req.budget.shared_with_id
        });
    }
);

module.exports = router;
