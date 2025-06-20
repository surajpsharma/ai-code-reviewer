// routes/login.js
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const FormDataModel = require("../models/FormData");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("server email: ", email, "password", password);

  try {
    const user = await FormDataModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No records found!", success: false });
    }

    if (user.password !== password) {
      return res
        .status(401)
        .json({ message: "Incorrect password!", success: false });
    }

    // --- ADD THIS CONSOLE.LOG HERE ---
    console.log("JWT_SECRET used for SIGNING:", process.env.JWT_SECRET);

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET, // Make sure this is process.env.JWT_SECRET
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Success", token, success: true });
  } catch (error) {
    console.error("Login server error:", error);
    res
      .status(500)
      .json({
        message: "Server error during login",
        error: error.message,
        success: false,
      });
  }
});

router.get("/", (req, res) => {
  res.json({ message: "Hello from server!" });
});

module.exports = router;
