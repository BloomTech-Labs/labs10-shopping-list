const db = require('../data/config.js');

module.exports = {
    getByCode,
    add,
}

function getByCode(inviteCode) { // get the invitation information by passing in the inviteCode
    return db.select('*').from('invitations').where('inviteCode', inviteCode);
}

/**
 * 
 * @param invitation must contain inviteCode, groupID, groupName, userID, userName
 */
function add(invitation){
    return db('invitations').returning('id').insert(invitation).into('invitations'); // returns the id of the new invitation
}