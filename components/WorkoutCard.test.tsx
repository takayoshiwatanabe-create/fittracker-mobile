import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { WorkoutCard } from './WorkoutCard';
import type { Workout } from '@/types/workout';

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: '#F5F5F5',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textSecondary: '#6B7280',
      primary: '#3B82F6',
      primaryLight: '#DBEAFE',
      border: '#E5E7EB',
      error: '#EF4444',
      success: '#22C55E',
      card: '#FFFFFF',
      tabBar: '#FFFFFF',
      tabBarInactive: '#9CA3AF',
    },
  }),
}));

const sampleWorkout: Workout = {
  id: 'test-1',
  date: '2024-01-15',
  type: 'ランニング',
  duration: 30,
  notes: 'Morning run',
  createdAt: '2024-01-15T08:00:00.000Z',
};

describe('WorkoutCard', () => {
  it('renders workout type', () => {
    render(<WorkoutCard workout={sampleWorkout} />);
    expect(screen.getByText('ランニング')).toBeTruthy();
  });

  it('renders formatted duration', () => {
    render(<WorkoutCard workout={sampleWorkout} />);
    expect(screen.getByText('30分')).toBeTruthy();
  });

  it('renders notes when present', () => {
    render(<WorkoutCard workout={sampleWorkout} />);
    expect(screen.getByText('Morning run')).toBeTruthy();
  });

  it('does not render notes when empty', () => {
    const workoutNoNotes: Workout = { ...sampleWorkout, notes: '' };
    render(<WorkoutCard workout={workoutNoNotes} />);
    expect(screen.queryByText('Morning run')).toBeNull();
  });

  it('renders delete button when onDelete is provided', () => {
    const onDelete = jest.fn();
    render(<WorkoutCard workout={sampleWorkout} onDelete={onDelete} />);
    expect(screen.getByText('削除')).toBeTruthy();
  });

  it('does not render delete button when onDelete is not provided', () => {
    render(<WorkoutCard workout={sampleWorkout} />);
    expect(screen.queryByText('削除')).toBeNull();
  });

  it('calls onDelete when delete button is pressed', () => {
    const onDelete = jest.fn();
    render(<WorkoutCard workout={sampleWorkout} onDelete={onDelete} />);
    fireEvent.press(screen.getByText('削除'));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('calls onPress when card is pressed', () => {
    const onPress = jest.fn();
    render(<WorkoutCard workout={sampleWorkout} onPress={onPress} />);
    fireEvent.press(screen.getByLabelText('ランニング 30分'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('displays correct icon for workout type', () => {
    render(<WorkoutCard workout={sampleWorkout} />);
    expect(screen.getByText('🏃')).toBeTruthy();
  });

  it('displays default icon for unknown workout type', () => {
    const unknownType: Workout = { ...sampleWorkout, type: 'その他' };
    render(<WorkoutCard workout={unknownType} />);
    expect(screen.getByText('⭐')).toBeTruthy();
  });
});
