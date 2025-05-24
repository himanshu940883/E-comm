// knexfile.js
const knex = require('knex');
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'himanshu',     
      password: '1234',
      database: 'loki'
    },
    migrations: {
      directory: './migrations'
    }
  },
  debug: true,

};

