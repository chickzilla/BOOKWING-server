const express = require("express");
const rounter = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  deleteEvent,
  updateEvent,
  getAllNameEvent,
} = require("../controllers/eventController");

rounter.get("/", getAllEvents);
rounter.get("/id", getEventById);
rounter.get("/name", getAllNameEvent);
rounter.post("/create", createEvent);
rounter.delete("/delete", deleteEvent);
rounter.put("/update", updateEvent);

module.exports = rounter;
