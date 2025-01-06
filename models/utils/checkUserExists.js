const db = require("../../db/connection")

function checkUserExists (username) {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
}

module.exports = checkUserExists;