package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

type Todo struct {
	ID        int64  `json:"id"`
	Title     string `json:"title"`
	Completed bool   `json:"completed"`
}

var db *sql.DB

func initDB() {
	var err error
	db, err = sql.Open("sqlite3", "./todos.db")
	if err != nil {
		log.Fatal(err)
	}
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL
    )`)
	if err != nil {
		log.Fatal(err)
	}

	// Insert initial records if table is empty
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM todos").Scan(&count)
	if err != nil {
		log.Fatal(err)
	}
	if count == 0 {
		_, err = db.Exec(`
            INSERT INTO todos (title, completed) VALUES
            ('Learn Go', 0),
            ('Build a Todo API', 0),
            ('Test with HTTP client', 0)
        `)
		if err != nil {
			log.Fatal(err)
		}
	}
}

func getTodos(w http.ResponseWriter) {
	rows, err := db.Query("SELECT id, title, completed FROM todos")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var todos []Todo
	for rows.Next() {
		var t Todo
		var completed int
		if err := rows.Scan(&t.ID, &t.Title, &completed); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		t.Completed = completed != 0
		todos = append(todos, t)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todos)
}

func getTodoByID(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Path[len("/api/todo/"):]
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}
	var t Todo
	var completed int
	err = db.QueryRow("SELECT id, title, completed FROM todos WHERE id = ?", id).Scan(&t.ID, &t.Title, &completed)
	if err == sql.ErrNoRows {
		http.NotFound(w, r)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	t.Completed = completed != 0
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(t)
}

func addTodo(w http.ResponseWriter, r *http.Request) {
	var todo Todo
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	res, err := db.Exec("INSERT INTO todos (title, completed) VALUES (?, ?)", todo.Title, todo.Completed)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	id, _ := res.LastInsertId()
	todo.ID = id
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(todo)
}

func deleteTodo(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Path[len("/api/todo/"):]
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}
	res, err := db.Exec("DELETE FROM todos WHERE id = ?", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	affected, _ := res.RowsAffected()
	if affected == 0 {
		http.NotFound(w, r)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func main() {
	initDB()
	http.HandleFunc("/api/todo", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			getTodos(w)
		case http.MethodPost:
			addTodo(w, r)
		default:
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/api/todo/", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			getTodoByID(w, r)
		case http.MethodDelete:
			deleteTodo(w, r)
		default:
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		}
	})

	log.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
