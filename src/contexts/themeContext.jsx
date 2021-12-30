import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

const ThemeStateContext = createContext('');
ThemeStateContext.displayName = 'ThemeStateContext';

const ThemeDispatchContext = createContext('');
ThemeDispatchContext.displayName = 'ThemeDispatchContext';

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  let handleSetTheme;

  try {
    const storage = localStorage;

    handleSetTheme = (newTheme) => {
      setTheme(newTheme);
      storage.setItem('theme', newTheme);
    };

    useEffect(() => {
      const storageTheme = storage.getItem('theme');

      return storageTheme
        ? setTheme(storageTheme)
        : storage.setItem('theme', 'light');
    }, []);
  } catch {
    handleSetTheme = (newTheme) => setTheme(newTheme);
  }

  const stateValue = useMemo(
    () => ({
      theme,
    }),
    [theme],
  );

  const dispatchValue = useMemo(
    () => ({
      handleSetTheme,
    }),
    [handleSetTheme],
  );

  return (
    <ThemeStateContext.Provider value={stateValue}>
      <ThemeDispatchContext.Provider value={dispatchValue}>
        <div className={`sticky-footer theme-${theme}`}>{children}</div>
      </ThemeDispatchContext.Provider>
    </ThemeStateContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useThemeStateContext = () => {
  const context = useContext(ThemeStateContext);

  if (!context) {
    throw new Error('useThemeStateContext must be used within a ThemeProvider');
  }

  return context;
};

const useThemeDispatchContext = () => {
  const context = useContext(ThemeDispatchContext);

  if (!context) {
    throw new Error(
      'useThemeDispatchContext must be used within a ThemeProvider',
    );
  }

  return context;
};

export { useThemeStateContext, useThemeDispatchContext, ThemeProvider };
