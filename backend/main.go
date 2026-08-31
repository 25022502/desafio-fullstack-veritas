package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/tasks", tasksHandler)
	mux.HandleFunc("/tasks/", taskByIDHandler)

	handler := corsMiddleware(mux)

	fmt.Println("Servidor rodando em http://localhost:8080")

	log.Fatal(http.ListenAndServe(":8080", handler))
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func tasksHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getTasks(w, r)

	case http.MethodPost:
		createTask(w, r)

	default:
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
	}
}

func taskByIDHandler(w http.ResponseWriter, r *http.Request) {
	if !strings.HasPrefix(r.URL.Path, "/tasks/") {
		http.NotFound(w, r)
		return
	}

	switch r.Method {
	case http.MethodPut:
		updateTask(w, r)

	case http.MethodDelete:
		deleteTask(w, r)

	default:
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
	}
}

