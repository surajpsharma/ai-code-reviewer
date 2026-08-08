const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_STRING);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.warn("⚠️ MongoDB connection error (Server will start in offline database mode):", err.message);
  }
};

module.exports = connectDB;
