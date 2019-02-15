const express = require('express');
const groupRouter = express.Router();

const groupDb = require('../../helpers/groupModel');

const checkJwt = require('../../validators/checkJwt');



/**
 * Check Group Size middleware
 * @TODO This will be a function that ensures the group size is less than
 * or equal to the maximum allowed members for the group
 */


/** @TODO Update group schema to designate a group "owner"
 * This will be important when deciding the maximum limit of
 * users in the group. The group must be owned by a premium user
 * in order to hold more than 2 members
 */


/****************************************************************************************************/
/** THIS ROUTER HANDLES ALL REQUESTS TO THE /api/group ENDPOINT **/
/****************************************************************************************************/

/**
 * Get All Groups
 */

groupRouter.get('/', (req, res) => {
    groupDb.get().then(group => {
        console.log(group);
        if(!group){
            return res.status(404).json({error: `Group list does not exist.`})
        } else {
            return res.status(200).json(group);
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: `Error retrieving group list.`})
    })
})

/**
 * Get Group by ID
 */


/**
 * Get all users in group
 */

/**
 * Create new group
 */

/**
 * Add member to group
 */

/**
 * Remove member from group
 */

/**
 * Update Group Name
 */