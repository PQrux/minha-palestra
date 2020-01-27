const express = require('express');
const modules = require("./modules");

const router = express.Router();
router.use("/Template", modules.Template.routes);

module.exports = router;