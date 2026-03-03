import { createContext, useContext, useState, useEffect, useRef } from 'react';

const ThemeContext = createContext();

const STORAGE_KEY = 'blog-theme';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'dark';
    } catch {
      return 'dark';
    }
  });

  const transitionTimer = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage 不可用时静默忽略
    }
  }, [theme]);

  const toggleTheme = () => {
    const root = document.documentElement;

    // 清除上一次未完成的过渡计时器（防止快速切换竞态）
    if (transitionTimer.current) clearTimeout(transitionTimer.current);

    root.classList.add('theme-transitioning');
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));

    transitionTimer.current = setTimeout(() => {
      root.classList.remove('theme-transitioning');
      transitionTimer.current = null;
    }, 450);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
