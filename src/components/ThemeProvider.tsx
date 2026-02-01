'use client';

import React from 'react';

export const ThemeContext = React.createContext<{
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  isHydrated: boolean;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Set hydration flag - indicates client is ready
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Apply theme to document root when it changes
  React.useEffect(() => {
    if (!isHydrated) return;
    
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, isHydrated]);

  // Note: Page component (src/app/page.tsx) handles all localStorage operations
  // This provider just applies the theme class to the DOM

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isHydrated }}>
      {children}
    </ThemeContext.Provider>
  );
}
