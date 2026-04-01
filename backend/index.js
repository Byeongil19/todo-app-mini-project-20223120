const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// MongoDB 연결 주소
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB 연결 성공!!!'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// 할 일 스키마 (날짜 필드 포함)
const TodoSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
  date: { type: String, required: true }
});
const Todo = mongoose.model('Todo', TodoSchema);

// --- API 라우터 시작 ---

// 모든 할 일 가져오기
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 할 일 추가
app.post('/api/todos', async (req, res) => {
  try {
    const newTodo = new Todo({ 
      title: req.body.title,
      date: req.body.date 
    });
    await newTodo.save();
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 할 일 상태 수정 (완료 체크)
app.put('/api/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 할 일 삭제
app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "삭제 성공" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- API 라우터 끝 ---

// Vercel 배포용 서버 설정
// 로컬 환경에서만 서버를 직접 켜고, Vercel(Production)에서는 서버리스 함수로 작동합니다.
if (process.env.NODE_ENV !== 'production') {
  const PORT = 5000;
  app.listen(PORT, () => console.log(`🚀 로컬 서버 실행 중: http://localhost:${PORT}`));
}

// Vercel 배포를 위한 핵심 코드 (Serverless Handler 내보내기)
module.exports = app;