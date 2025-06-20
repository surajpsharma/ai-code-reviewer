const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "log_reg_form",
    required: true,
  },
  code: { type: String, required: true },
  review: { type: String, required: true },
  language: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const SearchHistory = mongoose.model("SearchHistory", reviewSchema);
module.exports = SearchHistory;
