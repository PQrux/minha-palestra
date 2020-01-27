const functions = require('firebase-functions');
const app = require('./App');
const admin = require("firebase-admin");
const secret = require("./secret");

admin.initializeApp({
    credential: admin.credential.cert(secret.firebaseAdmin_credential),
    databaseURL: secret.firebaseAdmin_databaseURL,
});

exports.widgets = functions.https.onRequest(app);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
