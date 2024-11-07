const budgets = [
    { id: 1, name: "October", targetAmount: 2400, actualAmount: 1800, startDate: 15/10/2024, endDate: 15/11/2024, isActive: true, accountId: 1, userId: 1, },
    { id: 2, name: "Thailand", targetAmount: 1500, actualAmount: 1600, startDate: 13/1/2025, endDate: 10/2/2025, userId: 1, sharedWithId: 2 },
    { id: 3, name: "Budget 1", targetAmount: 200, actualAmount: 50, startDate: 11/10/2024, userId: 1 },
    { id: 4, name: "User 2 Budget", targetAmount: 400, actualAmount: 100, startDate: 10/9/2024, endDate: 20/12/2024, userId: 2 },
    { id: 5, name: "Shared User 2 budget", targetAmount: 800, actualAmount: 230, startDate: 1/12/2024, endDate: 24/12/2024, userId: 2, sharedWithId: 1 }
];

exports.getBudgetsForUser = (req, res, next) => {
    const userId = req.user.id;

    const userBudgets = budgets.filter(budget => {
        return budget.userId === userId || budget.sharedWithId === userId;
    });

    req.userBudgets = userBudgets;

    next();
};

exports.getBudgetById = (req, res, next) => {
    const budgetId = parseInt(req.params.id);
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) {
        return res.status(404).send('Budget not found');
    }
    req.budget = budget;
    next();
};