const db = require("../db/connection");
const HttpError = require("../helpers/HttpError");
 

function getUsersModel() {
    return db.query(`SELECT username FROM users`)
    .then((result) => {
        return result.rows;
    })
    .catch(() => {
        throw new HttpError(500, "Failed to fetch users");
    });
}

function getUserModel(username) {
    return db
    .query(`SELECT username, password_hash FROM users WHERE users.username=$1`, [username])
    .then(({rows}) => {
        if (rows.length === 0) {
            throw new HttpError(404, "User not found");
        }
        return rows[0];
    })
    .catch(() => {
        throw new HttpError(500, "Database error while fetching user");
    });
}

function postUserModel(username, password_hash) {
    return db.query(
        `INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *`,
        [username, password_hash]
    ).then((result) => {
        console.log("Inserted user:", result.rows[0]);
        return result.rows[0];
    });
}

module.exports = {getUsersModel, getUserModel, postUserModel}