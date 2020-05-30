module.exports = {
    firebase_key: process.env.REACT_APP_PRODUCTION === "s" ? {} : {},
    API_ROOT: process.env.REACT_APP_PRODUCTION === "s" ? "" : "",
}