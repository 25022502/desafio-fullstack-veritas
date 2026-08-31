import { useEffect, useState } from "react";
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask
} from "./services/api";

import "./App.css";

function App() {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {

        loadTasks();

    }, []);

    async function loadTasks() {

        try {

            setLoading(true);

            const data = await getTasks();

            setTasks(data);

        } catch (error) {

            setError("Não foi possível carregar as tarefas.");

        } finally {

            setLoading(false);

        }
    }

    async function handleAddTask(event) {

        event.preventDefault();

        if (!title.trim()) {
            return;
        }

        try {

            const newTask = await createTask({
                title,
                description,
                status: "todo"
            });

            setTasks([...tasks, newTask]);

            setTitle("");
            setDescription("");

        } catch (error) {

            setError("Não foi possível criar a tarefa.");

        }
    }

    async function handleDelete(id) {

        try {

            await deleteTask(id);

            setTasks(tasks.filter(task => task.id !== id));

        } catch (error) {

            setError("Não foi possível excluir a tarefa.");

        }
    }

    async function moveTask(task, newStatus) {

        try {

            const updatedTask = await updateTask(task.id, {
                ...task,
                status: newStatus
            });

            setTasks(
                tasks.map(item =>
                    item.id === task.id ? updatedTask : item
                )
            );

        } catch (error) {

            setError("Não foi possível mover a tarefa.");

        }
    }

    function renderColumn(status, title) {

        const columnTasks = tasks.filter(
            task => task.status === status
        );

        return (
            <div className="column">

                <h2>{title}</h2>

                {columnTasks.map(task => (

                    <div className="task" key={task.id}>

                        <h3>{task.title}</h3>

                        <p>{task.description}</p>

                        <div className="buttons">

                            {status !== "todo" && (
                                <button
                                    onClick={() =>
                                        moveTask(
                                            task,
                                            status === "done"
                                                ? "in_progress"
                                                : "todo"
                                        )
                                    }
                                >
                                    ←
                                </button>
                            )}

                            {status !== "done" && (
                                <button
                                    onClick={() =>
                                        moveTask(
                                            task,
                                            status === "todo"
                                                ? "in_progress"
                                                : "done"
                                        )
                                    }
                                >
                                    →
                                </button>
                            )}

                            <button
                                onClick={() =>
                                    handleDelete(task.id)
                                }
                            >
                                Excluir
                            </button>

                        </div>

                    </div>

                ))}

            </div>
        );
    }

    return (
        <div className="app">

            <h1>Mini Kanban</h1>

            <form onSubmit={handleAddTask}>

                <input
                    type="text"
                    placeholder="Título da tarefa"
                    value={title}
                    onChange={event =>
                        setTitle(event.target.value)
                    }
                />

                <input
                    type="text"
                    placeholder="Descrição"
                    value={description}
                    onChange={event =>
                        setDescription(event.target.value)
                    }
                />

                <button type="submit">
                    Adicionar tarefa
                </button>

            </form>

            {loading && (
                <p>Carregando tarefas...</p>
            )}

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            {!loading && (
                <div className="board">

                    {renderColumn("todo", "A Fazer")}

                    {renderColumn(
                        "in_progress",
                        "Em Progresso"
                    )}

                    {renderColumn(
                        "done",
                        "Concluídas"
                    )}

                </div>
            )}

        </div>
    );
}

export default App;