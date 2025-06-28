const express = require("express");
const router = express.Router();
router.post("/logout", (req, res) => {
  // Use the same cookie settings as login to ensure proper clearing
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // Match login cookie settings
    sameSite: "none", // Match login cookie settings
    path: "/",
  });

  res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
