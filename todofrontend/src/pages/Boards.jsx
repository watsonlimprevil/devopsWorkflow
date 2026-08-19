import { useEffect, useState } from 'react';
import { api } from '../Api/client';
import { useNavigate } from 'react-router-dom';
import EditBoardModal from '../components/EditBoardModal';
import BoardInsights from '../components/BoardInsights';
import RecentActivity from '../components/RecentActivity';
import { FiSettings } from 'react-icons/fi';
import { Link } from "react-router-dom";
export default function Boards() {
  const [boards, setBoards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const Navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [editingBoard, setEditingBoard] = useState(null);
  const [activity , setActivity] = useState([])
  const showInsights = JSON.parse(localStorage.getItem("showInsights") || "true");
const showActivity = JSON.parse(localStorage.getItem("showActivity") || "true");



  useEffect(() => {
    api('/boards/').then(setBoards);
  }, []);

useEffect(() => {
  const loadActivity = async () => {
    const data = await api('/activity');
    console.log("Activity:", data);
    setActivity(Array.isArray(data) ? data : []);
  };

  loadActivity();
}, []);

async function refreshBoards() {
  const updatedBoards = await api("/boards");
  setBoards(updatedBoards);
}

useEffect(() => {
  refreshBoards();
}, [location.pathname]);



  useEffect(() => {
  const handleScroll = () => {
    const offset = window.scrollY * 0.05;
    document.documentElement.style.setProperty('--parallax-offset', `${offset}px`);
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);


  async function handleCreateBoard() {
    const newBoard = await api('/boards', {
      method: 'POST',
      body: JSON.stringify({ title, description })
    });

    setBoards([...boards, newBoard]);
    setShowModal(false);
    setTitle('');
    setDescription('');
  }

  async function handleDeleteBoard(boardId) {
    await api(`/boards/${boardId}`, { method: 'DELETE' });
    setBoards(boards.filter(board => board.id !== boardId));
  }

 const handleRenameBoard = async (id, newTitle) => {
  try {
    const updated = await api(`/boards/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ title: newTitle })
    });

    setBoards(prev =>
      prev.map(b => (b.id === updated.id ? updated : b))
    );

    setEditingBoard(null);
  } catch (err) {
    console.error("Failed to rename board", err);
  }
};


  // ⭐ SEARCH LOGIC (Boards + Lists)
  const filteredBoards = boards.filter(board => {
    const term = search.toLowerCase();

    // match board title
    const matchesBoard = board.title.toLowerCase().includes(term);

    // match list titles (backend must return board.lists)
    const matchesList = board.lists?.some(list =>
      list.title.toLowerCase().includes(term)
    );

    return matchesBoard || matchesList;
  });

  return (
  <div className="board-page" style={{ padding: '20px' }}>
    <div className='boards-header'>
    <h1>Your Boards</h1>
    <Link to='/settings' className='settings-icon'>
    <FiSettings size={26} />
    </Link>
    </div>
    <button
      onClick={() => setShowModal(true)}
      style={{
        padding: '10px 20px',
        background: '#4caf50',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginBottom: '20px',
        
      }}
    >
      + New Board
    </button>

    <input
      type="text"
      placeholder="search boards or lists..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        border: 'none',
        marginTop: '20px',
        fontSize: '16px',
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(8px)',
        color: 'white'
      }}
    />

    {showModal && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex:9999
        }}
      >
        <div
          style={{
            background: '#1e1e1e',
            padding: '20px',
            borderRadius: '8px',
            width: '300px'
          }}
        >
          <h2>Create Board</h2>

          <input
            type="text"
            placeholder="Board title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '10px' }}
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '10px', marginTop: '10px' }}
          />

          <button
            onClick={handleCreateBoard}
            style={{
              marginTop: '15px',
              padding: '10px',
              width: '100%',
              background: '#4caf50',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Create
          </button>

          <button
            onClick={() => {
              setShowModal(false);
              setTitle('');
              setDescription('');
            }}
            style={{
              padding: '8px 12px',
              background: '#b71c1c',
              border: 'none',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    )}

    {/* BOARD GRID */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}
    >
      {filteredBoards.map(board => (
        <div key={board.id} className="board-card">
          <span
            onClick={() => Navigate(`/boards/${board.id}`)}
            style={{ cursor: 'pointer', fontSize: '18px' }}
          >
            {board.title}
          </span>

          <div className="board-card-actions">
            <button onClick={() => setEditingBoard(board)}>Edit</button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteBoard(board.id);
              }}
            >
              Delete
            </button>

            {editingBoard && (
              <EditBoardModal
                board={editingBoard}
                onClose={() => setEditingBoard(null)}
                onSave={handleRenameBoard}
              />
            )}
          </div>
        </div>
      ))}
    </div>

    {/* DIVIDER */}
    <div
      style={{
        width: '100%',
        height: '1px',
        background: 'rgba(255,255,255,0.15)',
        margin: '40px 0 20px',
        backdropFilter: 'blur(4px)'
      }}
    ></div>
    <div className="insights-divider"></div>
    {/* INSIGHTS AT THE BOTTOM */}
    <h2 className='insights-title'>Workspace Insights </h2>
  {showInsights && <BoardInsights boards={boards} />}
  {showActivity && <RecentActivity activity={activity} />}

  </div>
);

}
