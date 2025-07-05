const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;

// Dummy login endpoint — replace with DB check later
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

module.exports = router;
