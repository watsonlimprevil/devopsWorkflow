import { useEffect, useState } from "react";

function SubtasksModal({ taskId, onClose }) {
  const [subtasks, setSubtasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchSubtasks = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/subtasks/${taskId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setSubtasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch subtasks", err);
      }
    };
    fetchSubtasks();
  }, [taskId]);

  const handleAddSubtask = async () => {
    if (!title.trim()) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/subtasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ taskId, title }),
      });
      const data = await res.json();
      setSubtasks((prev) => [...prev, data]);
      setTitle("");
    } catch (err) {
      console.error("Failed to add subtask", err);
    }
  };

  const handleToggleCompleted = async (subtask, checked) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/subtasks/${subtask.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ completed: checked }),
        }
      );
      const updated = await res.json();
      setSubtasks((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    } catch (err) {
      console.error("Failed to toggle subtask", err);
    }
  };

  const handleDeleteSubtask = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/subtasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setSubtasks((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete subtask", err);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#1e1e1e",
          padding: "20px",
          borderRadius: "10px",
          width: "400px",
          maxHeight: "70vh",
          overflowY: "auto",
          color: "white",
        }}
      >
        <h2>Subtasks</h2>

        {subtasks.length === 0 && <p>No subtasks yet.</p>}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {subtasks.map((subtask) => (
            <li
              key={subtask.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={!!subtask.completed}
                  onChange={(e) =>
                    handleToggleCompleted(subtask, e.target.checked)
                  }
                />
                <span
                  style={{
                    textDecoration: subtask.completed ? "line-through" : "none",
                    opacity: subtask.completed ? 0.6 : 1,
                  }}
                >
                  {subtask.title}
                </span>
              </div>
              <button
                onClick={() => handleDeleteSubtask(subtask.id)}
                style={{
                  background: "#ff4d4d",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New subtask..."
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "8px",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "#2e2e2e",
              color: "white",
            }}
          />
          <button
            onClick={handleAddSubtask}
            style={{
              width: "100%",
              padding: "8px",
              background: "#4caf50",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              color: "white",
            }}
          >
            Add Subtask
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: "12px",
            width: "100%",
            padding: "8px",
            background: "#555",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            color: "white",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default SubtasksModal;
