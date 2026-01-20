import './TodoItem.css';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <label className="todo-item-label">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle?.(todo.id)}
          className="todo-item-checkbox"
        />
        <span className="todo-item-checkmark" />
        <span className="todo-item-text">{todo.text}</span>
      </label>
      <button
        className="todo-item-delete"
        onClick={() => onDelete?.(todo.id)}
        aria-label="Delete"
      >
        ×
      </button>
    </li>
  );
}

// Default export renders component in isolation for preview
export default function TodoItemPreview() {
  const sampleTodos: Todo[] = [
    { id: '1', text: 'Learn React', completed: false },
    { id: '2', text: 'Build something awesome', completed: false },
    { id: '3', text: 'Take a break', completed: true },
  ];

  return (
    <div className="preview-container">
      <ul className="preview-list">
        {sampleTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={(id) => alert(`Toggle: ${id}`)}
            onDelete={(id) => alert(`Delete: ${id}`)}
          />
        ))}
      </ul>
    </div>
  );
}

export { TodoItem };
export type { Todo };
