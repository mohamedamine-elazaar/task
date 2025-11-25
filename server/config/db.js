// server/config/db.js
// MongoDB connection helper using Mongoose

const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/task_manager";

  // Recommended options are default in Mongoose 6+
  await mongoose.connect(uri);
  console.log("MongoDB connected:", mongoose.connection.host);
}

module.exports = { connectDB };
