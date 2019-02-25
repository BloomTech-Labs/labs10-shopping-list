require('dotenv').config();
var localPg = require('pg');
// localPg.defaults.ssl = true;

/*
  * For use with a local postgresql server
*/
localPg = {
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASS,
  defaults: {
    ssl: true
  }
}

// Define the database connection to use
const dbConnection = process.env.DATABASE_URL || localPg;

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/shoppinglist.sqlite3'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './data/dev/migrations'
    },
    seeds: {
      directory: './data/dev/seeds'
    }
  },

  staging: {
    client: 'pg',
    connection: dbConnection,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './data/dev/migrations',
    },
    seeds: {
      directory: './data/dev/seeds'
    },
    ssl: true,
  },

  production: {
    client: 'pg',
    connection: dbConnection,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './data/dev/migrations',
    },
    seeds: {
      directory: './data/dev/seeds'
    }
  }

};