export default function BoardInsights({ boards }) {
  // total boards
  const totalBoards = boards.length;

  // total lists
  const totalLists = boards.reduce(
    (sum, board) => sum + (board.lists?.length || 0),
    0
  );

  // total tasks
  const totalTasks = boards.reduce((sum, board) => {
    return (
      sum +
      (board.lists?.reduce(
        (listSum, list) => listSum + (list.tasks?.length || 0),
        0
      ) || 0)
    );
  }, 0);

  // completed tasks
  const completedTasks = boards.reduce((sum, board) => {
    return (
      sum +
      (board.lists?.reduce(
        (listSum, list) =>
          listSum +
          (list.tasks?.filter((t) => t.completed).length || 0),
        0
      ) || 0)
    );
  }, 0);

  // most active board (by number of lists)
  const mostActiveBoard =
    boards.length > 0
      ? boards.reduce((max, board) =>
          (board.lists?.length || 0) > (max.lists?.length || 0)
            ? board
            : max
        )
      : null;

  return (
    <div className="insights-container">
      <div className="insight-card">
        <h3>{totalBoards}</h3>
        <p>Boards</p>
      </div>

      <div className="insight-card">
        <h3>{totalLists}</h3>
        <p>Lists</p>
      </div>

      <div className="insight-card">
        <h3>{totalTasks}</h3>
        <p>Tasks</p>
      </div>

      <div className="insight-card">
        <h3>{completedTasks}</h3>
        <p>Completed</p>
      </div>

      {mostActiveBoard && (
        <div className="insight-card">
          <h3>{mostActiveBoard.title}</h3>
          <p>Most Active Board</p>
        </div>
      )}
    </div>
  );
}
