// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./db/database");
const authMiddleware = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS Configuration for local + Vercel frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-code-reviewer-cyan-five.vercel.app",
  "https://ai-code-reviewer-cvhwpme5s-suraj-sharma-s-projects.vercel.app", // your Vercel frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow undefined origin (like Postman) or matched origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Routes — Public
app.use("/api", require("./routes/login"));
app.use("/api", require("./routes/register"));
app.use("/api", require("./routes/logout"));
app.use("/api", require("./routes/tokengetter"));

// ✅ Routes — Protected with JWT auth middleware
app.use("/api", authMiddleware, require("./routes/reviewHistory"));
app.use("/api", authMiddleware, require("./routes/get-review"));

// Root route
app.get("/", (req, res) => {
  res.send("🚀 AI Code Reviewer Server is running...");
});

// Start server after DB connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
};

startServer();
