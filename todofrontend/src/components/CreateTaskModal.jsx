export default function CreateTaskModal({
  taskTitle,
  setTaskTitle,
  onCreate,
  onClose
}) {
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
    >
      <div
        style={{
          background: "#1e1e1e",
          padding: "20px",
          borderRadius: "8px",
          width: "300px"
        }}
      >
        <h2>Create Task</h2>

        <input
          type="text"
          placeholder="Task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          style={{ width: "100%", padding: "10px", marginTop: "10px" }}
        />

        <button
          onClick={onCreate}
          style={{
            marginTop: "15px",
            padding: "10px",
            width: "100%",
            background: "#673ab7",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Create
        </button>

        <button
          onClick={onClose}
          style={{
            padding: "8px 12px",
            background: "#b71c1c",
            border: "none",
            cursor: "pointer",
            color: "white",
            marginTop: "10px"
          }}
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  );
}
