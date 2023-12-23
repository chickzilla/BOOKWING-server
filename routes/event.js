const express = require("express");
const rounter = express.Router();
const {
  getAllEvents,
  getEventById,
} = require("../controllers/eventController");

rounter.get("/", getAllEvents);
rounter.get("/id", getEventById);

module.exports = rounter;
