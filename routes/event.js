const express = require("express");
const rounter = express.Router();
const storage = require("../database/db");
const multer = require("multer");
const {
  getAllEvents,
  getEventById,
  createEvent,
  deleteEvent,
  updateEvent,
  getAllNameEvent,
  getEventByType,
  getEventByProvince,
  getAllLocation,
  upLoadFile,
} = require("../controllers/eventController");

const upload = multer({ storage: multer.memoryStorage() });

rounter.get("/", getAllEvents);
rounter.get("/id", getEventById);
rounter.get("/type", getEventByType);
rounter.get("/name", getAllNameEvent);
rounter.get("/province", getEventByProvince);
rounter.get("/location", getAllLocation);
rounter.post("/upload", upload.single("file"), upLoadFile);
rounter.post("/create", createEvent);
rounter.delete("/delete", deleteEvent);
rounter.put("/update", updateEvent);

module.exports = rounter;
