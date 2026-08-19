import jwt from 'jsonwebtoken';
import express from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../db.js';

const router = express.Router();

router.post('/signup' , async(req,res)=> {
    const { email , password} = req.body;

    if(!email || !password){
        return res.status(400).json({error : 'email and password must be set'})
    }

    try{
        const existing = await pool.query(
            `SELECT * from users where email =$1`
        ,[email]);

        if(existing.rows.length > 0){
            return res.status(400).json({error :'email is already in use'})
        }

        const hashed = await bcrypt.hash(password , 10)

        const data = await pool.query(
        `INSERT into users(email , password_hash) Values($1 , $2) RETURNING *`
        ,[email , hashed]);

        const user = data.rows[0];

        const token = jwt.sign(
            {userId : user.id , email : user.email},
            process.env.JWT_SECRET ,
            {expiresIn: '7d'}
        )

        res.json({token , user})
    }catch(error){
        res.status(500).json({error : 'server error'})
    }
})


router.post('/login' , async(req,res) =>{
    const { email , password } = req.body;

    if(!email || !password){
        return res.status(400).json({error : 'email and password must be set'})
    };

    try{
        const data = await pool.query(
            `SELECT * from users where email = $1`
        ,[email]);

        if(data.rows.length === 0){
            return res.status(400).json({error : 'invalid credentials'})
        };
        const user = data.rows[0];

        const matched = await bcrypt.compare(password , user.password_hash);

        if(!matched){
            return res.status(400).json({error : 'invalid credentials'})
        }

        const token = jwt.sign(
            {userId : user.id , email: user.email} ,
            process.env.JWT_SECRET ,
            {expiresIn : '7d'}
        );

        res.json({token , user})
    }catch(error){
        res.status(500).json({error : 'server error'})
    }
})

export default router