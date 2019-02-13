const express = require('express');
const apiRouter = express.Router();

// this will import the routers from the other API paths and use them for their respective endpoints

// e.g. router.use('/user', userRouter)

// This router is used by the server.js to route all paths through the '/api' endpoint

apiRouter.get('/', (req, res) => {
    res.send('This is the API root endpoint.');
});

module.exports = apiRouter;