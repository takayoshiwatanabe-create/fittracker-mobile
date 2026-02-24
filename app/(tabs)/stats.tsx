import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useWorkouts } from '@/contexts/WorkoutContext';
import { BarChart } from '@/components/BarChart';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorScreen } from '@/components/ErrorScreen';
import { getDayOfWeekShort, getToday, getWeekDates } from '@/utils/date';
import type { MonthlySummary } from '@/types/workout';

export default function StatsScreen() {
  const { colors } = useTheme();
  const { workouts, isLoading, error } = useWorkouts();

  const today = getToday();

  const weeklyData = useMemo(() => {
    const weekDates = getWeekDates(today);
    return weekDates.map((date) => {
      const dayWorkouts = workouts.filter((w) => w.date === date);
      const total = dayWorkouts.reduce((sum, w) => sum + w.duration, 0);
      return {
        label: getDayOfWeekShort(date),
        value: total,
      };
    });
  }, [workouts, today]);

  const monthlySummary = useMemo((): MonthlySummary => {
    const year = parseInt(today.slice(0, 4), 10);
    const month = parseInt(today.slice(5, 7), 10);
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    const monthWorkouts = workouts.filter((w) => w.date.startsWith(prefix));
    const totalDuration = monthWorkouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCount = monthWorkouts.length;
    const activeDaysSet = new Set(monthWorkouts.map((w) => w.date));
    return {
      totalDuration,
      totalCount,
      averageDuration: totalCount > 0 ? Math.round(totalDuration / totalCount) : 0,
      activeDays: activeDaysSet.size,
    };
  }, [workouts, today]);

  if (isLoading) return <LoadingScreen />;
  if (error !== null) return <ErrorScreen message={error} />;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>今週の運動</Text>
      <BarChart data={weeklyData} />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>今月のサマリー</Text>
      <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SummaryRow label="合計時間" value={`${monthlySummary.totalDuration}分`} colors={colors} />
        <SummaryRow label="運動回数" value={`${monthlySummary.totalCount}回`} colors={colors} />
        <SummaryRow label="平均時間" value={`${monthlySummary.averageDuration}分`} colors={colors} />
        <SummaryRow label="アクティブ日数" value={`${monthlySummary.activeDays}日`} colors={colors} />
      </View>
    </ScrollView>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
  colors: { text: string; textSecondary: string; border: string };
}

function SummaryRow({ label, value, colors }: SummaryRowProps) {
  return (
    <View
      style={[summaryRowStyles.row, { borderBottomColor: colors.border }]}
      accessibilityLabel={`${label}: ${value}`}
    >
      <Text style={[summaryRowStyles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[summaryRowStyles.value, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 12,
  },
  summaryCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
});

const summaryRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 15,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
  },
});
