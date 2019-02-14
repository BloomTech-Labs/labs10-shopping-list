const express = require('express');
const userRouter = express.Router();

// this router handles all requests to the /api/user endpoint

userRouter.get('/', (req, res) => {
    res.send('This is the /user root endpoint.');
});

module.exports = userRouter;