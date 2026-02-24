import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Workout } from '@/types/workout';
import { useTheme } from '@/contexts/ThemeContext';
import { formatDuration } from '@/utils/date';
import { WORKOUT_TYPE_OPTIONS } from '@/constants/workoutTypes';

interface WorkoutCardProps {
  workout: Workout;
  onPress?: () => void;
  onDelete?: () => void;
}

export function WorkoutCard({ workout, onPress, onDelete }: WorkoutCardProps) {
  const { colors } = useTheme();
  const typeOption = WORKOUT_TYPE_OPTIONS.find((o) => o.label === workout.type);
  const icon = typeOption?.icon ?? '⭐';

  return (
    <Pressable
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${workout.type} ${formatDuration(workout.duration)}`}
    >
      <View style={styles.row}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.content}>
          <Text style={[styles.type, { color: colors.text }]}>{workout.type}</Text>
          <Text style={[styles.duration, { color: colors.textSecondary }]}>
            {formatDuration(workout.duration)}
          </Text>
          {workout.notes.length > 0 && (
            <Text
              style={[styles.notes, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {workout.notes}
            </Text>
          )}
        </View>
        {onDelete !== undefined && (
          <Pressable
            onPress={onDelete}
            style={styles.deleteButton}
            accessibilityRole="button"
            accessibilityLabel="削除"
            hitSlop={8}
          >
            <Text style={[styles.deleteText, { color: colors.error }]}>削除</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
  },
  duration: {
    fontSize: 14,
    marginTop: 2,
  },
  notes: {
    fontSize: 13,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
