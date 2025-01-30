const express = require("express");

const {getUsers, getUser, createUser, logoutUser} = require ('../controllers/userControllers')

const router = express.Router()

router.post("/register", createUser);
router.post("/logout", logoutUser);

router.post('/login', getUser);
router.get("/", getUsers);

module.exports = router;
