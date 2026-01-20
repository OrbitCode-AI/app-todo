import { useVar } from 'orbitcode';
import './TodoInput.css';

interface TodoInputProps {
  onAdd?: (text: string) => void;
}

function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useVar('todoInputText', '');

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd?.(text.trim());
    setText('');
  };

  return (
    <form className="todo-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onInput={(e) => setText((e.target as HTMLInputElement).value)}
        placeholder="What needs to be done?"
        className="todo-input-field"
      />
      <button type="submit" className="todo-input-btn" disabled={!text.trim()}>
        Add
      </button>
    </form>
  );
}

// Default export renders component in isolation for preview
export default function TodoInputPreview() {
  const handleAdd = (text: string) => {
    alert(`Would add: "${text}"`);
  };

  return (
    <div className="preview-container">
      <TodoInput onAdd={handleAdd} />
    </div>
  );
}

export { TodoInput };
