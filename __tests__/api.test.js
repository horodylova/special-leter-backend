const request = require("supertest");

const pool = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/test-data/index.js");
const app = require("../server.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return pool.end();
});

//tests for database

describe("Database tests", () => {
  test("Users table is seeded correctly", async () => {
    const { rows } = await pool.query("SELECT * FROM users;");
    expect(rows).toHaveLength(5);
    expect(rows[0]).toEqual({
      id: 1,
      password_hash: "password123",
      username: "John Doe",
    });
  });

  test("Letters table is seeded correctly", async () => {
    const { rows } = await pool.query("SELECT * FROM letters ORDER by id;");
    expect(rows).toHaveLength(5);
    expect(rows[0]).toMatchObject({
      id: 1,
      user_id: 1,
      letter_text: "Hello John, this is your first letter!",
    });
  });
});

describe("Database tests", () => {
  test("Can fetch username through a letter", async () => {
    const letterId = 1;
    const result = await pool.query(
      `
      SELECT users.username, letters.letter_text
      FROM letters
      JOIN users ON letters.user_id = users.id
      WHERE letters.id = $1;
      `,
      [letterId]
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]).toEqual(
      expect.objectContaining({
        username: expect.any(String),
        letter_text: expect.any(String),
      })
    );

    expect(result.rows[0].username).toBe("John Doe");
  });

  test('Fetch all letters for John Doe', async () => {
    const result = await pool.query(`
      SELECT letters.id, users.username, letters.letter_text, letters.created_at
      FROM letters
      JOIN users ON letters.user_id = users.id
      WHERE users.username = 'John Doe';
    `);
  
    expect(result.rows).toHaveLength(2); 
  
     const formattedRows = result.rows.map((row) => ({
      ...row,
      created_at: row.created_at.toISOString(),
    }));
  
    expect(formattedRows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: 'John Doe',
          letter_text: 'Hello John, this is your first letter!',
          created_at: '2023-12-10T10:00:00.000Z',
        }),
        expect.objectContaining({
          username: 'John Doe',
          letter_text: 'Second letter for John.',
          created_at: '2023-12-12T15:30:00.000Z',
        }),
      ])
    );
  });

  test('Fetch all letters that can be opened in 2023', async () => {
    const result = await pool.query(`
      SELECT id, user_id, letter_text, opened_at
      FROM letters
      WHERE EXTRACT(YEAR FROM opened_at) = 2023;
    `);
  
    
    expect(result.rows).toHaveLength(3); 
    expect(result.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user_id: 1,
          letter_text: 'Hello John, this is your first letter!',
          opened_at: new Date('2023-12-11T12:00:00Z'),
        }),
        expect.objectContaining({
          user_id: 2,
          letter_text: 'Hi Jane, this is your welcome letter.',
          opened_at: new Date('2023-12-10T09:00:00Z'),
        }),
        expect.objectContaining({
          user_id: 5,
          letter_text: 'Dear Emily, welcome to Special Letter!',
          opened_at: new Date('2023-12-14T10:00:00Z'),
        }),
      ])
    );
  });
  
});
//tests for users

describe("GET /auth", () => {
  test("returns 200 status with array of users", () => {
    return request(app)
      .get("/api/auth")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBeGreaterThan(0);

        body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
  
});
