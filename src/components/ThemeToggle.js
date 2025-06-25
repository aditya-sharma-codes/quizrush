import React, { useContext } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { ThemeContext } from '../ThemeContext'; // Assuming you're using a ThemeContext

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.5rem',
        color: isDark ? '#FFD700' : '#333',
        transition: 'all 0.3s ease',
        filter: `drop-shadow(0 0 5px ${isDark ? '#FFD700' : '#999'})`,
      }}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
    >
      {isDark ? <FaSun /> : <FaMoon />}
    </button>
  );
};

export default ThemeToggle;
