# Project Design Specification

This file is the single source of truth for this project. All code must conform to this specification.

## Constitution (Project Rules)
# プロジェクト憲法

## 品質基準
- TypeScript strict mode必須、any禁止
- 全画面でローディング・エラー状態をハンドル
- アクセシビリティ: VoiceOver/TalkBack対応

## セキュリティ
- ユーザーデータはローカルストレージ（AsyncStorage）に保存
- 外部APIは使用しない（オフラインファースト）

## アーキテクチャ制約
- Expo SDK 52 + Expo Router
- 状態管理はReact Context + useReducer
- スタイルはStyleSheet.createを使用

## Design Specification
# 設計仕様書

## システムアーキテクチャ
- React Native + Expo (Managed workflow)
- Expo Router (ファイルベースルーティング)
- AsyncStorage (ローカルデータ永続化)
- React Context (グローバル状態管理)

## 画面構成
1. **/(tabs)/index** - ホーム画面（カレンダー + 今日の記録サマリー）
2. **/(tabs)/add** - 運動記録追加画面
3. **/(tabs)/stats** - 統計画面（週間/月間グラフ）
4. **/(tabs)/settings** - 設定画面（ダークモード切替）

## データモデル
```typescript
interface Workout {
  id: string;
  date: string; // YYYY-MM-DD
  type: string; // ランニング, 筋トレ, ヨガ, etc.
  duration: number; // minutes
  notes: string;
  createdAt: string;
}
```

## コンポーネント階層
- App (RootLayout)
  - TabLayout (/(tabs)/_layout)
    - HomeScreen (カレンダー + WorkoutList)
    - AddWorkoutScreen (フォーム)
    - StatsScreen (BarChart + Summary)
    - SettingsScreen (テーマ切替)

## 状態管理
- WorkoutContext: CRUD操作 + AsyncStorage同期
- ThemeContext: ダーク/ライトモード

## Development Instructions
# 開発指示書

## Phase 1: Scaffold
- Expo Router タブナビゲーション設定
- 基本レイアウト（_layout.tsx）
- テーマProvider設定

## Phase 2: データ層
- WorkoutContext + useReducer
- AsyncStorage wrapper
- TypeScript型定義

## Phase 3: ホーム画面
- カレンダーコンポーネント（月表示）
- 日付選択 → その日の運動リスト表示
- WorkoutCard コンポーネント

## Phase 4: 運動追加画面
- フォーム（種目選択、時間入力、メモ）
- バリデーション
- 保存後ホームへ遷移

## Phase 5: 統計画面
- 週間バーチャート（日別運動時間）
- 月間サマリー（合計時間、回数、平均）

## Phase 6: 設定 + ダークモード
- ThemeContext実装
- useColorScheme連携
- 全画面にダークモード適用

## テスト戦略
- Jest + jest-expo
- Context層のユニットテスト
- ユーティリティ関数テスト

## Technical Stack
- React Native + Expo SDK 52 + TypeScript (strict mode)
- Expo Router for navigation
- Jest for unit tests
- EAS Build + EAS Submit for deployment

## Code Standards
- TypeScript strict mode, no `any`
- Minimal comments — code should be self-documenting
- Use path alias `@/` for imports from project root
- All components use functional style with proper typing
- Use StyleSheet.create for styles
- Follow React Native best practices for cross-platform compatibility
