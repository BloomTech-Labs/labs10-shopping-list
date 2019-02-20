// Define database from the configuration
const db = require('../data/config.js');

// Export functions
module.exports = {
    get,
    getById,
    getByCategory,
    add,
    update,
    remove
}

function get() {
    return db("categories");
}

function getById(id) {
    return db
        .select("*")
        .from("categories")
        .where({ id });
}

function getByCategory(category) {
    return db.select("*").from("categories").where({ category });
}

function add(item) {
    return db("categories")
        .returning("id")
        .insert(item)
        .into("categories");
}

function update(id, changes) {
    return db("categories")
        .returning("id")
        .where({ id })
        .update(changes);
}

function remove(id) {
    return db("categories")
        .returning("id")
        .where({ id })
        .del();
}
