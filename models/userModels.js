const db = require("../db/connection");
const HttpError = require("../helpers/HttpError")
 

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
    .query(`SELECT users.username FROM users WHERE users.username=$1`, [username])
    .then(({rows}) => {
        if (rows.length === 0) {
            throw new HttpError(404, "User not found");
        }
        return rows;
    })
    .catch(() => {
        throw new HttpError(500, "Database error while fetching user");
    });
}

function postUserModel(username) {
    return db
    .query(`INSERT INTO users
        (username)
        VALUES ($1)
        RETURNING *`,
    [username]
)
    .then((result) => {
        return result.rows[0];
    })
    .catch((err) => {
        if (err.code === '23505') {   
            throw new HttpError(409, "User already exists");
        }
        throw new HttpError(500, "Failed to create user");
    });
}

module.exports = {getUsersModel, getUserModel, postUserModel}