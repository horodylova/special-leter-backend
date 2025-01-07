const pool = require('../connection.js');

const seed = async (data) => {
  const { usersData, lettersData } = data;

  await pool.query('DROP TABLE IF EXISTS letters;');
  await pool.query('DROP TABLE IF EXISTS users;');

  await pool.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password_hash VARCHAR(255) NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE letters (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      opened_at TIMESTAMP,
      letter_text TEXT NOT NULL
    );
  `);

  await Promise.all(
    usersData.map((user) =>
      pool.query(`INSERT INTO users (id, username, password_hash) VALUES ($1, $2, $3);`, [
        user.id,
        user.username,
        user.password_hash
      ])
    )
  );

  await Promise.all(
    lettersData.map((letter) =>
      pool.query(
        `INSERT INTO letters (id, user_id, created_at, opened_at, letter_text) VALUES ($1, $2, $3, $4, $5);`,
        [
          letter.id,
          letter.user_id,
          letter.created_at,
          letter.opened_at,
          letter.letter_text,
        ]
      )
    )
  );

  console.log('Database seeded successfully!');
};

module.exports = seed;



