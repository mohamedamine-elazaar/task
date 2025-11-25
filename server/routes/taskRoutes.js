// server/routes/taskRoutes.js
// Routes for Task resources

const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

// POST /api/tasks - create
router.post("/", createTask);

// GET /api/tasks - list (with filters)
router.get("/", getTasks);

// PUT /api/tasks/:id - update
router.put("/:id", updateTask);

// DELETE /api/tasks/:id - delete
router.delete("/:id", deleteTask);

module.exports = router;
