const express = require('express');
const inviteRouter = express.Router();
const groupMembersDb = require('../../helpers/groupMembersModel');
const usersDb = require('../../helpers/userModel');

const inviteDb = require('../../helpers/invitationsModel');

const checkJwt = require('../../validators/checkJwt');

const crypto = require('crypto');
const moment = require('moment');

/****************************************************************************************************/
/** THIS ROUTER HANDLES ALL REQUESTS TO THE /api/invite ENDPOINT **/
/****************************************************************************************************/

inviteRouter.use(checkJwt); // ensures only logged in users can create invitations

/**
 * Create new invitation
 * @return inviteCode = returns the invite code for the created invitation
 * @param groupID = the group ID the code will invite to
 * @param groupName = the name of the group being invited to
 * @param userID = the ID of the user who created the invitation
 * @param userName = the name of the user who created the invitation
 * @param inviteCode = randomly generated string identifier
 */

inviteRouter.post('/create', (req, res) => {
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
        return res.status(500).json(err);
    })
})

inviteRouter.get('/:code', (req, res) => {
    console.log(req.params.code);
    let inviteCode = req.params.code;
    inviteDb.getByCode(inviteCode).then(info => {
        console.log('invite info', info[0]);
        if(info){
            res.status(200).json(info[0]);
        }
    })
})

module.exports = inviteRouter;