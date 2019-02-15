const express = require('express');
const groupRouter = express.Router();

const groupDb = require('../../helpers/groupModel');
const groupMembersDb = require('../../helpers/groupMembersModel');

const checkJwt = require('../../validators/checkJwt');

/**
 * Check Group Size middleware
 * @TODO This will be a function that ensures the group size is less than
 * or equal to the maximum allowed members for the group
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

groupRouter.get('/:id', (req, res) => {
    groupDb.get().then(group => {
        if(!group){
            return res.status(404).json({error: `Could not find group with ID ${id}.`})
        } else {
            return res.status(200).json(group);
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: `Error retrieving group.`})
    })
})


/**
 * Get all users in group by Group ID
 */
groupRouter.get('/:id/users', (req, res) => {
    const id = req.params.id;
    groupMembersDb.get(id).then(members => {
        if(!members){
            return res.status(404).json({error: `Could not find members in group with ID ${id}.`})
        } else {
            return res.status(200).json(group);
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: `Error retrieving group members.`})
    })
})


/**
 * Create new group
 */
groupRouter.post('/', (req, res) => {

    // First, create the group

    console.log(req.body);
    let group = {
        name: req.body.name,
        userID: req.body.userID
    }

    groupDb.add(group).then(id => {
        console.log('groupID', id);
        if(!id || !id === undefined){
            return res.status(404).json({error: `Error creating group. Please check your parameters.`})
        } else {
            // create user-group link
            let groupID = id[0];
            console.log('group id: ', groupID);
            let groupMember = {
                userID : group.userID,
                groupID : groupID,
                moderator: 1,
                weeklyNotification: 1,
                monthlyNotification: 1,
                total: 0,
                net: 0
            }

            groupMembersDb.add(groupMember).then(groupLinkID => {
                console.log('group-link ID: ', groupLinkID);
                if(!groupLinkID){
                    return res.status(404).json({error: `Error creating group-user link.`})
                } else {
                    return res.status(201).json({message: `Group created with ID ${groupID}, group-user linked with ID ${groupLinkID}`})
                }
            })
            .catch(err => {
                console.log(err);
                return res.status(500).json({error: `Error creating user-group link.`})
            })
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: `Error creating group.`})
    })
    
})



/**
 * Add member to group
 */

/**n
 * Remove member from group
 */

/**
 * Update Group Name
 */

 /** Designate group moderator (true/false)
 */


module.exports = groupRouter;