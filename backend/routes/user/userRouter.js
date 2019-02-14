const express = require('express');
const userRouter = express.Router();

const checkJwt = require('../../validators/checkJwt');

// userRouter.use(secured);

// this router handles all requests to the /api/user endpoint

userRouter.get('/', checkJwt, (req, res) => {
    console.log(req.body);
    res.send('This is the /user root endpoint.');
});

module.exports = userRouter;