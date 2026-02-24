export interface Workout {
  id: string;
  date: string; // YYYY-MM-DD
  type: WorkoutType;
  duration: number; // minutes
  notes: string;
  createdAt: string;
}

export type WorkoutType =
  | 'ランニング'
  | '筋トレ'
  | 'ヨガ'
  | 'ウォーキング'
  | 'サイクリング'
  | 'スイミング'
  | 'ストレッチ'
  | 'その他';

export interface WorkoutFormData {
  type: WorkoutType;
  duration: number;
  notes: string;
  date: string;
}

export interface DaySummary {
  date: string;
  totalDuration: number;
  count: number;
}

export interface WeeklySummary {
  days: DaySummary[];
  totalDuration: number;
  totalCount: number;
  averageDuration: number;
}

export interface MonthlySummary {
  totalDuration: number;
  totalCount: number;
  averageDuration: number;
  activeDays: number;
}

export interface WorkoutState {
  workouts: Workout[];
  isLoading: boolean;
  error: string | null;
}

export type WorkoutAction =
  | { type: 'LOADED'; workouts: Workout[] }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'ADD'; workout: Workout }
  | { type: 'UPDATE'; workout: Workout }
  | { type: 'DELETE'; id: string };

export interface WorkoutContextValue {
  workouts: Workout[];
  isLoading: boolean;
  error: string | null;
  addWorkout: (data: WorkoutFormData) => void;
  updateWorkout: (id: string, data: WorkoutFormData) => void;
  deleteWorkout: (id: string) => void;
  getWorkoutsByDate: (date: string) => Workout[];
  getTodayWorkouts: () => Workout[];
}
