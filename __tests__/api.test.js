const pool = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const usersData = require('../db/test-data/users.js');
const lettersData = require('../db/test-data/letters.js');

beforeEach(() => {
  return seed({ usersData, lettersData });
});

afterAll(() => {
  return pool.end();
});

describe('Database tests', () => {
  test('Users table is seeded correctly', async () => {
    const { rows } = await pool.query('SELECT * FROM users;');
    expect(rows).toHaveLength(5);
    expect(rows[0]).toEqual({
      id: 1,
      username: 'John Doe',
    });
  });

  test('Letters table is seeded correctly', async () => {
    const { rows } = await pool.query('SELECT * FROM letters ORDER BY id;');
    expect(rows).toHaveLength(5);
    expect(rows[0]).toMatchObject({
      id: 1,
      user_id: 1,
      letter_text: 'Hello John, this is your first letter!',
    });
  });
});


