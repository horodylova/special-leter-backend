// const pg = require('pg');
// const dotenv = require('dotenv');
// const path = require('path');
// const { Pool } = pg;

// const ENV = process.env.NODE_ENV || 'development';

// dotenv.config({
//   path: path.resolve(__dirname, `../.env.${ENV}`),
// });

// if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
//   throw new Error('PGDATABASE or DATABASE_URL not set');
// }

// const config = {};

// if (ENV === 'production') {
//   config.connectionString = process.env.DATABASE_URL;
//   config.max = 2; 
//   config.ssl = {
//     rejectUnauthorized: false, 
//   };
// }

// const pool = new Pool(config);
// module.exports = pool;
const pg = require('pg');
const dotenv = require('dotenv');
const path = require('path');
const { Pool } = pg;

const ENV = process.env.NODE_ENV || 'development';

console.log(`Loading environment from: ${path.resolve(__dirname, `../.env.${ENV}`)}`);

dotenv.config({
  path: path.resolve(__dirname, `../.env.${ENV}`),
});

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set in environment variables.");
  throw new Error('DATABASE_URL not set');
}

const config = {
  connectionString: process.env.DATABASE_URL,
};

if (ENV === 'production') {
  config.max = 2;
  config.ssl = {
    rejectUnauthorized: false,
  };
}

console.log(`Running in ${ENV} mode`);

const pool = new Pool(config);

(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Connected to database:", res.rows[0]);
  } catch (error) {
    console.error("Error connecting to database:", error.message);
  } finally {
    pool.end();
  }
})();

module.exports = pool;
