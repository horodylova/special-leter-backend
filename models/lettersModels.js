const db = require("../db/connection");
const HttpError = require("../helpers/HttpError");
const { 
  generateEncryptionKey, 
  encryptLetterText, 
  decryptLetterText, 
  isLetterReadable 
} = require("../helpers/encryption");

function fetchAllLetters(user_id) {
  return db.query(
    `SELECT * FROM letters WHERE user_id = $1`,
    [user_id]
  ).then((result) => {
    return result.rows.map(letter => {
      const readable = isLetterReadable(letter.opened_at);
      
      if (!readable) {
        return {
          ...letter,
          letter_text: "[Letter will be available on " + 
            new Date(letter.opened_at).toLocaleDateString() + "]"
        };
      }
      
      try {
        const key = generateEncryptionKey(letter.id, letter.opened_at);
        letter.letter_text = decryptLetterText(letter.letter_text, key);
      } catch (error) {
        console.error(`Error decrypting letter ${letter.id}:`, error);
        letter.letter_text = "[Error reading letter]";
      }
      
      return letter;
    });
  });
}

function postNewLetterModel(user_id, created_at, opened_at, letter_text) {
  const actualCreatedAt = created_at || new Date();
  const actualOpenedAt = opened_at || null;
  
  return db.query(
    `INSERT INTO letters (user_id, created_at, opened_at, letter_text)
     VALUES ($1, $2, $3, $4)
     RETURNING *;`,
    [user_id, actualCreatedAt, actualOpenedAt, "temp"]
  ).then((result) => {
    const newLetter = result.rows[0];
    
    const key = generateEncryptionKey(newLetter.id, actualOpenedAt);
    const encryptedText = encryptLetterText(letter_text, key);
    
    return db.query(
      `UPDATE letters 
       SET letter_text = $1
       WHERE id = $2
       RETURNING *;`,
      [encryptedText, newLetter.id]
    ).then(updateResult => {
      const updatedLetter = updateResult.rows[0];
      
      return {
        ...updatedLetter,
        letter_text: letter_text
      };
    });
  });
}

function fetchLetterById(letter_id, user_id) {
  return db.query(
    `SELECT * FROM letters 
     WHERE letters.id = $1 
     AND user_id = $2`,
    [letter_id, user_id]
  ).then((result) => {
    if (result.rows.length === 0) {
      throw HttpError(404, "Letter not found");
    }
    
    const letter = result.rows[0];
    const readable = isLetterReadable(letter.opened_at);
    
    if (!readable) {
      return {
        ...letter,
        letter_text: "[Letter will be available on " + 
          new Date(letter.opened_at).toLocaleDateString() + "]"
      };
    }
    
    try {
      const key = generateEncryptionKey(letter.id, letter.opened_at);
      letter.letter_text = decryptLetterText(letter.letter_text, key);
    } catch (error) {
      console.error(`Error decrypting letter ${letter.id}:`, error);
      letter.letter_text = "[Error reading letter]";
    }
    
    return letter;
  });
}

function deleteLetterModel(letter_id, user_id) {
  return db.query(
    `DELETE FROM letters
     WHERE id = $1 
     AND user_id = $2`,
    [letter_id, user_id]
  ).then((result) => {
    if(result.rowCount === 0) {
      throw HttpError(404, "Letter not found");
    }
  });
}

module.exports = {
  postNewLetterModel,
  fetchAllLetters,
  fetchLetterById,
  deleteLetterModel
};
