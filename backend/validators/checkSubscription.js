const userDb = require('../helpers/userModel');

const checkSubscription = (req, res, next) => {
    /**
     * Check to see what the subscription model the user has.
     * This determines what features are accessible to the end user.
     */

    userDb.getProfileByEmail(req.user.email).then(id => {
        if (!id || id.length === 0) return res.status(403).json({warning: `You do not have permission to do that.`})

        req.subscriptionType = id[0].subscriptionType;
        return next();
    }).catch(err => {
        console.log(err);
        return res.status(500).json({error: `An internal server error has occurred.`})
    })
}

module.exports = checkSubscription;