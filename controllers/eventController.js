const db = require("../database/db");

// GET EVENT -----------------------------------
const getAllEvents = async (req, res) => {
  const result = await db.collection("event").get();
  if (result.empty) {
    return res.status(404).json({ message: "No event found" });
  }

  const events = result.docs.map((event) => {
    const eventId = event.id;
    return { id: eventId, ...event.data() };
  });
  res.json(events);
};

const getEventById = async (req, res) => {
  if (!req?.query?.id) {
    return res.status(400).json({ message: "Please provide an id" });
  }

  const { id } = req.query;
  try {
    const result = await db.collection("event").doc(id).get();

    if (!result.exists) {
      return res.status(404).json({ message: "Event not found" });
    } else {
      return res.status(200).json(result.data());
    }
  } catch (error) {
    return res.status(500).json({ message: "Cant find doc by ID" });
  }
};

// ---------------------------------------------
const createEvent = async (req, res) => {
  const { name, longitude, latitude, type, picture, province, date } = req.body;
  if (
    !name ||
    !longitude ||
    !latitude ||
    !type ||
    !picture ||
    !province ||
    !date
  ) {
    return res.status(400).json({ message: "Please provide all field" });
  }

  const events = await db.collection("event").get();
  const foundEvent = events.docs.find((event) => event.data().name === name);
  if (foundEvent) {
    return res.status(401).json({ message: "Event already exist" });
  }

  try {
    const result = await db.collection("event").add({
      name,
      longitude,
      latitude,
      type,
      picture,
      province,
      date,
    });
    res.status(201).json({ success: `New event ${name} created!` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  if (!req?.query?.id) {
    return res.status(400).json({ message: "Please provide an id" });
  }

  const { id } = req.query;
  const result = await db.collection("event").doc(id).get();
  if (!result.exists) {
    return res.status(404).json({ message: "Event not found" });
  }

  try {
    await db.collection("event").doc(id).delete();
    return res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateEvent = async (req, res) => {
  if (!req?.query?.id) {
    return res.status(400).json({ message: "Please provide an id" });
  }
  const { id } = req.query;

  const { name, longitude, latitude, type, picture, province, date } = req.body;
  if (
    !name ||
    !longitude ||
    !latitude ||
    !type ||
    !picture ||
    !province ||
    !date
  ) {
    return res.status(400).json({ message: "Please provide all field" });
  }

  const events = await db.collection("event").get();
  const foundEvent = events.docs.find((event) => event.data().name === name);

  if (!foundEvent) {
    return res.status(401).json({ message: "This Event not exist in system" });
  }

  try {
    await db.collection("event").doc(id).update({
      name,
      longitude,
      latitude,
      type,
      picture,
      province,
      date,
    });
    return res.status(200).json({ message: "Event updated" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  deleteEvent,
  updateEvent,
};
