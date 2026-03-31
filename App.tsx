import { useMap, useVar } from 'orbitcode'
import { useRef, useState } from 'preact/hooks'

import TodoHeader from './TodoHeader'
import TodoList from './TodoList'
import TodoFooter from './TodoFooter'
import type { Todo, TodoFilter, TodoRecord } from './types'

import './styles.css'

function matchesFilter(todo: Todo, filter: TodoFilter): boolean {
  if (filter === 'active') return !todo.completed
  if (filter === 'completed') return todo.completed
  return true
}

export default function App() {
  const [todosMap, actions, loading] = useMap<TodoRecord>('todos')
  const [input, setInput] = useVar('newTodo', '')
  const [filter, setFilter] = useVar<TodoFilter>('filter', 'all')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const activeEditRef = useRef<string | null>(null)

  const todos: Todo[] = Object.entries(todosMap).map(([id, rec]) => ({ ...rec, id }))

  const activeCount = todos.filter(todo => !todo.completed).length
  const completedCount = todos.length - activeCount
  const allCompleted = todos.length > 0 && activeCount === 0
  const filteredTodos = todos.filter(todo => matchesFilter(todo, filter))

  const setEditingState = (id: string | null, text = '') => {
    activeEditRef.current = id
    setEditingId(id)
    setEditText(text)
  }

  const startEditing = (todo: Todo) => {
    setEditingState(todo.id, todo.text)
  }
  const cancelEditing = () => setEditingState(null, '')

  const handleAdd = async (event: Event) => {
    event.preventDefault()
    if (isAdding) return

    const text = input.trim()
    if (!text) return

    setInput('')
    setIsAdding(true)
    try {
      await actions.set(Date.now().toString(), { text, completed: false })
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleAll = () => {
    const nextCompleted = !allCompleted
    for (const todo of todos) {
      actions.set(todo.id, { text: todo.text, completed: nextCompleted })
    }
  }

  const handleToggle = (todo: Todo) => {
    actions.set(todo.id, { text: todo.text, completed: !todo.completed })
  }

  const handleDestroy = (id: string) => {
    if (editingId === id) cancelEditing()
    actions.remove(id)
  }

  const handleClearCompleted = () => {
    for (const todo of todos) {
      if (todo.completed) {
        actions.remove(todo.id)
      }
    }
  }

  const handleSubmitEdit = (id: string) => {
    // Enter and blur may fire back-to-back; only honor the first one.
    if (activeEditRef.current !== id) return

    const todo = todos.find(t => t.id === id)
    const nextText = editText.trim()
    cancelEditing()

    if (!todo) return
    if (!nextText) {
      actions.remove(id)
      return
    }
    if (nextText !== todo.text) {
      actions.set(id, { text: nextText, completed: todo.completed })
    }
  }

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
                todosAll={todos}
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
  )
}
