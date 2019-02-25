const groupDb = require('../helpers/groupModel');
const groupMembersDb = require('../helpers/groupMembersModel');
const itemDb = require('../helpers/itemModel');
const userDb = require('../helpers/userModel');
const server = require('../api/server');

const checkUser = (req, res, next) => {
    console.log('CHECK USER', req.user.email);
    console.log('req url', req.originalUrl);

    let userId;

    /**
     * First we need to check the database for a user with the email generated in 
     * req.user by the checkJwt middleware. The checkJwt middleware stores the id token's
     * user information in req.user for usage in concurrent requests
     */

    userDb.getIdByEmail(req.user.email).then(id => { 
        if(!id || id.length === 0){
            console.log('no user found with that email');
            return res.status(403).json({error: `You are not authorized to do that.`})
        } else {
            userId = id[0].id;
            console.log('userId', userId);
        }
    })

    /**
     * We can now track the ID of the user making requests with @param userId 
     * and ensure they have permissions to perform actions on different API Routes
     */


    /**
     * Protect User Groups
     * Ensure that only the self-same user can view their user group information
     */
    if(req.originalUrl.includes('/api/group/user/')){
        console.log('protect me!');
        let paramId = req.originalUrl.replace('/api/group/user/', '');
        console.log('param id', paramId);
        if(userId !== paramId){
            res.status(403).json({warning: `You are not allowed to do that.`})
        } else {
            next();
        }
    }
     

    next();
}

module.exports = checkUser;