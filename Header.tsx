import './Header.css';

interface HeaderProps {
  title?: string;
}

function Header({ title = 'My Tasks' }: HeaderProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      <p className="header-date">{today}</p>
    </header>
  );
}

// Default export renders component in isolation for preview
export default function HeaderPreview() {
  return (
    <div className="preview-container">
      <Header />
      <Header title="Custom Title" />
    </div>
  );
}

export { Header };
