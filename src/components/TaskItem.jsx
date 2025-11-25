import { format } from "date-fns";

function TaskItem({ task, onToggleStatus, onEdit, onDelete }) {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== "completed";

  return (
    <article className={`task-item ${task.status === "completed" ? "task-item--completed" : ""}`}>
      <header className="task-item__header">
        <div>
          <button
            type="button"
            className="task-item__status"
            onClick={() => onToggleStatus(task)}
            aria-label={
              task.status === "completed" ? "Mark as pending" : "Mark as completed"
            }
          >
            {task.status === "completed" ? "✔" : "○"}
          </button>
        </div>
        <div className="task-item__title">
          <h3>{task.title}</h3>
          {task.description && <p>{task.description}</p>}
        </div>
        <div className="task-item__actions">
          <button type="button" className="btn btn--ghost" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--danger"
            onClick={() => onDelete(task._id)}
          >
            Delete
          </button>
        </div>
      </header>

      <footer className="task-item__meta">
        <span className={`badge badge--${task.priority}`}>{task.priority}</span>
        {dueDate && (
          <span className={`badge ${isOverdue ? "badge--danger" : "badge--neutral"}`}>
            Due {format(dueDate, "PPP")}
          </span>
        )}
        <span className="badge badge--neutral">
          {task.status === "completed" ? "Completed" : "Pending"}
        </span>
      </footer>
    </article>
  );
}

export default TaskItem;
