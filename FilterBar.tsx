import { useVar } from 'orbitcode';
import './FilterBar.css';

type FilterType = 'all' | 'active' | 'completed';

interface FilterBarProps {
  value?: FilterType;
  onChange?: (filter: FilterType) => void;
}

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Done' },
];

function FilterBar({ value, onChange }: FilterBarProps) {
  const [filter, setFilter] = useVar<FilterType>('todoFilter', value ?? 'all');
  const activeFilter = value ?? filter;

  const handleClick = (newFilter: FilterType) => {
    if (onChange) {
      onChange(newFilter);
    } else {
      setFilter(newFilter);
    }
  };

  return (
    <div className="filter-bar">
      {filters.map((f) => (
        <button
          key={f.value}
          className={`filter-btn ${activeFilter === f.value ? 'active' : ''}`}
          onClick={() => handleClick(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

// Default export renders component in isolation for preview
export default function FilterBarPreview() {
  return (
    <div className="preview-container">
      <FilterBar />
      <p className="preview-note">
        Click the buttons to change filter state (persisted via useVar).
      </p>
    </div>
  );
}

export { FilterBar };
export type { FilterType };
