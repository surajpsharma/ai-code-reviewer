// routes/login.js
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const FormDataModel = require("../models/FormData");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET;

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Validates that the given email and password are both strings and not empty.
 * @param {string} email - The email to validate.
 * @param {string} password - The password to validate.
 * @returns {object} An object with two properties, isValid and message. If the input is valid, isValid is true and message is an empty string. If the input is invalid, isValid is false and message is a string describing the error.
 */
/*******  9b987569-ce6d-4da6-80e7-4dfe7b16f6c7  *******/ const validateLoginInput =
  (email, password) => {
    if (!email || !password) {
      return { isValid: false, message: "Email and password are required." };
    }
    if (typeof email !== "string" || typeof password !== "string") {
      return { isValid: false, message: "Invalid input types." };
    }
    return { isValid: true, message: "" };
  };

router.post("/login", async (req, res) => {
  // Add CORS headers explicitly for this route
  const origin = req.get("Origin");
  if (origin) {
    // Import the allowedOrigins array from the main server file
    const allowedOrigins = require("../server").allowedOrigins;

    // Check if the origin is allowed
    let isAllowed = allowedOrigins.includes(origin);

    // If not an exact match, check regex patterns
    if (!isAllowed) {
      isAllowed = allowedOrigins.some((allowedOrigin) => {
        return allowedOrigin instanceof RegExp && allowedOrigin.test(origin);
      });
    }

    if (isAllowed) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Cookie, Cache-Control"
      );
    } else {
      console.log("Blocked by CORS in login:", origin);
    }
  }

  const { email, password } = req.body;

  const validation = validateLoginInput(email, password);
  if (!validation.isValid) {
    console.warn(`Login failed (validation): ${validation.message}`);
    return res
      .status(400)
      .json({ message: validation.message, success: false });
  }

  if (!JWT_SECRET) {
    console.error("❌ JWT_SECRET not defined in environment variables.");
    return res
      .status(500)
      .json({ message: "Server configuration error.", success: false });
  }

  console.log(`🔐 Login attempt for: ${email}`);

  try {
    const user = await FormDataModel.findOne({ email });
    if (!user) {
      console.warn(`❌ Login failed: User not found`);
      return res
        .status(401)
        .json({ message: "Invalid credentials.", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn(`❌ Login failed: Wrong password`);
      return res
        .status(401)
        .json({ message: "Invalid credentials.", success: false });
    }

    const tokenPayload = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

    // ✅ Dynamic cookie configuration for development vs production
    const isProduction = process.env.NODE_ENV === "production";

    // Always use sameSite=none for deployed environments to work with all browsers
    // Chrome on desktop requires sameSite=none with secure=true for cross-origin cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Always use secure for deployed environments
      sameSite: "none", // Use "none" for all cross-origin requests to work in all browsers
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    console.log(
      `🍪 Cookie set with config: secure=${isProduction}, sameSite=${
        isProduction ? "none" : "lax"
      }`
    );

    console.log(`✅ Login successful for ${email}`);
    res.json({ message: "Login successful!", success: true });
  } catch (error) {
    console.error(`🔥 Server error on login:`, error.message);
    res.status(500).json({
      message: "An unexpected server error occurred during login.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
      success: false,
    });
  }
});

router.get("/", (req, res) => {
  res.json({ message: "Authentication service is running." });
});

module.exports = router;
