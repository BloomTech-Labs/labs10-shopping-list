const express = require('express');
const groupRouter = express.Router();
const groupDb = require('../../helpers/groupModel');
const groupMembersDb = require('../../helpers/groupMembersModel');
const groupMemDb = require('../../helpers/groupMembersModel');
const cors = require('cors');

const usersDb = require('../../helpers/userModel');
const nodemailer = require('nodemailer');


const checkJwt = require('../../validators/checkJwt');
// checkJwt middleware authenticates user tokens and ensures they are signed correctly in order to access our internal API
const checkUser = require('../../validators/checkUser');

const chkC = require("./checkCors");

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
        console.log(groupId);
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
groupRouter.get('/user/:id', (req, res) => {

    let userId = req.params.id;
  
    groupDb.getByUser(userId).then(groups => {
        console.log('get groups by user id', groups);
        if(groups.length === 0){
            return res.status(404).json({error: `No groups found for that userID.`})
        }
        
        for(let i = 0; i < groups.length; i++){
            groupMembersDb.getByGroup(groups[i].id).then(members => {
                // console.log('members', members);
                groups[i].groupMembers = members;
                // console.log('UG', userGroups);
                // console.log('GI', groups[i]);
                // console.log('GROUPS', groups);

                let usrs = [];
                for (let j = 0; j < members.length; j++) {
                    usersDb.getById(members[j].userID).then(usr => {
                        console.log("USER => ", usr[0].name);
                        usrs.push(usr[0]);



                    }).then(() => {
                        groups[i].members = usrs;
                        console.log("GROUP => ", groups);

                        if(i === groups.length - 1){
                            return res.status(200).json({groups: groups}); // returns all groups with groupmembers appended
                        }
                    })
                }


            }).catch(err => {
                console.log(err);
                return res.status(500).json({error: `Internal server error.`})
            })
        }
    }).catch(err => {
        console.log(err);
        return res.status(500).json({error: `Error retrieving groups.`})
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

groupRouter.delete('/remove/:groupID/:userID', async (req, res) => {
    const groupID = Number(req.params.groupID);
    const userID = Number(req.params.userID);

    console.log("GROUP ID => ", groupID)
    console.log("USER ID => ", userID)

    let groups = [];
    let members = [];

    try {
        const ress = await groupDb.getById(groupID);
        console.log("RESS => ", ress);

        if (ress[0].userID === userID) {
            for (let i = 0; i < ress.length; i++) {
                const membs = await groupMemDb.getByGroup(groupID);
                console.log("MEMBS => ", membs);

                if (membs.length >= 1) {
                    membs.forEach(elem => {
                        members.push(elem);
                    })
                }

            }

            console.log("MEMBESR => ", members)

            if (members.length >= 1) {
                for (let i = 0; i < members.length; i++) {
                    // console.log("ID => ", members[i].id)
                    const returns = await groupMemDb.remove(members[i].id);
                }
            }


            const deletion = await groupDb.remove(groupID);
            console.log("DELETION => ", deletion)

            return res.status(200).json({removedID: deletion[0]});
        } else {
            res.status(403).json({message: "You can not delete a group you do not own!"});
        }


    } catch(err) {
        return res.status(404).json(err)
    }



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