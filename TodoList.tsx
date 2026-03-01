import { useList, useVar } from 'orbitcode'
import { useEffect, useRef } from 'preact/hooks'

import TodoItem from './TodoItem'
import type { Todo, TodoRecord } from './types'
import './styles.css'

interface TodoListProps {
  todos?: Todo[]
  allCompleted?: boolean
  editingId?: string | null
  editText?: string
  onToggleAll?: () => void
  onToggle?: (todo: Todo) => void
  onDestroy?: (id: string) => void
  onStartEditing?: (todo: Todo) => void
  onEditTextChange?: (value: string) => void
  onSubmitEdit?: (id: string) => void
  onCancelEdit?: () => void
}

const SAMPLE_TODOS: Todo[] = [
  { id: 'sample-1', text: 'Write concise, beautiful components', completed: false },
  { id: 'sample-2', text: 'Break UI into visual blocks', completed: true },
  { id: 'sample-3', text: 'Ship with confidence', completed: false },
]

const noop = () => {}
const noopToggle = (_todo: Todo) => {}
const noopDestroy = (_id: string) => {}
const noopStartEditing = (_todo: Todo) => {}
const noopEditTextChange = (_value: string) => {}
const noopSubmitEdit = (_id: string) => {}

export default function TodoList({
  todos,
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
  // Standalone storyboard mode: when no todos are passed in, keep a tiny
  // persistent sample collection so previews behave like a real app.
  const [previewTodos, previewActions, previewLoading] = useList<TodoRecord>('todoListPreviewItems')
  const [previewSeeded, setPreviewSeeded] = useVar('todoListPreviewSeeded', false)
  const seedingRef = useRef(false)

  const isControlled = typeof todos !== 'undefined'
  const visibleTodos = isControlled ? todos : previewTodos

  useEffect(() => {
    if (
      isControlled ||
      previewLoading ||
      previewSeeded ||
      previewTodos.length > 0 ||
      seedingRef.current
    )
      return

    seedingRef.current = true

    ;(async () => {
      try {
        for (const sample of SAMPLE_TODOS) {
          await previewActions.add({ text: sample.text, completed: sample.completed })
        }
        setPreviewSeeded(true)
      } finally {
        seedingRef.current = false
      }
    })()
  }, [
    isControlled,
    previewLoading,
    previewSeeded,
    previewTodos.length,
    previewActions,
    setPreviewSeeded,
  ])

  const derivedAllCompleted =
    visibleTodos.length > 0 && visibleTodos.every(todo => todo.completed === true)

  const handleToggleAll = isControlled
    ? onToggleAll
    : () => {
        const nextCompleted = !derivedAllCompleted
        for (const todo of visibleTodos) {
          if (todo.completed !== nextCompleted) {
            previewActions.update(todo.id, { text: todo.text, completed: nextCompleted })
          }
        }
      }

  const handleToggle = isControlled
    ? onToggle
    : (todo: Todo) => {
        previewActions.update(todo.id, { text: todo.text, completed: !todo.completed })
      }

  const handleDestroy = isControlled
    ? onDestroy
    : (id: string) => {
        previewActions.remove(id)
      }

  if (previewLoading && !isControlled) {
    return (
      <section className="main">
        <ul className="todo-list">
          <li className="loading">Loading...</li>
        </ul>
      </section>
    )
  }

  if (visibleTodos.length === 0) {
    return (
      <section className="main">
        <ul className="todo-list">
          <li className="loading">No todos yet.</li>
        </ul>
      </section>
    )
  }

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={isControlled ? allCompleted : derivedAllCompleted}
        onChange={handleToggleAll}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>

      <ul className="todo-list">
        {visibleTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isEditing={editingId === todo.id}
            editText={editingId === todo.id ? editText : todo.text}
            onToggle={handleToggle}
            onDestroy={handleDestroy}
            onStartEditing={onStartEditing}
            onEditTextChange={onEditTextChange}
            onSubmitEdit={onSubmitEdit}
            onCancelEdit={onCancelEdit}
          />
        ))}
      </ul>
    </section>
  )
}
