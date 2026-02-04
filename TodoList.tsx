import TodoItem from './TodoItem';
import type { Todo } from './types';
import './styles.css';

interface TodoListProps {
  todos?: Todo[];
  allCompleted?: boolean;
  editingId?: string | null;
  editText?: string;
  onToggleAll?: () => void;
  onToggle?: (todo: Todo) => void;
  onDestroy?: (id: string) => void;
  onStartEditing?: (todo: Todo) => void;
  onEditTextChange?: (value: string) => void;
  onSubmitEdit?: (id: string) => void;
  onCancelEdit?: () => void;
}

const SAMPLE_TODOS: Todo[] = [
  { id: 'sample-1', text: 'Write concise, beautiful components', completed: false },
  { id: 'sample-2', text: 'Break UI into visual blocks', completed: true },
  { id: 'sample-3', text: 'Ship with confidence', completed: false },
];

const noop = () => {};
const noopToggle = (_todo: Todo) => {};
const noopDestroy = (_id: string) => {};
const noopStartEditing = (_todo: Todo) => {};
const noopEditTextChange = (_value: string) => {};
const noopSubmitEdit = (_id: string) => {};

export default function TodoList({
  todos = SAMPLE_TODOS,
  allCompleted = false,
  editingId = null,
  editText = '',
  onToggleAll = noop,
  onToggle = noopToggle,
  onDestroy = noopDestroy,
  onStartEditing = noopStartEditing,
  onEditTextChange = noopEditTextChange,
  onSubmitEdit = noopSubmitEdit,
  onCancelEdit = noop,
}: TodoListProps = {}) {
  if (todos.length === 0) {
    return (
      <section className="main">
        <ul className="todo-list">
          <li className="loading">No todos yet.</li>
        </ul>
      </section>
    );
  }

  return (
    <section className="main">
      <input id="toggle-all" className="toggle-all" type="checkbox" checked={allCompleted} onChange={onToggleAll} />
      <label htmlFor="toggle-all">Mark all as complete</label>

      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isEditing={editingId === todo.id}
            editText={editingId === todo.id ? editText : todo.text}
            onToggle={onToggle}
            onDestroy={onDestroy}
            onStartEditing={onStartEditing}
            onEditTextChange={onEditTextChange}
            onSubmitEdit={onSubmitEdit}
            onCancelEdit={onCancelEdit}
          />
        ))}
      </ul>
    </section>
  );
}
