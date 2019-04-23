const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const server = express();
const apiRouter = require('../routes/apiRouter');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

server.use(allowCrossDomain);

// initialize server to set content-type to application/json, allows us to easily pass JSON objects through endpoints
server.use(express.json());
server.use(bodyParser.urlencoded({
    extended: true
}));
// CORS middleware, default cors() permits all cross-origin scripting, 
// https://github.com/expressjs/cors
// TODO: this will need to be configured in production
server.use(cors());

// Helmet middleware, helps to secure application via HTTP response headers
// https://github.com/helmetjs/helmet
server.use(helmet());

// Morgan middleware logs req/res for monitoring and debugging. 

// set config to 'combined' for verbose log responses.
// set config to 'dev' for color-coded console logs
// https://github.com/expressjs/morgan
// can be configured later to write logs to a file
server.use(morgan('dev'));

// apiRouter will handle addresses passed to the /api endpoint
server.use('/api', apiRouter);

// test http get request
server.get('/', (req, res) => {
    res.status(200).send(`Server is running successfully. This is the root / endpoint.`);
})

module.exports = server;