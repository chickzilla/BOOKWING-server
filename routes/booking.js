const express = require("express");
const rounter = express.Router();

const {
  getAllBookings,
  getBookingByID,
  getBookingByUserID,
  createBooking,
} = require("../controllers/bookingController");

const verifyAuth = require("../middleware/verifyAuth");

rounter.get("/", getAllBookings);
rounter.get("/:id", verifyAuth, getBookingByID);
rounter.get("/id", verifyAuth, getBookingByUserID);
rounter.post("/create", verifyAuth, createBooking);

module.exports = rounter;
