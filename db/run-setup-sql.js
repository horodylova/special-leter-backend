const pool = require('./connection.js');
const fs = require('fs');
const path = require('path');

async function runSetupSql() {
  console.log('Running setup.sql to create tables...');
  let client;
  try {
    client = await pool.connect();
    const setupSql = fs.readFileSync(path.resolve(__dirname, './setup.sql'), 'utf8');

    const queries = setupSql.split(';').filter(q => q.trim().length > 0);

    for (const query of queries) {
      if (query.trim().startsWith('\\c')) {
        console.log(`Skipping psql command: ${query.trim()}`);
        continue;
      }
      try {
        await client.query(query);
        console.log(`Executed: ${query.substring(0, 70).trim()}...`);
      } catch (err) {
        if (err.code === '42P07') {
          console.warn(`Warning: Table already exists, skipping. (${err.message})`);
        } else {
          console.error(`Error executing query: ${query}`, err);
          throw err;
        }
      }
    }
    console.log('Database tables created successfully!');
  } catch (err) {
    console.error('Failed to run setup.sql:', err);
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

runSetupSql();