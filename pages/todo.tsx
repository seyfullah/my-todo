import React, { useState, useEffect } from 'react';
import Head from 'next/head';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  // Fetch todos from JSONPlaceholder API on mount
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = () => {
    if (input.trim() !== '') {
      // Simulate API POST (does not persist on JSONPlaceholder)
      fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify({
          title: input,
          completed: false,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(res => res.json())
        .then(newTodo => {
          setTodos([...todos, { ...newTodo, id: Date.now() }]);
          setInput('');
        });
    }
  };

  const removeTodo = (id: number) => {
    // Simulate API DELETE (does not persist on JSONPlaceholder)
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setTodos(todos.filter(todo => todo.id !== id));
    });
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        style={{
          maxWidth: 400,
          margin: '2rem auto',
          fontFamily: 'sans-serif',
          padding: '1rem',
          boxSizing: 'border-box',
        }}
      >
        <h1 style={{ fontSize: '2rem', textAlign: 'center' }}>Todo List</h1>
        <div style={{ display: 'flex', gap: 8, flexDirection: 'row', marginBottom: 16 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Add a todo"
            style={{
              flex: 1,
              padding: 8,
              fontSize: '1rem',
              borderRadius: 4,
              border: '1px solid #ccc',
            }}
          />
          <button
            onClick={addTodo}
            style={{
              padding: '8px 16px',
              fontSize: '1rem',
              borderRadius: 4,
              border: 'none',
              background: '#0070f3',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Add
          </button>
        </div>
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                margin: '8px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f9f9f9',
                padding: '8px 12px',
                borderRadius: 4,
                opacity: todo.completed ? 0.5 : 1,
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              <span style={{ wordBreak: 'break-word', flex: 1 }}>{todo.title}</span>
              <button
                onClick={() => removeTodo(todo.id)}
                style={{
                  marginLeft: 8,
                  padding: '4px 8px',
                  fontSize: '0.9rem',
                  borderRadius: 4,
                  border: 'none',
                  background: '#e00',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}