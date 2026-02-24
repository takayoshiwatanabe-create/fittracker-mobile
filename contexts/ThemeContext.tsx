import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { useColorScheme } from 'react-native';
import type { ThemeColors, ThemeMode } from '@/types/theme';
import { DarkColors, LightColors } from '@/constants/colors';
import { loadThemePreference, saveThemePreference } from '@/utils/storage';

interface ThemeState {
  mode: ThemeMode;
  colors: ThemeColors;
  isLoading: boolean;
}

type ThemeAction =
  | { type: 'SET_MODE'; mode: ThemeMode }
  | { type: 'LOADED'; mode: ThemeMode };

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode,
        colors: action.mode === 'dark' ? DarkColors : LightColors,
      };
    case 'LOADED':
      return {
        ...state,
        mode: action.mode,
        colors: action.mode === 'dark' ? DarkColors : LightColors,
        isLoading: false,
      };
  }
}

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  isLoading: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemScheme = useColorScheme();

  const [state, dispatch] = useReducer(themeReducer, {
    mode: (systemScheme ?? 'light') as ThemeMode,
    colors: systemScheme === 'dark' ? DarkColors : LightColors,
    isLoading: true,
  });

  useEffect(() => {
    loadThemePreference().then((saved) => {
      if (saved === 'dark' || saved === 'light') {
        dispatch({ type: 'LOADED', mode: saved });
      } else {
        dispatch({ type: 'LOADED', mode: (systemScheme ?? 'light') as ThemeMode });
      }
    });
  }, [systemScheme]);

  const toggleTheme = useCallback(() => {
    const next = state.mode === 'light' ? 'dark' : 'light';
    dispatch({ type: 'SET_MODE', mode: next });
    saveThemePreference(next);
  }, [state.mode]);

  return (
    <ThemeContext.Provider
      value={{
        mode: state.mode,
        colors: state.colors,
        isLoading: state.isLoading,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
