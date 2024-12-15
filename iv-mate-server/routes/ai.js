var express = require("express");
const router = express.Router();
var db = require("../src/db.js");
var sql = require("../sql.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = router;

router.post("/sendInfo", (req, res) => {
  const user = req.body;
  console.log(user);
});
