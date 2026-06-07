import { useEffect, useState, useCallback } from 'react';

function App() {
    const apiUrl = process.env.REACT_APP_API_URL || '';
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [error, setError] = useState(null);

    const loadTodos = useCallback(async () => {
        try {
            const response = await fetch(`${apiUrl}/api/todos`);
            const data = await response.json();
            setTodos(data);
        } catch (err) {
            setError('Unable to load todos');
        }
    }, [apiUrl]);

    useEffect(() => {
        loadTodos();
    }, [loadTodos]);

    const handleAdd = async (event) => {
        event.preventDefault();
        if (!title.trim()) return;

        try {
            const response = await fetch(`${apiUrl}/api/todos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }),
            });
            const newTodo = await response.json();
            if (response.ok) {
                setTodos([newTodo, ...todos]);
                setTitle('');
            } else {
                setError(newTodo.error || 'Unable to add todo');
            }
        } catch (err) {
            setError('Unable to add todo');
        }
    };

    const toggleTodo = async (todoId, completed) => {
        try {
            const response = await fetch(`${apiUrl}/api/todos/${todoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !completed }),
            });
            const updatedTodo = await response.json();
            if (response.ok) {
                setTodos(todos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo)));
            }
        } catch (err) {
            setError('Unable to update todo');
        }
    };

    const deleteTodo = async (todoId) => {
        try {
            const response = await fetch(`${apiUrl}/api/todos/${todoId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setTodos(todos.filter((todo) => todo._id !== todoId));
            }
        } catch (err) {
            setError('Unable to delete todo');
        }
    };

    return (
        <div className="app-shell">
            <div className="card">
                <h1>MERN Azure Todo App</h1>
                <form onSubmit={handleAdd} className="todo-form">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Add a new todo"
                    />
                    <button type="submit">Add</button>
                </form>

                {error && <div className="error">{error}</div>}

                <ul className="todo-list">
                    {todos.map((todo) => (
                        <li key={todo._id} className={todo.completed ? 'todo-item completed' : 'todo-item'}>
                            <span onClick={() => toggleTodo(todo._id, todo.completed)}>
                                {todo.title}
                            </span>
                            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
