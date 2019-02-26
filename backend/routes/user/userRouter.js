const express = require('express');
const userRouter = express.Router({mergeParams: true});
const userDb = require('../../helpers/userModel');

const checkJwt = require('../../validators/checkJwt'); 
const checkUser = require('../../validators/checkUser');
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

userRouter.use(checkJwt);

userRouter.post('/', (req, res) => {
    let user = req.body;
    userDb.add(user).then(id => {
        return res.status(200).json({message: `User adder to database with ID ${id[0]}`, id: id[0]});
    })
    .catch(err => {
        const error = {
            message: `The requested user already exists.`,
            data: {
                err: err
            },
        }
        return res.status(500).json(error);
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
        if (user.length >= 1) {
            return res.status(200).json(user[0]);
        }

        return res.status(404).json({message: "The requested user does not exist."})
    })
    .catch(err => {
        const error = {
            message: `Internal Server Error`,
            data: {
                err: err
            },
        }
        return res.status(500).json(error);
    })
})

/**************************************************/

// GET ALL USERS
/** @TODO This should be set to sysadmin privileges for user privacy **/

/**************************************************/

// GET USER BY EMAIL
/** @TODO This should be set to sysadmin privileges for user privacy **/

/**************************************************/

userRouter.get('/email/:email', (req, res) => {
    const email = req.params.email;

    userDb.getByEmail(email).then(user => {
        if (user.length >= 1) {
            return res.status(200).json(user[0]);
        }

        return res.status(404).json({message: "The requested user does not exist."})
    })
        .catch(err => {
            const error = {
                message: `Internal Server Error`,
                data: {
                    err: err
                },
            }
            return res.status(500).json(error);
        })
})

userRouter.get('/')

/**************************************************/
/**
 * UPDATE USER
 * @TODO Add middleware to ensure users can only change their own information
 */

/**************************************************/
userRouter.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const changes = req.body;
    userDb.update(id, changes).then(status => {
        if(status.length >= 1 || !status){
            return res.status(200).json({message: `User ${id} successfully updated.`});

        } else {
            return res.status(404).json({error: `The requested user does not exist.`});
        }
    })
    .catch(err => {
        const error = {
            message: `Error updating user with ID ${id}.`,
            data: {
                err: err
            },
        }
        return res.status(500).json(error);
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
        if(status.length >= 1 || !status){
            return res.status(200).json({message: `User ${id} successfully deleted.`});

        } else {
            return res.status(404).json({error: `The requested user does not exist.`});
        }
    })
    .catch(err => {
        const error = {
            message: `Error deleting user with ID ${id}.`,
            data: {
                err: err
            },
        }
        return res.status(500).json(error);
    })
})


/**************************************************/

/** GET USER ID
 * This will query the database for the user ID that matches the passed in email address
 * if no user is found, a new entry will be created
 * **/

/**************************************************/

userRouter.post('/getid', (req, res) => {
    let email = req.body.email;
    userDb.getIdByEmail(email).then(id => {
        if(!id || id.length === 0){
            console.log('no user found');
            // CREATE NEW USER ENTRY
            let newUser = {
                name: req.body.name,
                email: req.body.email,
                profilePicture: req.body.img_url,
            }
            userDb.add(newUser).then(id => {
                console.log('newuserID', id[0]);
                return res.status(201).json({message: `New user added to database with ID ${id}.`, id: id[0].id});
            })
            .catch(err => {
                console.log(err);
                return res.status(500).json({error: `Error adding new user DB entry.`})
            })
        } else {
            console.log('user found', id[0]);
            return res.status(200).json({message: `Found ID for user with email ${email}.`, id: id[0].id});
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: `Error retrieving user ID.`})
    })
})

module.exports = userRouter;