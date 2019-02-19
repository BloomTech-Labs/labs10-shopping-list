// Define database from the configuration
const db = require('../data/config.js');

// Export functions
module.exports = {
  get,
  getByGroup,
  getByUser,
  getById,
  add,
  update,
  remove
}
/**
 * Returns all the group members in the database
 * @returns {*}
 */
function get() {
  return db("groupMembers");
}
/**
 * Returns all the group members of the given group ID
 * @param id - The ID of the group
 * @returns {*} - Returns all information about the group member from the given ID
 */
function getByGroup(id) {
  return db
    .select("*")
    .from("groupMembers")
    .where("groupId", id);
}

/**
 * Return all the information owned by the given user ID
 * @param id - The ID of the user
 * @returns {*} - Returns every information owned by given user ID
 */
function getByUser(id) {
  return db
    .select("*")
    .from("groupMembers")
    .where("userId", id);
}

function getById(groupID, userID) {
  return db.select("*").from("groupMembers").where({groupID}).where({userID});
}

/**
 * Adds a new group member to the database
 * @param groupMember - The new group member to add
 * @returns {*} - Returns the group members
 */
function add(groupMember) {
  return db("groupMembers")
      .returning("id")
    .insert(groupMember)
    .into("groupMembers");
}

/**
 * Update an existing group member in the database
 * @param userID - The user ID of the group member to update
 * @param groupID - The group ID of the group member to update
 * @param changes - The actual changes of the group member itself
 * @returns {*} - Returns the group member ID
 */
function update(userID, groupID, changes) {
  return db("groupMembers")
      .returning("id")
    .where('userID', userID)
    .where('groupID', groupID)
    .update(changes);
}

/**
 * Removes a group member from the database
 * @param userID - The user ID of the group member to remove
 * @param groupID - The group ID of the group member to remove
 * @returns {*} - Returns the group ID
 */
function remove(userID, groupID) {
  return db("groupMembers")
      .returning("id")
    .where('userID', userID)
    .where('groupID', groupID)
    .del();
}
