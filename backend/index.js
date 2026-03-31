const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 환경 설정
app.use(cors());
app.use(express.json());

// ⭐️ MongoDB 연결 설정 (이 부분이 중요합니다)
const MONGODB_URI = process.env.MONGODB_URI || "본인의_실제_몽고DB_주소";

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB 연결 성공!!!')) // 이 메시지가 나와야 합니다
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// 할 일 스키마 및 모델
const TodoSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false }
});
const Todo = mongoose.model('Todo', TodoSchema);

// API 경로
app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const newTodo = new Todo({ title: req.body.title });
  await newTodo.save();
  res.json(newTodo);
});

app.delete('/api/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "삭제 성공" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다!`));