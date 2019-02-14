// this is a test middleware to see if login is working

module.exports = function(){
    return function secured (req, res, next){
        if(req.user){
            return next();
        }

        req.session.returnTo = req.originalUrl;
        res.redirect('https://localhost:9000/api/auth/login');
    }
}