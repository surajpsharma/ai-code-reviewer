// routes/login.js
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const FormDataModel = require("../models/FormData");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET;

const validateLoginInput = (email, password) => {
  if (!email || !password) {
    return { isValid: false, message: "Email and password are required." };
  }
  if (typeof email !== "string" || typeof password !== "string") {
    return { isValid: false, message: "Invalid input types." };
  }
  return { isValid: true, message: "" };
};

router.post("/login", async (req, res) => {
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // Only secure in production (HTTPS), false for HTTP development
      sameSite: isProduction ? "none" : "lax", // "none" for cross-origin production, "lax" for development
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
