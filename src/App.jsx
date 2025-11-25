import { useEffect, useMemo, useState, useCallback } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FilterBar from "./components/FilterBar";
import { getTasks, createTask, updateTask, deleteTask } from "./services/taskApi";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({ status: "all", search: "" });

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        filters.status === "all" || task.status === filters.status;
      const matchesSearch = task.title
        .toLowerCase()
        .includes(filters.search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [tasks, filters]);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleSubmitTask = async (taskData) => {
    try {
      setError("");
      if (selectedTask) {
        const updated = await updateTask(selectedTask._id, taskData);
        setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        setSelectedTask(null);
      } else {
        const created = await createTask(taskData);
        setTasks((prev) => [created, ...prev]);
      }
    } catch (err) {
      setError(err.message || "Failed to save task.");
    }
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    try {
      const updated = await updateTask(task._id, { status: nextStatus });
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      setError(err.message || "Failed to update task status.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      setError(err.message || "Failed to delete task.");
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
  };

  const handleCancelEdit = () => {
    setSelectedTask(null);
  };

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>Task Manager</h1>
        <p>Track progress, manage priorities, and stay organized.</p>
      </header>
      <main className="app__content">
        <section className="app__panel">
          <TaskForm
            key={selectedTask ? selectedTask._id : "new-task"}
            onSubmit={handleSubmitTask}
            onCancel={handleCancelEdit}
            initialData={selectedTask}
          />
        </section>
        <section className="app__panel">
          <FilterBar filters={filters} onChange={handleFiltersChange} />
          {error && <div className="alert alert--error">{error}</div>}
          {loading ? (
            <div className="state state--loading">Loading tasks…</div>
          ) : filteredTasks.length === 0 ? (
            <div className="state">No tasks match your filters.</div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              onToggleStatus={handleToggleStatus}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
