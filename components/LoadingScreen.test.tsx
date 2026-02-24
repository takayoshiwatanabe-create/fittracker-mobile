import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { LoadingScreen } from './LoadingScreen';

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

describe('LoadingScreen', () => {
  it('renders without crashing', () => {
    render(<LoadingScreen />);
    expect(screen.getByLabelText('読み込み中')).toBeTruthy();
  });

  it('renders an ActivityIndicator', () => {
    const { UNSAFE_getByType } = render(<LoadingScreen />);
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });
});
