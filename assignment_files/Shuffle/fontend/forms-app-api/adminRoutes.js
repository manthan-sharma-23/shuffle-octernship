const express = require("express");
const router = express.Router();

const {
  getUserForms,
  addForm,
  getForm,
  updateForm,
  deleteForm,
} = require("./controllers.js");

//admin
router.get("/", getUserForms);
router.get("/:form_id", getForm);
router.delete("/delete/admin/:form_id", deleteForm);
router.post("/addform", addForm);
router.patch("/updateform/:form_id", updateForm);

module.exports = router;
