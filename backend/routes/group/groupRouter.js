const express = require('express');
const groupRouter = express.Router();
const groupDb = require('../../helpers/groupModel');
const groupMembersDb = require('../../helpers/groupMembersModel');
const groupMemDb = require('../../helpers/groupMembersModel');

const usersDb = require('../../helpers/userModel');
const nodemailer = require('nodemailer');


const checkJwt = require('../../validators/checkJwt');
// checkJwt middleware authenticates user tokens and ensures they are signed correctly in order to access our internal API
const checkUser = require('../../validators/checkUser');
const checkSubscription = require('../../validators/checkSubscription');

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
groupRouter.post('/', checkSubscription, (req, res) => {
    let group = req.body;
    const subType = req.subscriptionType;
    console.log("GROUP => ", group);
    console.log("subType => ", subType);

    groupDb.getByUser(group.userID).then(rs => {
        console.log("RS => ", rs);
        if (subType === 1 && rs.length >= 1) {
            return res.status(403).json({ warning: `You do not have permission to do that. Only premium members can create more than one group.`})
        } else if (subType === 1 && rs.length === 0 || subType === 2) {
            groupDb.add(group).then(groupId => {
                // console.log(groupId);
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
                    }).catch(err => {
                        console.log(err);
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
        }

    }).catch(err => {
        return res.status(500).json(err);
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
 * also sends all group members
 * **/

/**************************************************/

function fetch_group_mem(id) {
    return groupMemDb.getByGroup(id).then((value) => {
        return value;
    })
}

// get all groups with user ID
// TODO: Refactor for better performance
groupRouter.get('/user/:id', async (req, res) => {
    let userID = req.params.id;
    var finalProfiles = [];

    // get all groups user is a member of via groupmembers
    groupMembersDb.getByUser(userID).then(joinedGroups => {
        // console.log('joined groups', joinedGroups);

        // get all group profiles via groupID
        for(let i = 0; i < joinedGroups.length; i++){
            groupDb.getById(joinedGroups[i].groupID).then(groupProfiles => {
                // console.log('group profiles', groupProfiles);

                for(let j = 0; j < groupProfiles.length; j++){
                    //initialize an empty array for each group profile's members
                    if(!groupProfiles[j].members){
                        groupProfiles[j].members = [];
                    }
                    
                    // get all members of each group via groupmembers
                    groupMembersDb.getByGroup(groupProfiles[j].id).then(groupMembers => {    
                        // console.log('group members', groupMembers);

                        // get all user profiles via userdb
                        for(let k = 0; k < groupMembers.length; k++){
                            usersDb.getById(groupMembers[k].userID).then(userProfile => {
                                // console.log('userProfile', userProfile[0]);
                                if(userProfile && userProfile[0] !== undefined){
                                    groupProfiles[j].members[k] = userProfile[0];
                                } else {
                                    let removed = {id: 0, name: 'Removed User', email: 'removed', profilePicture: 'https://i.imgur.com/M8kRKQC.png'};
                                    groupProfiles[j].members[k] = removed;
                                }
                                // console.log('finished profile', groupProfiles[j]);
                                if(k === groupMembers.length - 1){
                                    finalProfiles.push(groupProfiles[j]);
                                }

                                if(i === joinedGroups.length - 1){
                                    console.log('final profiles', finalProfiles);
                                    return res.status(200).json({groups: finalProfiles});
                                }
                            })
                        }
                    })
                }
            })
        }
    }).catch(err => {
        console.log(err);
        return res.status(500).json({error: `Internal server error.`})
    })
})





// function contains(a, obj) {
//     var i = a.length;
//     while (i--) {
//         if (a[i] === obj) {
//             return true;
//         }
//     }
//     return false;
// }


// groupRouter.get('/user/:id', checkUser, async (req, res) => {
//     const id = req.params.id;

//     let groups = [];
//     let members = [];

//     const groupmembs = await groupMemDb.returnUserGroups(id);

//     // console.log("GM => ", groupmembs);

//     for (let i = 0; i < groupmembs.length; i++) {
//         const grp = await groupDb.getById(groupmembs[i].groupID)
//         groups.push(grp[0]);
//     }

//     let newGroups = [];

//     try {

//         // console.log("GRP => ", grp);
//         for (let i = 0; i < groups.length; i++) {
//             console.log(`GROUPS ${i}=> `, groups[i])

//             let curMembs = []
//             const groupMember = await groupMemDb.getByGroup(groups[i].id);


//             // console.log(`GROUP MEMBER ${i} => `, groupMember);

//             for (let j = 0; j < groupMember.length; j++) {
//                 const user = await userDb.getById(groupMember[j].userID);
//                 // console.log("USER => ", user);
//                 if (!contains(curMembs, user[0])) {
//                     curMembs.push(user[0]);
               

// function contains(a, obj) {
//     var i = a.length;
//     while (i--) {
//         if (a[i] === obj) {
//             return true;
//         }
//     }
//     return false;
// }

// groupRouter.get('/user/:id', checkUser, async (req, res) => {
//     const id = req.params.id;

//     let groups = [];
//     let members = [];

//     const groupmembs = await groupMemDb.returnUserGroups(id);

//     // console.log("GM => ", groupmembs);

//     for (let i = 0; i < groupmembs.length; i++) {
//         const grp = await groupDb.getById(groupmembs[i].groupID)
//         groups.push(grp[0]);
//     }

//     let newGroups = [];

//     try {

//         // console.log("GRP => ", grp);
//         for (let i = 0; i < groups.length; i++) {
//             console.log(`GROUPS ${i}=> `, groups[i])

//             let curMembs = []
//             const groupMember = await groupMemDb.getByGroup(groups[i].id);


//             // console.log(`GROUP MEMBER ${i} => `, groupMember);

//             for (let j = 0; j < groupMember.length; j++) {
//                 const user = await userDb.getById(groupMember[j].userID);
//                 // console.log("USER => ", user);
//                 if (!contains(curMembs, user[0])) {
//                     curMembs.push(user[0]);
//                 }

//             }

//             // console.log(`CUR MEMBS => `, curMembs)

//             const data = {
//                 id: groups[i].id,
//                 userID: groups[i].userID,
//                 name: groups[i].name,
//                 token: groups[i].token,
//                 createdAt: groups[i].createdAt,
//                 updatedAt: groups[i].updatedAt,
//                 memberAmount: groupMember.length,
//                 members: curMembs,
//             };

//             newGroups.push(data);

//             // for (let i = 0; i < member.length; i++) {
//             //     const usr = await userDb.getById(member[i].userID);
//             //     members.push({id: usr[0].id, name: usr[0].name, pic: usr[0].profilePicture});
//             // }
//             //
//             // // console.log("MEMS => ", members);
//             //
//             // const data = {
//             //     id: groups[i].id,
//             //     userID: groups[i].userID,
//             //     name: groups[i].name,
//             //     token: groups[i].token,
//             //     createdAt: groups[i].createdAt,
//             //     updatedAt: groups[i].updatedAt,
//             //     memberAmount: groupMember.length,
//             //     members: members,
//             // };
//             //
//             // newGroups.push(data);
//         }
//     }).catch(err=>{
//         console.log(err);
//         return res.status(500).json({error: `Internal server error.`})
//     })

// })

//         return res.status(200).json({data: newGroups });



//     try {
//         const grp = await groupDb.getByUser(id);

//         // console.log("GRP => ", grp);
//         for (let i = 0; i < grp.length; i++) {
//             const member = await groupMemDb.getByGroup(grp[i].id);
//             // console.log("MEMBER => ", member);

//             const data = {
//                 id: grp[i].id,
//                 userID: grp[i].userID,
//                 name: grp[i].name,
//                 token: grp[i].token,
//                 createdAt: grp[i].createdAt,
//                 updatedAt: grp[i].updatedAt,
//                 memberAmount: member.length,
//             };

//             groups.push(data);
//         }
    //         }

    //         // console.log(`CUR MEMBS => `, curMembs)

    //         const data = {
    //             id: groups[i].id,
    //             userID: groups[i].userID,
    //             name: groups[i].name,
    //             token: groups[i].token,
    //             createdAt: groups[i].createdAt,
    //             updatedAt: groups[i].updatedAt,
    //             memberAmount: groupMember.length,
    //             members: curMembs,
    //         };

    //         newGroups.push(data);
    //     }

    //     return res.status(200).json({data: newGroups });

    // } catch (e) {
    //     return res.status(500).json({message: "Internal Server Error", err: e})
    // }

//         return res.status(200).json({data: groups });

//     } catch (e) {
//         return res.status(500).json({message: "Internal Server Error", err: e})
//     }


// })

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

groupRouter.delete('/remove/:groupID/:userID', (req, res) => {
    let userID = req.params.userID;
    let groupID = req.params.groupID;
    groupMembersDb.getById(groupID, userID).then(entry => {
        // console.log(entry);
        if(entry && (entry[0].moderator === 1 || entry[0].moderator === true)){
            groupDb.remove(groupID).then(response => {
                console.log('delete response', response);
                // delete from groupmembers table
                groupMembersDb.removeGroup(groupID).then(response => {
                    console.log('groupmem del response', response);
                    return res.status(200).json({message: `Group successfully deleted.`})
                })
            })
        } else {
            return res.status(403).json({warning: `You are not authorized to do that.`})
        }
    }).catch(err => {
        console.log(err);
        return res.status(500).json({error: `Internal server error.`})
    })
})
/**************************************************/

/** GET/ADD user to group by USER ID and GROUP ID
 * **/

/**************************************************/
groupRouter.get('/invite/:userId::groupId', (req, res) => {
    const user = req.params.userId;
    const group = req.params.groupId;
    const groupMem = {
        userID: user,
        groupID: group};

    groupMemDb.add(groupMem).then(id => {
        return res.status(200).json({message: `User added to group.`, userId: user, groupId: group, id: id[0]});
    }).catch(err => {
        const error = {
            message: `Error adding user to group.`,
            data: {
                error: err
            }
        }
        return res.status(500).json(error);
    });
})

/**************************************************/

/** POST/email user the link
 * **/

/**************************************************/
groupRouter.get('/invite/email', (req, res) => {
    let email = req.body.email;
    let link = req.body.link;

    // setting up sender e-mail
    let transporter = nodemailer.createTransport({
        service: `${process.env.EMAIL_SERVICE}`,
        auth:{
            user: `${process.env.EMAIL_ADDRESS}`,
            pass: `${process.env.EMAIL_PASSWORD}`
        }
    });

    // create the email
    let mailOptions = {
        from: `${process.env.EMAIL_ADDRESS}`,
        to: `${email}`,
        subject: `You are invited to join a group on ShopTrak`,
        text: `${link}`
    };

    //send the email
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Email send: '+info.response);
        }
    });

    return res.status(200).json({
        message: "invitation sent",
        email: email,
        link: link
    });
})

/**************************************************/

module.exports = groupRouter;