const mongoose = require("mongoose");
const FormDataModel = require("../models/FormData");
const SearchHistory = require("../models/SearchHistory");
const fs = require("fs");
const path = require("path");

// Local JSON file path for offline fallback storage
const MOCK_DB_PATH = path.join(__dirname, "mockdb.json");

// Ensure the local JSON database exists on server startup
if (!fs.existsSync(MOCK_DB_PATH)) {
  fs.writeFileSync(MOCK_DB_PATH, JSON.stringify({ users: [], history: [] }, null, 2));
}

function readMockDB() {
  try {
    const data = fs.readFileSync(MOCK_DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading mock database file:", err.message);
    return { users: [], history: [] };
  }
}

function writeMockDB(data) {
  try {
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing to mock database file:", err.message);
  }
}

// Check if mongoose has an active connection to MongoDB Atlas
const isDbConnected = () => mongoose.connection.readyState === 1;

const dbService = {
  findUserByEmail: async (email) => {
    if (isDbConnected()) {
      try {
        return await FormDataModel.findOne({ email });
      } catch (error) {
        console.warn("MongoDB query failed, falling back to local storage:", error.message);
      }
    }
    // Local JSON database fallback
    const db = readMockDB();
    return db.users.find(u => u.email === email) || null;
  },

  createUser: async (name, email, hashedPassword) => {
    if (isDbConnected()) {
      try {
        const newUser = new FormDataModel({ name, email, password: hashedPassword });
        return await newUser.save();
      } catch (error) {
        console.warn("MongoDB write failed, falling back to local storage:", error.message);
      }
    }
    // Local JSON database fallback
    const db = readMockDB();
    const newUser = {
      _id: "mock-user-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
      name,
      email,
      password: hashedPassword
    };
    db.users.push(newUser);
    writeMockDB(db);
    return newUser;
  },

  saveReview: async (userId, code, review, language) => {
    if (isDbConnected()) {
      try {
        const newHistoryEntry = new SearchHistory({ userId, code, review, language });
        return await newHistoryEntry.save();
      } catch (error) {
        console.warn("MongoDB history write failed, falling back to local storage:", error.message);
      }
    }
    // Local JSON database fallback
    const db = readMockDB();
    const newEntry = {
      _id: "mock-history-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
      userId,
      code,
      review,
      language,
      timestamp: new Date().toISOString()
    };
    db.history.push(newEntry);
    writeMockDB(db);
    return newEntry;
  },

  getReviewHistory: async (userId) => {
    if (isDbConnected()) {
      try {
        const history = await SearchHistory.find({ userId }).sort({ timestamp: -1 }).limit(10);
        return history.map(entry => ({
          id: entry._id,
          code: entry.code,
          review: entry.review,
          language: entry.language,
          timestamp: new Date(entry.timestamp).toLocaleString()
        }));
      } catch (error) {
        console.warn("MongoDB history retrieve failed, falling back to local storage:", error.message);
      }
    }
    // Local JSON database fallback
    const db = readMockDB();
    return db.history
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10)
      .map(entry => ({
        id: entry._id,
        code: entry.code,
        review: entry.review,
        language: entry.language,
        timestamp: new Date(entry.timestamp).toLocaleString()
      }));
  },

  deleteReviewHistory: async (historyId, userId) => {
    if (isDbConnected()) {
      try {
        const result = await SearchHistory.deleteOne({ _id: historyId, userId });
        return result.deletedCount > 0;
      } catch (error) {
        console.warn("MongoDB history delete failed, falling back to local storage:", error.message);
      }
    }
    // Local JSON database fallback
    const db = readMockDB();
    const initialLength = db.history.length;
    db.history = db.history.filter(entry => !(entry._id === historyId && entry.userId === userId));
    writeMockDB(db);
    return db.history.length < initialLength;
  }
};

module.exports = dbService;
