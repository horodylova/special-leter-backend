const express = require("express");

const {getUser, createUser, logoutUser} = require ('../controllers/userControllers')

const router = express.Router()

router.post("/register", createUser);
router.post("/logout", logoutUser);

router.get('/login', getUser);

module.exports = router;
