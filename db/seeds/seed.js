const pool = require('../connection.js');

const seed = async (data) => {
  const { usersData, lettersData } = data;

  
  await pool.query('TRUNCATE TABLE letters, users RESTART IDENTITY CASCADE;');

  
  await Promise.all(
    usersData.map((user) =>
      pool.query(
        `INSERT INTO users (id, username, password_hash) VALUES ($1, $2, $3) RETURNING *;`,
        [user.id, user.username, user.password_hash]
      )
    )
  );

 
  await Promise.all(
    lettersData.map((letter) =>
      pool.query(
        `INSERT INTO letters (user_id, created_at, opened_at, letter_text) VALUES ($1, $2, $3, $4);`,
        [letter.user_id, letter.created_at, letter.opened_at, letter.letter_text]
      )
    )
  );

  console.log('Database seeded successfully!');
};

module.exports = seed;


