const TransactionCategories = require('../enums/transactionCategories');

const transactions = [
    // Account id 1 transactions (user 1)
    { id: 1, name: "Subway", amount: 4.60, type: "expense", category: TransactionCategories.FOOD, dateMade: "20/09/2024", accountId: 1, userId: 1 },
    { id: 2, name: "Greggs", amount: 2.10, type: "expense", category: TransactionCategories.FOOD, dateMade: "10/10/2024", accountId: 1, userId: 1 },
    { id: 3, name: "JD Sports", amount: 100, type: "expense", category: TransactionCategories.CLOTHING, dateMade: "10/10/2024", accountId: 1, userId: 1 },
    { id: 4, name: "Netflix", amount: 10, type: "expense", category: TransactionCategories.SUBSCRIPTION, dateMade: "23/10/2024", accountId: 1, userId: 1, recurrentId: 1 },
    { id: 5, name: "Amazon", amount: 8.99, type: "expense", category: TransactionCategories.SUBSCRIPTION, dateMade: "20/10/2024", accountId: 1, userId: 1, recurrentId: 2 },
    { id: 6, name: "Pay Check", amount: 2400, type: "income", category: TransactionCategories.PAY_CHECK, dateMade: "15/10/2024", accountId: 1, userId: 1 },

    // Account id 4 transactions (user 2)
    { id: 7, name: "Gym Membership", amount: 17.99, type: "expense", category: TransactionCategories.DIRECT_DEBIT, dateMade: "1/09/2024", accountId: 4, userId: 2, recurrentId: 5 },
    { id: 8, name: "Groceries", amount: 75, type: "expense", category: TransactionCategories.FOOD, dateMade: "05/09/2024", accountId: 4, userId: 2 },
    { id: 9, name: "Car Insurance", amount: 120, type: "expense", category: TransactionCategories.INSURANCE, dateMade: "25/09/2024", accountId: 4, userId: 2 },
    { id: 10, name: "Pay Check", amount: 2600, type: "income", category: TransactionCategories.PAY_CHECK, dateMade: "15/10/2024", accountId: 4, userId: 2 },
    { id: 11, name: "Electricity Bill", amount: 90, type: "expense", category: TransactionCategories.UTILITIES, dateMade: "28/09/2024", accountId: 4, userId: 2 },

    // Account id 5 transactions (shared between user 1 and user 2)
    { id: 12, name: "Mortgage Payment", amount: 1000, type: "expense", category: TransactionCategories.HOUSING, dateMade: "01/10/2024", accountId: 5, userId: 1, recurrentId: 4 },
    { id: 13, name: "Water Bill", amount: 30, type: "expense", category: TransactionCategories.UTILITIES, dateMade: "15/09/2024", accountId: 5, userId: 1 },
    { id: 14, name: "Pay Check", amount: 1200, type: "income", category: TransactionCategories.PAY_CHECK, dateMade: "15/09/2024", accountId: 5, userId: 1 },
    { id: 15, name: "Home Maintenance", amount: 200, type: "expense", category: TransactionCategories.MAINTENANCE, dateMade: "10/10/2024", accountId: 5, userId: 2 },
    { id: 16, name: "Internet Bill", amount: 40, type: "expense", category: TransactionCategories.UTILITIES, dateMade: "20/10/2024", accountId: 5, userId: 1 },

    // Budget id 1 transactions (user 1, linked to account id 1)
    { id: 17, name: "Groceries", amount: 150, type: "expense", category: TransactionCategories.FOOD, dateMade: "10/10/2024", budgetId: 1, accountId: 1, userId: 1 },
    { id: 18, name: "Gas Station", amount: 50, type: "expense", category: TransactionCategories.TRANSPORT, dateMade: "09/10/2024", budgetId: 1, accountId: 1, userId: 1 },
    { id: 19, name: "Dining Out", amount: 60, type: "expense", category: TransactionCategories.FOOD, dateMade: "06/10/2024", budgetId: 1, accountId: 1, userId: 1 },
    { id: 20, name: "Streaming Service", amount: 15, type: "expense", category: TransactionCategories.SUBSCRIPTION, dateMade: "02/10/2024", budgetId: 1, accountId: 1, userId: 1 },

    // Budget id 4 transactions (user 2)
    { id: 21, name: "Groceries", amount: 200, type: "expense", category: TransactionCategories.FOOD, dateMade: "15/10/2024", accountId: 4, userId: 2 },
    { id: 22, name: "Utilities", amount: 70, type: "expense", category: TransactionCategories.UTILITIES, dateMade: "18/10/2024", accountId: 4, userId: 2 },
    { id: 23, name: "Travel Expenses", amount: 50, type: "expense", category: TransactionCategories.TRANSPORT, dateMade: "19/10/2024", accountId: 4, userId: 2 },

    // Pot id 1 transactions (user 1)
    { id: 24, name: "Bonus", amount: 300, type: "income", category: TransactionCategories.BONUS, dateMade: "10/10/2024", potId: 1, userId: 1 },
    { id: 25, name: "Side Hustle", amount: 250, type: "income", category: TransactionCategories.FREELANCING, dateMade: "05/10/2024", potId: 1, userId: 1 },
    { id: 26, name: "Gift", amount: 100, type: "income", category: TransactionCategories.GIFT, dateMade: "02/10/2024", potId: 1, userId: 1 }
];


const recurrentTransactions = [
    { 
        id: 1, 
        name: "Netflix", 
        amount: 10, 
        type: "expense", 
        category: "Subscription", 
        frequency: "monthly", 
        startDate: "23/09/2024", 
        nextDate: "23/10/2024", 
        userId: 1
    },
    { 
        id: 2, 
        name: "Amazon", 
        amount: 8.99, 
        type: "expense", 
        category: "Subscription", 
        frequency: "monthly", 
        startDate: "20/09/2024", 
        nextDate: "20/10/2024", 
        userId: 1 
    },
    { 
        id: 3, 
        name: "Car", 
        amount: 170.99, 
        type: "expense", 
        category: "Direct Debit", 
        frequency: "monthly", 
        startDate: "1/10/2024", 
        nextDate: "1/11/2024", 
        userId: 1 
    },
    { 
        id: 4, 
        name: "Mortgage", 
        amount: 1000, 
        type: "expense", 
        category: "Direct Debit", 
        frequency: "monthly", 
        startDate: "1/10/2024", 
        nextDate: "1/11/2024", 
        userId: 2 
    },
    { 
        id: 5, 
        name: "Gym Membership", 
        amount: 17.99, 
        type: "expense", 
        category: "Direct Debit", 
        frequency: "monthly", 
        startDate: "1/10/2024", 
        nextDate: "1/11/2024", 
        userId: 1
    },
];


// Helper functions

// Fetch recurrent transactions for a user
const getRecurrentTransactions = (userId) => {
    return recurrentTransactions.filter(transaction => transaction.userId === userId);
};

// Fetch transactions for each account (including shared accounts)
const getAccountTransactions = (userId, userAccounts) => {
    return transactions.filter(transaction => {
        // Get the account associated with the transaction
        const account = userAccounts.find(acc => acc.id === transaction.accountId);
        
        // If account is not found, skip this transaction
        if (!account) return false;

        // Check if the transaction's account ID matches
        const accountMatches = account.id === transaction.accountId;

        // If the account is shared, include all transactions, regardless of user
        const accountIsShared = account.sharedWithId;

        // Return true if the account matches and either it's shared or the transaction belongs to the user
        return accountMatches && (accountIsShared || transaction.userId === userId);
    });
};


// Fetch pot transactions for a user (including shared pots)
const getPotTransactions = (userId, potIds) => {
    return transactions.filter(transaction => {
        return transaction.potId && potIds.includes(transaction.potId) && transaction.userId === userId;
    });
};

// Fetch budget transactions for a user (including shared budgets)
const getBudgetTransactions = (userId, budgetIds) => {
    return transactions.filter(transaction => {
        return transaction.budgetId && budgetIds.includes(transaction.budgetId) && transaction.userId === userId;
    });
};

// Fetch all recent transactions (including shared accounts, pots, and budgets)
const getRecentTransactions = (userId, accountIds, recentDate) => {
    return transactions.filter(transaction => {
        return accountIds.includes(transaction.accountId) &&
               transaction.userId === userId &&
               new Date(transaction.dateMade) >= new Date(recentDate);
    });
};

// Fetch all transactions (including recurring and shared)
const getAllTransactions = (userId, accountIds, potIds, budgetIds) => {
    // Regular transactions (account, pot, budget)
    const regularTransactions = transactions.filter(transaction => {
        return (
            (accountIds.includes(transaction.accountId) ||
            (transaction.potId && potIds.includes(transaction.potId)) ||
            (transaction.budgetId && budgetIds.includes(transaction.budgetId))) &&
            transaction.userId === userId
        );
    });

    // Recurrent transactions for the user
    const recurrentTrans = recurrentTransactions.filter(transaction => transaction.userId === userId);

    // Combine both regular and recurrent transactions
    return [...regularTransactions, ...recurrentTrans];
};

function getTotalSpendingByCategory(userId) {
    const categoryTotals = {};
    
    // Initialize totals for each category
    Object.values(TransactionCategories).forEach(category => {
        categoryTotals[category] = 0;
    });

    // Iterate through transactions and add amounts to the corresponding category
    transactions
        .filter(transaction => transaction.userId === userId && transaction.type === 'expense')
        .forEach(transaction => {
            categoryTotals[transaction.category] += transaction.amount;
        });

    return categoryTotals;
}

// Exports

// Index - spending by category
exports.getTotalSpendingByCategoryByUser = (req, res, next) => {
    const userId = req.user.id; 

    const categorySpending = getTotalSpendingByCategory(userId);

    req.spendingByCategory = categorySpending;

    next();
};

// Profile page - Recurrent transactions
exports.getRecurrentTransactionsForUser = (req, res, next) => {
    const userId = req.user.id; 

    const recurrentTrans = getRecurrentTransactions(userId);

    req.recurrentTransactions = recurrentTrans;

    next();
};

// Accounts page - All account transactions (including shared)
exports.getAccountTransactionsForUser = (req, res, next) => {
    const userId = req.user.id;
    const userAccounts = req.userAccounts;

    const accountTrans = getAccountTransactions(userId, userAccounts);

    req.accountTransactions = accountTrans;

    next();
};

// Savings page - All pot and budget transactions (including shared)
exports.getSavingsTransactionsForUser = (req, res, next) => {
    const userId = req.user.id;
    const potIds = req.userPots.map(pot => pot.id);
    const budgetIds = req.userBudgets.map(budget => budget.id);

    const potTrans = getPotTransactions(userId, potIds); 
    const budgetTrans = getBudgetTransactions(userId, budgetIds); 

    req.potTransactions = potTrans;
    req.budgetTransactions = budgetTrans;

    next();
};

// Dashboard - Recent transactions for the logged-in user
exports.getRecentTransactionsForUser = (req, res, next) => {
    const userId = req.user.id;
    const accountIds = req.userAccounts.map(account => account.id);
    const today = new Date()
    const recentDate = new Date().setDate(today.getDate() - 30)

    const recentTrans = getRecentTransactions(userId, accountIds, recentDate);

    req.recentTransactions = recentTrans;

    next();
};

// Transactions page - All transactions (including recurring) for the logged-in user
exports.getAllTransactionsForUser = (req, res, next) => {
    const userId = req.user.id;
    const accountIds = req.userAccounts.map(account => account.id);
    const potIds = req.userPots.map(pot => pot.id);
    const budgetIds = req.userBudgets.map(budget => budget.id);

    const allTrans = getAllTransactions(userId, accountIds, potIds, budgetIds);

    req.allTransactions = allTrans;

    next();
};

