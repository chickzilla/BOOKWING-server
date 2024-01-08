const express = require("express");
const rounter = express.Router();
const {
  RegisterHandler,
  LoginHandler,
  UserProfile,
  ChangeRole,
} = require("../controllers/authController");
const verifyAuth = require("../middleware/verifyAuth");

rounter.get("/me", verifyAuth, UserProfile);
rounter.post("/signup", RegisterHandler);
rounter.post("/signin", LoginHandler);
rounter.put("/changerole", verifyAuth, ChangeRole);

module.exports = rounter;
