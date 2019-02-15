const express = require('express');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
// import middleware and packages
const passport = require('passport');
// const session = require('express-session');

// const sess = {
//     secret: process.env.SUPER_SECRET,
//     cookie: {},
//     resave: false,
//     saveUninitialized: true
// };

const Auth0Strategy = require('passport-auth0');

if(process.env.NODE_ENV !== 'production'){
    var dotenv = require('dotenv'); // allows us to load .env variables in development mode
    dotenv.config();
}

if(process.env.NODE_ENV === 'production'){
    sess.cookie.secure = true; // serves secure cookies in https production
}

// authRouter.use(session(sess));
authRouter.use(passport.initialize());
// authRouter.use(passport.session());

const auth0_strategy = new Auth0Strategy({
    state: false,
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
        // console.log(accessToken);
        // console.log('JWT: \n' +  extraParams.id_token + '\n');
        // const jwt = extraParams.id_token;
        // // console.log('User Profile', profile);
        return done(null, profile);
    }
);

passport.use(auth0_strategy);


authRouter.get('/', (req, res) => {
    res.send('This is the /auth root endpoint.');
});

authRouter.get('/success', (req, res) => {
    res.send('Login successful!');
})


authRouter.get('/login',
    passport.authenticate('auth0', {
        scope: 'openid email profile',
        // audience: 'https://shoptrak.auth0.com/api/v2/',

        // connection: 'google-oauth2'
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

            // generate the token
            console.log('user', user._json.user);
            const token = jwt.sign(user._json, process.env.AUTH0_CLIENT_SECRET);
            console.log('\nTOKEN TOKEN TOKEN TOKEN\n', token);
            // const returnTo = req.session.returnTo;
            // delete req.session.returnTo;
            // res.redirect(returnTo || 'http://localhost:9000/api/auth/success')
            res.status(200).json({user, token});

            // on the front end, if the user gets a token, redirect to their profile page

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