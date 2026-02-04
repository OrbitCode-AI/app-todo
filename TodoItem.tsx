import type { Todo } from './types';
import './styles.css';

interface TodoItemProps {
  todo?: Todo;
  isEditing?: boolean;
  editText?: string;
  onToggle?: (todo: Todo) => void;
  onDestroy?: (id: string) => void;
  onStartEditing?: (todo: Todo) => void;
  onEditTextChange?: (value: string) => void;
  onSubmitEdit?: (id: string) => void;
  onCancelEdit?: () => void;
}

const SAMPLE_TODO: Todo = {
  id: 'sample-item',
  text: 'Tastefully composed todo item',
  completed: false,
};

const noopToggle = (_todo: Todo) => {};
const noopDestroy = (_id: string) => {};
const noopStartEditing = (_todo: Todo) => {};
const noopEditTextChange = (_value: string) => {};
const noopSubmitEdit = (_id: string) => {};
const noopCancelEdit = () => {};

export default function TodoItem({
  todo = SAMPLE_TODO,
  isEditing = false,
  editText = SAMPLE_TODO.text,
  onToggle = noopToggle,
  onDestroy = noopDestroy,
  onStartEditing = noopStartEditing,
  onEditTextChange = noopEditTextChange,
  onSubmitEdit = noopSubmitEdit,
  onCancelEdit = noopCancelEdit,
}: TodoItemProps = {}) {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
        />
        <label onDblClick={() => onStartEditing(todo)}>{todo.text}</label>
        <button
          type="button"
          className="destroy"
          onClick={() => onDestroy(todo.id)}
          aria-label="Delete todo"
        />
      </div>

      {isEditing && (
        <input
          className="edit"
          value={editText}
          onInput={(event) => onEditTextChange((event.target as HTMLInputElement).value)}
          onBlur={() => onSubmitEdit(todo.id)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onSubmitEdit(todo.id);
            } else if (event.key === 'Escape') {
              event.preventDefault();
              onCancelEdit();
            }
          }}
          autoFocus
        />
      )}
    </li>
  );
}
