const AlertTypes = require('../enums/alertTypes');

const alerts = [
    { id: 1, title: "New Friend Request", body: "Lottie Anderson sent you a friend request.", type: AlertTypes.FRIEND_REQUEST, date: "21/10/2024", unread: true, userId: 1, },
    { id: 2, title: "Transaction Made", body: "New transaction logged for Monzo. See here", type: AlertTypes.SPENDING_ACTIVITY, date: "21/10/2024", unread: true, userId: 1, },
    { id: 3, title: "Half Way to Savings Goal!", body: "You're half way to your saving goal of £500 for Pot 1! Keep up the good work!", type: AlertTypes.MILESTONE, date: "20/10/2024",  unread: false, userId: 1, },
    { id: 4, title: "Account Warning", body: "You have less than £100 in Account 1 remaining.", type: AlertTypes.WARNING, date: "20/10/2024",  unread: false, userId: 1, },
    { id: 5, title: "New Friend Request", body: "Jacob Wilson sent you a friend request", type: AlertTypes.FRIEND_REQUEST, date: "20/10/2024",  unread: true, userId: 2, },
    { id: 6, title: "Transaction Made", body: "New Transaction logged for user 2 account. See here", type: AlertTypes.SPENDING_ACTIVITY, date: "19/10/2024",  unread: true, userId: 2, },
    { id: 7, title: "Savings Goal Reached!", body: "You just reached your £100 savings goal for pot 4! Good job!", type: AlertTypes.MILESTONE, date: "15/10/2024",  unread: true, userId: 3, },
    { id: 8, title: "User 2 nudged you", body: "User 2 just nudged you.", type: AlertTypes.NUDGE, date: "15/11/2024",  unread: true, userId: 1, },

];

exports.getAlertsForUser = (req, res, next) => {
    const userId = req.user.id;

    const userAlerts = alerts
        .filter(alert => alert.userId === userId)

    const unreadAlerts = userAlerts.filter(alert => alert.unread);

    // Pass the user alerts and unread count (always defined)
    req.userAlerts = userAlerts;
    // res.locals.userAlerts = userAlerts.length > 0 ? userAlerts.slice(0, 5) : []; 
    res.locals.unreadAlertsCount = unreadAlerts.length || 0; // Unread alerts count

    next();
};

