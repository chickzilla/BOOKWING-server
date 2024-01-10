const { db, bucket, storage } = require("../database/db");
const { ref, deleteObject, refFromURL } = require("firebase/storage");

// GET EVENT -----------------------------------
const getAllEvents = async (req, res) => {
  const result = await db.collection("event").get();
  if (result.empty) {
    return res.status(404).json({ message: "No event found" });
  }

  // query

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

  // query

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
  // query
  const eventRef = db.collection("event");
  const query = await eventRef.select("name").get();
  if (query.empty) {
    return res.status(404).json({ message: "No event found" });
  }

  const names = query.docs
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

  // query

  const { type } = req.query;

  const eventRef = db.collection("event");
  const query = await eventRef.where("type", "array-contains", type).get();
  if (query.empty) {
    return res.status(404).json({ message: "No event found" });
  }

  const result = query.docs.map((event) => {
    const eventId = event.id;
    return { id: eventId, ...event.data() };
  });

  res.json(result);
};

const getEventByProvince = async (req, res) => {
  if (!req?.query?.province) {
    return res.status(400).json({ message: "Please provide an province" });
  }

  // query

  const { province } = req.query;
  const eventRef = db.collection("event");
  const q = await eventRef.where("province", "==", province).get();

  if (q.empty) {
    return res.status(404).json({ message: "No event found" });
  }

  const result = q.docs.map((event) => {
    const eventId = event.id;
    return { id: eventId, ...event.data() };
  });

  res.json(result);
};

const getAllLocation = async (req, res) => {
  // query

  const eventRef = db.collection("event");
  const query = await eventRef.select("latitude", "longitude").get();

  if (query.empty) {
    return res.status(404).json({ message: "No event found" });
  }
  const events = query.docs.map((event) => {
    const eventId = event.id;
    const latitude = event.data().latitude;
    const longitude = event.data().longitude;
    return { id: eventId, latitude: latitude, longitude: longitude };
  });
  res.json(events);
};

const getEventByOrganizer = async (req, res) => {
  if (!req?.query?.organizer) {
    return res.status(400).json({ message: "Please provide an organizer" });
  }
  const { organizer } = req.query;

  // query

  const eventRef = db.collection("event");
  const query = await eventRef.where("organizer", "==", organizer).get();
  if (query.empty) {
    return res.status(404).json({ message: "No event found" });
  }

  const result = query.docs
    .map((event) => {
      if (event.data().organizer !== organizer) {
        return null;
      }
      const eventId = event.id;
      return { id: eventId, ...event.data() };
    })
    .filter((event) => event !== null);

  return res.json(result);
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
      return res.status(200).send({
        message: "File uploaded successfully.",
        url: url[0],
        location: filename,
      });
    });

    stream.end(fileBuffer);
  } catch (error) {
    return res.status(500).send("File upload error: " + error);
  }
};

const createEvent = async (req, res) => {
  // query

  const {
    name,
    longitude,
    latitude,
    type,
    picture,
    picture_location,
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
    !picture_location ||
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

  const eventRef = db.collection("event");
  const foundEvent = await eventRef.where("name", "==", name).get();
  if (foundEvent.docs.length > 0) {
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
        picture_location,
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
  // query

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
    const result_picture_ref = result.data().picture_location;
    const storage_picture_ref = `gs://book-wing.appspot.com/${result_picture_ref}`;
    const fileRef = bucket.file(result_picture_ref);
    await fileRef.delete();
    //const fileRef = ref(storage, storage_picture_ref);
    //await deleteObject(fileRef);

    return res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateEvent = async (req, res) => {
  // query

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

  const eventRef = db.collection("event");
  const query = await eventRef.where("name", "==", name).get();

  if (query.docs.length > 0) {
    return res
      .status(401)
      .json({ message: "This Event already exist in system" });
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
  getEventByOrganizer,
};
