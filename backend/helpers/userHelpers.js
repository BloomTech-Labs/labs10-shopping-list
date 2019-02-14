// Define database from the configuration
const db = require('../data/config.js');
// Export functions
module.exports = {
  get,
  getById,
  createUser,
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
 * @returns {*} - Returns all information about the user from the given ID
 */
function getById(id) {
  return db
    .select("*")
    .from("users")
    .where("id", id);
}

/**
 * creates a new user in the users table 
 * @param user is an object with the necessary user params
 * user{
 *      email: "email@email.com",
 *      name: "User Name",
 *      profilePicture : "https://www.website.com/image.jpg",
 * }
 * 
 * profilePicture is optional and will default to a shopping basket
 * email and name are required fields (notNullable)
 * email and name will be pulled from the profile object passed back from the
 * Oauth external login when is passes the access token

**/

function createUser(user){
    return db('users')
    .insert(user)
    .then(ids => ({id: ids[0]}));
}

