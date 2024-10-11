const budgets = [
    { id: 1, name: "October", amount: 2400, startDate: 15/10/2024, endDate: 15/11/2024, isActive: true, userId: 1, },
    { id: 2, name: "Thailand", amount: 1500, startDate: 13/1/2025, endDate: 10/2/2025, userId: 1, sharedWithId: 2 },
    { id: 3, name: "Budget 1", amount: 200, startDate: 11/10/2024, userId: 1 },
    { id: 4, name: "User 2 Budget", amount: 400, startDate: 10/9/2024, endDate: 20/12/2024, userId: 2 },
    { id: 5, name: "Shared User 2 budget", amount: 800, startDate: 1/12/2024, endDate: 24/12/2024, userId: 2, sharedWithId: 1 }
];

exports.getBudgetsForUser = (req, res, next) => {
    const userId = req.user.id;

    const userBudgets = budgets.filter(budget => {
        return budget.userId === userId || budget.sharedWithId === userId;
    });

    req.userBudgets = userBudgets;

    next();
};
