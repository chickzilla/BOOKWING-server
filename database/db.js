const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

const admin = require("firebase-admin");

//const serviceAccount = require("./serviceAccountKey.json");
const serviceAccountKey2 = require("./serviceAccountKey2.json");
const bucketName = "book-wing-2.appspot.com";

admin.initializeApp({
  //credential: admin.credential.cert(serviceAccount),
  //storageBucket: "gs://book-wing.appspot.com",
  credential: admin.credential.cert(serviceAccountKey2),
  storageBucket: "gs://book-wing-2.appspot.com",
});

const db = getFirestore();
const storage = getStorage();
const bucket = getStorage().bucket(bucketName);

module.exports = { db, bucket, storage };
