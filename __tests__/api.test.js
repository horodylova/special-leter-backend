const pool = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const usersData = require('../db/test-data/users.js');
const lettersData = require('../db/test-data/letters.js');
const app = require("../server.js")

beforeEach(() => {
  return seed({ usersData, lettersData });
});

afterAll(() => {
  return pool.end();
});

//tests for database 

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

//tests for users 

describe("GET /api/auth", () => {
  test("returns 200 status with array of users", () => {
    return request (app)
    .get("/api/auth")
    .expect(200)
    .then(({body}) => {
      expect(body.users.length).toBeGreaterThan(0)

      body.users.forEach(user => {
        expect(user).toEqual(
          expect.objectContaining({
            username: expect.any(String)
          })
        )
      })
    })
  })
  test("returns 404 Not Found if user does not exist", () => {

    const userSvitlana = {
      username: "Svitlana",

    };

    return request(app)
    .get('/api/auth/login')
    .send(userSvitlana)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not Found")
    })
  })
  test("returns 200 if the user exists", () => {
    const userAlice = {
      username: "Alice Johnson",
    
    };

    return request(app)

    .get('/api/login')
    .send(userAlice)
    .expect(200)
    .then(({body}) => {
    expect(body.user.length).toBe(1)
    expect.objectContaining({
      username: "Alice Johnson"
    })
    })
  })
})


