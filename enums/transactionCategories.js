const TransactionCategories = Object.freeze({
    FOOD: "Food",
    CLOTHING: "Clothing",
    SUBSCRIPTION: "Subscription",
    PAY_CHECK: "Pay Check",
    DIRECT_DEBIT: "Direct Debit",
    INSURANCE: "Insurance",
    UTILITIES: "Utilities",
    HOUSING: "Housing",
    MAINTENANCE: "Maintenance",
    TRANSPORT: "Transport",
    BONUS: "Bonus",
    FREELANCING: "Freelancing",
    GIFT: "Gift"
});

const PaymentMethods = Object.freeze({
    CREDIT_CARD: "Credit Card",
    DEBIT_CARD: "Debit Card",
    CASH: "Cash",
    BANK_TRANSFER: "Bank Transfer",
    MOBILE_PAYMENT: "Mobile Payment",
    CHECK: "Check"
});

module.exports = TransactionCategories;