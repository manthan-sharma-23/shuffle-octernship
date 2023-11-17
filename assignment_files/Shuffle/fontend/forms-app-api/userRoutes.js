const express = require("express");
const router = express.Router();

const { submitForm } = require("./controllers.js");

router.post("/submit/:form_id", submitForm);

module.exports = router;
