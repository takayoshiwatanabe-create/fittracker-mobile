import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { formatDuration } from '@/utils/date';
import type { MonthlySummary } from '@/types/workout';

interface StatsSummaryProps {
  summary: MonthlySummary;
}

interface SummaryRowProps {
  label: string;
  value: string;
  isLast: boolean;
}

function SummaryRow({ label, value, isLast }: SummaryRowProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.row,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
      ]}
      accessibilityLabel={`${label}: ${value}`}
    >
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

export function StatsSummary({ summary }: StatsSummaryProps) {
  const { colors } = useTheme();

  const rows: { label: string; value: string }[] = [
    { label: '合計時間', value: formatDuration(summary.totalDuration) },
    { label: '運動回数', value: `${summary.totalCount}回` },
    { label: '平均時間', value: formatDuration(summary.averageDuration) },
    { label: 'アクティブ日数', value: `${summary.activeDays}日` },
  ];

  const hasData = summary.totalCount > 0;

  return (
    <View
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      accessibilityRole="summary"
      accessibilityLabel={
        hasData
          ? `今月のサマリー。合計${formatDuration(summary.totalDuration)}、${summary.totalCount}回の運動`
          : '今月のサマリー。記録なし'
      }
    >
      {hasData ? (
        rows.map((row, index) => (
          <SummaryRow
            key={row.label}
            label={row.label}
            value={row.value}
            isLast={index === rows.length - 1}
          />
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            今月の記録はまだありません
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: {
    fontSize: 15,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
