import './styles.css';

interface TodoTitleProps {
  text?: string;
}

export default function TodoTitle({ text = 'todos' }: TodoTitleProps = {}) {
  return <h1 className="todo-title">{text}</h1>;
}
