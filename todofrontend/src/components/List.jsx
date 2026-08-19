import { Droppable } from "@hello-pangea/dnd";
import Task from "./Task";

export default function List({
  list,
  onRename,
  onDelete,
  onAddTask,
  showRenameListModal,
  TitleToEdit,
  setTitleToEdit,
  handleRenameList,
  renameListId
}) {
  return (
    <Droppable droppableId={String(list.id)} key={list.id}>
      {(provided) => (
        <div
          className="list-container"
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            background: "#1e1e1e",
            padding: "20px",
            borderRadius: "8px",
            width: "250px",
            minHeight: "100px",
          }}
        >
          <h3>{list.title}</h3>

         <button
        onClick={() => onRename(list.id)}
        style={{
          padding: "6px 12px",
         background: "rgba(255,255,255,0.12)",
         backdropFilter: "blur(4px)",
         border: "1px solid rgba(255,255,255,0.2)",
         borderRadius: "6px",
          color: "white",
          cursor: "pointer",
         fontSize: "14px",
           marginTop: "8px",
          transition: "all 0.2s ease"
           }}
           >
           ✏ Rename
          </button>


          <button
            onClick={() => onDelete(list.id)}
            style={{
              background: "#b71c1c",
              border: "none",
              padding: "6px 10px",
              borderRadius: "6px",
              cursor: "pointer",
              color: "white",
              marginLeft: "10px",
            }}
          >
            Delete List 🗑️
          </button>

          {showRenameListModal && renameListId === list.id && (
  <div
    style={{
      background: "#1e1e1e",
      padding: "20px",
      borderRadius: "8px",
      marginTop: "10px"
    }}
  >
    <input
      value={TitleToEdit}
      onChange={(e) => setTitleToEdit(e.target.value)}
      placeholder="enter new name..."
      style={{
        width: "100%",
        padding: "8px",
        marginBottom: "10px",
        borderRadius: "6px",
        border: "none",
        background: "#2e2e2e",
        color: "white"
      }}
    />

    <div style={{ display: "flex", gap: "10px" }}>
      <button
        onClick={handleRenameList}
        style={{
          padding: "8px 12px",
          background: "#4caf50",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          color: "white",
          flex: 1
        }}
      >
        Save
      </button>

      <button
        onClick={() => {
          setShowRenameListModal(false);
          setTitleToEdit("");
        }}
        style={{
          padding: "8px 12px",
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
)}


          {list.tasks?.map((task, index) => (
            <Task key={task.id} task={task} index={index} listId={list.id} />
          ))}

          {provided.placeholder}

          <button
            onClick={() => onAddTask(list.id)}
            style={{
              marginTop: "10px",
              padding: "8px",
              width: "100%",
              background: "#673ab7",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            + Add Task
          </button>
        </div>
      )}
    </Droppable>
  );
}
