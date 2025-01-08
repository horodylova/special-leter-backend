const pool = require('../connection.js');

const seed = async (data) => {
  const { usersData, lettersData } = data;


  await pool.query('TRUNCATE TABLE letters, users RESTART IDENTITY CASCADE;');

  
  const insertedUsers = await Promise.all(
    usersData.map((user) =>
      pool.query(
        `INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *;`,
        [user.username, user.password_hash]
      )
    )
  );

 
  const userMap = insertedUsers.reduce((acc, result) => {
    const user = result.rows[0];
    acc[user.username] = user.id;
    return acc;
  }, {});

  await Promise.all(
    lettersData.map((letter) => {
      const user_id = userMap[letter.username];  
      return pool.query(
        `INSERT INTO letters (user_id, created_at, opened_at, letter_text) VALUES ($1, $2, $3, $4);`,
        [
          user_id,
          letter.created_at,
          letter.opened_at,
          letter.letter_text,
        ]
      );
    })
  );

  console.log('Database seeded successfully!');
};

module.exports = seed;

