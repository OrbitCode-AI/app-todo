import { useSet } from 'orbitcode';
import './Stats.css';

interface Todo {
  text: string;
  completed: boolean;
}

function Stats() {
  const [todos] = useSet<Todo>('todos');

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (total === 0) return null;

  return (
    <div className="stats">
      <div className="stats-progress">
        <div className="stats-progress-bar" style={{ width: `${percentage}%` }} />
      </div>
      <div className="stats-text">
        <span className="stats-completed">{completed} done</span>
        <span className="stats-separator">•</span>
        <span className="stats-active">{active} remaining</span>
        <span className="stats-separator">•</span>
        <span className="stats-percentage">{percentage}%</span>
      </div>
    </div>
  );
}

// Default export renders component in isolation for preview
export default function StatsPreview() {
  return (
    <div className="preview-container">
      <p className="preview-note">
        Stats are calculated from the shared todo list.
        Add some todos to see this component in action.
      </p>
      <Stats />
    </div>
  );
}

export { Stats };
