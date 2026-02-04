import TodoTitle from './TodoTitle';
import './styles.css';

interface TodoHeaderProps {
  title?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onSubmit?: (event: Event) => void;
  onValueChange?: (value: string) => void;
}

const noopSubmit = (_event: Event) => {};
const noopValueChange = (_value: string) => {};

export default function TodoHeader({
  title = 'todos',
  value = '',
  placeholder = 'What needs to be done?',
  disabled = false,
  onSubmit = noopSubmit,
  onValueChange = noopValueChange,
}: TodoHeaderProps = {}) {
  return (
    <header className="header">
      <TodoTitle text={title} />
      <form onSubmit={onSubmit}>
        <input
          className="new-todo"
          placeholder={placeholder}
          value={value}
          onInput={(event) => onValueChange((event.target as HTMLInputElement).value)}
          disabled={disabled}
          autoFocus
        />
      </form>
    </header>
  );
}
