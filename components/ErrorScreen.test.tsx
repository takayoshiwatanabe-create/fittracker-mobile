import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ErrorScreen } from './ErrorScreen';

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

describe('ErrorScreen', () => {
  it('renders error message', () => {
    render(<ErrorScreen message="データの読み込みに失敗しました" />);
    expect(screen.getByText('データの読み込みに失敗しました')).toBeTruthy();
  });

  it('renders warning icon', () => {
    render(<ErrorScreen message="Error" />);
    expect(screen.getByText('⚠️')).toBeTruthy();
  });

  it('renders retry button when onRetry is provided', () => {
    const onRetry = jest.fn();
    render(<ErrorScreen message="Error" onRetry={onRetry} />);
    expect(screen.getByText('再試行')).toBeTruthy();
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorScreen message="Error" />);
    expect(screen.queryByText('再試行')).toBeNull();
  });

  it('calls onRetry when retry button is pressed', () => {
    const onRetry = jest.fn();
    render(<ErrorScreen message="Error" onRetry={onRetry} />);
    fireEvent.press(screen.getByText('再試行'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('has alert accessibility role', () => {
    render(<ErrorScreen message="Error" />);
    expect(screen.getByRole('alert')).toBeTruthy();
  });
});
