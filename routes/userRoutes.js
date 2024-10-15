// back/routes/userRoutes.js
const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const authenticateJWT = require("../middlewares/authenticateJWT.js");
const { first, second } = require("../services/first.js");
// const { second } = require("../services/second.js");

const { room } = require("../services/room");
const { screen } = require("../services/screen.js");
const { screentwo } = require("../services/screentwo.js");
const { screenthree } = require("../services/screenthree.js");
const { profile } = require("../services/profile.js");
const {
  ucHouse,
  stockHouse,
  balancestockHouse,
  filterStockByDate,
  Exp,
} = require("../services/ucHouse.js");
const { test } = require("../services/dockertest.js");

const {
  medicationProfile_database_view,
} = require("../services/medicationProfile/fromMYSQL.js");
const {
  medicationProfile_database_144,
} = require("../services/medicationProfile/fromSQLSERVER.js");

router.post("/register", register);
router.post("/login", login);
router.get("/auth", authenticateJWT, (req, res, next) => {
  res.json({ msg: "Token Check" });
});
router.post("/first", first);
router.post("/second", second);
// router.post("/doubleClickIPDProfile", doubleClickIPDProfile);

router.post("/room", room);
router.post("/screen", screen);
router.post("/screentwo", screentwo);
router.post("/screenthree", screenthree);
router.post("/profile", profile);

router.post("/ucHouse", ucHouse);
router.post("/stockHouse", stockHouse);
router.post("/balancestockHouse", balancestockHouse);
router.post("/filterStockByDate", filterStockByDate);
router.post("/Exp", Exp);
router.get("/test", test);

// router.post("/medicationProfile/:an", medicationProfile);
router.post(
  "/medicationProfile_database_view",
  medicationProfile_database_view
);
router.post("/medicationProfile_database_144", medicationProfile_database_144);

// const { pool, poolConnect, sql } = require("../models/db"); // นำเข้า pool และ poolConnect
// router.get("/patient-lab-result", async (req, res) => {
//   await poolConnect; // รอจนกระทั่งเชื่อมต่อเสร็จสมบูรณ์

//   try {
//     const request = pool.request(); // สร้างคำขอเพื่อ query ข้อมูล
//     const result = await request.query(
//       "SELECT * FROM ms_patientlabresult WHERE an = '6727582'"
//     );

//     res.status(200).json(result.recordset); // ส่งข้อมูลกลับในรูปแบบ JSON
//   } catch (err) {
//     console.error("SQL error", err);
//     res.status(500).send("Server error");
//   }
// });

module.exports = router;
