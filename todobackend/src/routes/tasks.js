import express from 'express';
import requireAuth from '../Middleware/Authe.js';

import { pool } from '../db.js';
const router = express.Router();

// Create task
router.post('/:listId', requireAuth, async (req, res) => {
  const { title, description, priority, due_date , completed = false } = req.body;
  const { listId } = req.params;

  try {
    // Determine the next position inside this list
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM tasks WHERE list_id = $1',
      [listId]
    );
    const position = parseInt(countResult.rows[0].count, 10);

    // Insert into your existing tasks table
    const insertResult = await pool.query(
      `INSERT INTO tasks (list_id, title, description, priority, due_date, position, completed)
       VALUES ($1, $2, $3, $4, $5, $6 , $7)
       RETURNING *`,
      [listId, title, description, priority, due_date, position , completed]
    );

    res.json(insertResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Get tasks for list
router.get('/:listId', requireAuth, async (req, res) => {
  const { listId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM tasks
       WHERE list_id = $1
       ORDER BY position ASC`,
      [listId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});


// Move task (drag & drop)
router.patch('/:taskId/move', requireAuth, async (req, res) => {
  const { taskId } = req.params;
  const { toListId, position } = req.body;

  try {
    const updateResult = await pool.query(
      `UPDATE tasks
       SET list_id = $1, position = $2
       WHERE id = $3
       RETURNING *`,
      [toListId, position, taskId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

router.patch('/:taskId', requireAuth , async(req,res)=>{
    const { taskId } = req.params;
    let { title , description , priority , due_date , completed } = req.body;

    // ⭐ Force boolean conversion
    completed = completed === true || completed === 'true';

    try{
        const result = await pool.query(
            `UPDATE tasks 
            SET title = $1, 
             description = $2,
             priority = $3,
             due_date = $4,
             completed = $5
             WHERE id = $6
             RETURNING *`,
            [title , description , priority , due_date , completed, taskId]
        );
        res.json(result.rows[0])
    }catch(error){
        console.error(error);
        res.status(500).json({error : 'server error'})
    }
})

router.delete('/:taskId' , requireAuth , async(req,res) =>{
    const { taskId } = req.params;

    try{
        await pool.query(
            `DELETE FROM tasks WHERE id = $1`
        ,[taskId]);

        res.json({ success :true})
    }catch(error){
        console.error(error);
        res.status(500).json({error : 'server error'})
    }
})
export default router;

