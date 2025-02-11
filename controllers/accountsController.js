const AccountTypes = require('../enums/accountTypes');
const supabase = require('../config/database');

exports.getAccountsForUser = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Query accounts that are either owned by the user or shared with them
        const { data: accounts, error } = await supabase
            .from('accounts')
            .select('*')
            .or(`user_id.eq.${userId},shared_with_id.eq.${userId}`);

        if (error) throw error;

        req.userAccounts = accounts;
        next();
    } catch (error) {
        next(error);
    }
};

exports.getAccountById = async (req, res, next) => {
    try {
        const accountId = req.params.id;
        
        const { data: account, error } = await supabase
            .from('accounts')
            .select('*')
            .eq('id', accountId)
            .single();

        if (error) throw error;
        
        if (!account) {
            return res.status(404).send('Account not found');
        }

        account.itemType = 'account';

        req.account = account;
        next();
    } catch (error) {
        next(error);
    }
};

// helper functions for account management

exports.createAccount = async (req, res, next) => {
    try {
        const { name, type, balance = 0, sharedWithId = null, isActive = false } = req.body;
        const userId = req.user.id;

        const { data: newAccount, error } = await supabase
            .from('accounts')
            .insert([{
                name,
                type,
                balance,
                user_id: userId,
                shared_with_id: sharedWithId,
                is_active: isActive
            }])
            .select()
            .single();

        if (error) throw error;

        req.account = newAccount;
        next();
    } catch (error) {
        next(error);
    }
};

exports.updateAccount = async (req, res, next) => {
    try {
        const accountId = req.params.id;
        const { ...updates } = req.body;
        const userId = req.user.id;

        // Verify ownership
        const { data: existingAccount, error: fetchError } = await supabase
            .from('accounts')
            .select('*')
            .eq('id', accountId)
            .eq('user_id', userId)
            .single();

        if (fetchError) throw fetchError;
        if (!existingAccount) {
            return res.status(403).send('Not authorized to update this account');
        };

        // Perform the update
        const { data: updatedAccount, error: updateError } = await supabase
            .from('accounts')
            .update({
                ...updates,
            })
            .eq('id', accountId)
            .select()
            .single();

        if (updateError) throw updateError;

        req.account = updatedAccount;
        next();
    } catch (error) {
        next(error);
    }
};


exports.deleteAccount = async (req, res, next) => {
    try {
        const accountId = req.params.id;
        const userId = req.user.id;

        // First verify the user owns this account
        const { data: existingAccount, error: fetchError } = await supabase
            .from('accounts')
            .select('*')
            .eq('id', accountId)
            .eq('user_id', userId)
            .single();

        if (fetchError) throw fetchError;
        if (!existingAccount) {
            return res.status(403).send('Not authorized to delete this account');
        }

        // Perform the deletion
        const { error: deleteError } = await supabase
            .from('accounts')
            .delete()
            .eq('id', accountId);

        if (deleteError) throw deleteError;

        next();
    } catch (error) {
        next(error);
    }
};

exports.updateAccountBalance = async (req, res, next) => {
    try {
        const accountId = req.params.id;
        const { amount, type } = req.body; // type should be 'credit' or 'debit'
        const userId = req.user.id;

        // First get the current balance
        const { data: account, error: fetchError } = await supabase
            .from('accounts')
            .select('balance')
            .eq('id', accountId)
            .eq('user_id', userId)
            .single();

        if (fetchError) throw fetchError;
        if (!account) {
            return res.status(404).send('Account not found');
        }

        // Calculate new balance
        const newBalance = type === 'credit' 
            ? account.balance + amount
            : account.balance - amount;

        // Update the balance
        const { data: updatedAccount, error: updateError } = await supabase
            .from('accounts')
            .update({ balance: newBalance })
            .eq('id', accountId)
            .select()
            .single();

        if (updateError) throw updateError;

        req.account = updatedAccount;
        next();
    } catch (error) {
        next(error);
    }
};

exports.leaveAccount = async (req, res, next) => {
    try {
        const accountId = req.params.id;
        const userId = req.user.id;

        // Verify the user is actually shared with this account
        const { data: account, error: fetchError } = await supabase
            .from('accounts')
            .select('*')
            .eq('id', accountId)
            .eq('shared_with_id', userId)
            .single();

        if (fetchError) throw fetchError;
        if (!account) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to leave this account' 
            });
        }

        // Remove the user from the account
        const { error: updateError } = await supabase
            .from('accounts')
            .update({ shared_with_id: null })
            .eq('id', accountId);

        if (updateError) throw updateError;

        next();
    } catch (error) {
        next(error);
    }
};

// PROCS
exports.transferBalance = async (req, res, next) => {
    try {
        const { fromAccountId, toAccountId, amount } = req.body;
        const userId = req.user.id;

        const { data, error } = await supabase.rpc('account_balance_transfer', {
            p_user_id: userId,
            p_from_account_id: fromAccountId,
            p_to_account_id: toAccountId,
            p_transaction_value: parseFloat(amount),
        });

        if (error) throw error;

        res.status(200).json({ success: true, message: 'Transfer successful' });
    } catch (error) {
        console.error('Error during balance transfer:', error.message);
        res.status(500).json({ success: false, message: 'Transfer failed', error: error.message });
    }
};

