import { useVar, useSet } from 'orbitcode';
import { TodoItem, type Todo } from './TodoItem';
import './TodoList.css';

type FilterType = 'all' | 'active' | 'completed';

function TodoList() {
  const [todos, { add, update, remove }] = useSet<Omit<Todo, 'id'>>('todos');
  const [filter] = useVar<FilterType>('todoFilter', 'all');

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const handleToggle = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      update(id, { text: todo.text, completed: !todo.completed });
    }
  };

  const handleDelete = (id: string) => {
    remove(id);
  };

  if (filteredTodos.length === 0) {
    return (
      <div className="todo-list-empty">
        {filter === 'all'
          ? 'No tasks yet. Add one above!'
          : filter === 'active'
            ? 'No active tasks. Great job!'
            : 'No completed tasks yet.'}
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}

// Default export renders component in isolation for preview
export default function TodoListPreview() {
  return (
    <div className="preview-container">
      <p className="preview-note">
        This component uses useSet from orbitcode for persistent storage.
        The preview shows the empty state.
      </p>
      <TodoList />
    </div>
  );
}

export { TodoList };
