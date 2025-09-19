import React, { useEffect, useState } from 'react';
import { applyTheme, getSavedTheme, toggleTheme } from '../services/ThemeService';

function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const initial = getSavedTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const onToggle = () => {
    setTheme((t) => toggleTheme(t));
  };

  return (
    <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2" onClick={onToggle} title="Toggle theme">
      <i className={`bi ${theme === 'dark' ? 'bi-moon-stars' : 'bi-brightness-high'}`}></i>
      <span className="d-none d-md-inline">{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  );
}

export default ThemeToggle;




