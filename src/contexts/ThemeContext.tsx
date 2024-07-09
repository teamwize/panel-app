import { ReactNode, createContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeContextProviderProps = {
  children: ReactNode;
}

export const ThemeContextProvider = ({ children }: ThemeContextProviderProps) => {
  const prefersDarkMode: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>({
    key: "DARK_MODE",
    initialValue: prefersDarkMode,
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevIsDarkMode: boolean) => !prevIsDarkMode);
  };

  const contextValue: ThemeContextType = {
    isDarkMode: isDarkMode as boolean,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};