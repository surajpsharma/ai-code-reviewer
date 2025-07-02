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
  "https://ai-code-reviewer-teal.vercel.app",
  "https://ai-code-reviewer-9xdi1fbyr-suraj-sharma-s-projects.vercel.app",
  "https://ai-code-reviewer.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean); // Remove any undefined values

console.log("✅ Allowed Origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow undefined origins like Postman or valid frontend URLs
      if (!origin || allowedOrigins.includes(origin)) {
        console.log("✅ Origin allowed:", origin);
        callback(null, true);
      } else {
        console.log("❌ Origin not allowed:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Allow cookies in cross-origin requests
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Add pre-flight OPTIONS handling for all routes
app.options("*", cors());

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

// ✅ Handle OPTIONS requests for CORS preflight
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).send();
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
