import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getFirstDayOfWeek, getMonthDays, getToday } from '@/utils/date';

const WEEK_HEADERS = ['日', '月', '火', '水', '木', '金', '土'] as const;

interface CalendarProps {
  year: number;
  month: number;
  selectedDate: string;
  markedDates: Set<string>;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function Calendar({
  year,
  month,
  selectedDate,
  markedDates,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: CalendarProps) {
  const { colors } = useTheme();
  const today = getToday();

  const days = useMemo(() => getMonthDays(year, month), [year, month]);
  const firstDayOfWeek = useMemo(() => getFirstDayOfWeek(year, month), [year, month]);

  const blanks = Array.from<undefined>({ length: firstDayOfWeek });

  return (
    <View
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      accessibilityRole="summary"
      accessibilityLabel={`${year}年${month}月のカレンダー`}
    >
      <View style={styles.header}>
        <Pressable
          onPress={onPrevMonth}
          accessibilityRole="button"
          accessibilityLabel="前月"
          hitSlop={12}
        >
          <Text style={[styles.navButton, { color: colors.primary }]}>◀</Text>
        </Pressable>
        <Text style={[styles.monthTitle, { color: colors.text }]}>
          {year}年{month}月
        </Text>
        <Pressable
          onPress={onNextMonth}
          accessibilityRole="button"
          accessibilityLabel="翌月"
          hitSlop={12}
        >
          <Text style={[styles.navButton, { color: colors.primary }]}>▶</Text>
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEK_HEADERS.map((label) => (
          <View key={label} style={styles.cell}>
            <Text style={[styles.weekLabel, { color: colors.textSecondary }]}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {blanks.map((_, i) => (
          <View key={`blank-${i}`} style={styles.cell} />
        ))}
        {days.map((dateStr) => {
          const dayNum = parseInt(dateStr.slice(-2), 10);
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const isMarked = markedDates.has(dateStr);

          return (
            <Pressable
              key={dateStr}
              style={styles.cell}
              onPress={() => onSelectDate(dateStr)}
              accessibilityRole="button"
              accessibilityLabel={`${month}月${dayNum}日${isMarked ? ' 記録あり' : ''}`}
              accessibilityState={{ selected: isSelected }}
            >
              <View
                style={[
                  styles.dayCircle,
                  isSelected && { backgroundColor: colors.primary },
                  isToday && !isSelected && { borderWidth: 2, borderColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: colors.text },
                    isSelected && { color: '#FFFFFF' },
                  ]}
                >
                  {dayNum}
                </Text>
              </View>
              {isMarked && (
                <View
                  style={[styles.dot, { backgroundColor: colors.primary }]}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  navButton: {
    fontSize: 18,
    padding: 4,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  weekLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 2,
  },
});
