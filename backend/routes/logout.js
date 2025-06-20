const express = require("express");
const router = express.Router();
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: "lax",
  });

  res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
