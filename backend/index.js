// use the server defined in the api directory
const server = require('./api/server.js');
const requireAll = require('require-all');
let _ = require('lodash');

// loads .env files for development mode
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').load();
}

const port = 9000;

server.listen(port, () => console.log(`\n Server running on port ${port}. \n`));

// ** start of endpoints code **

// process.setMaxListeners(0);

// loops through all routes; coverages all server endpoints
// console.log('***');
// console.log(__dirname + '/routes');
// const controllers = requireAll(__dirname + '/routes');
// _.each(controllers, (endpoints, controller) => {
//     console.log('endpoints', endpoints);
//   _.each(endpoints, (definition, endpoint) => {
//     console.log('definition', definition);
//     const args = [definition.handler];
//     console.log(`${endpoint}: ${definition.url}`);
//     console.log('args', args);
//     args.unshift(`${definition.url}`);
//     server[definition.type.toLowerCase()].call(server, ...args);
//   });
// });
// // // ** end of endpoints code **