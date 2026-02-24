import React, { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useWorkouts } from '@/contexts/WorkoutContext';
import { DURATION_PRESETS, WORKOUT_TYPE_OPTIONS } from '@/constants/workoutTypes';
import { getToday } from '@/utils/date';
import type { WorkoutType } from '@/types/workout';

export default function AddWorkoutScreen() {
  const { colors } = useTheme();
  const { addWorkout } = useWorkouts();
  const router = useRouter();

  const [selectedType, setSelectedType] = useState<WorkoutType>('ランニング');
  const [duration, setDuration] = useState('30');
  const [notes, setNotes] = useState('');

  const handleSave = useCallback(() => {
    const durationNum = parseInt(duration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('エラー', '有効な運動時間を入力してください');
      return;
    }

    addWorkout({
      type: selectedType,
      duration: durationNum,
      notes,
      date: getToday(),
    });

    setSelectedType('ランニング');
    setDuration('30');
    setNotes('');
    router.navigate('/(tabs)');
  }, [selectedType, duration, notes, addWorkout, router]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.label, { color: colors.text }]}>種目</Text>
        <View style={styles.typeGrid}>
          {WORKOUT_TYPE_OPTIONS.map((option) => (
            <Pressable
              key={option.label}
              style={[
                styles.typeButton,
                { borderColor: colors.border, backgroundColor: colors.card },
                selectedType === option.label && {
                  borderColor: colors.primary,
                  backgroundColor: colors.primaryLight,
                },
              ]}
              onPress={() => setSelectedType(option.label)}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedType === option.label }}
              accessibilityLabel={option.label}
            >
              <Text style={styles.typeIcon}>{option.icon}</Text>
              <Text
                style={[
                  styles.typeLabel,
                  { color: colors.text },
                  selectedType === option.label && { color: colors.primary, fontWeight: '700' },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>時間（分）</Text>
        <View style={styles.durationRow}>
          {DURATION_PRESETS.map((preset) => (
            <Pressable
              key={preset}
              style={[
                styles.presetButton,
                { borderColor: colors.border, backgroundColor: colors.card },
                duration === String(preset) && {
                  borderColor: colors.primary,
                  backgroundColor: colors.primaryLight,
                },
              ]}
              onPress={() => setDuration(String(preset))}
              accessibilityRole="button"
              accessibilityLabel={`${preset}分`}
            >
              <Text
                style={[
                  styles.presetText,
                  { color: colors.text },
                  duration === String(preset) && { color: colors.primary, fontWeight: '700' },
                ]}
              >
                {preset}
              </Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border, backgroundColor: colors.card },
          ]}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
          placeholder="カスタム時間"
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel="運動時間入力"
        />

        <Text style={[styles.label, { color: colors.text }]}>メモ</Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            { color: colors.text, borderColor: colors.border, backgroundColor: colors.card },
          ]}
          value={notes}
          onChangeText={setNotes}
          placeholder="メモを入力（任意）"
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
          accessibilityLabel="メモ入力"
        />

        <Pressable
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel="運動を保存"
        >
          <Text style={styles.saveButtonText}>保存する</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  typeIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  typeLabel: {
    fontSize: 14,
  },
  durationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  presetText: {
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
