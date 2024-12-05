const TransactionCategories = require('../enums/transactionCategories');
const RecTransactionEnums = require('../enums/recurrentTransactions');

const transactions = [
    // Account id 1 transactions (user 1)
    { id: 1, name: "Subway", amount: 4.60, type: "expense", category: TransactionCategories.FOOD, dateMade: "18/11/2024", accountId: 1, userId: 1 },
    { id: 2, name: "Greggs", amount: 2.10, type: "expense", category: TransactionCategories.FOOD, dateMade: "15/11/2024", accountId: 1, userId: 1 },
    { id: 3, name: "JD Sports", amount: 100, type: "expense", category: TransactionCategories.CLOTHING, dateMade: "18/11/2024", accountId: 1, userId: 1 },
    { id: 4, name: "Netflix", amount: 10, type: "expense", category: TransactionCategories.SUBSCRIPTION, dateMade: "17/11/2024", accountId: 1, userId: 1, recurrentId: 1 },
    { id: 5, name: "Amazon", amount: 8.99, type: "expense", category: TransactionCategories.SUBSCRIPTION, dateMade: "15/11/2024", accountId: 1, userId: 1, recurrentId: 2 },
    { id: 6, name: "Pay Check", amount: 2400, type: "income", category: TransactionCategories.PAY_CHECK, dateMade: "15/11/2024", accountId: 1, userId: 1 },
    { id: 95, name: "Pay Check", amount: 2400, type: "income", category: TransactionCategories.PAY_CHECK, dateMade: "15/11/2024", accountId: 1, userId: 1 },


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
    { id: 17, name: "Groceries", amount: 150, type: "expense", category: TransactionCategories.FOOD, dateMade: "10/11/2024", budgetId: 1, accountId: 1, userId: 1 },
    { id: 18, name: "Gas Station", amount: 50, type: "expense", category: TransactionCategories.TRANSPORT, dateMade: "09/11/2024", budgetId: 1, accountId: 1, userId: 1 },
    { id: 19, name: "Dining Out", amount: 60, type: "expense", category: TransactionCategories.FOOD, dateMade: "06/11/2024", budgetId: 1, accountId: 1, userId: 1 },
    { id: 20, name: "Streaming Service", amount: 15, type: "expense", category: TransactionCategories.SUBSCRIPTION, dateMade: "02/11/2024", budgetId: 1, accountId: 1, userId: 1 },

    // Budget id 4 transactions (user 2)
    { id: 21, name: "Groceries", amount: 200, type: "expense", category: TransactionCategories.FOOD, dateMade: "15/10/2024", accountId: 4, userId: 2 },
    { id: 22, name: "Utilities", amount: 70, type: "expense", category: TransactionCategories.UTILITIES, dateMade: "18/10/2024", accountId: 4, userId: 2 },
    { id: 23, name: "Travel Expenses", amount: 50, type: "expense", category: TransactionCategories.TRANSPORT, dateMade: "19/10/2024", accountId: 4, userId: 2 },

    // Pot id 1 transactions (user 1)
    { id: 24, name: "Bonus", amount: 300, type: "income", category: TransactionCategories.BONUS, dateMade: "10/11/2024", potId: 1, userId: 1 },
    { id: 25, name: "Side Hustle", amount: 250, type: "income", category: TransactionCategories.FREELANCING, dateMade: "09/11/2024", potId: 1, userId: 1 },
    { id: 26, name: "Gift", amount: 100, type: "income", category: TransactionCategories.GIFT, dateMade: "06/11/2024", potId: 1, userId: 1 },

    // Budget 6
    { id: 27, name: "Bailey wage", amount: 2200, type: "income", category: TransactionCategories.PAY_CHECK, dateMade: "15/12/2024", budgetId: 6, userId: 1 },
    { id: 28, name: "Charlotte wage", amount: 2200, type: "income", category: TransactionCategories.PAY_CHECK, dateMade: "24/12/2024", budgetId: 6, userId: 2 },
    { id: 29, name: "Mortgage", amount: 1178, type: "expense", category: TransactionCategories.HOUSING, dateMade: "17/12/2024", budgetId: 6, userId: 1 },
    { id: 30, name: "Bailey Car", amount: 170, type: "expense", category: TransactionCategories.DIRECT_DEBIT, dateMade: "01/01/2025", budgetId: 6, userId: 1 },

    { id: 31, name: "Charlotte Car", amount: 230, type: "expense", category: TransactionCategories.DIRECT_DEBIT, dateMade: "24/12/2024", budgetId: 6, userId: 2 },
    { id: 32, name: "Charlotte Car Insurance", amount: 60, type: "expense", category: TransactionCategories.INSURANCE, dateMade: "24/12/2024", budgetId: 6, userId: 2 },

    { id: 33, name: "Bailey Car Insurance", amount: 65, type: "expense", category: TransactionCategories.INSURANCE, dateMade: "22/12/2024", budgetId: 6, userId: 1 },
    { id: 34, name: "Bailey Phone", amount: 25, type: "expense", category: TransactionCategories.DIRECT_DEBIT, dateMade: "22/12/2024", budgetId: 6, userId: 1 },
    { id: 35, name: "Charlotte Phone", amount: 67, type: "expense", category: TransactionCategories.DIRECT_DEBIT, dateMade: "24/12/2024", budgetId: 6, userId: 2 },
    { id: 36, name: "Bailey Other Bills", amount: 50, type: "expense", category: TransactionCategories.DIRECT_DEBIT, dateMade: "01/01/2025", budgetId: 6, userId: 1 },

    { id: 37, name: "House Bills", amount: 300, type: "expense", category: TransactionCategories.DIRECT_DEBIT, dateMade: "01/01/2025", budgetId: 6, userId: 1 },
    { id: 38, name: "Bailey Dinners", amount: 100, type: "expense", category: TransactionCategories.FOOD, dateMade: "20/12/2025", budgetId: 6, userId: 1 },
    { id: 39, name: "Food for house", amount: 200, type: "expense", category: TransactionCategories.FOOD, dateMade: "20/12/2025", budgetId: 6, userId: 1 },
    { id: 40, name: "Charlotte Dinners", amount: 100, type: "expense", category: TransactionCategories.FOOD, dateMade: "20/12/2025", budgetId: 6, userId: 2 },


];


const recurrentTransactions = [
    // Monthly Transaction Example
    {
        id: 1,
        category: TransactionCategories.HOUSING,
        description: "Monthly rent payment",
        amount: 1200,
        frequency: RecTransactionEnums.RecTransactionFrequencies.MONTHLY,
        startDate: "2024-01-01",
        endDate: null, // Null indicates no defined end date
        type: "expense",
        userId: 1,
    },
    // Bi-Weekly Transaction Example
    {
        id: 2,
        category: TransactionCategories.PAY_CHECK,
        description: "Bi-weekly paycheck from employer",
        amount: 1500,
        frequency: RecTransactionEnums.RecTransactionFrequencies.BI_WEEKLY,
        startDate: "2024-01-05",
        endDate: null,
        type: "income",
        userId: 1,
    },
    // Weekly Transaction Example
    {
        id: 3,
        category: TransactionCategories.UTILITIES,
        description: "Weekly cleaning service",
        amount: 75,
        frequency: RecTransactionEnums.RecTransactionFrequencies.WEEKLY,
        startDate: "2024-01-07",
        endDate: "2024-06-30",
        type: "expense",
        userId: 1,
    },
    // Daily Transaction Example
    {
        id: 4,
        category: TransactionCategories.SAVINGS,
        description: "Daily transfer to savings account",
        amount: 10,
        frequency: RecTransactionEnums.RecTransactionFrequencies.DAILY,
        startDate: "2024-01-01",
        endDate: null,
        type: "expense",
        userId: 1,
    },
    // Random Transaction Example
    {
        id: 5,
        category: TransactionCategories.DONATION,
        description: "Occasional charity donations",
        amount: 50,
        frequency: RecTransactionEnums.RecTransactionFrequencies.RANDOM,
        startDate: "2024-01-01",
        endDate: null,
        type: "expense",
        userId: 1,
    },
    // Custom Frequency Transaction Example
    {
        id: 6,
        category: TransactionCategories.INSURANCE,
        description: "Insurance payment every 45 days",
        amount: 200,
        frequency: RecTransactionEnums.RecTransactionFrequencies.CUSTOM,
        customFrequency: "45 days",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        type: "expense",
        userId: 1,
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
        debugger;
        return transaction.potId && potIds.includes(transaction.potId) && transaction.userId === userId;
    });
};

// Fetch budget transactions for a user (including shared budgets)
const getBudgetTransactions = (budgetIds) => {
    return transactions.filter(transaction => {
        return transaction.budgetId && budgetIds.includes(transaction.budgetId);
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

function getTotalSpendingByCategory(userId, type = null, id = null) {
    const categoryTotals = {};

    // Initialize totals for each category
    Object.values(TransactionCategories).forEach(category => {
        categoryTotals[category] = 0;
    });

    let objectIdField = null;
    let objectType = '';

    if (type) {
        objectIdField = type + 'Id';
        objectType = type;
    }

    // Iterate through transactions and filter by userId, type, and id if specified
    transactions
        .filter(transaction => {
            return (
                transaction.userId === userId &&
                transaction.type === 'expense' &&
                (type ? (type === objectType && transaction[objectIdField] === id) :
                transaction.id != -1)
            );
        })
        .forEach(transaction => {
            categoryTotals[transaction.category] += transaction.amount;
        });

    return categoryTotals;
}

// Exports

exports.getTotalSpendingByCategoryByUser = (req, res, next) => {
    const userId = req.user.id; 
    const type = req.type; // Use type set by the route
    const id = req.id;

    // Pass userId, type, and id to getTotalSpendingByCategory
    const categorySpending = getTotalSpendingByCategory(userId, type, id);

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

// Accounts detail page - All account transactions for a given account
exports.getTransactionsForAccount = (req, res, next) => {
    const userId = req.user.id;
    const userAccount = req.account;

    const accountTrans = getAccountTransactions(userId, [userAccount]);

    req.accountTransactions = accountTrans;

    next();
};

// Pot detail page - All pot transactions for a given pot
exports.getTransactionsForPot = (req, res, next) => {
    const userId = req.user.id;
    const userPotId = req.pot.id;

    const potTrans = getPotTransactions(userId, [userPotId]);

    req.potTransactions = potTrans;

    next();
};

// Budget detail page - All pot transactions for a given budget
exports.getTransactionsForBudget = (req, res, next) => {
    // const userId = req.user.id;
    const userBudgetId = req.budget.id;

    const budgetTrans = getBudgetTransactions([userBudgetId]);

    req.budgetTransactions = budgetTrans;

    next();
};

// Savings page - All pot and budget transactions (including shared)
exports.getSavingsTransactionsForUser = (req, res, next) => {
    const userId = req.user.id;
    const potIds = req.userPots.map(pot => pot.id);
    const budgetIds = req.userBudgets.map(budget => budget.id);

    const potTrans = getPotTransactions(userId, potIds); 
    const budgetTrans = getBudgetTransactions(budgetIds); 

    req.potTransactions = potTrans;
    req.budgetTransactions = budgetTrans;

    next();
};

// Dashboard - Recent transactions for the logged-in user
exports.getRecentTransactionsForUser = (req, res, next) => {
    const userId = req.user.id;
    const accountIds = req.userAccounts.map(account => account.id);
    const today = new Date()
    const recentDate = new Date().setDate(today.getDate() - 60)

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

