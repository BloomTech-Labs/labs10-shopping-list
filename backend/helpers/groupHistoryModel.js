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
 * Returns all the group histories in the database
 * @returns {*}
 */
function get() {
  return db("groupHistory");
}


/**
 * Returns all the group histories of the given group ID
 * @param id - The ID of the group
 * @returns {*} - Returns all information about the group history from the given ID
 */
function getByGroup(id) {
  return db
    .select("*")
    .from("groupHistory")
    .where("groupID", id);
}


/**
 * Return all group histories owned by the given user ID
 * @param id - The ID of the user
 * @returns {*} - Returns every information owned by given user ID
 */
function getByUser(id) {
  return db
    .select("*")
    .from("groupHistory")
    .where("userID", id);
}


/**
 * Return all the histories owned by the given user ID and group ID
 * @param userID - The ID of the user
 * @param groupID - The ID of the group
 * @returns {*} - Returns every information owned by given history
 */
function getById(groupID, userID) {
  return db.select("*").from("groupHistory").where({groupID}).where({userID});
}


/**
 * Adds a new group history to the database
 * @param groupMember - The new group history to add
 * @returns {*} - Returns the group history
 */
function add(groupMember) {
  return db("groupHistory")
      .returning("id")
    .insert(groupMember)
    .into("groupHistory");
}


/**
 * Update an existing group history in the database
 * @param id - The ID of the group history to update
 * @param changes - The actual changes of the group history itself
 * @returns {*} - Returns ??
 */
function update(id, changes) {
  console.log("*testing*");
  return db("groupHistory")
      .returning("id")
    .where({id})
    .update(changes);
}

/**
 * Removes a group history from the database
 * @param id - The ID of the group history to remove
 * @returns {*} - Returns the group ID
 */
function remove(id) {
  return db("groupHistory")
      .returning("id")
    .where({id})
    .del();
}
