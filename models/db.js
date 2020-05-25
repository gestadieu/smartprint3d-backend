require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

if (!db) console.log("Error connecting db");
else console.log("Db connected successfully");

module.exports = db;
