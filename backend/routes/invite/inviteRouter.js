const express = require('express');
const inviteRouter = express.Router();
const groupMembersDb = require('../../helpers/groupMembersModel');
const usersDb = require('../../helpers/userModel');
const groupDb = require('../../helpers/groupModel');

const inviteDb = require('../../helpers/invitationsModel');

const checkJwt = require('../../validators/checkJwt');

const crypto = require('crypto');
const moment = require('moment');

/****************************************************************************************************/
/** THIS ROUTER HANDLES ALL REQUESTS TO THE /api/invite ENDPOINT **/
/****************************************************************************************************/

// inviteRouter.use(checkJwt); // ensures only logged in users can create invitations
// ^ only use on case-by-case basis, as invite acceptance needs to be public

/**
 * Create new invitation
 * @return inviteCode = returns the invite code for the created invitation
 * @param groupID = the group ID the code will invite to
 * @param groupName = the name of the group being invited to
 * @param userID = the ID of the user who created the invitation
 * @param userName = the name of the user who created the invitation
 * @param inviteCode = randomly generated string identifier
 */

inviteRouter.post('/create', checkJwt, (req, res) => {
    let info = req.body; // req.body should contain groupID, groupName, userID, userName from the front-end.

    let newCode = crypto.randomBytes(14).toString('hex');

    info.inviteCode = newCode;

    let expiration = moment().add(7, 'days').format();
    console.log('exp', expiration);
    info.expiration = expiration;

   console.log('invite info', info);
    inviteDb.add(info).then(status => {
        console.log('status', status)
        if(status.length >= 0){
            console.log('success!');
            return res.status(201).json({message: `New invitation created with code ${info.inviteCode}.`, inviteCode: info.inviteCode});
        } else {
            return res.status(404).json({error: `Could not create invitation.`})
        }
    }).catch(err => {
        console.log(err);
        return res.status(500).json({message: "Internal server error", data: err});
    })
})

inviteRouter.get('/:code', (req, res) => {
    let inviteCode = req.params.code;
    inviteDb.getByCode(inviteCode).then(info => {
        // console.log('invite info', info[0]);
        if(info){
            // console.log(info[0].groupID)
             groupDb.getById(info[0].groupID).then(group => {
                console.log('invite group query', group);
                info[0].groupName = group[0].name; // add group name to info
                 usersDb.getById(info[0].userID).then(user => {
                    // console.log(user[0]);
                    info[0].userName = user[0].name;
                    console.log('final info', info[0]);
                    return res.status(200).json(info[0]);
                }).catch(err => {
                    console.log(err);
                    return res.status(404).json({error: `Could not find a user with the specified ID.`})
                })
            }).catch(err => {
                console.log(err);
                return res.status(404).json({error: `Could not find a group with the specified ID.`})
            })
        } else {
            return res.status(404).json({error: `No invite matches that code.`})
        }
    }).catch(err => {
        console.log(err);
        return res.status(500).json({error: `Internal server error.`})
    })
})

// if invitation is accepted, add new user to groupMembers db

inviteRouter.post('/join', checkJwt, (req, res) => { // req.body must contain the invitation code
    usersDb.getIdByEmail(req.user.email).then(id => {
        let newMember = {};
        newMember.userID = id[0].id; // start constructing the newMember
        inviteDb.getByCode(req.body.inviteCode).then(invite => {
            // console.log(invite[0].usedBefore);
            if(invite[0].usedBefore === 0 || invite[0].usedBefore === false){
                newMember.groupID = invite[0].groupID; // the group ID that is in the invitation
                // console.log('newmemebr', newMember);
                let changes = invite[0];
                changes.usedBefore = true; // mark the invitation as having been visited
                inviteDb.update(invite[0].id, changes).then(status => {
                    // console.log(status);
                    // add the new user into the database as a member of the given group ID

                    groupMembersDb.getById(newMember.groupID, newMember.userID).then(response => {
                        if(response.length > 0){ // ensure that the user is not already a member of the group
                            return res.status(400).json({message: `User is already a member of that group.`})
                        } else {
                            groupMembersDb.add(newMember).then(newId => {
                                console.log('success', newId);
                                return res.status(201).json({message: `New group member added with ID ${newId[0]}.`, id: id[0]});
                            })
                        }
                    })
                })
            } else {
                return res.status(400).json({error: `That invitation is no longer valid.`});
            }
        })
    }).catch(err => {
        console.log(err);
        return res.status(500).json({error: `Internal server error.`, data: err})
    })
})

module.exports = inviteRouter;