import express from 'express';
import { pool } from '../db.js';
import requireAuth from '../Middleware/Authe.js';

const router = express.Router();

router.post('/:boardIn' , requireAuth , async(req,res)=>{
    const { title , position } = req.body;
    const { boardIn } = req.params;

    try{
        const result = await pool.query(
        `INSERT INTO lists (board_id , title , position)
         VALUES ($1 , $2 , $3)
         RETURNING *`
        ,[boardIn , title , position])

        res.json(result.rows[0])
    }catch(error){
        res.status(500).json({error : 'server error'})
    }
})


router.get('/:boardIn' , requireAuth , async(req,res)=>{
    const { boardIn } = req.params;

    try{
        const result = await pool.query(
        `SELECT * FROM lists WHERE board_id = $1 ORDER BY position 
         ASC`
        ,[boardIn])

        res.json(result.rows)
    }catch(error){
        res.status(500).json({error : 'server error'})
    }
})

router.patch('/:listId' , requireAuth , async(req,res)=>{
    const {listId} = req.params;
    const { title } = req.body;

    try{
        const result = await pool.query(
            `UPDATE lists SET title = $1 WHERE id = $2 RETURNING *`
        ,[title , listId]);

        res.json(result.rows[0]);
    }catch(error){
        console.error(error);
        res.status(500).json({error : 'server error'})
    }
})


router.delete('/:listId', requireAuth, async (req, res) => {
  const { listId } = req.params;

  try {
    // 1. Delete tasks belonging to this list
    await pool.query(`DELETE FROM tasks WHERE list_id = $1`, [listId]);

    // 2. Delete the list itself
    await pool.query(`DELETE FROM lists WHERE id = $1`, [listId]);
    console.log('list to delete', listId)
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'server error' });
  }
});


export default router;