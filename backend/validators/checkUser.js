const groupDb = require('../helpers/groupModel');
const groupMembersDb = require('../helpers/groupMembersModel');
const itemDb = require('../helpers/itemModel');
const userDb = require('../helpers/userModel');

const checkUser = (req, res, next) => {
    console.log('CHECK USER', req.user.email);
    console.log('req url', req.originalUrl);

    let userId;

    userDb.getIdByEmail(req.user.email).then(id => {
        if(!id || id.length === 0){
            console.log('no user found with that email');
            return res.status(403).json({error: `You are not authorized to do that.`})
        } else {
            userId = id[0];
            console.log('userId', userId);
        }
    })
    next();
}

module.exports = checkUser;