require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const Database = require("./db/database");
// const reviewHistory = require("./routes/reviewHistory");
const express = require("express");
const app = express();
app.use(express.json());
app.use(cookieParser());

Database();

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // 🔥 Allows cookies to be sent
  })
);
app.use("/api", require("./routes/login"));
app.use("/api", require("./routes/register"));
app.use("/api", require("./routes/logout"));
app.use("/api", require("./routes/tokengetter"));
app.use("/api", require("./routes/get-review"));
app.use("/api", require("./routes/reviewHistory"));
app.use("/api", require("./routes/login"));
app.get("/", (req, res) => res.send("Server is running..."));
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
