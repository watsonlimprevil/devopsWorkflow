import Comments from "./Comments";
import SubtasksModal from "./SubtasksModal";

export default function TaskDetailsModal({
  task,
  setTask,
  onSave,
  onClose,
  showSubtasksModal,
  setShowSubtasksModal
}) {
  if (!task) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
      }}
      onClick={onClose}   // click outside closes modal
    >
      <div
        style={{
          background: "#1e1e1e",
          padding: "20px",
          borderRadius: "8px",
          width: "350px",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}  // prevents closing when clicking inside
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "22px",
            cursor: "pointer"
          }}
        >
          ✕
        </button>

        <h2>Edit Task</h2>

        {/* TITLE */}
        <input
          type="text"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          style={{ width: "100%", padding: "10px", marginTop: "10px" }}
        />

        {/* DESCRIPTION */}
        <textarea
          value={task.description || ""}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          placeholder="Description"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            height: "100px"
          }}
        />

        {/* PRIORITY */}
        <select
          value={task.priority || "low"}
          onChange={(e) => setTask({ ...task, priority: e.target.value })}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            background: "#2e2e2e",
            color: "white",
            borderRadius: "6px"
          }}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        {/* DUE DATE */}
        <input
          type="date"
          value={task.due_date || ""}
          onChange={(e) => setTask({ ...task, due_date: e.target.value })}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            background: "#2e2e2e",
            color: "white",
            borderRadius: "6px"
          }}
        />

        {/* COMMENTS */}
        <Comments taskId={task.id} />

        {/* SUBTASKS */}
        <button
          onClick={() => setShowSubtasksModal(true)}
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "10px",
            background: "#1976d2",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            color: "white"
          }}
        >
          Manage Subtasks
        </button>

        {showSubtasksModal && (
          <SubtasksModal
            taskId={task.id}
            onClose={() => setShowSubtasksModal(false)}
          />
        )}

        {/* ACTION BUTTONS */}
        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button
            onClick={onSave}
            style={{
              padding: "10px",
              background: "#4caf50",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              flex: 1
            }}
          >
            Save
          </button>

          <button
            onClick={onClose}
            style={{
              padding: "10px",
              background: "#b71c1c",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              color: "white",
              flex: 1
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
