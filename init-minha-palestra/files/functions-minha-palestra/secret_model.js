const developmentId = "";
const productionId = "";
module.exports = {
    firebaseAdmin_credential: process.env.GCLOUD_PROJECT === productionId ? {} : {},
    firebaseAdmin_databaseURL: process.env.GCLOUD_PROJECT === productionId ? "" : "",
    firebaseAdmin_storageBucket: process.env.GCLOUD_PROJECT === productionId ? "" : "",
    siteURL: process.env.GCLOUD_PROJECT === productionId ? "" : "",
}