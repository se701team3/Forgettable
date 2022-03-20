import './DarkMode.css';
import React from 'react';

const DarkMode = () => {
  const setDark = () => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  };

  const setLight = () => {
    localStorage.setItem('theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
  };

  const storedTheme = localStorage.getItem('theme');

  const prefersDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const defaultDark =
    storedTheme === 'dark' || (storedTheme === null && prefersDark);

  const toggleTheme = (e) => {
    if (e.target.checked) {
      window.location.reload(false);
      setDark();
    } else {
      window.location.reload(false);
      setLight();
    }
  };

  return (
    <div className='toggle-theme-wrapper'>
      <label className='toggle-theme' htmlFor='checkbox'>
        <input
          type='checkbox'
          id='checkbox'
          onChange={toggleTheme}
          defaultChecked={defaultDark}
        />
        <div className='slider round'></div>
      </label>
    </div>
  );
};

export default DarkMode;
