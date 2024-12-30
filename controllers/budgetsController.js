const supabase = require('../config/database');

exports.getBudgetsForUser = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get budgets that are either owned by the user or shared with them
        const { data: budgets, error } = await supabase
            .from('budgets')
            .select(`
                *,
                account:account_id (
                    name,
                    balance
                )
            `)
            .or(`user_id.eq.${userId},shared_with_id.eq.${userId}`);

        if (error) throw error;

        req.userBudgets = budgets;
        next();
    } catch (error) {
        next(error);
    }
};

exports.getBudgetById = async (req, res, next) => {
    try {
        const budgetId = req.params.id;

        const { data: budget, error } = await supabase
            .from('budgets')
            .select(`
                *,
                account:account_id (
                    name,
                    balance
                )
            `)
            .eq('id', budgetId)
            .single();

        if (error) throw error;
        if (!budget) {
            return res.status(404).send('Budget not found');
        }
        
        budget.itemType = 'budget';
        
        req.budget = budget;
        next();
    } catch (error) {
        next(error);
    }
};

exports.createBudget = async (req, res, next) => {
    try {
        const {
            name,
            targetAmount,
            startDate,
            endDate = null,
            accountId = null,
            isActive = false,
            sharedWithId = null,
        } = req.body;
        const userId = req.user.id;
        const includeRecurring = req.body.includeRecurring || false;

        const { data: newBudget, error } = await supabase
            .from('budgets')
            .insert([{
                name,
                target_amount: targetAmount,
                actual_amount: 0,
                start_date: startDate,
                end_date: endDate,
                is_active: isActive,
                account_id: accountId,
                user_id: userId,
                shared_with_id: sharedWithId
            }])
            .select()
            .single();

        if (error) throw error;

        if (includeRecurring) {
            console.log('Importing recurring transactions for budget:', newBudget.id);
            try {
                const { data, error: procedureError } = await supabase.rpc('import_recurrent_transactions', {
                    new_budget_id: newBudget.id,
                    current_user_id: userId
                });
                
                if (procedureError) {
                    console.error('Error importing recurring transactions:', procedureError);
                    return res.status(500).json({ 
                        success: false, 
                        error: `Failed to import recurring transactions: ${procedureError.message}` 
                    });
                }
                console.log('Successfully imported recurring transactions');
            } catch (rpcError) {
                console.error('RPC call failed:', rpcError);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Failed to import recurring transactions. Please try again.' 
                });
            }
        }

        req.budget = newBudget;
        next();
    } catch (error) {
        next(error);
    }
};

exports.updateBudget = async (req, res, next) => {
    try {
        const budgetId = req.params.id;
        const { ...updates } = req.body;
        const userId = req.user.id;

        // First verify the user owns this budget
        const { data: existingBudget, error: fetchError } = await supabase
            .from('budgets')
            .select('*')
            .eq('id', budgetId)
            .eq('user_id', userId)
            .single();

        if (fetchError) throw fetchError;
        if (!existingBudget) {
            return res.status(403).send('Not authorized to update this budget');
        }

        // Perform the update
        const { data: updatedBudget, error: updateError } = await supabase
            .from('budgets')
            .update({
                ...updates,
            })
            .eq('id', budgetId)
            .select()
            .single();

        if (updateError) throw updateError;

        req.budget = updatedBudget;
        next();
    } catch (error) {
        next(error);
    }
};

exports.deleteBudget = async (req, res, next) => {
    try {
        const budgetId = req.params.id;
        const userId = req.user.id;

        // First verify the user owns this budget
        const { data: existingBudget, error: fetchError } = await supabase
            .from('budgets')
            .select('*')
            .eq('id', budgetId)
            .eq('user_id', userId)
            .single();

        if (fetchError) throw fetchError;
        if (!existingBudget) {
            return res.status(403).send('Not authorized to delete this budget');
        }

        // Perform the deletion
        const { error: deleteError } = await supabase
            .from('budgets')
            .delete()
            .eq('id', budgetId);

        if (deleteError) throw deleteError;

        next();
    } catch (error) {
        next(error);
    }
};

exports.updateBudgetAmount = async (req, res, next) => {
    try {
        const budgetId = req.params.id;
        const { amount } = req.body;
        const userId = req.user.id;

        // First get the current amount
        const { data: budget, error: fetchError } = await supabase
            .from('budgets')
            .select('actual_amount')
            .eq('id', budgetId)
            .eq('user_id', userId)
            .single();

        if (fetchError) throw fetchError;
        if (!budget) {
            return res.status(404).send('Budget not found');
        }

        // Update the amount
        const { data: updatedBudget, error: updateError } = await supabase
            .from('budgets')
            .update({
                actual_amount: budget.actual_amount + amount
            })
            .eq('id', budgetId)
            .select()
            .single();

        if (updateError) throw updateError;

        req.budget = updatedBudget;
        next();
    } catch (error) {
        next(error);
    }
};

exports.getActiveBudget = async (req, res, next) => {
    try {
        const userId = req.user.id;
        
        const { data: activeBudget, error } = await supabase
            .from('budgets')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .single();

        if (error) throw error;
        
        if (!activeBudget) {
            return res.status(404).send('No active budget');
        }

        req.activeBudget = activeBudget;
        next();
    } catch (error) {
        next(error);
    }
};
