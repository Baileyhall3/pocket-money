const AlertTypes = require('../enums/alertTypes');
const supabase = require('../config/database');

exports.getAlertsForUser = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get all alerts for the user
        const { data: alerts, error } = await supabase
            .from('alerts')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });

        if (error) throw error;

        // Count unread alerts
        const unreadAlerts = alerts.filter(alert => alert.unread);

        // Pass the user alerts and unread count
        req.userAlerts = alerts;
        res.locals.unreadAlertsCount = unreadAlerts.length || 0;

        next();
    } catch (error) {
        next(error);
    }
};

exports.createAlert = async (req, res, next) => {
    try {
        const { title, body, type, userId } = req.body;

        const { data: newAlert, error } = await supabase
            .from('alerts')
            .insert([{
                title,
                body,
                type,
                user_id: userId,
                unread: true
            }])
            .select()
            .single();

        if (error) throw error;

        req.alert = newAlert;
        next();
    } catch (error) {
        next(error);
    }
};

exports.markAlertAsRead = async (req, res, next) => {
    try {
        const alertId = req.params.id;
        const userId = req.user.id;

        const { data: updatedAlert, error } = await supabase
            .from('alerts')
            .update({ unread: false })
            .eq('id', alertId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;

        req.alert = updatedAlert;
        next();
    } catch (error) {
        next(error);
    }
};

exports.markAllAlertsAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const { error } = await supabase
            .from('alerts')
            .update({ unread: false })
            .eq('user_id', userId)
            .eq('unread', true);

        if (error) throw error;

        next();
    } catch (error) {
        next(error);
    }
};

exports.deleteAlert = async (req, res, next) => {
    try {
        const alertId = req.params.id;
        const userId = req.user.id;

        const { error } = await supabase
            .from('alerts')
            .delete()
            .eq('id', alertId)
            .eq('user_id', userId);

        if (error) throw error;

        next();
    } catch (error) {
        next(error);
    }
};

// Helper functions for creating specific types of alerts

exports.createFriendRequestAlert = async (userId, friendName, sentById) => {
    if (!userId || !friendName || !sentById) {
        throw new Error('Missing required fields for friend request alert');
    }

    const { data, error } = await supabase
        .from('alerts')
        .insert([{
            title: 'New Friend Request',
            body: `${friendName} sent you a friend request.`,
            type: AlertTypes.FRIEND_REQUEST,
            user_id: userId,
            unread: true,
            received_from_id: sentById
        }])
        .select();

    if (error) {
        console.error('Error creating friend request alert:', error);
        throw error; // Propagate the error instead of just logging it
    }

    return data;
};

exports.createTransactionAlert = async (userId, accountName) => {
    if (!userId || !accountName) {
        throw new Error('Missing required fields for transaction alert');
    }

    const { data, error } = await supabase
        .from('alerts')
        .insert([{
            title: 'Transaction Made',
            body: `New transaction logged for ${accountName}. See here`,
            type: AlertTypes.SPENDING_ACTIVITY,
            user_id: userId,
            unread: true
        }])
        .select();

    if (error) {
        console.error('Error creating transaction alert:', error);
        throw error;
    }

    return data;
};

exports.createMilestoneAlert = async (userId, potName, targetAmount, currentAmount) => {
    if (!userId || !potName || !targetAmount || currentAmount === undefined) {
        throw new Error('Missing required fields for milestone alert');
    }

    try {
        const percentage = (currentAmount / targetAmount) * 100;
        const message = percentage >= 100
            ? `You just reached your £${targetAmount} savings goal for ${potName}! Good job!`
            : `You're ${Math.floor(percentage)}% of the way to your saving goal of £${targetAmount} for ${potName}! Keep up the good work!`;

        const { data, error } = await supabase
            .from('alerts')
            .insert([{
                title: percentage >= 100 ? 'Savings Goal Reached!' : 'Savings Milestone!',
                body: message,
                type: AlertTypes.MILESTONE,
                user_id: userId,
                unread: true
            }])
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating milestone alert:', error);
        throw error;
    }
};

exports.createWarningAlert = async (userId, accountName, balance) => {
    if (!userId || !accountName || balance === undefined) {
        throw new Error('Missing required fields for warning alert');
    }

    const { data, error } = await supabase
        .from('alerts')
        .insert([{
            title: 'Account Warning',
            body: `You have less than £${balance} in ${accountName} remaining.`,
            type: AlertTypes.WARNING,
            user_id: userId,
            unread: true
        }])
        .select();

    if (error) {
        console.error('Error creating warning alert:', error);
        throw error;
    }

    return data;
};

exports.createNudgeAlert = async (userId, friendName, sentById) => {
    if (!userId || !friendName || !sentById) {
        throw new Error('Missing required fields for nudge alert');
    }

    const { data, error } = await supabase
        .from('alerts')
        .insert([{
            title: 'You\'ve been nudged!',
            body: `${friendName} just nudged you.`,
            type: AlertTypes.NUDGE,
            user_id: userId,
            unread: true,
            received_from_id: sentById
        }])
        .select();

    if (error) {
        console.error('Error creating nudge alert:', error);
        throw error;
    }

    return data;
};
