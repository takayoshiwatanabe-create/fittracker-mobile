import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { formatDuration } from '@/utils/date';

interface BarChartItem {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarChartItem[];
  unit?: string;
}

const CHART_HEIGHT = 200;
const GRID_LINES = 4;

function computeGridMax(maxValue: number): number {
  if (maxValue <= 0) return 60;
  const raw = Math.ceil(maxValue / GRID_LINES) * GRID_LINES;
  const step = Math.ceil(raw / GRID_LINES / 10) * 10;
  return step * GRID_LINES;
}

export function BarChart({ data, unit = '分' }: BarChartProps) {
  const { colors } = useTheme();

  const maxValue = Math.max(...data.map((d) => d.value), 0);
  const hasData = maxValue > 0;
  const gridMax = computeGridMax(maxValue);

  const gridLines = Array.from({ length: GRID_LINES + 1 }, (_, i) => {
    const value = Math.round((gridMax / GRID_LINES) * (GRID_LINES - i));
    const top = (i / GRID_LINES) * CHART_HEIGHT;
    return { value, top };
  });

  return (
    <View
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      accessibilityRole="summary"
      accessibilityLabel={
        hasData
          ? `週間運動グラフ。最大${formatDuration(maxValue)}`
          : '週間運動グラフ。データなし'
      }
    >
      <View style={styles.chartArea}>
        <View style={styles.yAxis}>
          {gridLines.map((line) => (
            <View
              key={line.value}
              style={[styles.yLabel, { top: line.top }]}
            >
              <Text style={[styles.yLabelText, { color: colors.textSecondary }]}>
                {line.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.chartBody}>
          {gridLines.map((line) => (
            <View
              key={`grid-${line.value}`}
              style={[
                styles.gridLine,
                { top: line.top, borderBottomColor: colors.border },
              ]}
            />
          ))}

          <View style={styles.barsRow}>
            {data.map((item) => {
              const heightPercent = hasData
                ? (item.value / gridMax) * 100
                : 0;
              const isActive = item.value > 0;

              return (
                <View
                  key={item.label}
                  style={styles.barColumn}
                  accessibilityLabel={
                    isActive
                      ? `${item.label}曜日: ${formatDuration(item.value)}`
                      : `${item.label}曜日: 記録なし`
                  }
                >
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${Math.max(heightPercent, isActive ? 3 : 0)}%`,
                          backgroundColor: isActive ? colors.primary : 'transparent',
                          opacity: isActive ? 1 : 0,
                        },
                      ]}
                    >
                      {isActive && (
                        <View
                          style={[
                            styles.barHighlight,
                            { backgroundColor: colors.primaryLight },
                          ]}
                        />
                      )}
                    </View>
                  </View>
                  <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>
                    {item.label}
                  </Text>
                </View>
              );
            })}
          </View>

          {!hasData && (
            <View style={styles.emptyOverlay}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                今週の記録はまだありません
              </Text>
            </View>
          )}
        </View>
      </View>

      {hasData && (
        <View style={styles.valueSummary}>
          {data.map((item) =>
            item.value > 0 ? (
              <View key={item.label} style={styles.valueChip}>
                <Text style={[styles.valueChipDay, { color: colors.textSecondary }]}>
                  {item.label}
                </Text>
                <Text style={[styles.valueChipValue, { color: colors.text }]}>
                  {item.value}
                  {unit}
                </Text>
              </View>
            ) : null,
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  chartArea: {
    flexDirection: 'row',
    height: CHART_HEIGHT,
  },
  yAxis: {
    width: 32,
    position: 'relative',
  },
  yLabel: {
    position: 'absolute',
    right: 4,
    transform: [{ translateY: -7 }],
  },
  yLabelText: {
    fontSize: 10,
    fontVariant: ['tabular-nums'],
  },
  chartBody: {
    flex: 1,
    marginLeft: 8,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  barsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 24,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    flex: 1,
    width: '55%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden',
  },
  barHighlight: {
    height: 6,
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    opacity: 0.5,
  },
  dayLabel: {
    position: 'absolute',
    bottom: 0,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  valueSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  valueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  valueChipDay: {
    fontSize: 11,
    fontWeight: '600',
  },
  valueChipValue: {
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
