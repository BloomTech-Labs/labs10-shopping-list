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
 * Returns all the subscriptions in the database
 * @returns {*}
 */
function get() {
    return db("subscriptions");
}
/**
 * Returns all the subscriptions of the given ID
 * @param id - The ID of the subscription
 * @returns {*} - Returns all information about the subscriptions from the given ID
 */
function getById(id) {
    return db
        .select("*")
        .from("subscriptions")
        .where({id});
}

/**
 * Adds a new subscription to the database
 * @param sub - The new group member to add
 * @returns {*} - Returns the subscription
 */
function add(sub) {
    return db("subscriptions")
        .returning(["id", "name", "amount"])
        .insert(sub)
        .into("subscriptions");
}

/**
 * Update an existing subscription in the database
 * @param id - The ID of the subscription to update
 * @param changes - The actual changes of the group member itself
 * @returns {*} - Returns the group member ID
 */
function update(id, changes) {
    return db("subscriptions")
        .returning("id")
        .where({id})
        .update(changes);
}

/**
 * Removes a subscription from the database
 * @param id - The id of the subscription to remove
 * @returns {*} - Returns the subscription ID
 */
function remove(id) {
    return db("subscriptions")
        .returning("id")
        .where({id})
        .del();
}
