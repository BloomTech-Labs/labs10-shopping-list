const express = require('express');
const userRouter = express.Router({mergeParams: true});
const userDb = require('../../helpers/userModel');

const nodemailer = require('nodemailer');

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

userRouter.get('/check/email', (req, res) => {
    const email = req.user.email;

    userDb.getProfileByEmail(email).then(user => {
        if(user){
            return res.status(200).json({profile: user[0]})
        } else {
            return res.status(404).json({error: `User not found.`})
        }
    }) .catch(err => {
        console.log(err);
        return res.status(500).json({error: `Internal server error.`})
    })
})
        

/**************************************************/
/**
 * UPDATE USER
 * @NOTE @checkUser middleware ensures only self-same users can update their profile
 * information
 */

/**************************************************/
userRouter.put('/:id', checkUser, (req, res) => {
    const id = Number(req.params.id);
    const changes = req.body;
    userDb.update(id, changes).then(status => {
        if(status.length >= 1 || !status || status === 1){
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
 * @NOTE @checkUser middleware prevents unauthorized deletions by other users
 * **/

/**************************************************/

userRouter.delete('/:id', checkUser, (req, res) => {
    const id = req.params.id;

    userDb.remove(id).then(status => {
        if(status.length >= 1 || !status || status === 1){
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
 * This will query the database for the user ID that matches the passed in email address in the JWT
 * if no user is found, a new entry will be created
 * @NOTE @checkUser is unneccessary here since the values are passing from the token, which will
 * only show information specific to the token bearer. @checkJwt middleware gives us the information we need
 * in @param req.user rather than the old method of posting the email address.
 * 
 * The address must be changed to 'GET /check/getid', since 'GET /getid' hits the GET /:id endpoint on accident.
 * 
 * Generating the user information from the token rather than a POST email is much more secure.
 * **/

/**************************************************/

userRouter.get('/check/getid', (req, res) => {
    let email = req.user.email; // use jwt's req.user instead of req.body which is vulnerable

    // setting up sender e-mail
    let transporter = nodemailer.createTransport({
        service: `${process.env.EMAIL_SERVICE}`,
        auth:{
            user: `${process.env.EMAIL_ADDRESS}`,
            pass: `${process.env.EMAIL_PASSWORD}`
        }
    });

    userDb.getIdByEmail(email).then(id => {
        console.log(id, 'ID res');
        if(!id || id.length === 0){
            // CREATE NEW USER ENTRY IF NO USER FOUND
            let newUser = {
                name: req.user.name,
                email: req.user.email,
                profilePicture: req.user.picture,
            }

            // email new user with welcome e-mail
            // set up the email
            let mailOptions = {
                from: `${process.env.EMAIL_ADDRESS}`,
                to: `${email}`,
                subject: 'Signed up for ShopTrak',
                text: 'Thank you for signing up with ShopTrak.'
            };
            // send the email now
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    console.log(error);
                }else{
                    console.log('Email sent: '+info.response);
                }
            });
            
            return userDb.add(newUser).then(id => {
                console.log('newuser', id[0])
                return userDb.getById(id).then(profile => {
                    console.log('profile', profile);
                    return res.status(201).json({message: `New user added to database with ID ${id}.`, profile: profile[0]});
                }).catch(err => {
                    console.log(err);
                    return res.status(404).json({error: `Error adding user/no user found.`})
                })
            })
            .catch(err => {
                console.log(err);
                return res.status(500).json({error: `Error adding new user DB entry.`})
            })
        } else {
            console.log('user found', id[0].id);
          
            userDb.getById(id[0].id).then(profile => {
                return res.status(200).json({profile: profile[0]})
            }).catch(err => { 
                console.log(err);
                return res.status(404).json({error: `Nothing there.`})
            })

            
            let mailOptions = {
                from: `${process.env.EMAIL_ADDRESS}`,
                to: `${email}`,
                subject: 'Signed into ShopTrak',
                text: 'You have signed into ShopTrak.'
            };
            // send the email now
            // transporter.sendMail(mailOptions, function(error, info){
            //     if(error){
            //         console.log(error);
            //     }else{
            //         console.log('Email sent: '+info.response);
            //     }
            // });
            // console.log('user found', id[0]);
            // return res.status(200).json({message: `Found ID for user with email ${email}.`, id: id[0].id});
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: `Error retrieving user ID.`})
    })
})

module.exports = userRouter;