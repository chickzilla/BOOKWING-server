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
  getEventByOrganizer,
} = require("../controllers/eventController");

const verifyAuth = require("../middleware/verifyAuth");
const verifyRole = require("../middleware/verifuRole");

const upload = multer({ storage: multer.memoryStorage() });

rounter.get("/", getAllEvents);
rounter.get("/id", getEventById);
rounter.get("/type", getEventByType);
rounter.get("/name", getAllNameEvent);
rounter.get("/province", getEventByProvince);
rounter.get("/location", getAllLocation);
rounter.get("/organizer", verifyAuth, verifyRole, getEventByOrganizer);
rounter.post("/upload", upload.single("file"), upLoadFile);
rounter.post("/create", verifyAuth, verifyRole, createEvent);
rounter.delete("/delete", verifyAuth, verifyRole, deleteEvent);
rounter.put("/update", verifyAuth, verifyRole, updateEvent);

module.exports = rounter;
