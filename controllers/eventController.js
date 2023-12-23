const db = require("../database/db");

const getAllEvents = async (req, res) => {
  const result = await db.collection("event").get();
  if (result.empty) {
    return res.status(404).json({ message: "No event found" });
  }

  res.send(result.docs.map((doc) => doc.data()));
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

module.exports = { getAllEvents, getEventById };
