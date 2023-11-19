const express = require("express");
const router = express.Router();

const { submitForm, getResponseOfId } = require("./controllers.js");

router.post("/submit/:form_id", submitForm);
router.get("/response/:form_id", getResponseOfId);

module.exports = router;
