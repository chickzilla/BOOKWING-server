require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8000;
const cors = require("cors");
app.use(cors());
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

const db = require("./database/db");
const storage = require("./database/db");

//router
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const eventRouter = require("./routes/event");
app.use("/event", eventRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/*
app.get("/testDB", async (req, res) => {
  const result = await db.collection("user").get();
  res.send(result.docs.map((doc) => doc.data()));
});*/
