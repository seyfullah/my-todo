import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function TodoPage() {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load todos from API on mount
  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch('/api/load-todos');
      if (res.ok) {
        const data = await res.json();
        setTodos(data.todos || []);
      }
    };
    fetchTodos();
  }, []);

  // Debounced save
  const saveTodos = (newTodos: string[]) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      await fetch('/api/save-todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todos: newTodos }),
      });
    }, 500); // Save after 500ms of inactivity
  };

  const addTodo = () => {
    if (input.trim() !== '') {
      const updated = [...todos, input];
      setTodos(updated);
      saveTodos(updated);
      setInput('');
    }
  };

  const removeTodo = (index: number) => {
    const updated = todos.filter((_, i) => i !== index);
    setTodos(updated);
    saveTodos(updated);
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
          {todos.map((todo, idx) => (
            <li
              key={idx}
              style={{
                margin: '8px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f9f9f9',
                padding: '8px 12px',
                borderRadius: 4,
              }}
            >
              <span style={{ wordBreak: 'break-word', flex: 1 }}>{todo}</span>
              <button
                onClick={() => removeTodo(idx)}
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