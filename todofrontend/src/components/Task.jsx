import { Draggable } from "@hello-pangea/dnd";
import { useBoardContext } from "../pages/BoardContext";

export default function Task({ task, index, listId }) {
  const {
    setSelectedTask,
    setShowTaskDetailsModal,
    handleToggleCompleted,
    handleDeleteTask,
  } = useBoardContext();

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided) => (
        // OUTER WRAPPER — does NOT move
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            marginTop: "10px",
          }}
        >
          {/* INNER CARD — receives the transform */}
          <div
            {...provided.dragHandleProps}
            className={`task-card ${task.completed ? "completed-task" : ""}`}
            style={{
              background: "#2e2e2e",
              padding: "10px",
              borderRadius: "6px",
              cursor: "pointer",
              ...provided.draggableProps.style, // ONLY inner gets transform
            }}
          >
            {/* CLICKABLE AREA */}
            <div
              onClick={() => {
                setSelectedTask({
                  ...task,
                  due_date: task.due_date ? task.due_date.slice(0, 10) : "",
                });
                setShowTaskDetailsModal(true);
              }}
            >
              {task.title}

              {/* PRIORITY */}
              <div style={{ fontSize: "12px", marginTop: "5px" }}>
                {task.priority === "high" && (
                  <span style={{ color: "#ff4d4d" }}>🔥 High</span>
                )}
                {task.priority === "medium" && (
                  <span style={{ color: "#ffcc00" }}>⚠️ Medium</span>
                )}
                {task.priority === "low" && (
                  <span style={{ color: "#4caf50" }}>🟢 Low</span>
                )}
              </div>

              {/* DUE DATE */}
              {task.due_date && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#90caf9",
                    marginTop: "5px",
                  }}
                >
                  📆 Due: {task.due_date.slice(0, 10)}
                </div>
              )}
            </div>

            {/* NON-CLICKABLE AREA */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                checked={!!task.completed}
                onChange={(e) => {
                  e.stopPropagation();
                  handleToggleCompleted(task, e.target.checked);
                }}
              />
              <span>Mark as completed</span>

              {task.completed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task.id, listId);
                  }}
                  style={{
                    marginTop: "6px",
                    background: "#ff4d4d",
                    color: "white",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Delete Task
                </button>
              )}
            </div>

            {/* DELETE BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTask(task.id, listId);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "#ff6b6b",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "16px",
                marginLeft: "10px",
              }}
            >
              ❌
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
