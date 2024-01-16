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
  const query = await db
    .collection("user")
    .where("username", "==", username)
    .get();

  if (!query) {
    return res.status(401).json({ message: "Username not exist in system" });
  }

  const foundUser = query.docs[0];

  const match = await bcrypt.compare(password, foundUser.data().password);
  if (!match) {
    return res.status(401).json({ message: "Password not match" });
  }

  if (match) {
    const jwtToken = jwt.sign(
      {
        username: foundUser.data().username,
        role: foundUser.data().role,
        id: foundUser.id,
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
    res.json({
      AccessToken: jwtToken,
      id: foundUser.id,
      role: foundUser.data().role,
      username: foundUser.data().username,
    });
  }
};

// REGISTER ----------------------------------

const RegisterHandler = async (req, res) => {
  const { firstname, lastname, email, username, password } = req.body;
  if (!email || !password || !firstname || !lastname || !username) {
    return res.status(400).json({ message: "Please provide all field" });
  }

  const users = await db
    .collection("user")
    .where("username", "==", username)
    .get();
  const foundUser = users.docs[0];

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
      role: "runner",
    });
    res.status(201).json({ success: `New user ${username} created!` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const UserProfile = async (req, res) => {
  if (!req.header("Authorization")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const ID = decoded.id;
    const users = await db.collection("user").doc(ID).get();
    if (!users.exists) {
      return res.status(401).json({ message: "User not found" });
    }

    res.status(200).json({
      user: { ...users.data(), password: "", id: ID },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const ChangeRole = async (req, res) => {
  if (!req.header("Authorization")) {
    return res.status(401).json({ message: "No header Authorization" });
  }
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const users = await db
      .collection("user")
      .where("username", "==", decode.username)
      .get();

    if (!users) {
      return res.status(404).json({ message: "User not found" });
    } else {
      await db.collection("user").doc(decode.id).update({
        role: "organizer",
      });
    }
    const jwtNewToken = jwt.sign(
      {
        username: decode.username,
        role: "organizer",
        id: decode.id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10d",
      }
    );

    return res
      .status(200)
      .json({ AccessToken: jwtNewToken, role: "organizer" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { LoginHandler, RegisterHandler, UserProfile, ChangeRole };
