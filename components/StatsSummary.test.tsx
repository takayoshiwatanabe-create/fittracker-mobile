import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { StatsSummary } from './StatsSummary';
import type { MonthlySummary } from '@/types/workout';

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      background: '#F5F5F5',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textSecondary: '#6B7280',
      primary: '#3B82F6',
      primaryLight: '#DBEAFE',
      border: '#E5E7EB',
      error: '#EF4444',
      success: '#22C55E',
      card: '#FFFFFF',
      tabBar: '#FFFFFF',
      tabBarInactive: '#9CA3AF',
    },
  }),
}));

describe('StatsSummary', () => {
  const summaryWithData: MonthlySummary = {
    totalDuration: 150,
    totalCount: 5,
    averageDuration: 30,
    activeDays: 4,
  };

  const emptySummary: MonthlySummary = {
    totalDuration: 0,
    totalCount: 0,
    averageDuration: 0,
    activeDays: 0,
  };

  it('renders summary labels when data exists', () => {
    render(<StatsSummary summary={summaryWithData} />);
    expect(screen.getByText('合計時間')).toBeTruthy();
    expect(screen.getByText('運動回数')).toBeTruthy();
    expect(screen.getByText('平均時間')).toBeTruthy();
    expect(screen.getByText('アクティブ日数')).toBeTruthy();
  });

  it('renders formatted duration values', () => {
    render(<StatsSummary summary={summaryWithData} />);
    expect(screen.getByText('2時間30分')).toBeTruthy();
    expect(screen.getByText('30分')).toBeTruthy();
  });

  it('renders count and active days', () => {
    render(<StatsSummary summary={summaryWithData} />);
    expect(screen.getByText('5回')).toBeTruthy();
    expect(screen.getByText('4日')).toBeTruthy();
  });

  it('renders empty state message when no data', () => {
    render(<StatsSummary summary={emptySummary} />);
    expect(screen.getByText('今月の記録はまだありません')).toBeTruthy();
  });

  it('does not render summary rows when no data', () => {
    render(<StatsSummary summary={emptySummary} />);
    expect(screen.queryByText('合計時間')).toBeNull();
    expect(screen.queryByText('運動回数')).toBeNull();
  });
});
