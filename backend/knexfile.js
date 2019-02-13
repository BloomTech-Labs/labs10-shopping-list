require('dotenv').config();

/*
  * For use with a local postgresql server
*/
const localPg = {
  host: 'localhost',
  database: 'shoppinglist',
  user: process.env.DB_USER,
  password: process.env.DB_PASS
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
    }
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
