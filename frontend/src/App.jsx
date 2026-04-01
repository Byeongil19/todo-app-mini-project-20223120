import { useState, useEffect } from 'react';
import axios from 'axios';

const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #ffffff;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .todo-card {
    background: #1a1a2e;
    border-radius: 16px;
    padding: 32px 28px 28px;
    width: 400px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2);
  }

  .todo-title {
    font-family: 'Space Mono', monospace;
    color: #ffffff;
    font-size: 22px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 20px;
    letter-spacing: 0.5px;
  }

  .date-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
  }

  .date-label {
    color: #c0b8f8;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .date-input {
    background: #2a2a42;
    border: 1px solid #3a3a55;
    border-radius: 8px;
    padding: 7px 12px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: #ffffff;
    outline: none;
    cursor: pointer;
    flex: 1;
    transition: border-color 0.2s;
    color-scheme: dark;
  }

  .date-input:focus { border-color: #7c6af7; }

  .input-row {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
  }

  .todo-input {
    flex: 1;
    background: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #1a1a2e;
    outline: none;
    transition: box-shadow 0.2s;
  }

  .todo-input:focus { box-shadow: 0 0 0 2px #7c6af7; }
  .todo-input::placeholder { color: #aaa; }

  .add-btn {
    background: #7c6af7;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
  }

  .add-btn:hover { background: #6857e6; }
  .add-btn:active { transform: scale(0.96); }

  .section-label {
    font-family: 'Space Mono', monospace;
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
    text-align: center;
    padding: 10px 0 12px;
    border-top: 1px solid #2e2e4a;
    border-bottom: 1px solid #2e2e4a;
    margin-bottom: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .todo-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-height: 80px;
    max-height: 260px;
    overflow-y: auto;
    padding-right: 2px;
    margin-bottom: 14px;
  }

  .todo-list::-webkit-scrollbar { width: 4px; }
  .todo-list::-webkit-scrollbar-track { background: transparent; }
  .todo-list::-webkit-scrollbar-thumb { background: #3a3a55; border-radius: 4px; }

  .todo-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    background: #22223a;
    border-radius: 10px;
    border: 1px solid #2e2e4a;
    transition: border-color 0.2s;
    animation: slideIn 0.2s ease;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-5px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .todo-item:hover { border-color: #7c6af7; }
  .todo-item.completed { opacity: 0.6; }

  .custom-checkbox {
    width: 17px;
    height: 17px;
    min-width: 17px;
    border-radius: 4px;
    border: 2px solid #7c6af7;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }

  .custom-checkbox.checked { background: #7c6af7; }

  .custom-checkbox.checked::after {
    content: '';
    width: 4px;
    height: 8px;
    border: 2px solid white;
    border-top: none;
    border-left: none;
    transform: rotate(45deg) translateY(-1px);
    display: block;
  }

  .todo-text {
    flex: 1;
    font-size: 14px;
    color: #e0deff;
    font-weight: 500;
  }

  .todo-text.done {
    text-decoration: line-through;
    color: #6a6a8a;
    font-style: italic;
  }

  .action-btns {
    display: flex;
    gap: 4px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .todo-item:hover .action-btns { opacity: 1; }

  .action-btn {
    background: none;
    border: none;
    font-size: 11px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    padding: 3px 8px;
    border-radius: 5px;
    transition: background 0.15s;
  }

  .delete-btn { color: #f87171; }
  .delete-btn:hover { background: rgba(248,113,113,0.12); }

  .edit-btn { color: #7c6af7; }
  .edit-btn:hover { background: rgba(124,106,247,0.12); }

  .empty-msg {
    text-align: center;
    color: #ffffff;
    font-size: 13px;
    padding: 24px 0;
    font-style: italic;
  }

  .progress-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }

  .progress-bar-wrap {
    flex: 1;
    background: #2a2a42;
    border-radius: 4px;
    height: 6px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #7c6af7, #a78bfa);
    border-radius: 4px;
    transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
  }

  .progress-pct {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    color: #a78bfa;
    min-width: 36px;
    text-align: right;
  }

  .stats-row {
    display: flex;
    justify-content: center;
    gap: 6px;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    color: #9090b8;
    padding-top: 12px;
    border-top: 1px solid #2e2e4a;
  }

  .stats-row span { color: #c0b8f8; font-weight: 700; }

  .edit-input {
    flex: 1;
    background: #2a2a42;
    border: 1px solid #7c6af7;
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: #e0deff;
    outline: none;
  }
`;

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get('https://todo-app-mini-project-20223120.vercel.app/api/todos');
      setTodos(res.data);
    } catch (err) { console.error("불러오기 실패:", err); }
  };

  const addTodo = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post('https://todo-app-mini-project-20223120.vercel.app/api/todos', { title: input, date: selectedDate });
      setTodos([...todos, res.data]);
      setInput('');
    } catch (err) { console.error("추가 실패:", err); }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/todos/${id}`, { completed: !completed });
      setTodos(todos.map(t => (t._id === id ? res.data : t)));
    } catch (err) { console.error("수정 실패:", err); }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) { console.error("삭제 실패:", err); }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.title);
  };

  const submitEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const res = await axios.put(`http://localhost:5000/api/todos/${id}`, { title: editText });
      setTodos(todos.map(t => (t._id === id ? res.data : t)));
      setEditingId(null);
    } catch (err) { console.error("수정 실패:", err); }
  };

  const filteredTodos = todos.filter(t => t.date === selectedDate);
  const completedCount = filteredTodos.filter(t => t.completed).length;
  const uncompletedCount = filteredTodos.length - completedCount;
  const progress = filteredTodos.length === 0 ? 0 : Math.round((completedCount / filteredTodos.length) * 100);

  return (
    <>
      <style>{fontStyles}</style>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff', padding: '24px' }}>
        <div className="todo-card">

          <h1 className="todo-title">To Do List</h1>

          {/* 날짜 선택 */}
          <div className="date-row">
            <span className="date-label">📅 날짜</span>
            <input
              type="date"
              className="date-input"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
            />
          </div>

          {/* 입력창 */}
          <div className="input-row">
            <input
              className="todo-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addTodo()}
              placeholder="할 일 입력..."
            />
            <button className="add-btn" onClick={addTodo}>Add</button>
          </div>

          <div className="section-label">Task List</div>

          <ul className="todo-list">
            {filteredTodos.length === 0 ? (
              <li className="empty-msg">등록된 할 일이 없습니다 ☕</li>
            ) : (
              filteredTodos.map(todo => (
                <li key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <div
                    className={`custom-checkbox ${todo.completed ? 'checked' : ''}`}
                    onClick={() => toggleTodo(todo._id, todo.completed)}
                  />
                  {editingId === todo._id ? (
                    <input
                      className="edit-input"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && submitEdit(todo._id)}
                      onBlur={() => submitEdit(todo._id)}
                      autoFocus
                    />
                  ) : (
                    <span className={`todo-text ${todo.completed ? 'done' : ''}`}>{todo.title}</span>
                  )}
                  <div className="action-btns">
                    <button className="action-btn delete-btn" onClick={() => deleteTodo(todo._id)}>Delete</button>
                    <button className="action-btn edit-btn" onClick={() => startEdit(todo)}>Edit</button>
                  </div>
                </li>
              ))
            )}
          </ul>

          {/* 진행바 + 퍼센트 */}
          <div className="progress-row">
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="progress-pct">{progress}%</span>
          </div>

          {/* 통계 */}
          <div className="stats-row">
            Completed: <span>{completedCount}</span>&nbsp;&nbsp;|&nbsp;&nbsp;Uncompleted: <span>{uncompletedCount}</span>
          </div>

        </div>
      </div>
    </>
  );
}

export default App;