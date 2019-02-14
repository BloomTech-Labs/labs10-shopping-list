const passport = require('passport');

module.exports = {
  type: 'GET',
  url: '/api/auth/callback/',
  handler: (req, res, next) => {
    passport.authenticate('auth0', function(err, user, info){
      console.log(req.user);
      if(err){ return next(err) }
      if(!user){ return res.redirect('/api/auth/login'); }
      req.logIn(user, function(err){
          if(err){ return next(err); }
          const returnTo = req.session.returnTo;
          delete req.session.returnTo;
          res.redirect(returnTo || '/api/auth/success');
      });
    })(req, res, next);
  },
};
