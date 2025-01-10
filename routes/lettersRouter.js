const express = require('express');

const {getAllLetters, getLetterById, postNewLetter} = require("../controllers/lettersControllers")

const router = express.Router()

router 
.get("/", getAllLetters)
.get("./:letter_id", getLetterById)
.post("/", postNewLetter)

module.exports = router;