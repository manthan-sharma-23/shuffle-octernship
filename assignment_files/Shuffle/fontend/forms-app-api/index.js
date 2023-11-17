const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3300;
const adminRoutes = require("./adminRoutes");
const userRoutes = require("./userRoutes");

app.use(cors());

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use("/api/forms", adminRoutes);
app.use("/api/survey", userRoutes);

app.listen(port, () => {
  console.log(`server is listening at port ${port}`);
});
