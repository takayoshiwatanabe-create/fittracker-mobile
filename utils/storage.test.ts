import { describe, it, expect, beforeEach } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadWorkouts, saveWorkouts, loadThemePreference, saveThemePreference, clearAll } from './storage';
import type { Workout } from '@/types/workout';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;
const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;

describe('loadWorkouts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty array when no data stored', async () => {
    mockGetItem.mockResolvedValue(null);
    const result = await loadWorkouts();
    expect(result).toEqual([]);
    expect(mockGetItem).toHaveBeenCalledWith('fittracker_workouts');
  });

  it('returns parsed workouts from storage', async () => {
    const workouts: Workout[] = [
      {
        id: '1',
        date: '2024-01-15',
        type: 'ランニング',
        duration: 30,
        notes: 'Test',
        createdAt: '2024-01-15T10:00:00.000Z',
      },
    ];
    mockGetItem.mockResolvedValue(JSON.stringify(workouts));
    const result = await loadWorkouts();
    expect(result).toEqual(workouts);
  });
});

describe('saveWorkouts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves workouts to storage as JSON', async () => {
    const workouts: Workout[] = [
      {
        id: '1',
        date: '2024-01-15',
        type: '筋トレ',
        duration: 60,
        notes: '',
        createdAt: '2024-01-15T10:00:00.000Z',
      },
    ];
    mockSetItem.mockResolvedValue(undefined);
    await saveWorkouts(workouts);
    expect(mockSetItem).toHaveBeenCalledWith(
      'fittracker_workouts',
      JSON.stringify(workouts)
    );
  });

  it('saves empty array', async () => {
    mockSetItem.mockResolvedValue(undefined);
    await saveWorkouts([]);
    expect(mockSetItem).toHaveBeenCalledWith('fittracker_workouts', '[]');
  });
});

describe('loadThemePreference', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when no preference stored', async () => {
    mockGetItem.mockResolvedValue(null);
    const result = await loadThemePreference();
    expect(result).toBeNull();
    expect(mockGetItem).toHaveBeenCalledWith('fittracker_theme');
  });

  it('returns saved theme preference', async () => {
    mockGetItem.mockResolvedValue(JSON.stringify('dark'));
    const result = await loadThemePreference();
    expect(result).toBe('dark');
  });
});

describe('saveThemePreference', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves theme preference to storage', async () => {
    mockSetItem.mockResolvedValue(undefined);
    await saveThemePreference('dark');
    expect(mockSetItem).toHaveBeenCalledWith(
      'fittracker_theme',
      JSON.stringify('dark')
    );
  });

  it('saves light theme preference', async () => {
    mockSetItem.mockResolvedValue(undefined);
    await saveThemePreference('light');
    expect(mockSetItem).toHaveBeenCalledWith(
      'fittracker_theme',
      JSON.stringify('light')
    );
  });
});

describe('clearAll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('removes all storage keys', async () => {
    mockRemoveItem.mockResolvedValue(undefined);
    await clearAll();
    expect(mockRemoveItem).toHaveBeenCalledWith('fittracker_workouts');
    expect(mockRemoveItem).toHaveBeenCalledWith('fittracker_theme');
    expect(mockRemoveItem).toHaveBeenCalledTimes(2);
  });
});
