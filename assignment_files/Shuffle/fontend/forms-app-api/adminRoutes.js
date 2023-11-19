const express = require("express");
const router = express.Router();

const {
  getUserForms,
  getForm,
  updateForm,
  deleteForm,
  createForm,
} = require("./controllers.js");

//admin
router.get("/", getUserForms);
router.get("/:form_id", getForm);
router.delete("/delete/admin/:form_id", deleteForm);
router.post("/addform", createForm);
router.patch("/updateform/:form_id", updateForm);

module.exports = router;
