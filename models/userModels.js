const db = require("../db/connection");

function getUsersModel() {
    return db.query(`SELECT username FROM users`)
    .then((result) => {
        return result.rows;
    })
}

function getTheUserModel(username) {
    return db
    .query(`SELECT users.username FROM users WHERE users.username=$1`, [username])
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status:404, msg: "Not Found"})
        }
        return rows;
    })
}

function postTheUserModel (username) {
    return db
    .query(`INSERT INTO users
        (username)
        VALUES ($1, $2)
        RETURNING *`,
    [username]
)
    .then((result)=> {
        return result.rows[0]
    })
    .catch((error) => {
        next(error)
    })
}

module.exports = {getUsersModel, getTheUserModel, postTheUserModel}