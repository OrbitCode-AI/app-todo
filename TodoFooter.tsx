import type { TodoFilter } from './types';
import './styles.css';

interface TodoFooterProps {
  activeCount?: number;
  completedCount?: number;
  filter?: TodoFilter;
  onFilterChange?: (filter: TodoFilter) => void;
  onClearCompleted?: () => void;
}

const FILTERS: Array<{ value: TodoFilter; label: string; href: string }> = [
  { value: 'all', label: 'All', href: '#/' },
  { value: 'active', label: 'Active', href: '#/active' },
  { value: 'completed', label: 'Completed', href: '#/completed' },
];

const noopFilterChange = (_filter: TodoFilter) => {};
const noopClearCompleted = () => {};

export default function TodoFooter({
  activeCount = 2,
  completedCount = 1,
  filter = 'all',
  onFilterChange = noopFilterChange,
  onClearCompleted = noopClearCompleted,
}: TodoFooterProps = {}) {
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {activeCount === 1 ? 'item' : 'items'} left
      </span>

      <ul className="filters">
        {FILTERS.map((entry) => (
          <li key={entry.value}>
            <a
              href={entry.href}
              className={filter === entry.value ? 'selected' : ''}
              onClick={(event) => {
                event.preventDefault();
                onFilterChange(entry.value);
              }}
            >
              {entry.label}
            </a>
          </li>
        ))}
      </ul>

      {completedCount > 0 && (
        <button type="button" className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
}
