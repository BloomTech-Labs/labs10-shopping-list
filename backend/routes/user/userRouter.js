const express = require('express');
const userRouter = express.Router();
const userDb = require('../../helpers/userModel');
const checkJwt = require('../../validators/checkJwt');

// userRouter.use(secured);

// this router handles all requests to the /api/user endpoint

userRouter.get('/', checkJwt, (req, res) => {
    console.log(req.body);
    res.send('This is the /user root endpoint.');
});

userRouter.post('/', (req, res) => {
    console.log(req.body);

    let user = req.body;

    userDb.add(user).then(id => {
        console.log(id);
        return res.status(200).json({message: `User adder to database with ID ${id}`, id: id});
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error: `Error when adding user.`});
    })
})

module.exports = userRouter;