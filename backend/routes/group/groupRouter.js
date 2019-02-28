const express = require('express');
const groupRouter = express.Router();
const groupDb = require('../../helpers/groupModel');
const groupMembersDb = require('../../helpers/groupMembersModel');
const groupMemDb = require('../../helpers/groupMembersModel');
const userDb = require('../../helpers/userModel');

const checkJwt = require('../../validators/checkJwt');
// checkJwt middleware authenticates user tokens and ensures they are signed correctly in order to access our internal API
const checkUser = require('../../validators/checkUser');

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

groupRouter.use(checkJwt);
/** this middleware will decode the JWT and store the user information in req.user
 * it should be initiated before any other middleware, as the req.user contains valuable
 * user information (e.g. email) that needs to be verified in the database
 * **

/**
 * @NOTE The @checkUser middleware must be route-specific, as it requires the req.params value
 * to function without unnecessary complexity. Trying to use router.use() with checkUser will not
 * pass the req.params to the function, and therefore it will not operate properly.
 */

/** ADD GROUP
 * @TODO Add middleware to ensure user is logged in
 * **/
groupRouter.post('/', (req, res) => {
    let group = req.body;
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
                    group: {
                        id: Number(groupId),
                    },
                    groupMember: {
                        id: Number(mId[0]),
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
groupRouter.get('/:id', checkUser, (req, res) => {
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

/** GET GROUP BY USER ID
 * 
 * @NOTE @checkUser middleware ensures only users with permission can access
 * their own group information
 * **/

/**************************************************/

function fetch_group_mem(id) {
    return groupMemDb.getByGroup(id).then((value) => {
        return value;
    })
}

function contains(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

groupRouter.get('/user/:id', checkUser, async (req, res) => {
    const id = req.params.id;

    let groups = [];
    let members = [];

    const groupmembs = await groupMemDb.returnUserGroups(id);

    // console.log("GM => ", groupmembs);

    for (let i = 0; i < groupmembs.length; i++) {
        const grp = await groupDb.getById(groupmembs[i].groupID)
        groups.push(grp[0]);
    }

    let newGroups = [];

    try {

        // console.log("GRP => ", grp);
        for (let i = 0; i < groups.length; i++) {
            console.log(`GROUPS ${i}=> `, groups[i])

            let curMembs = []
            const groupMember = await groupMemDb.getByGroup(groups[i].id);


            // console.log(`GROUP MEMBER ${i} => `, groupMember);

            for (let j = 0; j < groupMember.length; j++) {
                const user = await userDb.getById(groupMember[j].userID);
                // console.log("USER => ", user);
                if (!contains(curMembs, user[0])) {
                    curMembs.push(user[0]);
                }

            }

            // console.log(`CUR MEMBS => `, curMembs)

            const data = {
                id: groups[i].id,
                userID: groups[i].userID,
                name: groups[i].name,
                token: groups[i].token,
                createdAt: groups[i].createdAt,
                updatedAt: groups[i].updatedAt,
                memberAmount: groupMember.length,
                members: curMembs,
            };

            newGroups.push(data);

            // for (let i = 0; i < member.length; i++) {
            //     const usr = await userDb.getById(member[i].userID);
            //     members.push({id: usr[0].id, name: usr[0].name, pic: usr[0].profilePicture});
            // }
            //
            // // console.log("MEMS => ", members);
            //
            // const data = {
            //     id: groups[i].id,
            //     userID: groups[i].userID,
            //     name: groups[i].name,
            //     token: groups[i].token,
            //     createdAt: groups[i].createdAt,
            //     updatedAt: groups[i].updatedAt,
            //     memberAmount: groupMember.length,
            //     members: members,
            // };
            //
            // newGroups.push(data);
        }

        return res.status(200).json({data: newGroups });

    } catch (e) {
        return res.status(500).json({message: "Internal Server Error", err: e})
    }


})

/**************************************************/

// GET ALL GROUPS
/** @TODO This should be set to sysadmin privileges for group privacy **/

/**************************************************/

groupRouter.get('/', (req, res) => {
    groupDb.get().then(groups => {
        if(groups.length >= 1){
            return res.status(200).json(groups);
        }

        return res.status(404).json({message: "No groups exist."});
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
            return res.status(200).json({message: `Group ${id} successfully updated.`, id: Number(id)});

        }

        return res.status(404).json({error: `The requested group does not exist.`});
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

groupRouter.delete('/remove', (req, res) => {
    const {groupID, userID} = req.body;

    groupMembersDb.remove(userID, groupID).then(id => {
        groupDb.remove(groupID).then(status => {
            if(status.length >= 1 || !status){
                return res.status(200).json({message: `Group ${status[0]} successfully removed.`, id: Number(groupID)});

            }

            return res.status(404).json({error: `The requested group does not exist.`});
        })
            .catch(err => {
                const error = {
                    message: `Error removing group with ID ${groupID}.`,
                    data: {
                        err: err
                    },
                }
                return res.status(500).json(error);
            })

    }).catch(err => {
        const error = {
            message: `Error removing group member.`,
            data: {
                err: err
            },
        }
        return res.status(500).json(error);
    })


})

module.exports = groupRouter;