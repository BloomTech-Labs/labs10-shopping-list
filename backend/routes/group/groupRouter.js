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
    const groupID = req.params.id
    groupDb.getById(groupID).then(group => {
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
    console.log(id);
    groupMembersDb.getByGroup(id).then(members => {
        if(!members){
            return res.status(404).json({error: `Could not find members in group with ID ${id}.`})
        } else {
            return res.status(200).json(members);
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
    const group = {
        name: req.body.name, // name of the group
        userID: req.body.userID // user ID that created the group
    }

    groupDb.add(group).then(id => {
        console.log('groupID', id);
        if(!id || !id === undefined){
            return res.status(404).json({error: `Error creating group. Please check your parameters.`})
        } else {
            
            // then, create user-group link

            const groupID = id[0];
            console.log('group id: ', groupID);
            const groupMember = {
                userID : group.userID, // the user ID of the group creator
                groupID : groupID, // the group ID from the groups Database
                moderator: 1, // set as moderator upon group creation
                weeklyNotification: 1, // auto-subscribe to weekly reports
                monthlyNotification: 1, // auto-subscribe to monthly reports
                total: 0, // initialize total to 0
                net: 0 // initialize net to 0
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
 * POST /api/group/:groupID
 */
groupRouter.post('/:groupID', (req, res) => {
    const groupID = req.params.groupID;
    const userID = req.body.userID;

    console.log('group ID', groupID);

    // Verify that the group exists
    groupDb.getById(groupID).then(group => {
        console.log('group', group);
        if(!group || group.length === 0){
            console.log('group does not exist');
            return res.status(404).json({error: `That group does not exist.`})
        } else {

            const groupMember = {
                userID : userID, // the user ID of the group creator
                groupID : groupID, // the group ID from the groups Database
                moderator: 0, // set as false when adding to group
                weeklyNotification: 1, // auto-subscribe to weekly reports
                monthlyNotification: 1, // auto-subscribe to monthly reports
                total: 0, // initialize total to 0
                net: 0 // initialize net to 0
            }

            groupMembersDb.add(groupMember).then(groupLinkID => {
                if(!groupLinkID){
                    return res.status(404).json({error: `Error creating group-user link.`})
                } else {
                    return res.status(201).json({message: `User with ID ${userID} added to group with ID ${groupID} with group-user link ID ${groupLinkID}.`})
                }
            })
            .catch(err => {
                console.log(err);
                return res.status(500).json({error: `Error adding user to group.`})
            })
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: `Error adding user to group.`})
    })
})

/**n
 * Remove member from group
 */

/**
 * Update Group Name
 */


/**
 * Update weekly notifications
 */

/**
 * Update monthly notifications
 */

/**
 * Update group-user total
 * will pass new information to group-user net
 */

/** 
 * 
 * Update group-user net
 * Will receive new information from group-user total
 */

 /** Change group moderator (true/false => 1/0)
 */


/**
 * delete group (must delete all user-group links in groupMembers table)
 */

module.exports = groupRouter;