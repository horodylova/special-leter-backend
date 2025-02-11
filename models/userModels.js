const db = require("../db/connection");
const HttpError = require("../helpers/HttpError");

function getUsersModel() {
  return db.query(`SELECT username FROM users`)
    .then((result) => {
      return result.rows;
    })
    .catch((error) => {
      console.error("Database error:", error);
      throw HttpError(500, "Failed to fetch users");
    });
}

function getUserModel(username) {
  return db
    .query(
      `SELECT id, username, password_hash FROM users WHERE users.username=$1`,
      [username]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return null; 
      }
      return rows[0];
    })
    .catch((error) => {
      console.error("Database error:", error);
      throw HttpError(500, "Database error while fetching user");
    });
}

function postUserModel(username, password_hash) {
  return db
    .query(
      `INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username`,
      [username, password_hash]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((error) => {
      console.error("Database error:", error);
      if (error.code === '23505') { 
        throw HttpError(409, "A user with the same name already exists");
      }
      throw HttpError(500, "Failed to create user");
    });
}

module.exports = { getUsersModel, getUserModel, postUserModel };
