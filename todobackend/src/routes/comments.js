import { pool } from "../db.js";
import express from 'express';
import requireAuth from "../Middleware/Authe.js";

const router = express.Router();

router.get('/:taskId'  , async(req,res)=>{
    const { taskId} = req.params;
    try{
        const result = await pool.query(
            `SELECT * FROM comments WHERE task_id = $1 ORDER BY created_at ASC`
       , [taskId] );

       res.json(result.rows)
    }catch(error){
        console.error(error);
        res.status(500).json({error : 'Failed to fetch comments'})
    }
    
})

router.post('/' , async(req,res)=>{
    const { task_id , content , author } = req.body;

    if(!task_id || !content){
        return res.status(400).json({error : 'task_id and content required'})
    }
    try{
        const result = await pool.query(
            `INSERT INTO comments (task_id , content , author) 
            VALUES($1 , $2 , $3)
            RETURNING *
            `
        ,[task_id , content , author || 'Anonymous'])

        res.status(201).json(result.rows[0]);
    }catch(error){
        console.error(error);
        res.status(500).json({error : 'Failed toe add comment'})
    }
})

router.delete('/:id' , requireAuth , async(req,res) =>{
    const { id } = req.params;

    try{
        await pool.query(`DELETE FROM comments WHERE id = $1`,[id])
        res.status(204).end()
    }catch(error){
    console.error(error);
    res.status(500).json({error : 'Failed to delete comment'})
}
})
export default router