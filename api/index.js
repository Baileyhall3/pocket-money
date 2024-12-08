const app = require('../app');

// Handle both function and Express app exports for Vercel
if (process.env.VERCEL) {
  module.exports = (req, res) => {
    // Don't call next() since this is the final handler in Vercel
    app(req, res);
  };
} else {
  module.exports = app;
}
