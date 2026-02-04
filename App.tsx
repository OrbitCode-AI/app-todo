import { useVar, useSet } from 'orbitcode';
import { useRef, useState } from 'preact/hooks';

import TodoHeader from './TodoHeader';
import TodoList from './TodoList';
import TodoFooter from './TodoFooter';
import type { Todo, TodoFilter, TodoRecord } from './types';

import './styles.css';

function matchesFilter(todo: Todo, filter: TodoFilter): boolean {
  if (filter === 'active') return !todo.completed;
  if (filter === 'completed') return todo.completed;
  return true;
}

export default function App() {
  const [todos, { add, update, remove }, loading] = useSet<TodoRecord>('todos');
  const [input, setInput] = useVar('newTodo', '');
  const [filter, setFilter] = useVar<TodoFilter>('filter', 'all');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const activeEditIdRef = useRef<string | null>(null);

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;
  const allCompleted = todos.length > 0 && activeCount === 0;
  const filteredTodos = todos.filter((todo) => matchesFilter(todo, filter));

  const setEditingState = (id: string | null, text = '') => {
    activeEditIdRef.current = id;
    setEditingId(id);
    setEditText(text);
  };

  const startEditing = (todo: Todo) => setEditingState(todo.id, todo.text);
  const cancelEditing = () => setEditingState(null, '');

  const handleAdd = async (event: Event) => {
    event.preventDefault();
    if (isAdding) return;

    const text = input.trim();
    if (!text) return;

    setInput('');
    setIsAdding(true);
    try {
      await add({ text, completed: false });
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleAll = () => {
    const nextCompleted = !allCompleted;
    for (const todo of todos) {
      if (todo.completed !== nextCompleted) {
        update(todo.id, { text: todo.text, completed: nextCompleted });
      }
    }
  };

  const handleToggle = (todo: Todo) => {
    update(todo.id, { text: todo.text, completed: !todo.completed });
  };

  const handleDestroy = (id: string) => {
    if (editingId === id) cancelEditing();
    remove(id);
  };

  const handleClearCompleted = () => {
    for (const todo of todos) {
      if (todo.completed) remove(todo.id);
    }
  };

  const handleSubmitEdit = (id: string) => {
    // Enter and blur may fire back-to-back; only honor the first one.
    if (activeEditIdRef.current !== id) return;

    const todo = todos.find((entry) => entry.id === id);
    const nextText = editText.trim();
    cancelEditing();

    if (!todo) return;
    if (!nextText) {
      remove(id);
      return;
    }
    if (nextText !== todo.text) {
      update(id, { text: nextText, completed: todo.completed });
    }
  };

  return (
    <>
      <section className="todoapp">
        <TodoHeader
          floatingTitle
          value={input}
          onValueChange={setInput}
          onSubmit={handleAdd}
          disabled={isAdding}
        />

        {loading ? (
          <section className="main">
            <ul className="todo-list">
              <li className="loading">Loading...</li>
            </ul>
          </section>
        ) : (
          todos.length > 0 && (
            <>
              <TodoList
                todos={filteredTodos}
                allCompleted={allCompleted}
                editingId={editingId}
                editText={editText}
                onToggleAll={handleToggleAll}
                onToggle={handleToggle}
                onDestroy={handleDestroy}
                onStartEditing={startEditing}
                onEditTextChange={setEditText}
                onSubmitEdit={handleSubmitEdit}
                onCancelEdit={cancelEditing}
              />

              <TodoFooter
                activeCount={activeCount}
                completedCount={completedCount}
                filter={filter}
                onFilterChange={setFilter}
                onClearCompleted={handleClearCompleted}
              />
            </>
          )
        )}
      </section>

      <footer className="info">
        <p>Double-click to edit a todo</p>
      </footer>
    </>
  );
}
