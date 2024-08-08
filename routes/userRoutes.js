// routes/userRoutes.js
const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const authenticateJWT = require("../middlewares/authenticateJWT.js");
const { first } = require("../services/first.js");
const { second } = require("../services/second.js");
const { screen } = require("../services/screen.js");
const { screentwo } = require("../services/screentwo.js");
const { screenthree } = require("../services/screenthree.js");
const { profile } = require("../services/profile.js");

router.post("/register", register);
router.post("/login", login);
router.get("/protected", authenticateJWT, (req, res) => {
  res.send("This is a protected route");
});

router.post("/first", first);
router.post("/second", second); // ทดสอบ token
// router.post('/second',authenticateJWT, second); // ทดสอบ token

router.post("/screen", screen);
router.post("/screentwo", screentwo);
router.post("/screenthree", screenthree);
router.post("/profile", profile);

module.exports = router;
