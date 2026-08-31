function TaskCard({ task, onEdit, onDelete }) {
  return (
    <article className="task-card">
      <h3>{task.title}</h3>

      {task.description && (
        <p>{task.description}</p>
      )}

      <div className="task-actions">
        <button onClick={() => onEdit(task)}>
          Editar
        </button>

        <button onClick={() => onDelete(task.id)}>
          Excluir
        </button>
      </div>
    </article>
  )
}

export default TaskCard