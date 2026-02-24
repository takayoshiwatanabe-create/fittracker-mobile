import { describe, it, expect } from '@jest/globals';
import { workoutReducer } from './WorkoutContext';
import type { Workout, WorkoutState } from '@/types/workout';

const initialState: WorkoutState = {
  workouts: [],
  isLoading: true,
  error: null,
};

const sampleWorkout: Workout = {
  id: 'test-1',
  date: '2024-01-15',
  type: 'ランニング',
  duration: 30,
  notes: 'Morning run',
  createdAt: '2024-01-15T08:00:00.000Z',
};

describe('workoutReducer', () => {
  it('handles LOADED action', () => {
    const workouts = [sampleWorkout];
    const state = workoutReducer(initialState, { type: 'LOADED', workouts });
    expect(state.workouts).toEqual(workouts);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('handles LOAD_ERROR action', () => {
    const state = workoutReducer(initialState, {
      type: 'LOAD_ERROR',
      error: 'Failed to load',
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Failed to load');
  });

  it('handles ADD action', () => {
    const loadedState: WorkoutState = { ...initialState, isLoading: false };
    const state = workoutReducer(loadedState, { type: 'ADD', workout: sampleWorkout });
    expect(state.workouts).toHaveLength(1);
    expect(state.workouts[0]).toEqual(sampleWorkout);
  });

  it('appends to existing workouts on ADD', () => {
    const existingState: WorkoutState = {
      workouts: [sampleWorkout],
      isLoading: false,
      error: null,
    };
    const newWorkout: Workout = { ...sampleWorkout, id: 'test-2', type: '筋トレ' };
    const state = workoutReducer(existingState, { type: 'ADD', workout: newWorkout });
    expect(state.workouts).toHaveLength(2);
    expect(state.workouts[1].id).toBe('test-2');
  });

  it('handles UPDATE action', () => {
    const existingState: WorkoutState = {
      workouts: [sampleWorkout],
      isLoading: false,
      error: null,
    };
    const updatedWorkout: Workout = { ...sampleWorkout, duration: 60 };
    const state = workoutReducer(existingState, { type: 'UPDATE', workout: updatedWorkout });
    expect(state.workouts).toHaveLength(1);
    expect(state.workouts[0].duration).toBe(60);
  });

  it('only updates matching workout on UPDATE', () => {
    const other: Workout = { ...sampleWorkout, id: 'test-2', type: '筋トレ' };
    const existingState: WorkoutState = {
      workouts: [sampleWorkout, other],
      isLoading: false,
      error: null,
    };
    const updatedWorkout: Workout = { ...sampleWorkout, duration: 60 };
    const state = workoutReducer(existingState, { type: 'UPDATE', workout: updatedWorkout });
    expect(state.workouts).toHaveLength(2);
    expect(state.workouts[0].duration).toBe(60);
    expect(state.workouts[1]).toEqual(other);
  });

  it('handles DELETE action', () => {
    const existingState: WorkoutState = {
      workouts: [sampleWorkout],
      isLoading: false,
      error: null,
    };
    const state = workoutReducer(existingState, { type: 'DELETE', id: 'test-1' });
    expect(state.workouts).toHaveLength(0);
  });

  it('only removes matching workout on DELETE', () => {
    const other: Workout = { ...sampleWorkout, id: 'test-2' };
    const existingState: WorkoutState = {
      workouts: [sampleWorkout, other],
      isLoading: false,
      error: null,
    };
    const state = workoutReducer(existingState, { type: 'DELETE', id: 'test-1' });
    expect(state.workouts).toHaveLength(1);
    expect(state.workouts[0].id).toBe('test-2');
  });

  it('handles RESET action', () => {
    const existingState: WorkoutState = {
      workouts: [sampleWorkout],
      isLoading: false,
      error: 'some error',
    };
    const state = workoutReducer(existingState, { type: 'RESET' });
    expect(state.workouts).toEqual([]);
    expect(state.error).toBeNull();
  });

  it('preserves isLoading on RESET', () => {
    const existingState: WorkoutState = {
      workouts: [sampleWorkout],
      isLoading: false,
      error: null,
    };
    const state = workoutReducer(existingState, { type: 'RESET' });
    expect(state.isLoading).toBe(false);
  });
});
