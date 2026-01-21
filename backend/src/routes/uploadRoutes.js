const express = require("express");
const upload = require("../middlewares/upload");
const { uploadChat } = require("../controllers/chatController");

const router = express.Router();

router.post("/", upload.single("chat"), uploadChat);

module.exports = router;
