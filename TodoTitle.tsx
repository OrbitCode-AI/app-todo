import './styles.css'

interface TodoTitleProps {
  text?: string
  floating?: boolean
}

export default function TodoTitle({ text = 'todos', floating = false }: TodoTitleProps = {}) {
  return <h1 className={`todo-title${floating ? ' todo-title-floating' : ''}`}>{text}</h1>
}
