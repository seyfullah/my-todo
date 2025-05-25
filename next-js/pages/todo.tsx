import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';

const API_BASE = 'https://potential-garbanzo-pgpx9v55rrc644v-5226.app.github.dev/api/todo';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  // Fetch todos from selected API on mount
  useEffect(() => {
    fetch(API_BASE)
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim() !== '') {
      fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input, completed: false }),
      })
        .then(res => res.json())
        .then(newTodo => {
          setTodos([...todos, { ...newTodo, id: Date.now() }]);
          setInput('');
        });
    }
  }, [input, todos]);

  const removeTodo = useCallback((id: number) => {
    fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setTodos(todos.filter(todo => todo.id !== id));
    });
  }, [todos]);

  // Optional: Remove or adjust this block if you don't want to redirect on error
  // useEffect(() => {
  //   fetch(`${API_BASE}?_limit=1`)
  //     .then(res => {
  //       if (!res.ok) throw new Error("Not found");
  //       return res.json();
  //     })
  //     .catch(() => setError(true));
  // }, []);

  // useEffect(() => {
  //   if (error) {
  //     window.location.href = "/todo.html";
  //   }
  // }, [error]);

  // if (error) return null;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Todo List</title>
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
        <form
          onSubmit={addTodo}
          style={{ display: 'flex', gap: 8, flexDirection: 'row', marginBottom: 16 }}
        >
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
            type="submit"
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
        </form>
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

