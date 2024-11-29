import { FaSun, FaMoon } from 'react-icons/fa';
import './ThemeToggle.css';

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === 'light' ? <FaMoon /> : <FaSun />}
    </button>
  );
}

export default ThemeToggle;