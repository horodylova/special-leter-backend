const { Pool } = require("pg");

const DATABASE_URL = "postgresql://postgres:svetlana123456SVETLANA123456@db.zdyhayhguzfcjuilwnua.supabase.co:5432/postgres";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Connected to Supabase:", res.rows[0]);
  } catch (error) {
    console.error("Error connecting to Supabase:", error.message);
  } finally {
    pool.end();
  }
})();

module.exports = pool;

