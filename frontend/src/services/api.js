const API_URL = "http://localhost:8080";

export async function getTasks() {
    const response = await fetch(`${API_URL}/tasks`);

    if (!response.ok) {
        throw new Error("Erro ao buscar tarefas");
    }

    return response.json();
}

export async function createTask(task) {
    const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        throw new Error("Erro ao criar tarefa");
    }

    return response.json();
}

export async function updateTask(id, task) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        throw new Error("Erro ao atualizar tarefa");
    }

    return response.json();
}

export async function deleteTask(id) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE"
    });

    if (!response.ok && response.status !== 204) {
        throw new Error("Erro ao excluir tarefa");
    }
}