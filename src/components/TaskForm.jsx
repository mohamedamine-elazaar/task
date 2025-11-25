import { useEffect, useState } from "react";

const defaultValues = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: "",
};

function TaskForm({ initialData, onSubmit, onCancel }) {
  const [formValues, setFormValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormValues({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "pending",
        priority: initialData.priority || "medium",
        dueDate: initialData.dueDate ? initialData.dueDate.slice(0, 10) : "",
      });
    } else {
      setFormValues(defaultValues);
    }
  }, [initialData]);

  const validate = () => {
    const nextErrors = {};
    if (!formValues.title.trim()) {
      nextErrors.title = "Title is required";
    }
    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    await onSubmit({
      ...formValues,
      title: formValues.title.trim(),
      description: formValues.description.trim(),
    });
    setFormValues(defaultValues);
  };

  const handleCancel = () => {
    setFormValues(defaultValues);
    setErrors({});
    onCancel?.();
  };

  const isEditing = Boolean(initialData);

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2>{isEditing ? "Edit Task" : "Create Task"}</h2>

      <div className="form-field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formValues.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
        />
        {errors.title && <p className="field-error">{errors.title}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formValues.description}
          onChange={handleChange}
          placeholder="Describe the task"
        />
      </div>

      <div className="form-field form-field--inline">
        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formValues.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formValues.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate">Due date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formValues.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn--primary">
          {isEditing ? "Update" : "Create"}
        </button>
        {isEditing && (
          <button type="button" className="btn" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
