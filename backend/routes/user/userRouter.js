const express = require('express');
const userRouter = express.Router();
const userDb = require('../../helpers/userModel');

const checkJwt = require('../../validators/checkJwt'); 
// checkJwt middleware authenticates user tokens and ensures they are signed correctly in order to access our internal API

/****************************************************************************************************/
/** THIS ROUTER HANDLES ALL REQUESTS TO THE /api/user ENDPOINT **/
/****************************************************************************************************/

userRouter.get('/', checkJwt, (req, res) => {
    console.log(req.body);
    res.send('This is the /user root endpoint.'); // test the protected middleware by passing the JWT into Authorization header with 'Bearer <TOKEN>' value
});

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

module.exports = userRouter;