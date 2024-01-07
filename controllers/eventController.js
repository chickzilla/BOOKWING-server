const { db, bucket, storage } = require("../database/db");
const { ref, uploadBytes } = require("firebase/storage");

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

const getAllNameEvent = async (req, res) => {
  const result = await db.collection("event").get();
  if (result.empty) {
    return res.status(404).json({ message: "No event found" });
  }

  const names = result.docs
    .map((event) => {
      const eventId = event.id;
      const Eventname = event.data().name;

      if (!Eventname) {
        return null;
      }
      return { id: eventId, name: Eventname };
    })
    .filter((event) => event !== null);
  res.json(names);
};

const getEventByType = async (req, res) => {
  if (!req?.query?.type) {
    return res.status(400).json({ message: "Please provide an type" });
  }

  const { type } = req.query;

  const events = await db.collection("event").get();
  if (events.empty) {
    return res.status(404).json({ message: "No event found" });
  }

  const result = events.docs
    .map((event) => {
      if (
        event.data().type.find((eventType) => eventType === type) === undefined
      ) {
        return null;
      }

      const eventId = event.id;
      return { id: eventId, ...event.data() };
    })
    .filter((event) => event !== null);

  res.json(result);
};

const getEventByProvince = async (req, res) => {
  if (!req?.query?.province) {
    return res.status(400).json({ message: "Please provide an province" });
  }

  const { province } = req.query;

  const events = await db.collection("event").get();
  if (events.empty) {
    return res.status(404).json({ message: "No event found" });
  }

  const result = events.docs
    .map((event) => {
      if (event.data().province !== province) {
        return null;
      }
      const eventId = event.id;
      return { id: eventId, ...event.data() };
    })
    .filter((event) => event !== null);

  res.json(result);
};

const getAllLocation = async (req, res) => {
  const result = await db.collection("event").get();
  if (result.empty) {
    return res.status(404).json({ message: "No event found" });
  }

  const events = result.docs.map((event) => {
    const eventId = event.id;
    const latitude = event.data().latitude;
    const longitude = event.data().longitude;
    return { id: eventId, latitude: latitude, longitude: longitude };
  });
  res.json(events);
};

// ---------------------------------------------

const upLoadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const file = req.file;
  const filename = file.originalname;
  const fileBuffer = file.buffer;

  const fileUpload = bucket.file(filename);

  // destination to storage
  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype, // ex pdf
    },
  });
  try {
    stream.on("error", (err) => {
      return res.status(500).send("File upload error: " + err);
    });

    stream.on("finish", async () => {
      const url = await bucket.file(filename).getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });
      return res
        .status(200)
        .send({ message: "File uploaded successfully.", url: url[0] });
    });

    stream.end(fileBuffer);
  } catch (error) {
    return res.status(500).send("File upload error: " + error);
  }
};

const createEvent = async (req, res) => {
  const {
    name,
    longitude,
    latitude,
    type,
    picture,
    province,
    location,
    date,
    time,
    package,
    description,
    organizer,
  } = req.body;
  if (
    !name ||
    !longitude ||
    !latitude ||
    !type ||
    !picture ||
    !province ||
    !location ||
    !date ||
    !time ||
    !package ||
    !description ||
    !organizer
  ) {
    return res.status(400).json({ message: "Please provide all field" });
  }

  const events = await db.collection("event").get();
  const foundEvent = events.docs.find((event) => event.data().name === name);
  if (foundEvent) {
    return res.status(401).json({ message: "Event already exist" });
  }

  try {
    const result = await db
      .collection("event")
      .add({
        name,
        longitude,
        latitude,
        type,
        picture,
        province,
        location,
        date,
        time,
        package,
        description,
        organizer,
      })
      .then((docRef) => {
        res.status(201).json({ message: docRef.id });
      });
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

  const {
    name,
    longitude,
    latitude,
    type,
    picture,
    province,
    location,
    date,
    time,
    package,
    description,
    organizer,
  } = req.body;
  if (
    !name ||
    !longitude ||
    !latitude ||
    !type ||
    !picture ||
    !province ||
    !location ||
    !date ||
    !time ||
    !package ||
    !description ||
    !organizer
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
      location,
      date,
      time,
      package,
      description,
      organizer,
    });
    return res.status(200).json({ message: "Event updated" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getAllEvents,
  getAllNameEvent,
  getEventById,
  getEventByType,
  createEvent,
  deleteEvent,
  updateEvent,
  getEventByProvince,
  getAllLocation,
  upLoadFile,
};
