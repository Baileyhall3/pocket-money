const TransactionCategories = Object.freeze({
    GROCERIES: "Groceries", //expense 	fa fa-shopping-basket
    SUBSCRIPTION: "Subscription", //expense 	fa fa-amazon
    DIRECT_DEBIT: "Direct Debit", //expense fa fa-credit-card
    HOUSING: "Housing", //expense fa fa-home
    TRANSPORT: "Transport", //expense 	fa fa-car
    GENERAL: "General", //expense	fa fa-sign-out
    SAVINGS: "Savings", //expense 	fa fa-bank
    SHOPPING: "Shopping", //expense fa fa-shopping-bag
    GOING_OUT: "Going Out", //expense fa fa-glass
    TRAVEL: "Travel", //expense fa fa-globe
    RESTAURANTS: "Restauranats", //expense 	fa fa-cutlery
    OTHER: "Other", // expense fa fa-ellipsis-h 
    GIFT: "Gift", //income  	fa fa-handshake-o
    PAY_CHECK: "Pay Check", //income 	fa fa-money
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