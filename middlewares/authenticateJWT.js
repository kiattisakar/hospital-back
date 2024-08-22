// /back/middlewares/authenticateJWT.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_jwt_secret_key";

const authenticateJWT = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).send("Access denied. No token provided.");
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token or token expired.");
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateJWT;
