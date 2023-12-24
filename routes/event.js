const express = require("express");
const rounter = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  deleteEvent,
  updateEvent,
  getAllNameEvent,
  getEventByType,
  getEventByProvince,
} = require("../controllers/eventController");

rounter.get("/", getAllEvents);
rounter.get("/id", getEventById);
rounter.get("/type", getEventByType);
rounter.get("/name", getAllNameEvent);
rounter.get("/province", getEventByProvince);
rounter.post("/create", createEvent);
rounter.delete("/delete", deleteEvent);
rounter.put("/update", updateEvent);

module.exports = rounter;
