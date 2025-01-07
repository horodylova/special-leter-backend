const db = require("../../db/connection");
const HttpError = require("../../helpers/HttpError")

function checkUserExists (username) {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
        console.log("DB result:", result.rows);
        return result.rows.length > 0;   
    })
    .catch((err) => {
        throw new HttpError(500, "Database error during user check");
    });
}

module.exports = checkUserExists;