const mongoose = require("mongoose");

const Database = async () => {
  mongoose
    .connect(process.env.MONGODB_STRING)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = Database;
