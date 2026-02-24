import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import type { Workout, WorkoutAction, WorkoutContextValue, WorkoutFormData, WorkoutState } from '@/types/workout';
import { clearAll, loadWorkouts, saveWorkouts } from '@/utils/storage';
import { generateId } from '@/utils/id';
import { getToday } from '@/utils/date';

export function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'LOADED':
      return { ...state, workouts: action.workouts, isLoading: false, error: null };
    case 'LOAD_ERROR':
      return { ...state, isLoading: false, error: action.error };
    case 'ADD':
      return { ...state, workouts: [...state.workouts, action.workout] };
    case 'UPDATE':
      return {
        ...state,
        workouts: state.workouts.map((w) =>
          w.id === action.workout.id ? action.workout : w
        ),
      };
    case 'DELETE':
      return {
        ...state,
        workouts: state.workouts.filter((w) => w.id !== action.id),
      };
    case 'RESET':
      return { ...state, workouts: [], error: null };
  }
}

const WorkoutContext = createContext<WorkoutContextValue | undefined>(undefined);

interface WorkoutProviderProps {
  children: React.ReactNode;
}

export function WorkoutProvider({ children }: WorkoutProviderProps) {
  const [state, dispatch] = useReducer(workoutReducer, {
    workouts: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    loadWorkouts()
      .then((data) => {
        dispatch({ type: 'LOADED', workouts: data });
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'データの読み込みに失敗しました';
        dispatch({ type: 'LOAD_ERROR', error: message });
      });
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      saveWorkouts(state.workouts).catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'データの保存に失敗しました';
        dispatch({ type: 'LOAD_ERROR', error: message });
      });
    }
  }, [state.workouts, state.isLoading]);

  const addWorkout = useCallback((data: WorkoutFormData) => {
    const workout: Workout = {
      id: generateId(),
      date: data.date,
      type: data.type,
      duration: data.duration,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD', workout });
  }, []);

  const updateWorkout = useCallback((id: string, data: WorkoutFormData) => {
    const existing = state.workouts.find((w) => w.id === id);
    if (!existing) {
      return;
    }
    const workout: Workout = {
      id,
      date: data.date,
      type: data.type,
      duration: data.duration,
      notes: data.notes,
      createdAt: existing.createdAt,
    };
    dispatch({ type: 'UPDATE', workout });
  }, [state.workouts]);

  const deleteWorkout = useCallback((id: string) => {
    dispatch({ type: 'DELETE', id });
  }, []);

  const resetAll = useCallback(async () => {
    await clearAll();
    dispatch({ type: 'RESET' });
  }, []);

  const getWorkoutsByDate = useCallback(
    (date: string) => state.workouts.filter((w) => w.date === date),
    [state.workouts]
  );

  const getTodayWorkouts = useCallback(
    () => state.workouts.filter((w) => w.date === getToday()),
    [state.workouts]
  );

  return (
    <WorkoutContext.Provider
      value={{
        workouts: state.workouts,
        isLoading: state.isLoading,
        error: state.error,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        resetAll,
        getWorkoutsByDate,
        getTodayWorkouts,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkouts(): WorkoutContextValue {
  const ctx = useContext(WorkoutContext);
  if (ctx === undefined) {
    throw new Error('useWorkouts must be used within a WorkoutProvider');
  }
  return ctx;
}
