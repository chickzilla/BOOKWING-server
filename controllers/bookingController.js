const { db, bucket, storage } = require("../database/db");
const { param } = require("../routes/event");

//Get Booking
const getAllBookings = async (req, res) => {
  const result = await db.collection("booking").get();
  if (result.empty)
    return res.status(404).json({ message: "No booking found" });
  const bookings = result.docs.map((booking) => {
    const bookingId = booking.id;
    return { id: bookingId, ...booking.data() };
  });
  return res.json(bookings);
};

// by Event ID
const getBookingByID = async (req, res) => {
  if (!req?.param?.id)
    return res.status(404).json({ message: "Please provide an ID" });

  const id = req.param;
  try {
    const result = await db.collection("booking").doc(id).get();
    if (!result.exists) {
      return res.status(404).json({ message: "Booking not found" });
    } else {
      return res.status(200).json(result.data());
    }
  } catch (err) {
    return res.status(500).json({ message: "Can't find doc by ID" });
  }
};

const createBooking = async (req, res) => {
  const { event, name, surname, email, phone, shirtsize } = req.body;
  if (!event || !name || !surname || !email || !phone || !shirtsize) {
    return res.status(400).json({ message: "Please provide all field" });
  }
  const bookingRef = db.collection("booking");
  const foundBooking = await bookingRef.where("event", "==", event).get();
  if (foundEvent.docs.length > 0) {
    return res.status(401).json({ message: "Booging already exist" });
  }

  try {
    await db
      .collection("booking")
      .add({
        event,
        name,
        surname,
        email,
        phone,
        shirtsize,
      })
      .then((docRef) => {
        return res.status(201).json({ message: docRef.id });
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllBookings, getBookingByID, createBooking };
