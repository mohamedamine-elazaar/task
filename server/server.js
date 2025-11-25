// server/server.js
// Entry point for the Express server. Configures middleware, connects to MongoDB,
// mounts routes, and starts the HTTP server.

const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

// Load environment variables from .env if present
dotenv.config({ path: path.join(__dirname, ".env") });

const mongoose = require("mongoose");
const { connectDB } = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Ensure DB is connected for every request (Serverless fix)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection failed:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    mongoState: mongoose.connection.readyState, // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    env: process.env.NODE_ENV
  });
});

// Root info route (helps avoid 404 on '/')
app.get("/", (_req, res) => {
  res.json({
    name: "Task Manager API",
    version: "1.0.0",
    endpoints: [
      "GET /api/health",
      "GET /api/tasks",
      "POST /api/tasks",
      "PUT /api/tasks/:id",
      "DELETE /api/tasks/:id"
    ],
  });
});

// Routes
app.use("/api/tasks", taskRoutes);

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

// Start server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
