import React, { createContext, useContext, useEffect, useState } from 'react';

export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
}

const DEFAULT_THEME: ThemeConfig = {
  mode: 'dark',
  primaryColor: '195 100% 50%',
  secondaryColor: '210 100% 55%',
};

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  toggleMode: () => void;
  setColors: (primary: string, secondary: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeConfig>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ThemeConfig;
        setThemeState(parsed);
        applyTheme(parsed);
      } catch (e) {
        applyTheme(DEFAULT_THEME);
      }
    } else {
      applyTheme(DEFAULT_THEME);
    }
    setMounted(true);
  }, []);

  const applyTheme = (newTheme: ThemeConfig) => {
    const root = document.documentElement;
    
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme.mode);
    
    root.style.setProperty('--theme-primary', newTheme.primaryColor);
    root.style.setProperty('--theme-secondary', newTheme.secondaryColor);
  };

  const setTheme = (newTheme: ThemeConfig) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('portfolio-theme', JSON.stringify(newTheme));
  };

  const toggleMode = () => {
    const newTheme = {
      ...theme,
      mode: theme.mode === 'dark' ? 'light' : 'dark',
    };
    setTheme(newTheme);
  };

  const setColors = (primary: string, secondary: string) => {
    const newTheme = {
      ...theme,
      primaryColor: primary,
      secondaryColor: secondary,
    };
    setTheme(newTheme);
  };

  if (!mounted) return <>{children}</>;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleMode, setColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
