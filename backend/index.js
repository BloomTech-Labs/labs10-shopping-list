const express = require('express');
const requireAll = require('require-all');
require('dotenv').config();

let _ = require('lodash'); // eslint-disable-line
const server = express();
const port = process.env.PORT || 5000;

server.listen(port, () => console.log('eztips user server running...'));

process.setMaxListeners(0);

// loop through endpoints; eg server.get ...
const controllers = requireAll(__dirname + '/routes');
_.each(controllers, (endpoints, controller) => {
  _.each(endpoints, (definition, endpoint) => {
    
    const args = [definition.handler];
    console.log(`${endpoint}: ${definition.url}`);
    /*
    if (definition.protected) {
      args.unshift(protected);
      console.log(`${endpoint}: ${definition.url} | requiresAuth`);
    }else{
      console.log(`${endpoint}: ${definition.url}`);
    }
    */
    args.unshift(`${definition.url}`);
    server[definition.type.toLowerCase()].call(server, ...args);
  });
});

