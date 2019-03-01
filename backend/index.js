require('dotenv').config();
// use the server defined in the api directory
const server = require('./api/server.js');
// const requireAll = require('require-all');
// let _ = require('lodash');

// loads .env files for development mode
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').load();
}

const port = process.env.PORT || 9000;

server.listen(port, () => console.log(`\n Server running on port ${port}. \n`));
