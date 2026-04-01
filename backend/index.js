const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// ⭐️ .env 인식 에러를 피하기 위해 여기에 주소를 직접 넣었습니다! (+srv 포함)
const MONGODB_URI = "mongodb://bbaengil:1111@ac-m79xnv4-shard-00-00.zqxxxij.mongodb.net:27017,ac-m79xnv4-shard-00-01.zqxxxij.mongodb.net:27017,ac-m79xnv4-shard-00-02.zqxxxij.mongodb.net:27017/?ssl=true&replicaSet=atlas-iinb3h-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB 연결 성공!!!'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// 할 일 스키마
const TodoSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false }
});
const Todo = mongoose.model('Todo', TodoSchema);

// API 라우터
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