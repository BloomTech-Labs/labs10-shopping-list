const express = require('express');
const authRouter = express.Router();

// import middleware and packages
const passport = require('passport');
const session = require('express-session');

const sess = {
    secret: 'THIS IS TOP FRICCIN SECRET MOM',
    cookie: {},
    resave: false,
    saveUninitialized: true
};

const Auth0Strategy = require('passport-auth0');

if(process.env.NODE_ENV !== 'production'){
    var dotenv = require('dotenv'); // allows us to load .env variables in development mode
    dotenv.config();
}

if(process.env.NODE_ENV === 'production'){
    sess.cookie.secure = true; // serves secure cookies in https production
}


authRouter.use(session(sess));


const auth0_strategy = new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
        process.env.AUTH0_CALLBACK_URL || 'https://localhost:9000/api/auth/callback'
},
    function(accessToken, refreshToken, extraParams, profile, done){
        // accessToken is the token to call Auth0 API (not needed in the most cases)
        // extraParams.id_token has the JSON Web Token
        // profile has all the information from the user
        return done(null, profile);
    }
);

passport.use(auth0_strategy);
authRouter.use(passport.initialize());
authRouter.use(passport.session());

authRouter.get('/', (req, res) => {
    res.send('This is the /auth root endpoint.');
});

authRouter.get('/success', (req, res) => {
    res.send('Login successful!');
})


authRouter.get('/login',
    passport.authenticate('auth0', {
        scope: 'openid email profile'
    }), function(req, res){
        res.redirect('https://localhost:9000/api/auth/success');
    });


authRouter.get('/callback', function(req, res, next){
    passport.authenticate('auth0', function(err, user, info){
        if(err){ return next(err) }
        if(!user){ return res.redirect('https://localhost:9000/api/auth/login'); }
        req.logIn(user, function(err){
            if(err){ return next(err); }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(returnTo || 'https://localhost:9000/api/auth/success');
        });
    })(req, res, next);
});



module.exports = authRouter;