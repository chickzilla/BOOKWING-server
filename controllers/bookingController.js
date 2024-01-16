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

//get by Event ID
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

//get by USer ID
const getBookingByUserID = async (req, res) => {
  const result = await db
    .collection("booking")
    .where("userid", "==", uid)
    .get();
  if (result.empty)
    return res.status(404).json({ message: "No booking found" });
  return res.json(result.data);
};

// create Booking
const createBooking = async (req, res) => {
  const { eventid, userid, eventtype, phone, shirtsize } = req.body;
  if (!eventid || !userid || !eventtype || !phone || !shirtsize) {
    return res.status(400).json({ message: "Please provide all field" });
  }
  const bookingRef = db.collection("booking");
  const foundBooking = await bookingRef
    .where("eventid", "==", eventid)
    .where("userid", "==", userid)
    .get();
  if (foundBooking.docs.length > 0) {
    return res.status(401).json({ message: "Booking already exist" });
  }

  try {
    await db
      .collection("booking")
      .add({
        eventid,
        userid,
        eventtype,
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

module.exports = {
  getAllBookings,
  getBookingByID,
  getBookingByUserID,
  createBooking,
};
