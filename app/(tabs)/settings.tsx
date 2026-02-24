import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useWorkouts } from '@/contexts/WorkoutContext';

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const { mode, colors, toggleTheme } = useTheme();
  const { resetAll } = useWorkouts();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = useCallback(() => {
    Alert.alert(
      'データリセット',
      'すべての運動記録とテーマ設定を削除します。この操作は元に戻せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'リセット',
          style: 'destructive',
          onPress: async () => {
            setIsResetting(true);
            try {
              await resetAll();
            } finally {
              setIsResetting(false);
            }
          },
        },
      ]
    );
  }, [resetAll]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>外観</Text>
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

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>データ</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Pressable
          style={styles.row}
          onPress={handleReset}
          disabled={isResetting}
          accessibilityRole="button"
          accessibilityLabel="全データリセット"
          accessibilityHint="すべての運動記録と設定を削除します"
        >
          <View>
            <Text style={[styles.rowTitle, { color: colors.error }]}>全データリセット</Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
              すべての運動記録と設定を削除
            </Text>
          </View>
          {isResetting && <ActivityIndicator color={colors.error} />}
        </Pressable>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>アプリ情報</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.row}>
          <Text style={[styles.rowTitle, { color: colors.text }]}>バージョン</Text>
          <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{APP_VERSION}</Text>
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 4,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
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
  rowValue: {
    fontSize: 16,
  },
});
