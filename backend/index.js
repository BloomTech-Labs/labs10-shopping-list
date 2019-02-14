// use the server defined in the api directory
const server = require('./api/server.js');
const requireAll = require('require-all');
let _ = require('lodash');

const port = 9000;

server.listen(port, () => console.log(`\n Server running on port ${port}. \n`));

// ** start of endpoints code **
process.setMaxListeners(0);

// loops through all routes; coverages all server endpoints
const controllers = requireAll(__dirname + '/routes');
_.each(controllers, (endpoints, controller) => {
  _.each(endpoints, (definition, endpoint) => {
    const args = [definition.handler];
    console.log(`${endpoint}: ${definition.url}`);
    args.unshift(`${definition.url}`);
    server[definition.type.toLowerCase()].call(server, ...args);
  });
});
// ** end of endpoints code **