const express = require("express");
const router = express.Router();

const {
  submitForm,
  getResponseOfId,
  getResponse,
} = require("./controllers.js");

router.post("/submit/:form_id", submitForm);
router.get("/:response_id", getResponse);
router.get("/response/:form_id", getResponseOfId);

module.exports = router;
