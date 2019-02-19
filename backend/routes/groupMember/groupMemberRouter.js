const express = require('express');
const groupMemberRouter = express.Router();
const groupMemDb = require('../../helpers/groupMembersModel');

const checkJwt = require('../../validators/checkJwt');
// checkJwt middleware authenticates user tokens and ensures they are signed correctly in order to access our internal API

/****************************************************************************************************/
/** THIS ROUTER HANDLES ALL REQUESTS TO THE /api/groupmember ENDPOINT **/
/****************************************************************************************************/

/** ADD GROUP MEMBER TO DATABASE
 * @param groupMember = {userID: ID of user, groupID: ID of the group the user is in}, this is gathered from the
 * req.body
 * @return id = group member ID primary key in groupMembers table (e.g. 1, 3, 22, etc.);
 * ID is generated upon groupMember creation
 * @param groupMember.userID is the id of the user
 * @param groupMember.groupID is the id of the group that user belongs to
 * @param groupMember.moderator is to determine whether the person is a moderator for the group or not
 * @param groupMember.weeklyNotification is to determine if the user has opt-in/out for weekly notifications for a
 * particular group
 * @param groupMember.monthlyNotification is to determine if the user has opt-in/out for monthly notifications for a
 * particular group
 * @param groupMember.total is the total gross amount of items they have spent
 * @param groupMember.net is the total net gross amount of items they have spent
 *
 * ***********************************************/

/** ADD GROUP MEMBER
 * @TODO Add middleware to ensure user is logged in
 * **/
groupMemberRouter.post('/', (req, res) => {
    console.log(req.body);
    let groupMem = req.body;
    groupMemDb.add(groupMem).then(id => {
        return res.status(200).json({message: `Group member added to database with ID ${id[0]}`, id: id[0]});
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error when adding group member.`});
        })
})

/**************************************************/

/** GET GROUP MEMBER BY ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
groupMemberRouter.get('/group/:id', (req, res) => {
    const id = req.params.id;

    groupMemDb.getByGroup(id).then(mem => {
        console.log(mem);
        if(!mem){
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

// GET ALL GROUP MEMBERS
/** @TODO This should be set to sysadmin privileges for group privacy **/

/**************************************************/

groupMemberRouter.get('/', (req, res) => {
    groupMemDb.get().then(mems => {
        console.log(mems);
        if(!mems){
            return res.status(404).json({error: `No group members found!`});
        } else {
            return res.status(200).json(mems);
        }
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error collecting groups information.`});
        })
})

/**************************************************/
/**
 * UPDATE GROUP MEMBER
 * @TODO Add middleware to ensure users can only change their own group information
 */

/**************************************************/
groupMemberRouter.put('/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    const userId = changes.userID;
    groupMemDb.update(id, userId, changes).then(status => {
        if(!status || status !== 1){
            return res.status(404).json({error: `No group member found with ID ${id}.`});
        } else {
            return res.status(200).json({message: `Group member ${id} successfully updated.`});
        }
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error updating group member with ID ${id}.`});
        })
})

/**************************************************/

/** DELETE GROUP MEMBER
 * @TODO Add middleware to prevent unauthorized deletions
 * **/

/**************************************************/

groupMemberRouter.delete('/:id', (req, res) => {
    const id = req.params.id;
    const userId = req.body;
    if (!userId) return res.status(404).json({error: `No userID sent`});

    groupMemDb.remove(id, userId).then(status => {
        console.log(status);
        if(!status || status !== 1){
            return res.status(404).json({error: `No group member found with ID ${id}.`});
        } else {
            return res.status(200).json({message: `Group member with ID ${id} deleted successfully.`});
        }
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({error: `Error deleting group member with ID ${id}.`});
        })
})

module.exports = groupMemberRouter;