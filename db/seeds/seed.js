import fs from 'fs/promises';
import pool from '../connection.js';  

(async () => {
  try {
     const seedSQL = await fs.readFile('./db/seeds/seed.sql', 'utf-8');

     await pool.query(seedSQL);
    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error seeding database:', err.message);
  } finally {
     
    await pool.end();
  }
})();
