const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");
const bucketName = "book-wing.appspot.com";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://book-wing.appspot.com",
});

const db = getFirestore();
const storage = getStorage();
const bucket = getStorage().bucket(bucketName);

module.exports = { db, bucket, storage };
