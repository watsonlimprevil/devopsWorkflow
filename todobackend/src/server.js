import express from 'express' ;
import dotenv from 'dotenv';
import cors from 'cors';
import boardRoutes from './routes/boards.js';
import listRoutes from './routes/lists.js';
import taskRoutes from './routes/tasks.js'
import authRoutes from './Authentication/Auth.js'
import commentRoutes from './routes/comments.js'
import subtaskRoutes from './routes/subtasks.js'
import activityRoutes from './routes/activity.js'

dotenv.config();
import assistantRoutes from './routes/assistant.js'


const app =  express()


app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      "http://localhost:5173",
      /\.vercel\.app$/
    ];

    if (!origin) return callback(null, true);

    const isAllowed = allowed.some(rule => {
      if (rule instanceof RegExp) return rule.test(origin);
      return rule === origin;
    });

    // ⭐ SAFE — does NOT crash Railway
    callback(null, isAllowed);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));





app.use(express.json());
app.use('/auth', authRoutes);
app.use('/boards', boardRoutes);
app.use('/lists', listRoutes);
app.use('/tasks', taskRoutes);
app.use('/comments' , commentRoutes)
app.use('/subtasks', subtaskRoutes)
app.use('/activity' , activityRoutes)
app.use('/assistant' , assistantRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
