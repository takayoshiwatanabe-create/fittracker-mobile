import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { WorkoutProvider } from '@/contexts/WorkoutContext';
import { LoadingScreen } from '@/components/LoadingScreen';

function RootNavigator() {
  const { mode, colors, isLoading } = useTheme();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View
      style={[styles.root, { backgroundColor: colors.background }]}
      accessibilityRole="summary"
      accessibilityLabel="FitTracker アプリ"
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <WorkoutProvider>
        <RootNavigator />
      </WorkoutProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
