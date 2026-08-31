package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

var tasks = []Task{
	{
		ID:          1,
		Title:       "Criar o backend",
		Description: "Desenvolver a API em Go",
		Status:      "todo",
	},
	{
		ID:          2,
		Title:       "Criar o frontend",
		Description: "Desenvolver a interface em React",
		Status:      "in_progress",
	},
}

func getTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

func createTask(w http.ResponseWriter, r *http.Request) {
	var task Task

	err := json.NewDecoder(r.Body).Decode(&task)

	if err != nil {
		http.Error(w, "Dados inválidos", http.StatusBadRequest)
		return
	}

	if task.Title == "" {
		http.Error(w, "O título é obrigatório", http.StatusBadRequest)
		return
	}

	if task.Status == "" {
		task.Status = "todo"
	}

	task.ID = len(tasks) + 1

	tasks = append(tasks, task)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(task)
}

func updateTask(w http.ResponseWriter, r *http.Request) {
	idString := r.URL.Path[len("/tasks/"):]

	var id int
	_, err := fmt.Sscanf(idString, "%d", &id)

	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var updatedTask Task

	err = json.NewDecoder(r.Body).Decode(&updatedTask)

	if err != nil {
		http.Error(w, "Dados inválidos", http.StatusBadRequest)
		return
	}

	for i, task := range tasks {
		if task.ID == id {
			if updatedTask.Title == "" {
				http.Error(w, "O título é obrigatório", http.StatusBadRequest)
				return
			}

			if updatedTask.Status != "todo" &&
				updatedTask.Status != "in_progress" &&
				updatedTask.Status != "done" {
				http.Error(w, "Status inválido", http.StatusBadRequest)
				return
			}

			updatedTask.ID = id
			tasks[i] = updatedTask

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(updatedTask)
			return
		}
	}

	http.Error(w, "Tarefa não encontrada", http.StatusNotFound)
}

func deleteTask(w http.ResponseWriter, r *http.Request) {
	idString := r.URL.Path[len("/tasks/"):]

	var id int
	_, err := fmt.Sscanf(idString, "%d", &id)

	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	for i, task := range tasks {
		if task.ID == id {
			tasks = append(tasks[:i], tasks[i+1:]...)

			w.WriteHeader(http.StatusNoContent)
			return
		}
	}

	http.Error(w, "Tarefa não encontrada", http.StatusNotFound)
}