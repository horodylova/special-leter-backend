const pg = require('pg');
const dotenv = require('dotenv');
const path = require('path');
const { Pool } = pg;

const ENV = process.env.NODE_ENV || 'development';

dotenv.config({
  path: path.resolve(__dirname, `../.env.${ENV}`),
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

const config = {};

if (ENV === 'production') {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2; 
  config.ssl = {
    rejectUnauthorized: false, 
  },
  config.family = 4
}

const pool = new Pool(config);
module.exports = pool;

// const { Pool } = require("pg");

// const config = {
//   connectionString: "postgresql://postgres:svetlana123456SVETLANA123456@db.zdyhayhguzfcjuilwnua.supabase.co:5432/postgres",
//   ssl: {
//     rejectUnauthorized: false,  
//   },
//   family: 4,
// };

// const pool = new Pool(config);

// module.exports = pool;


