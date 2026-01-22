const express = require("express");
const {createUser} = require("../controllers/user.controller")

// router

const router = express.Router();

router.post("/create-user", createUser)

module.exports = router