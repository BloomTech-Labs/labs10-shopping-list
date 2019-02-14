const passport = require('passport');
const session = require('express-session');
const Auth0Strategy = require('passport-auth0');

const sess = {
    secret: 'THIS IS TOP FRICCIN SECRET MOM',
    cookie: {},
    resave: false,
    saveUninitialized: true
};

if(process.env.NODE_ENV !== 'production'){
    var dotenv = require('dotenv'); // allows us to load .env variables in development mode
    dotenv.config();
}

if(process.env.NODE_ENV === 'production'){
    sess.cookie.secure = true; // serves secure cookies in https production
}

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

passport.serializeUser(function(user, done){
    console.log('serialize', user);
    done(null, user);
});

passport.deserializeUser(function(user, done){
    console.log('deserialize', user)
    done(null, user);
})

const auth = function(server) {
  server.use(session(sess));
  server.use(passport.initialize());
  server.use(passport.session());
}

module.exports = auth;