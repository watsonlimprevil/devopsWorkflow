import express from 'express';
import { pool } from '../db.js';
import requireAuth from '../Middleware/Authe.js';

const router =  express.Router();

router.get('/' , requireAuth , async(req,res) => {
    const userId = req.user.userId;

    try{
        const result = await pool.query(
        `SELECT * FROM activity
        WHERE user_id = $1 
        ORDER BY created_at DESC 
         LIMIT 5`
       ,[userId] );

       res.json(result.rows)
    }catch(error){
        res.status(500).json({error : 'server error'})
    }
})

export default router
