// server/controllers/taskController.js
// Controller functions for Task CRUD operations

const mongoose = require("mongoose");
const Task = require("../models/Task");

// Helper: validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// POST /api/tasks - Create a new task
async function createTask(req, res, next) {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    if (!title || !title.trim()) {
      res.status(400);
      throw new Error("Title is required");
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim?.() || "",
      status: status || "pending",
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

// GET /api/tasks - Get all tasks (with optional filtering & search)
async function getTasks(req, res, next) {
  try {
    const { status, search, sort } = req.query;

    const filter = {};
    if (status && ["pending", "completed"].includes(status)) {
      filter.status = status;
    }

    if (search && String(search).trim()) {
      const q = String(search).trim();
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    // Sorting options: createdAt (default desc), dueDate asc, priority
    let sortOption = { createdAt: -1 };
    if (sort === "dueDate") sortOption = { dueDate: 1, createdAt: -1 };
    if (sort === "priority") sortOption = { priority: 1, createdAt: -1 };

    const tasks = await Task.find(filter).sort(sortOption);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

// PUT /api/tasks/:id - Update a task
async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      res.status(400);
      throw new Error("Invalid task id");
    }

    const allowed = ["title", "description", "status", "priority", "dueDate"];
    const update = {};
    for (const key of allowed) {
      if (key in req.body) update[key] = req.body[key];
    }

    if (typeof update.title === "string") update.title = update.title.trim();
    if (typeof update.description === "string") update.description = update.description.trim();
    if (update.dueDate) update.dueDate = new Date(update.dueDate);

    const task = await Task.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/tasks/:id - Delete a task
async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      res.status(400);
      throw new Error("Invalid task id");
    }

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    res.json({ message: "Task deleted", id: task._id });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
