const db = require("../../db/connection");
const HttpError = require("../../helpers/HttpError");

function checkLetterExists(letterId) {
    return db.query(
        `SELECT 1 FROM letters WHERE id=$1`,
        [letterId]
    )
    .then((result) => {
        console.log("DB result:", result.rows);
        return result.rows.length > 0;   
    })
    .catch((err) => {
        throw new HttpError(500, "Database error during letter check");
    });
}

module.exports = checkLetterExists;