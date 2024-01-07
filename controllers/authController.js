const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db } = require("../database/db");

const LoginHandler = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide an username and password" });
  }
  const users = await db.collection("user").get();
  const foundUser = users.docs.find(
    (user) => user.data().username === username
  );

  if (!foundUser) {
    return res.status(401).json({ message: "Username not exist in system" });
  }

  const match = await bcrypt.compare(password, foundUser.data().password);
  if (!match) {
    return res.status(401).json({ message: "Password not match" });
  }

  if (match) {
    const jwtToken = jwt.sign(
      {
        username: foundUser.data().username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10d",
      }
    );
    res.cookie("jwt", jwtToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000 * 3,
    });
    res.json({ AccessToken: jwtToken });
  }
};

// REGISTER ----------------------------------

const RegisterHandler = async (req, res) => {
  const { firstname, lastname, email, username, password } = req.body;
  if (!email || !password || !firstname || !lastname || !username) {
    return res.status(400).json({ message: "Please provide all field" });
  }

  const users = await db.collection("user").get();
  const foundUser = users.docs.find(
    (user) => user.data().username === username
  );

  if (foundUser) {
    return res.status(401).json({ message: "Username already exist" });
  }

  try {
    const salt = 10;
    const hashPassword = await bcrypt.hash(password, salt);
    await db.collection("user").add({
      firstname,
      lastname,
      email,
      username,
      password: hashPassword,
    });
    res.status(201).json({ success: `New user ${username} created!` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { LoginHandler, RegisterHandler };
