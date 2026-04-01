const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// ⭐️ 여기에 병일 님의 실제 MongoDB 주소를 넣어주세요!
const MONGODB_URI = "mongodb://bbaengil:1111@ac-m79xnv4-shard-00-00.zqxxxij.mongodb.net:27017,ac-m79xnv4-shard-00-01.zqxxxij.mongodb.net:27017,ac-m79xnv4-shard-00-02.zqxxxij.mongodb.net:27017/?ssl=true&replicaSet=atlas-iinb3h-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB 연결 성공!!!'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// ⭐️ 할 일 스키마 수정: 'date' 필드가 추가되었습니다.
const TodoSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
  date: { type: String, required: true } // 날짜 저장용
});
const Todo = mongoose.model('Todo', TodoSchema);

// API 라우터
app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  // 프론트엔드에서 보낸 title과 date를 모두 저장합니다.
  const newTodo = new Todo({ 
    title: req.body.title,
    date: req.body.date
  });
  await newTodo.save();
  res.json(newTodo);
});

app.delete('/api/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "삭제 성공" });
});

app.put('/api/todos/:id', async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
  );
  res.json(updatedTodo);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다!`));