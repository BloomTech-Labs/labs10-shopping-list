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
 * @param group.userID is the id of the user that is the owner of the group. Not nullable.
 * @param group.name is the name of the group. Not nullable.
 * @param group.token is an optional parameter to generate a unique token to invite other members
 *
 * ***********************************************/

/** ADD GROUP
 * @TODO Add middleware to ensure user is logged in
 * **/
groupRouter.post('/', (req, res) => {
    let group = req.body;
    console.log("Group -> ", group);
    groupDb.add(group).then(groupId => {
        const member = {
            userID: group.userID,
            groupID: groupId[0],
            moderator: true
        };

        if (groupId.length >= 1) {
            groupMembersDb.add(member).then(mId => {
                const msg = {
                    message: `Group ${groupId} successfully added.`,
                    Group: {
                        id: groupId,
                    },
                    GroupMember: {
                        id: mId[0],
                    }
                }

                if(mId.length >= 1) return res.status(200).json(msg)

                return res.status(500).json({message: `Could not add member to groupMembers.`})

            }).catch(e => {
                const error = {
                    message: `Internal Server Error - Adding Group Member`,
                    data: {
                        err: e
                    },
                }
                return res.status(500).json(error);
            })
        }


    }).catch(err => {
        const error = {
            message: `Internal Server Error - Adding Group`,
            data: {
                err: err
            },
        }
        return res.status(500).json(error);
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
        if (group.length >= 1) {
            return res.status(200).json(group[0]);
        }
        return res.status(404).json({error: `The requested group does not exist.`});
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

/**************************************************/

// GET ALL GROUPS
/** @TODO This should be set to sysadmin privileges for group privacy **/

/**************************************************/

groupRouter.get('/', (req, res) => {
    groupDb.get().then(groups => {
        if(!groups){
            return res.status(404).json({message: "No groups exist."});
        } else {
            return res.status(200).json(groups);
        }
    })
        .catch(err => {
            const error = {
                message: `Error collecting group information.`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
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
        if(status.length >= 1 || !status){
            return res.status(200).json({message: `Group ${id} successfully updated.`, id: id});

        } else {
            return res.status(404).json({error: `The requested group does not exist.`});
        }
    })
        .catch(err => {
            const error = {
                message: `Error updating group with ID ${id}.`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
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
        if(status.length >= 1 || !status){
            return res.status(200).json({message: `Group ${id} successfully removed.`, id: id});

        } else {
            return res.status(404).json({error: `The requested group does not exist.`});
        }
    })
        .catch(err => {
            const error = {
                message: `Error removing group with ID ${id}.`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

module.exports = groupRouter;