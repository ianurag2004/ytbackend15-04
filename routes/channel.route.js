const express = require("express");
const {createChannel, getAccountDetails} = require("../controllers/channel.controller");
const {uploadVideo, getVideoDetails} = require("../controllers/video.controller")

const router = express.Router();

router.post("/create-channel", createChannel)

router.get("/get-account-details", getAccountDetails)



module.exports = router