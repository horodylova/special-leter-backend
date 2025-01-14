const express = require('express');

const {getAllLetters, getLetterById, postNewLetter, deleteLetterById} = require("../controllers/lettersControllers")

const router = express.Router()

router 
.get("/", getAllLetters)
.get("./:letter_id", getLetterById)
.post("/", postNewLetter)
.delete("/:letter_id", deleteLetterById)

module.exports = router;