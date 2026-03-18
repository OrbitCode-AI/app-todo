import { useList, useVar } from 'orbitcode'
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
  const [todos, actions, loading] = useList<TodoRecord>('todos')
  const [input, setInput] = useVar('newTodo', '')
  const [filter, setFilter] = useVar<TodoFilter>('filter', 'all')

  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const activeEditRef = useRef<number | null>(null)

  const activeCount = todos.filter(todo => !todo.completed).length
  const completedCount = todos.length - activeCount
  const allCompleted = todos.length > 0 && activeCount === 0
  const filteredTodos = todos.filter(todo => matchesFilter(todo, filter))

  const setEditingState = (index: number | null, text = '') => {
    activeEditRef.current = index
    setEditingIndex(index)
    setEditText(text)
  }

  const startEditing = (todo: Todo) => {
    const index = todos.indexOf(todo)
    setEditingState(index, todo.text)
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
      await actions.push({ text, completed: false })
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleAll = () => {
    const nextCompleted = !allCompleted
    actions.set(todos.map(todo => ({ text: todo.text, completed: nextCompleted })))
  }

  const handleToggle = (todo: Todo) => {
    const index = todos.indexOf(todo)
    actions.updateAt(index, { text: todo.text, completed: !todo.completed })
  }

  const handleDestroy = (index: number) => {
    if (editingIndex === index) cancelEditing()
    actions.removeAt(index)
  }

  const handleClearCompleted = () => {
    actions.set(todos.filter(t => !t.completed).map(({ text, completed }) => ({ text, completed })))
  }

  const handleSubmitEdit = (index: number) => {
    // Enter and blur may fire back-to-back; only honor the first one.
    if (activeEditRef.current !== index) return

    const todo = todos[index]
    const nextText = editText.trim()
    cancelEditing()

    if (!todo) return
    if (!nextText) {
      actions.removeAt(index)
      return
    }
    if (nextText !== todo.text) {
      actions.updateAt(index, { text: nextText, completed: todo.completed })
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
                editingIndex={editingIndex}
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
