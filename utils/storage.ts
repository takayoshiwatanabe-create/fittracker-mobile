import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Workout } from '@/types/workout';
import type { ThemeMode } from '@/types/theme';

interface StorageSchema {
  fittracker_workouts: Workout[];
  fittracker_theme: ThemeMode;
}

type StorageKey = keyof StorageSchema;

async function getItem<K extends StorageKey>(
  key: K
): Promise<StorageSchema[K] | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) {
    return null;
  }
  return JSON.parse(raw) as StorageSchema[K];
}

async function setItem<K extends StorageKey>(
  key: K,
  value: StorageSchema[K]
): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function removeItem(key: StorageKey): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export async function loadWorkouts(): Promise<Workout[]> {
  const data = await getItem('fittracker_workouts');
  return data ?? [];
}

export async function saveWorkouts(workouts: Workout[]): Promise<void> {
  await setItem('fittracker_workouts', workouts);
}

export async function loadThemePreference(): Promise<ThemeMode | null> {
  return getItem('fittracker_theme');
}

export async function saveThemePreference(mode: ThemeMode): Promise<void> {
  await setItem('fittracker_theme', mode);
}

export async function clearAll(): Promise<void> {
  const keys: StorageKey[] = ['fittracker_workouts', 'fittracker_theme'];
  await Promise.all(keys.map((key) => AsyncStorage.removeItem(key)));
}
