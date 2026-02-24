import type { WorkoutType } from '@/types/workout';

interface WorkoutTypeOption {
  label: WorkoutType;
  icon: string;
}

export const WORKOUT_TYPE_OPTIONS: readonly WorkoutTypeOption[] = [
  { label: 'ランニング', icon: '🏃' },
  { label: '筋トレ', icon: '💪' },
  { label: 'ヨガ', icon: '🧘' },
  { label: 'ウォーキング', icon: '🚶' },
  { label: 'サイクリング', icon: '🚴' },
  { label: 'スイミング', icon: '🏊' },
  { label: 'ストレッチ', icon: '🤸' },
  { label: 'その他', icon: '⭐' },
] as const;

export const DURATION_PRESETS = [15, 30, 45, 60, 90, 120] as const;
