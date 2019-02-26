// this is a test middleware to see if login is working

// TODO: We must verify the JWT that are passed with API requests using the 
// auth0 client secret in process.env
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

if(process.env.NODE_ENV !== 'production'){
    var dotenv = require('dotenv'); // allows us to load .env variables in development mode
    dotenv.config();
}

// if(process.env.NODE_ENV === 'production'){
//     let sess = {
//         secret: 'THIS IS TOP FRICCIN SECRET MOM',
//         cookie: {secure: false},
//         resave: false,
//         saveUninitialized: true
//     };

//     sess.cookie.secure = true; // serves secure cookies in https production
// }

// console.log('checkJWT auth0 domain: ', process.env.AUTH0_DOMAIN);

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    
    audience: `${process.env.AUTH0_CLIENT_ID}`,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
});

module.exports = checkJwt;