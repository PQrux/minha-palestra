const express = require('express');
const controller = require("./controller");


const router = express.Router();
router.post('/inscrever', controller.inscrever);
router.post('/desinscrever', controller.desinscrever);

module.exports = router;