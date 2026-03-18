import type { Todo } from './types'
import './styles.css'

interface TodoItemProps {
  todo?: Todo
  index?: number
  isEditing?: boolean
  editText?: string
  onToggle?: (todo: Todo) => void
  onDestroy?: (index: number) => void
  onStartEditing?: (todo: Todo) => void
  onEditTextChange?: (value: string) => void
  onSubmitEdit?: (index: number) => void
  onCancelEdit?: () => void
}

const SAMPLE_TODO = {
  text: 'Tastefully composed todo item',
  completed: false,
} as Todo

const noopToggle = (_todo: Todo) => {}
const noopDestroy = (_index: number) => {}
const noopStartEditing = (_todo: Todo) => {}
const noopEditTextChange = (_value: string) => {}
const noopSubmitEdit = (_index: number) => {}
const noopCancelEdit = () => {}

export default function TodoItem({
  todo = SAMPLE_TODO,
  index = 0,
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
          onClick={() => onDestroy(index)}
          aria-label="Delete todo"
        />
      </div>

      {isEditing && (
        <input
          className="edit"
          value={editText}
          onInput={event => onEditTextChange((event.target as HTMLInputElement).value)}
          onBlur={() => onSubmitEdit(index)}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault()
              onSubmitEdit(index)
            } else if (event.key === 'Escape') {
              event.preventDefault()
              onCancelEdit()
            }
          }}
        />
      )}
    </li>
  )
}
