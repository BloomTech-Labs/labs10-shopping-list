// Define database from the configuration
const db = require('../data/config.js');

// Export functions
module.exports = {
  get,
  getById,
  add,
  update,
  remove
}
/**
 * Returns all the users in the database
 * @returns {*}
 */
function get() {
  return db("users");
}
/**
 * Returns the user of the given ID
 * @param id - The ID of the user
 * @returns {*} - Returns the user from the given ID
 */
function getById(id) {
  return db
    .select("*")
    .from("users")
    .where({ id });
}

/**
 * Adds a new user to the database
 * @param user - The new user to add
 * @returns {*} - Returns the users
 */
function add(user) {
  return db("users")
    .insert(group)
    .into("users");
}

/**
 * Update an existing user in the database
 * @param id - The ID of the user to update
 * @param changes - The actual changes of the group itself
 * @returns {*} - Returns the user ID
 */
function update(id, changes) {
  return db("users")
    .where({ id })
    .update(changes);
}

/**
 * Removes a user from the database
 * @param id - The ID of the user to remove
 * @returns {*} - Returns the user ID
 */
function remove(id) {
  return db("users")
    .where({ id })
    .del();
}
