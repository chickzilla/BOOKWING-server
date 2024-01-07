const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "You are not authorized" });
  }

  const Token = authHeader.split(" ")[1];
  const compare = jwt.verify(
    Token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid" });
      }
      next();
    }
  );
};

module.exports = verifyAuth;
