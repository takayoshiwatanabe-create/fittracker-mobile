import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const { mode, colors, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Pressable
          style={styles.row}
          onPress={toggleTheme}
          accessibilityRole="switch"
          accessibilityLabel="ダークモード"
          accessibilityState={{ checked: mode === 'dark' }}
        >
          <View>
            <Text style={[styles.rowTitle, { color: colors.text }]}>ダークモード</Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
              {mode === 'dark' ? 'オン' : 'オフ'}
            </Text>
          </View>
          <Switch
            value={mode === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </Pressable>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.row}>
          <Text style={[styles.rowTitle, { color: colors.text }]}>バージョン</Text>
          <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>1.0.0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
});
