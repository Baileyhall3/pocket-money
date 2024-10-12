const express = require('express');
const engine = require('ejs-mate');
const app = express();
const port = 3000;

const userController = require('./controllers/userController');
const accountsController = require('./controllers/accountsController');
const budgetsController = require('./controllers/budgetsController');
const potsController = require('./controllers/potsController');
const res = require('express/lib/response');


app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', userController.getUser, accountsController.getAccountsForUser, (req, res) => {
    res.render('index',
        { title: "Dashboard",
            user: req.user,
            accounts: req.userAccounts
        }
    );
});

app.get('/accounts', userController.getUser, accountsController.getAccountsForUser, (req, res) => {
    res.render('accounts', { 
        title: "Accounts",
        accounts: req.userAccounts,  // Pass filtered accounts to the view
        user: req.user  // Pass the user to the view
    });
});

app.get('/savings', userController.getUser, budgetsController.getBudgetsForUser, potsController.getPotsForUser, (req, res) => {
    res.render('savings', {
        title: "Savings",
        budgets: req.userBudgets,
        pots: req.userPots,
        user: req.user
    });
});

app.get('/profile', userController.getUser, userController.getUsers, userController.getFriends, (req, res) => {
    res.render('profile', {
        title: "Profile",
        user: req.user,
        users: req.users,
        friends: req.friendsList
    });
});

app.listen(port, () => {
  console.log(`App listening at port ${port}`)
});