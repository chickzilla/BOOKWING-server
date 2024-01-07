const express = require("express");
const rounter = express.Router();
const {
  RegisterHandler,
  LoginHandler,
  UserProfile,
} = require("../controllers/authController");

rounter.get("/me", UserProfile);
rounter.post("/signup", RegisterHandler);
rounter.post("/signin", LoginHandler);

module.exports = rounter;
