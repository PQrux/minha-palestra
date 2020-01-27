const express = require('express');
const controller = require("./controller");


const router = express.Router();
router.get('/', controller.index);

module.exports = router;