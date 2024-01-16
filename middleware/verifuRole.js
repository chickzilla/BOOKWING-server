const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyRole = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "You are not authorized" });
  }

  const token = authHeader.split(" ")[1];
  const compare = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid" });
      }
      if (decoded && decoded.role === "organizer") {
        next();
      } else {
        return res.status(401).json({ message: "You are not organizer" });
      }
    }
  );
};

module.exports = verifyRole;
