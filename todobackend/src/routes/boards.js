import express from 'express';
import { pool } from '../db.js';
import requireAuth from '../Middleware/Authe.js';

const router = express.Router();

/* -------------------- CREATE BOARD -------------------- */
router.post('/', requireAuth, async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `INSERT INTO boards (user_id, title, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, title, description]
    );

    const board = result.rows[0];

    // Log activity
    await pool.query(
      `INSERT INTO activity (user_id, type, message)
       VALUES ($1, 'board_created', $2)`,
      [userId, `Created board: ${title}`]
    );

    res.json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'server error' });
  }
});

/* -------------------- GET ALL BOARDS -------------------- */
/* GET ALL BOARDS WITH LISTS + TASKS */
router.get('/', requireAuth, async (req, res) => {
  const userId = req.user.userId;

  const boardsResult = await pool.query(
    `SELECT * FROM boards WHERE user_id = $1 ORDER BY id ASC`,
    [userId]
  );

  const boards = boardsResult.rows;

  for (let board of boards) {
    const listsResult = await pool.query(
      `SELECT * FROM lists WHERE board_id = $1 ORDER BY position ASC`,
      [board.id]
    );

    const lists = listsResult.rows;

    // ⭐ Fetch tasks for each list
    for (let list of lists) {
      const tasksResult = await pool.query(
        `SELECT * FROM tasks WHERE list_id = $1 ORDER BY position ASC`,
        [list.id]
      );

      list.tasks = tasksResult.rows;
    }

    board.lists = lists;
  }

  res.json(boards);
});

router.patch('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `UPDATE boards SET title = $1 WHERE id = $2 RETURNING *`,
      [title, id]
    );

    const updatedBoard = result.rows[0];

    // Log activity
    await pool.query(
      `INSERT INTO activity (user_id, type, message)
       VALUES ($1, 'board_renamed', $2)`,
      [userId, `Renamed board to: ${title}`]
    );

    res.json(updatedBoard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'server error' });
  }
});

/* -------------------- GET SINGLE BOARD -------------------- */
router.get('/:boardId', requireAuth, async (req, res) => {
  const { boardId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM boards WHERE id = $1`,
      [boardId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

/* -------------------- DELETE BOARD -------------------- */
router.delete('/:boardId', requireAuth, async (req, res) => {
  const { boardId } = req.params;
  const userId = req.user.userId;

  try {
    await pool.query(`DELETE FROM boards WHERE id = $1`, [boardId]);

    // Log activity
    await pool.query(
      `INSERT INTO activity (user_id, type, message)
       VALUES ($1, 'board_deleted', $2)`,
      [userId, `Deleted board with ID: ${boardId}`]
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'server error' });
  }
});

/* -------------------- RENAME BOARD -------------------- */


/* -------------------- GET RECENT ACTIVITY -------------------- */
router.get('/activity/recent', requireAuth, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT * FROM activity
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'server error' });
  }
});

export default router;
