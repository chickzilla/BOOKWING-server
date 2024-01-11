const express = require("express");
const rounter = express.Router();

const {
  getAllBookings,
  getBookingByID,
  createBooking,
} = require("../controllers/bookingController");

const verifyAuth = require("../middleware/verifyAuth");

rounter.get("/", getAllBookings);
rounter.get("/:id", verifyAuth, getBookingByID);
rounter.post("/", verifyAuth, createBooking);

module.exports = rounter;
