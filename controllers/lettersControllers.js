const HttpError = require("../helpers/HttpError");
const {
    postNewLetterModel,
    fetchAllLetters,
    fetchLetterById,
    deleteLetterModel
} = require("../models/lettersModels.js");

function getAllLetters(request, response, next) {
    const { user_id } = request.user;
    console.log("Fetching letters for user:", user_id);
    
    fetchAllLetters(user_id)
        .then((letters) => {
            response.status(200).send({ letters: letters || [] });
        })
        .catch(next);
}

function getLetterById(request, response, next) {
    const { letter_id } = request.params;
    const { user_id } = request.user;
    
    if (Number.isInteger(parseInt(letter_id))) {
        fetchLetterById(letter_id)
            .then((result) => {
                if (result.rows.length === 0) {
                    throw HttpError(404, "Letter not found");
                }
                
                const letter = result.rows[0];
                
                 if (letter.user_id !== user_id) {
                    throw HttpError(403, "Access denied");
                }
                
                response.status(200).send({ letter });
            })
            .catch(next);
    } else {
        throw HttpError(404, "No letters found");
    }
}

function postNewLetter(request, response, next) {
    const { created_at, opened_at, letter_text } = request.body;
    const { user_id } = request.user;
    
    if (!letter_text) {
        throw HttpError(400, "Letter text is required");
    }
    
    postNewLetterModel(user_id, created_at, opened_at, letter_text)
        .then((newLetter) => {
            response.status(201).send(newLetter);
        })
        .catch((error) => {
            next(error);
        });
}

function deleteLetterById(request, response, next) {
    const { letter_id } = request.params;
    const { user_id } = request.user;
    
    deleteLetterModel(letter_id, user_id)
        .then(() => {
            response.status(204).send();
        })
        .catch(next);
}

module.exports = {
    getAllLetters,
    getLetterById,
    postNewLetter,
    deleteLetterById
};
