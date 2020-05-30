const functions = require('firebase-functions');
const app = require('./App');
const admin = require("firebase-admin");
const secret = require("./secret");

admin.initializeApp({
    credential: admin.credential.cert(secret.firebaseAdmin_credential),
    databaseURL: secret.firebaseAdmin_databaseURL,
});

exports.widgets = functions.https.onRequest(app);