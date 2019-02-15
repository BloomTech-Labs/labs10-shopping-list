// this is a test middleware to see if login is working

// TODO: We must verify the JWT that are passed with API requests using the 
// auth0 client secret in process.env
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

if(process.env.NODE_ENV !== 'production'){
    var dotenv = require('dotenv'); // allows us to load .env variables in development mode
    dotenv.config();
}

if(process.env.NODE_ENV === 'production'){
    sess.cookie.secure = true; // serves secure cookies in https production
}

console.log('checkJWT auth0 domain: ', process.env.AUTH0_DOMAIN);

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    
    // audience: `https://shoptrak.auth0.com/api/v2/`,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
});

module.exports = checkJwt;











// module.exports = function(){
//     return function secured (req, res, next){
//         console.log(req);
//         if(req.isAuthenticated()){
//             return next();
//         }

//         res.redirect('http://localhost:9000/api/auth/login');
//     }
// }


// module.exports = function(){
//     return 
// }

// function secured (req, res, next){
//     console.log(req.session);
//     console.log(req.user);
//     if(req.user){
        
//         return next();
//     }

//     console.log(req.user);

//     req.session.returnTo = req.originalUrl;
//     res.redirect('http://localhost:9000/api/auth/login');
// }

// function secured (req, res, next){
//     console.log('req.user: ', req.user);
//     if(req.isAuthenticated()){
//         return next();
//     }

//     res.redirect('http://localhost:9000/api/auth/login');
// }