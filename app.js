const express = require('express');
const engine = require('ejs-mate');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.engine('ejs', engine);
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

require('dotenv').config();

// Set the views directory explicitly
app.set('views', path.join(__dirname, 'views'));

const dsTransactionCategories = require('./DS/dsTransactionCategories');
const userController = require('./controllers/userController');
const alertsController = require('./controllers/alertsController');
const AccountTypes = require('./enums/accountTypes');
const RecTransactionEnums = require('./enums/recurrentTransactions');
const { requireAuth } = require('./middleware/auth');

// Basic middleware for setting enums
app.use((req, res, next) => {
  res.locals.transactionCategories = dsTransactionCategories;
  res.locals.accountTypes = AccountTypes;
  res.locals.RecTransactionEnums = RecTransactionEnums;
  next();
});

// Route modules
const authRoutes = require('./routes/auth');
const accountsRoutes = require('./routes/accounts');
const usersRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const transactionsRoutes = require('./routes/transactions');
const alertsRoutes = require('./routes/alerts');
const settingsRoutes = require('./routes/settings');

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

// Login routes before auth middleware
app.use('/', authRoutes);

// Apply auth middleware to all routes after this point
app.use(requireAuth);

// Middleware to set `user` and `userAlerts` globally
app.use(async (req, res, next) => {
  try {
    // Fetch alerts for user
    await alertsController.getAlertsForUser(req, res, () => {});
    res.locals.userAlerts = req.userAlerts || [];

    await userController.getFriends(req, res, () => {});
    res.locals.friends = req.friendsList || [];
    
    // Set user in locals from the auth middleware
    res.locals.user = req.user || null;
    next();
  } catch (err) {
    console.error('Error setting global user and alerts:', err);
    next(err);
  }
});

// Protected routes
app.use(accountsRoutes);
app.use(usersRoutes);
app.use(dashboardRoutes);
app.use(transactionsRoutes);
app.use(alertsRoutes);
app.use(settingsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('404', { 
    title: 'Error',
    user: req.user || null,
    error: 'Something went wrong!'
  });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).render('404', { 
    title: '404 - Not Found',
    user: req.user || null
  });
});

// If the app is not running in a serverless environment (i.e., local dev), listen on a port
if (require.main === module) {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}

module.exports = app;
