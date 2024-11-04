const express = require('express');
const engine = require('ejs-mate');
const app = express();
const port = process.env.PORT || 3001; // Use the environment port or default to 3000

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const path = require('path');

// Set the views directory explicitly
app.set('views', path.join(__dirname, 'views'));

// Route modules
const accountsRoutes = require('./routes/accounts');
const usersRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const transactionsRoutes = require('./routes/transactions');
const alertsRoutes = require('./routes/alerts');

// Routes
app.use(accountsRoutes);
app.use(usersRoutes);
app.use(dashboardRoutes);
app.use(transactionsRoutes);
app.use(alertsRoutes);

app.use((req, res, next) => {
  res.status(404).render('404', { title: "404 - Not Found" });
});

// If the app is not running in a serverless environment (i.e., local dev), listen on a port
if (require.main === module) {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}

module.exports = app;