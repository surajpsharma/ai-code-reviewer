// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./db/database"); // Changed variable name to connectDB
const authMiddleware = require("./middleware/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-code-reviewer-cyan-five.vercel.app",
    ],
    credentials: true,
  })
);

// --- Public/Auth-Specific Routes ---
app.use("/api", require("./routes/login"));
app.use("/api", require("./routes/register"));
app.use("/api", require("./routes/logout"));
app.use("/api", require("./routes/tokengetter"));

// --- PROTECTED ROUTES ---
app.use("/api", authMiddleware, require("./routes/reviewHistory"));
app.use("/api", authMiddleware, require("./routes/get-review"));

// Root Route
app.get("/", (req, res) => res.send("Server is running..."));

const PORT = process.env.PORT || 3000;

// Connect to DB and then start server
const startServer = async () => {
  await connectDB(); // Await the database connection
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer(); // Call the async function to start the server
