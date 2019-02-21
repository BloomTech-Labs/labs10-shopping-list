// Define database from the configuration
const db = require('../data/config.js');

// Export functions
module.exports = {
  get,
  getByGroup,
  getByUser,
  getById,
  returnUserGroups,
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
    .where("groupID", id);
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
    .where("userID", id);
}

/**
 * Return all the information owned by the given user ID and group ID
 * @param userID - The ID of the user
 * @param groupID - The ID of the group
 * @returns {*} - Returns every information owned by given member
 */
function getById(groupID, userID) {
  return db.select("*").from("groupMembers").where({groupID}).where({userID});
}

/**
 * Return all the group id's owned by the given user ID
 * @param id - The ID of the user
 * @returns {*} - Returns all groupID's owned by given user ID
 */
function returnUserGroups(userID) {
  return db
      .select("groupID")
      .from("groupMembers")
      .where({userID});
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
 * @param id - The ID of the group member to update
 * @param changes - The actual changes of the group member itself
 * @returns {*} - Returns the group member ID
 */
function update(id, changes) {
  return db("groupMembers")
      .returning("id")
    .where({id})
    .update(changes);
}

/**
 * Removes a group member from the database
 * @param id - The ID of the group member to remove
 * @returns {*} - Returns the group ID
 */
function remove(id) {
  return db("groupMembers")
      .returning("id")
    .where({id})
    .del();
}
