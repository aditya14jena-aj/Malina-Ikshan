import { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    // Determine initial theme from OS preference or stored setting
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // Persist choice for session
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark(prev => !prev);

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-9.66l-.71.71M5.05 5.05l-.71.71M21 12h-1M4 12H3m15.36 6.36l-.71-.71M5.05 18.95l-.71-.71" />
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth={2} fill="none" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" stroke="none">
          <path d="M12 3a9 9 0 0 0 0 18 9 9 0 0 0 0-18zM12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z" />
        </svg>
      )}
      <span className="text-xs font-medium">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
};

export default DarkModeToggle;
