import Header from './Header';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import FilterBar from './FilterBar';
import Stats from './Stats';
import './styles.css';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <TodoInput />
        <FilterBar />
        <TodoList />
        <Stats />
      </main>
    </div>
  );
}
