// Define which database type to use
const dbEngine = process.env.DB || 'development';

// Import the knexfile using the specified database type
const config = require('../knexfile.js')[dbEngine];

// Export the configuration
module.exports = require('knex')(config);
