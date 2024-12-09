const TransactionCategories = require('../enums/transactionCategories');
const RecTransactionEnums = require('../enums/recurrentTransactions');
const supabase = require('../config/database');

// Helper functions

// Fetch recurrent transactions for a user
const getRecurrentTransactions = async (userId) => {
    const { data, error } = await supabase
        .from('recurrent_transactions')
        .select('*')
        .eq('user_id', userId);

    if (error) throw error;
    return data;
};

// Fetch transactions for each account (including shared accounts)
const getAccountTransactions = async (userId, userAccounts) => {
    const accountIds = userAccounts.map(acc => acc.id);
    
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .in('account_id', accountIds)
        .or(`user_id.eq.${userId},account_id.in.(${accountIds.join(',')})`);

    if (error) throw error;
    return data;
};

// Fetch pot transactions for a user (including shared pots)
const getPotTransactions = async (userId, potIds) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .in('pot_id', potIds)
        .eq('user_id', userId);

    if (error) throw error;
    return data;
};

// Fetch budget transactions for a user (including shared budgets)
const getBudgetTransactions = async (budgetIds) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .in('budget_id', budgetIds);

    if (error) throw error;
    return data;
};

// Fetch all recent transactions (including shared accounts, pots, and budgets)
const getRecentTransactions = async (userId, accountIds, recentDate) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .in('account_id', accountIds)
        .eq('user_id', userId)
        .gte('date_made', recentDate)
        .order('date_made', { ascending: false });

    if (error) throw error;
    return data;
};

// Fetch all transactions (including recurring and shared)
const getAllTransactions = async (userId, accountIds, potIds, budgetIds) => {
    // Regular transactions query
    const { data: regularTransactions, error: regularError } = await supabase
        .from('transactions')
        .select('*')
        .or(`account_id.in.(${accountIds.join(',')}),pot_id.in.(${potIds.join(',')}),budget_id.in.(${budgetIds.join(',')})`)
        .eq('user_id', userId);

    if (regularError) throw regularError;

    // Recurrent transactions query
    const { data: recurrentTransactions, error: recurrentError } = await supabase
        .from('recurrent_transactions')
        .select('*')
        .eq('user_id', userId);

    if (recurrentError) throw recurrentError;

    return [...regularTransactions, ...recurrentTransactions];
};

const getTotalSpendingByCategory = async (userId, type = null, id = null) => {
    let query = supabase
        .from('transactions')
        .select('category, amount')
        .eq('user_id', userId)
        .eq('type', 'expense');

    if (type && id) {
        query = query.eq(`${type}_id`, id);
    }

    const { data, error } = await query;
    if (error) throw error;

    const categoryTotals = {};
    Object.values(TransactionCategories).forEach(category => {
        categoryTotals[category] = 0;
    });

    data.forEach(transaction => {
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
    });

    return categoryTotals;
};

// Exports

exports.getTotalSpendingByCategoryByUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const type = req.type;
        const id = req.id;

        const categorySpending = await getTotalSpendingByCategory(userId, type, id);
        req.spendingByCategory = categorySpending;
        next();
    } catch (error) {
        next(error);
    }
};

// Profile page - Recurrent transactions
exports.getRecurrentTransactionsForUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const recurrentTrans = await getRecurrentTransactions(userId);
        req.recurrentTransactions = recurrentTrans;
        next();
    } catch (error) {
        next(error);
    }
};

// Accounts page - All account transactions (including shared)
exports.getAccountTransactionsForUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userAccounts = req.userAccounts;
        const accountTrans = await getAccountTransactions(userId, userAccounts);
        req.accountTransactions = accountTrans;
        next();
    } catch (error) {
        next(error);
    }
};

// Accounts detail page - All account transactions for a given account
exports.getTransactionsForAccount = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userAccount = req.account;
        const accountTrans = await getAccountTransactions(userId, [userAccount]);
        req.accountTransactions = accountTrans;
        next();
    } catch (error) {
        next(error);
    }
};

// Pot detail page - All pot transactions for a given pot
exports.getTransactionsForPot = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userPotId = req.pot.id;
        const potTrans = await getPotTransactions(userId, [userPotId]);
        req.potTransactions = potTrans;
        next();
    } catch (error) {
        next(error);
    }
};

// Budget detail page - All pot transactions for a given budget
exports.getTransactionsForBudget = async (req, res, next) => {
    try {
        const userBudgetId = req.budget.id;
        const budgetTrans = await getBudgetTransactions([userBudgetId]);
        req.budgetTransactions = budgetTrans;
        next();
    } catch (error) {
        next(error);
    }
};

// Savings page - All pot and budget transactions (including shared)
exports.getSavingsTransactionsForUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const potIds = req.userPots.map(pot => pot.id);
        const budgetIds = req.userBudgets.map(budget => budget.id);

        const [potTrans, budgetTrans] = await Promise.all([
            getPotTransactions(userId, potIds),
            getBudgetTransactions(budgetIds)
        ]);

        req.potTransactions = potTrans;
        req.budgetTransactions = budgetTrans;
        next();
    } catch (error) {
        next(error);
    }
};

// Dashboard - Recent transactions for the logged-in user
exports.getRecentTransactionsForUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const accountIds = req.userAccounts.map(account => account.id);
        const today = new Date();
        const recentDate = new Date(today.setDate(today.getDate() - 60)).toISOString();

        const recentTrans = await getRecentTransactions(userId, accountIds, recentDate);
        req.recentTransactions = recentTrans;
        next();
    } catch (error) {
        next(error);
    }
};

// Transactions page - All transactions (including recurring) for the logged-in user
exports.getAllTransactionsForUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const accountIds = req.userAccounts.map(account => account.id);
        const potIds = req.userPots.map(pot => pot.id);
        const budgetIds = req.userBudgets.map(budget => budget.id);

        const allTrans = await getAllTransactions(userId, accountIds, potIds, budgetIds);
        req.allTransactions = allTrans;
        next();
    } catch (error) {
        next(error);
    }
};

// CRUD

exports.createTransaction = async (req, res, next) => {
    try {
        const {
            name,
            amount,
            type,
            category,
            dateMade,
            accountId = null,
            budgetId = null,
            potId = null,
            isRecurring = false,
            recurrency = null, 
            recurrentEnd = null, 
        } = req.body;
        const userId = req.user.id;

        let recurrentId = null;

        // If the transaction is recurring, insert into the `recurrent_transactions` table first
        if (isRecurring && recurrency) {
            const { data: recurrentTransaction, error: recurrentError } = await supabase
                .from('recurrent_transactions')
                .insert([{
                    user_id: userId,
                    amount: amount,
                    category: category,
                    type: type,
                    description: name,
                    frequency: recurrency,
                    start_date: dateMade,
                    end_date: recurrentEnd,
                }])
                .select()
                .single();

            if (recurrentError) throw recurrentError;

            // Capture the recurrent transaction ID
            recurrentId = recurrentTransaction.id;
        }

        // Insert the main transaction with the `recurrent_id` if it exists
        const { data: newTransaction, error } = await supabase
            .from('transactions')
            .insert([{
                name,
                amount: amount,
                type: type,
                category: category,
                date_made: dateMade,
                account_id: accountId,
                budget_id: budgetId,
                pot_id: potId,
                user_id: userId,
                recurrent_id: recurrentId, // Add the ID from the recurrent transaction, if any
            }])
            .select()
            .single();

        if (error) throw error;

        req.transaction = newTransaction;
        next();
    } catch (error) {
        next(error);
    }
};
