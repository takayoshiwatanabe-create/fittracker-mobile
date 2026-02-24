import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useWorkouts } from '@/contexts/WorkoutContext';
import { Calendar } from '@/components/Calendar';
import { WorkoutCard } from '@/components/WorkoutCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorScreen } from '@/components/ErrorScreen';
import { getToday } from '@/utils/date';
import type { Workout } from '@/types/workout';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { workouts, isLoading, error, deleteWorkout } = useWorkouts();

  const today = getToday();
  const [selectedDate, setSelectedDate] = useState(today);
  const [year, setYear] = useState(() => parseInt(today.slice(0, 4), 10));
  const [month, setMonth] = useState(() => parseInt(today.slice(5, 7), 10));

  const markedDates = useMemo(() => {
    const set = new Set<string>();
    for (const w of workouts) {
      set.add(w.date);
    }
    return set;
  }, [workouts]);

  const filteredWorkouts = useMemo(
    () => workouts.filter((w) => w.date === selectedDate),
    [workouts, selectedDate]
  );

  const handlePrevMonth = useCallback(() => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }, [month]);

  const handleNextMonth = useCallback(() => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }, [month]);

  const renderWorkout = useCallback(
    ({ item }: { item: Workout }) => (
      <WorkoutCard
        workout={item}
        onDelete={() => deleteWorkout(item.id)}
      />
    ),
    [deleteWorkout]
  );

  if (isLoading) return <LoadingScreen />;
  if (error !== null) return <ErrorScreen message={error} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredWorkouts}
        keyExtractor={(item) => item.id}
        renderItem={renderWorkout}
        ListHeaderComponent={
          <View style={styles.calendarWrapper}>
            <Calendar
              year={year}
              month={month}
              selectedDate={selectedDate}
              markedDates={markedDates}
              onSelectDate={setSelectedDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {selectedDate === today ? '今日の記録' : `${selectedDate} の記録`}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            記録がありません
          </Text>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarWrapper: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  list: {
    padding: 16,
  },
  empty: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
  },
});
