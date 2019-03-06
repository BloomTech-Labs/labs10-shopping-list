// Define database from the configuration
const db = require('../data/config.js');

// Export functions
module.exports = {
    get,
    getByUser,
    getById,
    add,
    update,
    remove
}

function get() {
    return db("notifications");
}

function getByUser(userID) {
    return db
        .select("*")
        .from("notifications")
        .where({userID});
}

function getById(id) {
    return db
        .select("*")
        .from("notifications")
        .where({ id });
}

function add(notification) {
    return db("notifications")
        .returning("id")
        .insert(notification)
        .into("notifications");
}

function update(id, changes) {
    return db("notifications")
        .returning("id")
        .where({ id })
        .update(changes);
}

function remove(id) {
    return db("notifications")
        .returning("id")
        .where({ id })
        .del();
}
