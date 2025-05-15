const express = require("express");
const router = express.Router();
const doseController = require("../controllers/doseController");
//(url+/dose/.....)
router.get("/getDoseBySearch", doseController.getSearch);

module.exports = router;
