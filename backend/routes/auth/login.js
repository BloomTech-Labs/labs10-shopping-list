const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const auth0_strategy = new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
        process.env.AUTH0_CALLBACK_URL || 'http://localhost:9000/api/auth/callback',
    // passReqToCallback: true,
},
    async function(accessToken, refreshToken, extraParams, profile, done){
        // accessToken is the token to call Auth0 API (not needed in the most cases)
        // extraParams.id_token has the JSON Web Token
        // profile has all the information from the user
        console.log(accessToken);
        console.log('token', extraParams.id_token);
        console.log('profile', profile);
        return done(null, profile);
    }
);

passport.use(auth0_strategy);

module.exports = {
  type: 'GET',
  url: '/api/auth/login/',
  handler: (req, res) => {
    console.log('*1*');
    passport.authenticate('auth0', {
        scope: 'openid email profile',
        //audience: 'https://shoptrak.auth0.com/api/v2/',
        // connection: 'google-oauth2'
    }), function(req, res){
      console.log('*2*');
        res.redirect('/api/auth/success');
    };
  },
};
