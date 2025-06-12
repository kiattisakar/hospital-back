const express = require("express");
const router = express.Router();
const doseController = require("../controllers/doseController");
//(url+/dose/.....)
router.get("/getDoseBySearch", doseController.getSearch);
router.get("/getDiluentname", doseController.getDiluentname);

module.exports = router;
