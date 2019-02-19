const express = require('express');
const userRouter = express.Router();
const userDb = require('../../helpers/userModel');

const checkJwt = require('../../validators/checkJwt'); 
// checkJwt middleware authenticates user tokens and ensures they are signed correctly in order to access our internal API

/****************************************************************************************************/
/** THIS ROUTER HANDLES ALL REQUESTS TO THE /api/user ENDPOINT **/
/****************************************************************************************************/

// userRouter.get('/', checkJwt, (req, res) => {
//     console.log(req.body);
//     res.send('This is the /user root endpoint.'); // test the protected middleware by passing the JWT into Authorization header with 'Bearer <TOKEN>' value
// });

/**************************************************/

/** ADD USER TO DATABASE 
 * @param user = {name: "first last", email: "example@domain.com"}, this is gathered from the @param req.body
 * @return id = user ID primary key in users table (e.g. 1, 3, 22, etc.);
 * ID is generated upon user creation
 * @param user.email is the primary identifier for different users, as it is a unique value
 * We can do member checks with the email address gathered in the OAuth profile to verify if a user has an account, i.e. their email is in the DB
 * If it is not in the db, we run this function to store their email and full name for display on their profile
 * the @param id will be used to pair the user with a group upon group creation or group join
 * @param profilePicture is an optional parameter that can be passed in the user object
 * If the OAuth profile contains a picture, we will pass the image URL to the profilePicture column, otherwise it will default to our shopping basket icon
 * 
 * ***********************************************/

userRouter.post('/', (req, res) => {
    console.log(req.body);
    let user = req.body;
    userDb.add(user).then(id => {
        console.log(id);
        return res.status(200).json({message: `User adder to database with ID ${id[0]}`, id: id[0]});
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: `Error when adding user.`});
    })
})

/**************************************************/

/** GET USER BY ID
 * @TODO Add middleware to ensure user is logged in
 * **/

/**************************************************/
userRouter.get('/:id', (req, res) => {
    const id = req.params.id;

    userDb.getById(id).then(user => {
        console.log(user);
        if(!user){
            return res.status(404).json({error: `User with ID ${id} does not exist.`});
        } else {
            return res.status(200).json(user);
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: `Error retrieving user with ID ${id}.`});
    })
})

/**************************************************/

// GET ALL USERS
/** @TODO This should be set to sysadmin privileges for user privacy **/

/**************************************************/

userRouter.get('/', (req, res) => {
    userDb.get().then(users => {
        console.log(users);
        if(!users){
            return res.status(404).json({error: `No users found!`});
        } else {
            return res.status(200).json(users);
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: `Error collecting users information.`});
    })
})

/**************************************************/
/**
 * UPDATE USER
 * @TODO Add middleware to ensure users can only change their own information
 */

/**************************************************/
userRouter.put('/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    userDb.update(id, changes).then(status => {
        if(!status || status !== 1){
            return res.status(404).json({error: `No user found with ID ${id}.`});
        } else {
            return res.status(200).json({message: `User ${id} successfully updated.`});
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: `Error updating user with ID ${id}.`});
    })
})

/**************************************************/

/** DELETE USER
 * @TODO Add middleware to prevent unauthorized deletions 
 * **/

/**************************************************/

userRouter.delete('/:id', (req, res) => {
    const id = req.params.id;

    userDb.remove(id).then(status => {
        console.log(status);
        if(!status || status !== 1){
            return res.status(404).json({error: `No user found with ID ${id}.`});
        } else {
            return res.status(200).json({message: `User with ID ${id} deleted successfully.`});
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: `Error deleting user with ID ${id}.`});
    })
})

module.exports = userRouter;