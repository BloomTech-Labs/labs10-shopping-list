// Define database from the configuration
const db = require('../data/config.js');

// Export functions
module.exports = {
  add,
  remove,
  getById,
  get,
  update
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
 * @param id - The ID of the group
 * @returns {*} - Returns all information about the user from the given ID
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
 * @returns {*} - Returns the new user ID inside an array: { "id": [1] }
 */
function add(user) {
  return db("users")
    .insert(user)
    .into("users");
}

/**
 * Update an existing user in the database
 * @param id - The ID of the user to update
 * @param changes - The actual changes of the user itself
 * @returns {*} - Returns the user ID
 */
function update(id, changes) {
  return db("users")
    .where('id', Number(id)) // ensure the id is a number not a string
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