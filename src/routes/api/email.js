const express = require("express");
const router = express.Router();
const { sendEmailHandler } = require("../../controllers/email.controller");

router.post("/send", sendEmailHandler);

module.exports = router;
