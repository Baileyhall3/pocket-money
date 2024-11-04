const accounts = [
    { id: 1, name: "Barclays", balance: 2300, isActive: true, userId: 1, },
    { id: 2, name: "Monzo", balance: 400, userId: 1 },
    { id: 3, name: "Account 1", balance: 800, userId: 1, sharedWithId: 2 },
    { id: 4, name: "User 2 account", balance: 250, userId: 2 },
    { id: 5, name: "Shared User 2 account", balance: 670, userId: 2, sharedWithId: 1 }
];

exports.getAccountsForUser = (req, res, next) => {
    const userId = req.user.id; // Current user's ID

    // Filter accounts for the logged-in user (either owned or shared with)
    const userAccounts = accounts.filter(account => {
        return account.userId === userId || account.sharedWithId === userId;
    });

    // Attach the filtered accounts to the request object for use in the next middleware
    req.userAccounts = userAccounts;

    next();
};

exports.getAccountById = (req, res, next) => {
    const accountId = parseInt(req.params.id);
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) {
        return res.status(404).send('Account not found');
    }
    req.account = account;
    next();
};
