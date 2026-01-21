import { useVar, useSet } from 'orbitcode';
import './styles.css';

interface Todo {
  text: string;
  completed: boolean;
}

type Filter = 'all' | 'active' | 'completed';

export default function App() {
  const [todos, { add, update, remove }, loading] = useSet<Todo>('todos');
  const [input, setInput] = useVar('newTodo', '');
  const [filter, setFilter] = useVar<Filter>('filter', 'all');
  const [editingId, setEditingId] = useVar<string | null>('editingId', null);
  const [editText, setEditText] = useVar('editText', '');

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.length - activeCount;
  const allCompleted = todos.length > 0 && activeCount === 0;

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    await add({ text, completed: false });
    setInput('');
  };

  const toggleAll = () => {
    const newCompleted = !allCompleted;
    for (const todo of todos) {
      update(todo.id, { text: todo.text, completed: newCompleted });
    }
  };

  const toggle = (todo: Todo & { id: string }) => {
    update(todo.id, { text: todo.text, completed: !todo.completed });
  };

  const destroy = (id: string) => {
    remove(id);
  };

  const clearCompleted = () => {
    for (const todo of todos) {
      if (todo.completed) {
        remove(todo.id);
      }
    }
  };

  const startEditing = (todo: Todo & { id: string }) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const submitEdit = (id: string) => {
    const text = editText.trim();
    if (text) {
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        update(id, { text, completed: todo.completed });
      }
    } else {
      remove(id);
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  if (loading) {
    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
        </header>
        <section className="main">
          <ul className="todo-list">
            <li className="loading">Loading...</li>
          </ul>
        </section>
      </section>
    );
  }

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={input}
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            autoFocus
          />
        </form>
      </header>

      {todos.length > 0 && (
        <>
          <section className="main">
            <input
              id="toggle-all"
              className="toggle-all"
              type="checkbox"
              checked={allCompleted}
              onChange={toggleAll}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className={`${todo.completed ? 'completed' : ''} ${editingId === todo.id ? 'editing' : ''}`}
                >
                  <div className="view">
                    <input
                      className="toggle"
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggle(todo)}
                    />
                    <label onDblClick={() => startEditing(todo)}>{todo.text}</label>
                    <button className="destroy" onClick={() => destroy(todo.id)} />
                  </div>
                  {editingId === todo.id && (
                    <input
                      className="edit"
                      value={editText}
                      onInput={(e) => setEditText((e.target as HTMLInputElement).value)}
                      onBlur={() => submitEdit(todo.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') submitEdit(todo.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                    />
                  )}
                </li>
              ))}
            </ul>
          </section>

          <footer className="footer">
            <span className="todo-count">
              <strong>{activeCount}</strong> {activeCount === 1 ? 'item' : 'items'} left
            </span>
            <ul className="filters">
              <li>
                <button
                  type="button"
                  className={filter === 'all' ? 'selected' : ''}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={filter === 'active' ? 'selected' : ''}
                  onClick={() => setFilter('active')}
                >
                  Active
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={filter === 'completed' ? 'selected' : ''}
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </button>
              </li>
            </ul>
            {completedCount > 0 && (
              <button className="clear-completed" onClick={clearCompleted}>
                Clear completed
              </button>
            )}
          </footer>
        </>
      )}
    </section>
  );
}
