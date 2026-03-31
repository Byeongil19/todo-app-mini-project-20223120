import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  // 목록 가져오기
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/todos');
      setTodos(res.data);
    } catch (err) {
      console.error("불러오기 실패:", err);
    }
  };

  // 할 일 추가
  const addTodo = async () => {
    if (!input) return;
    try {
      const res = await axios.post('http://localhost:5000/api/todos', { title: input });
      setTodos([...todos, res.data]);
      setInput('');
    } catch (err) {
      console.error("추가 실패:", err);
    }
  };

  // 체크박스 변경
  const toggleTodo = async (id, completed) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/todos/${id}`, { completed: !completed });
      setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
    } catch (err) {
      console.error("수정 실패:", err);
    }
  };

  // 삭제
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">창원대 Todo 리스트</h1>
      
      <div className="flex gap-2 mb-6">
        <input 
          className="border p-2 rounded w-64 shadow-sm text-black"
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일을 입력하세요"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold" onClick={addTodo}>추가</button>
      </div>

      <ul className="w-full max-w-md">
        {todos.map(todo => (
          <li key={todo._id} className="bg-white p-4 mb-2 rounded shadow flex justify-between items-center text-black">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                className="w-5 h-5 cursor-pointer"
                checked={todo.completed} 
                onChange={() => toggleTodo(todo._id, todo.completed)}
              />
              <span className={todo.completed ? "line-through text-gray-400" : "font-medium"}>{todo.title}</span>
            </div>
            <button className="text-red-500 hover:text-red-700 font-bold" onClick={() => deleteTodo(todo._id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;