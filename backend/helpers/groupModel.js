// Define database from the configuration
const db = require('../data/config.js');

// Export functions
module.exports = {
  get,
  getById,
  getByUser,
  add,
  update,
  remove
}
/**
 * Returns all the groups in the database
 * @returns {*}
 */
function get() {
  return db("groups");
}
/**
 * Returns the group of the given ID
 * @param id - The ID of the group
 * @returns {*} - Returns all information about the group from the given ID
 */
function getById(id) {
  return db
    .select("*")
    .from("groups")
    .where({ id });
}

/**
 * Return all the groups owned by given user ID
 * @param id - The ID of the user
 * @returns {*} - Returns every group owned by given user ID
 */
function getByUser(id) {
  return db
    .select("*")
    .from("groups")
    .where("userId", id);
}

/**
 * Adds a new group to the database
 * @param group - The new group to add
 * @returns {*} - Returns the groups
 */
function add(group) {
  return db("groups")
    .insert(group)
    .into("groups");
}

/**
 * Update an existing group in the database
 * @param id - The ID of the group to update
 * @param changes - The actual changes of the group itself
 * @returns {*} - Returns the group ID
 */
function update(id, changes) {
  return db("group")
    .where({ id })
    .update(changes);
}

/**
 * Removes a group from the database
 * @param id - The ID of the group to remove
 * @returns {*} - Returns the group ID
 */
function remove(id) {
  return db("groups")
    .where({ id })
    .del();
}
