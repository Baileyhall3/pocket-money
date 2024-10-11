const pots = [
    { id: 1, name: "Christmas", targetAmount: 500, targetDate: 15/12/2024, userId: 1, },
    { id: 2, name: "Holiday", targetAmount: 700, targetDate: 10/3/2025, userId: 1, sharedWithId: 2 },
    { id: 3, name: "Pot 1", targetAmount: 200, targetDate: 27/10/2024, userId: 1 },
    { id: 4, name: "Pot 2", targetAmount: 200, targetDate: 18/8/2024, userId: 1 },
    { id: 5, name: "Charlotte Bday", targetAmount: 200, targetDate: 30/12/2024, userId: 1 },
    { id: 6, name: "Pot 3", targetAmount: 200, targetDate: 2/2/2024, userId: 1 },
    { id: 7, name: "User 2 Pot", targetAmount: 400, targetDate: 10/9/2024, userId: 2 },
    { id: 8, name: "Shared User 2 pot", targetAmount: 800, targetDate: 1/12/2024, userId: 2, sharedWithId: 1 }
];

exports.getPotsForUser = (req, res, next) => {
    const userId = req.user.id;

    const userPots = pots.filter(pot => {
        return pot.userId === userId || pot.sharedWithId === userId;
    });

    req.userPots = userPots;

    next();
};
