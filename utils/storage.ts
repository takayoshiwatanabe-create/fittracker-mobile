import AsyncStorage from '@react-native-async-storage/async-storage';

const WORKOUTS_KEY = 'fittracker_workouts';
const THEME_KEY = 'fittracker_theme';

export async function loadWorkouts<T>(): Promise<T | null> {
  const data = await AsyncStorage.getItem(WORKOUTS_KEY);
  if (data === null) {
    return null;
  }
  return JSON.parse(data) as T;
}

export async function saveWorkouts<T>(workouts: T): Promise<void> {
  await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
}

export async function loadThemePreference(): Promise<string | null> {
  return AsyncStorage.getItem(THEME_KEY);
}

export async function saveThemePreference(theme: string): Promise<void> {
  await AsyncStorage.setItem(THEME_KEY, theme);
}
