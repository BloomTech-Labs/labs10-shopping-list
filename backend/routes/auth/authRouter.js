const express = require('express');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
// import middleware and packages
const passport = require('passport');

const Auth0Strategy = require('passport-auth0');

if(process.env.NODE_ENV !== 'production'){
    var dotenv = require('dotenv'); // allows us to load .env variables in development mode
    dotenv.config();
}

if(process.env.NODE_ENV === 'production'){
    sess.cookie.secure = true; // serves secure cookies in https production
}

authRouter.use(passport.initialize());

const auth0_strategy = new Auth0Strategy({
    state: false, // our strategy does not need to use sessions, instead will use JWT in localStorage
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    // audience: 'https://shoptrak.auth0.com/api/v2/',
    callbackURL:
        process.env.AUTH0_CALLBACK_URL || 'http://localhost:9000/api/auth/callback',
    // passReqToCallback: true,
},
    async function(accessToken, refreshToken, extraParams, profile, done){
        // accessToken is the token to call Auth0 API (not needed in the most cases)
        // extraParams.id_token has the JSON Web Token
        // profile has all the information from the user
        return done(null, profile, extraParams);
    }
);

passport.use(auth0_strategy); // use Auth0 strategy as middleware

authRouter.get('/', (req, res) => {
    res.send('This is the /auth root endpoint.');
});

authRouter.get('/success', (req, res) => {
    res.send('Login successful!');
})


authRouter.get('/login',
    passport.authenticate('auth0', {
        scope: 'openid email profile',
        session: false,
    }), function(req, res){
        res.redirect(process.env.AUTH0_SUCCESS_URL || 'http://localhost:9000/api/auth/success');
    });

authRouter.get('/callback', function(req, res, next){
    passport.authenticate('auth0', {session: false}, function(err, user, info){
        if(err) {
            return next(err);
        }

        if(!user){
            return res.redirect('http://localhost:9000/api/auth/login');
        }
        req.logIn(user, {session: false}, function(err){
            if(err){
                res.status(500).json({error: `Error logging in.`})
            }
            console.log('info', info.id_token);
            console.log('user', user._json);
            
            let token = info.id_token; // collect the generated user token
            
            // const returnTo = req.session.returnTo;
            // delete req.session.returnTo;
            // res.redirect(returnTo || 'http://localhost:9000/api/auth/success')
            
            
            res.status(200).json({user, token}); // sends back the user profile and the generated JSON web token to the client

            // on the front end, if the user gets a token, store it, then redirect to their profile page

        })
    })(req, res, next);
})

passport.serializeUser(function(user, done){
    // console.log('serialize', user);
    done(null, user);
});

passport.deserializeUser(function(user, done){
    // console.log('deserialize', user)
    done(null, user);
})


authRouter.get('/logout', (req, res) => {
    req.logout();
    res.redirect('http://localhost:9000');
})

module.exports = authRouter;