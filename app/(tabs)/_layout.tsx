import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

function TabIcon({ label, color }: { label: string; color: string }) {
  return (
    <Text
      style={[styles.tabIcon, { color }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {label}
    </Text>
  );
}

export default function TabLayout() {
  const { colors, mode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        headerShadowVisible: mode === 'light',
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color }) => <TabIcon label="🏠" color={color} />,
          tabBarAccessibilityLabel: 'ホーム画面 タブ',
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '記録',
          tabBarIcon: ({ color }) => <TabIcon label="➕" color={color} />,
          tabBarAccessibilityLabel: '運動記録追加 タブ',
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: '統計',
          tabBarIcon: ({ color }) => <TabIcon label="📊" color={color} />,
          tabBarAccessibilityLabel: '統計画面 タブ',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '設定',
          tabBarIcon: ({ color }) => <TabIcon label="⚙️" color={color} />,
          tabBarAccessibilityLabel: '設定画面 タブ',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 22,
  },
});
