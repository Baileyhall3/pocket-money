const RecTransactionCategories = Object.freeze({
    SUBSCRIPTION: "Subscription",
    DIRECT_DEBIT: "Direct Debit",
    SALARY: "Salary",
    RENT: "Rent",
    UTILITIES: "Utilities",
    LOAN_PAYMENT: "Loan Payment",
    INSURANCE: "Insurance",
    SAVINGS: "Savings",
    MEMBERSHIP: "Membership",
    DONATION: "Donation",
});

const RecTransactionFrequencies = Object.freeze({
    MONTHLY: "Monthly",
    BI_WEEKLY: "Bi-weekly",
    WEEKLY: "Weekly",
    DAILY: "Daily",
    RANDOM: "At Some Point",
    CUSTOM: "Custom Frequency",
});

module.exports = {
    RecTransactionCategories,
    RecTransactionFrequencies,
};
