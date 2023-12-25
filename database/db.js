const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://book-wing.appspot.com",
});

const db = getFirestore();
const bucket = getStorage().bucket();

(module.exports = db), bucket;
