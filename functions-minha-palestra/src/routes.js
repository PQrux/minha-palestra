const express = require('express');
const modules = require("./modules");

const router = express.Router();
for(let i in modules){
    router.use("/"+i, modules[i].routes);
}
module.exports = router;