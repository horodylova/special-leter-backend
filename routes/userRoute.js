const express = require("express");

const {getUsers, getTheUser, createUser} = require ('../controllers/userControllers')

const router = express.Router()

router.get("/", getUsers);
router.get('/:username', getTheUser);
router.post("/", createUser);
router.delete("/:username", deleteUser);

module.exports = router;
