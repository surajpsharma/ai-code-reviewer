const express = require("express");
const aiRoutes = require("./routes/ai.routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// ✅ Proper CORS setup for cookies
const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-code-reviewer-cyan-five.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Enable cookie parser for reading JWT token from cookies
app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Route to AI review logic
app.use("/ai/get-review", aiRoutes);

// Add your other routes here (login, tokengetter, etc.)
