import { describe, it, expect } from '@jest/globals';
import { themeReducer } from './ThemeContext';
import { LightColors, DarkColors } from '@/constants/colors';

const lightState = {
  mode: 'light' as const,
  colors: LightColors,
  isLoading: true,
};

const darkState = {
  mode: 'dark' as const,
  colors: DarkColors,
  isLoading: false,
};

describe('themeReducer', () => {
  it('handles SET_MODE to dark', () => {
    const state = themeReducer(lightState, { type: 'SET_MODE', mode: 'dark' });
    expect(state.mode).toBe('dark');
    expect(state.colors).toEqual(DarkColors);
  });

  it('handles SET_MODE to light', () => {
    const state = themeReducer(darkState, { type: 'SET_MODE', mode: 'light' });
    expect(state.mode).toBe('light');
    expect(state.colors).toEqual(LightColors);
  });

  it('preserves isLoading on SET_MODE', () => {
    const state = themeReducer(lightState, { type: 'SET_MODE', mode: 'dark' });
    expect(state.isLoading).toBe(true);
  });

  it('handles LOADED action with dark mode', () => {
    const state = themeReducer(lightState, { type: 'LOADED', mode: 'dark' });
    expect(state.mode).toBe('dark');
    expect(state.colors).toEqual(DarkColors);
    expect(state.isLoading).toBe(false);
  });

  it('handles LOADED action with light mode', () => {
    const state = themeReducer(lightState, { type: 'LOADED', mode: 'light' });
    expect(state.mode).toBe('light');
    expect(state.colors).toEqual(LightColors);
    expect(state.isLoading).toBe(false);
  });
});
