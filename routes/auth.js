const express = require("express");
const rounter = express.Router();
const {
  RegisterHandler,
  LoginHandler,
} = require("../controllers/authController");

rounter.post("/signup", RegisterHandler);
rounter.post("/signin", LoginHandler);

module.exports = rounter;
