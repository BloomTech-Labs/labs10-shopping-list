const express = require('express');
const groupRouter = express.Router();
const groupDb = require('../../helpers/groupModel');
const groupMembersDb = require('../../helpers/groupMembersModel');

const checkJwt = require('../../validators/checkJwt');
// checkJwt middleware authenticates user tokens and ensures they are signed correctly in order to access our internal API

/****************************************************************************************************/
/** THIS ROUTER HANDLES ALL REQUESTS TO THE /api/group ENDPOINT **/
/****************************************************************************************************/

/** ADD GROUP TO DATABASE
 * @param group = {userID: ID of user, name: "name of group"}, this is gathered from the @param req.body
 * @return id = group ID primary key in groups table (e.g. 1, 3, 22, etc.);
 * ID is generated upon group creation
 * @param group.userID is the id of the user that is the owner of the group
 * @param group.name is the name of the group. Not nullable.
 * @param group.token is an optional parameter to generate a unique token to invite other members
 *
 * ***********************************************/

/** ADD GROUP
 * @TODO Add middleware to ensure user is logged in
 * **/
groupRouter.post('/', (req, res) => {
    console.log(req.body);
    let group = req.body;
    groupDb.add(group).then(id => {
        console.log(id);
        const member = {
            userID: group.userID,
            groupID: id[0],
            moderator: true
        };
        console.log(member);
        groupMembersDb.add(member).then(gid => {
            console.log(gid);
            return res.status(200).json({message: `Group added to database with ID ${id[0]}`, id: id[0]});
        }).catch(err => {
            return res.status(500).json({error: `Error when adding group member.`});
        })
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error when adding group.`});
        })
})

/**************************************************/

/** GET GROUP BY ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
groupRouter.get('/:id', (req, res) => {
    const id = req.params.id;

    groupDb.getById(id).then(group => {
        console.log(group);
        if(!group){
            return res.status(404).json({error: `group with ID ${id} does not exist.`});
        } else {
            return res.status(200).json(group);
        }
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error retrieving group with ID ${id}.`});
        })
})

/**************************************************/

// GET ALL GROUPS
/** @TODO This should be set to sysadmin privileges for group privacy **/

/**************************************************/

groupRouter.get('/', (req, res) => {
    groupDb.get().then(groups => {
        console.log(groups);
        if(!groups){
            return res.status(404).json({error: `No groups found!`});
        } else {
            return res.status(200).json(groups);
        }
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error collecting groups information.`});
        })
})

/**************************************************/
/**
 * UPDATE GROUP
 * @TODO Add middleware to ensure users can only change their own group information
 */

/**************************************************/
groupRouter.put('/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    groupDb.update(id, changes).then(status => {
        if(!status || status !== 1){
            return res.status(404).json({error: `No group found with ID ${id}.`});
        } else {
            return res.status(200).json({message: `Group ${id} successfully updated.`});
        }
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error updating group with ID ${id}.`});
        })
})

/**************************************************/

/** DELETE GROUP
 * @TODO Add middleware to prevent unauthorized deletions
 * **/

/**************************************************/

groupRouter.delete('/:id', (req, res) => {
    const id = req.params.id;

    groupDb.remove(id).then(status => {
        console.log(status);
        if(!status || status !== 1){
            return res.status(404).json({error: `No group found with ID ${id}.`});
        } else {
            return res.status(200).json({message: `Group with ID ${id} deleted successfully.`});
        }
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error deleting group with ID ${id}.`});
        })
})

module.exports = groupRouter;