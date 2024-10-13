const express = require('express');
const engine = require('ejs-mate');
const app = express();
const port = 3000;

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const res = require('express/lib/response');

// Route modules
const accountsRoutes = require('./routes/accounts');
const usersRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');

// Routes
app.use(accountsRoutes);
app.use(usersRoutes);
app.use(dashboardRoutes);

app.listen(port, () => {
  console.log(`App listening at port ${port}`)
});