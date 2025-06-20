// routes/login.js
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const FormDataModel = require("../models/FormData"); // Assuming FormDataModel is your User model
const bcrypt = require("bcryptjs"); // Import bcryptjs

// IMPORTANT: Ensure JWT_SECRET is loaded from environment variables in production.
// Do NOT hardcode secrets in production. A strong, randomly generated string is required.
const JWT_SECRET = process.env.JWT_SECRET;

// Basic input validation utility (can be expanded or replaced with a library like 'express-validator')
const validateLoginInput = (email, password) => {
  if (!email || !password) {
    return { isValid: false, message: "Email and password are required." };
  }
  if (typeof email !== "string" || typeof password !== "string") {
    return { isValid: false, message: "Invalid input types." };
  }
  // You can add more specific email format validation here if needed
  // e.g., if (!/\S+@\S+\.\S+/.test(email)) { return { isValid: false, message: "Invalid email format." }; }
  return { isValid: true, message: "" };
};

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 1. Input Validation
  const validation = validateLoginInput(email, password);
  if (!validation.isValid) {
    console.warn(
      `Login attempt failed: ${validation.message} for email: ${email}`
    );
    return res
      .status(400)
      .json({ message: validation.message, success: false });
  }

  // Ensure JWT_SECRET is set
  if (!JWT_SECRET) {
    console.error(
      "Critical Error: JWT_SECRET is not set in environment variables!"
    );
    // In a production environment, you might want to restart the server or exit here
    return res
      .status(500)
      .json({ message: "Server configuration error.", success: false });
  }

  console.log(`Login attempt for email: ${email}`); // More concise logging

  try {
    // 2. Find User by Email
    const user = await FormDataModel.findOne({ email });
    if (!user) {
      console.log(`Login failed: User not found for email: ${email}`);
      // Generic error message for security (don't reveal if email exists)
      return res
        .status(401)
        .json({ message: "Invalid credentials.", success: false });
    }

    // 3. Compare Passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login failed: Incorrect password for email: ${email}`);
      // Generic error message for security
      return res
        .status(401)
        .json({ message: "Invalid credentials.", success: false });
    }

    // 4. Generate JWT Token
    // Consider adding less sensitive user data to the token payload,
    // or only the user ID, and fetch full user details from DB on subsequent requests.
    const tokenPayload = {
      id: user._id,
      email: user.email,
      // Only include 'name' if absolutely necessary for client-side functionality
      // to keep token size down and reduce sensitive data exposure.
      name: user.name,
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" }); // Token expires in 7 days

    // 5. Set HTTP-only Cookie
    // httpOnly: Prevents client-side JavaScript from accessing the cookie. CRITICAL for security.
    // secure: Ensures cookie is only sent over HTTPS. Must be true in production.
    // sameSite: Protects against CSRF attacks. 'Lax' is a good balance for many apps.
    //           'None' requires 'secure: true' and a specific client-side setup.
    // path: Ensures the cookie is sent with requests to any path under the root.
    // maxAge: Sets cookie expiration, matching JWT expiry.
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Automatically true in production, false in development
      sameSite: "lax", // Can be 'strict', 'lax', or 'none'. 'Lax' is often a good default.
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      path: "/",
    });

    // 6. Send Success Response
    // Avoid sending the token in the response body if it's already in a cookie,
    // as it creates an additional attack surface (e.g., XSS can steal it from body).
    // If you absolutely need it for client-side logic (e.g., immediate UI updates without refetching),
    // then limit the data sent. For most auth flows with cookies, it's redundant.
    res.json({ message: "Login successful!", success: true });
    console.log(`User ${email} successfully logged in.`);
  } catch (error) {
    console.error(`Server error during login for email ${email}:`, error);
    res.status(500).json({
      message:
        "An unexpected server error occurred during login. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined, // Only send detailed error in development
      success: false,
    });
  }
});

// A simple test route (optional)
router.get("/", (req, res) => {
  res.json({ message: "Authentication service is running." });
});

module.exports = router;
