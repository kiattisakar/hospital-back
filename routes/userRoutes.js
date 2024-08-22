// back/routes/userRoutes.js
const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const authenticateJWT = require("../middlewares/authenticateJWT.js");
const { first } = require("../services/first.js");
const { second } = require("../services/second.js");
const { room } = require("../services/room");
const { screen } = require("../services/screen.js");
const { screentwo } = require("../services/screentwo.js");
const { screenthree } = require("../services/screenthree.js");
const { profile } = require("../services/profile.js");

router.post("/register", register);
router.post("/login", login);
router.get("/auth", authenticateJWT, (req, res, next) => {
  res.json({ msg: "Token Check" });
});
router.post("/first", first);
router.post("/second", second);

router.post("/room", room);
router.post("/screen", screen);
router.post("/screentwo", screentwo);
router.post("/screenthree", screenthree);
router.post("/profile", profile);

module.exports = router;
