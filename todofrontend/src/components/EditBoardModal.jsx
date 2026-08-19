import { useState } from "react";

export default function EditBoardModal({ board, onClose, onSave }) {
  const [title, setTitle] = useState(board.title);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Board</h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="modal-input"
        />

        <div className="modal-buttons">
          <button
            className="save-btn"
            onClick={() => onSave(board.id, title)}
          >
            Save
          </button>

          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
