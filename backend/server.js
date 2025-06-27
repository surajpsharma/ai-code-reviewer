// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/database");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS Configuration for local and deployed frontends
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  // Add your Vercel deployment URL here - update this with your actual Vercel URL
  "https://your-vercel-frontend-url.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow undefined origins like Postman or valid frontend URLs
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Allow cookies in cross-origin requests
  })
);

// ✅ Routes — Public
app.use("/api", require("./routes/login"));
app.use("/api", require("./routes/register"));
app.use("/api", require("./routes/logout"));
app.use("/api", require("./routes/tokengetter"));

// ✅ Routes — Protected
const authMiddleware = require("./middleware/auth");
app.use("/api", authMiddleware, require("./routes/reviewHistory"));
app.use("/api", authMiddleware, require("./routes/get-review"));

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("🚀 AI Code Reviewer Server is running...");
});

// ✅ Start Server After DB Connection
const startServer = async () => {
  try {
    // Environment validation
    console.log("🔧 Environment:", process.env.NODE_ENV || "development");
    console.log("🔑 JWT_SECRET available:", !!process.env.JWT_SECRET);
    console.log("🔑 MONGODB_STRING available:", !!process.env.MONGODB_STRING);

    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
};

startServer();
