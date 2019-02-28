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

function get() {
  return db("items");
}

function getByGroup(groupId) {
  return db
    .select("*")
    .from("items")
    .where("groupID", groupId);
}

function getByUser(userId) {
  return db
    .select("*")
    .from("items")
    .where("purchasedBy", userId);
}

function getById(id) {
  return db
    .select("*")
    .from("items")
    .where({ id });
}

function add(item) {
  return db("items")
      .returning("id")
    .insert(item)
    .into("items");
}

function update(id, changes) {
  return db("items")
    .returning("id")
    .where({ id })
    .update(changes);
}

function remove(id) {
  return db("items")
      .returning("id")
    .where({ id })
    .del();
}
