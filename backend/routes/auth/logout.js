const passport = require('passport');

module.exports = {
  type: 'GET',
  url: '/api/auth/logout/',
  handler: (req, res) => {
    req.logout();
    res.redirect('/');
  },
};