const db = require("../db/connection");
const HttpError = require("../helpers/HttpError");

function  fetchAllLetters (user_id) {
    return db.query(
        `SELECT * FROM letters WHERE user_id = $1`,
        [user_id]
    ).then((result) => 
        result.rows
    )
}
function postNewLetterModel(user_id, created_at, opened_at, letter_text) {
    return db.query(
        `INSERT INTO letters (user_id, created_at, opened_at, letter_text)
         VALUES ($1, $2, $3, $4)
         RETURNING *;`,
        [user_id, created_at || new Date(), opened_at || null, letter_text]
    ).then((result) => result.rows[0]);
}

function fetchLetterById (letter_id) {
    return db.query(
        `SELECT * FROM letters 
        WHERE letters.id = $1`, 
        [letter_id]
    )
}

function deleteLetterModel (letter_id, user_id) {
    return db.query(
        `DELETE FROM letters
        WHERE id = $1 
        AND user_id = $2`,
        [letter_id, user_id]
    ).then((result) => {
        if(result.rowCount === 0) {
            throw HttpError(404, "Letter not found")
        }
    })
}

module.exports = {postNewLetterModel,  fetchAllLetters, fetchLetterById, deleteLetterModel}
