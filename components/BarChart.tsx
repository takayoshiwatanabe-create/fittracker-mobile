import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface BarChartItem {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarChartItem[];
  unit?: string;
}

export function BarChart({ data, unit = '分' }: BarChartProps) {
  const { colors } = useTheme();

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      accessibilityRole="summary"
      accessibilityLabel="週間運動グラフ"
    >
      <View style={styles.chart}>
        {data.map((item) => {
          const heightPercent = (item.value / maxValue) * 100;
          return (
            <View key={item.label} style={styles.barColumn}>
              <Text style={[styles.value, { color: colors.textSecondary }]}>
                {item.value > 0 ? `${item.value}${unit}` : ''}
              </Text>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${heightPercent}%`,
                      backgroundColor: item.value > 0 ? colors.primary : colors.border,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                {item.label}
              </Text>
            </View>
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
    padding: 16,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    fontSize: 10,
    marginBottom: 4,
  },
  barWrapper: {
    flex: 1,
    width: '60%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  label: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
});
