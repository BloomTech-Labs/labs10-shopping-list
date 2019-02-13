// use the server defined in the api directory
const server = require('./api/server.js');

const port = 9000;

server.listen(port, () => console.log(`\n Server running on port ${port}. \n`));