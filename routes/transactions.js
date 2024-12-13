const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accountsController');
const budgetsController = require('../controllers/budgetsController');
const potsController = require('../controllers/potsController');
const transactionsController = require('../controllers/transactionsController');
const RecTransactionEnums = require('../enums/recurrentTransactions');

const { requireAuth } = require('../middleware/auth');

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
        });
    }
);

router.post('/transactions/create', transactionsController.createTransaction, (req, res) => {
    res.json({ success: true, transaction: req.transaction });
});

router.delete('/transactions/:id', requireAuth, transactionsController.deleteTransaction, (req, res) => {
    res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
});

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
