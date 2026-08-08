const express = require("express");
const router = express.Router();
const dbService = require("../db/dbService");
const bcrypt = require("bcryptjs"); // Make sure bcryptjs is imported

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await dbService.findUserByEmail(email);
    if (existingUser) {
      return res
        .status(409)
        .json({
          message: "User with this email already exists.",
          success: false,
        });
    }

    // ⭐ THIS IS THE CRITICAL PART ⭐
    const salt = await bcrypt.genSalt(10); // Generate a salt (recommended cost factor is 10-12)
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the plain text password

    await dbService.createUser(name, email, hashedPassword);
    console.log(`New user registered successfully: ${email}`);
    res
      .status(201)
      .json({
        message: "Registration successful! You can now log in.",
        success: true,
      });
  } catch (error) {
    console.error("Registration server error:", error);
    res
      .status(500)
      .json({
        message: "Server error during registration.",
        error: error.message,
        success: false,
      });
  }
});

module.exports = router;
