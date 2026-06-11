# 実装進捗ステータス

> エージェントはタスクを完了したら該当行の `[ ]` を `[x]` に更新すること。  
> 各Phaseの **✅ 完了確認** をすべてパスしてから次のPhaseに進むこと。  
> 1回の作業依頼で実装するのは **1タスクのみ**。

---

## Phase 0 ― Next.js 起動確認

**ゴール: `pnpm dev` でブラウザにトップページが表示される**

### セットアップ
- [x] Next.js + TypeScript のプロジェクトを作成する（`pnpm create next-app`・App Router使用）
- [x] `next.config.ts` に `output: 'export'` / `trailingSlash: true` / `images: { unoptimized: true }` を設定する
- [x] Tailwind CSS の設定を確認する（create next-app で同時導入）
- [x] Framer Motion を導入する（`pnpm add framer-motion`）
- [x] Recharts を導入する（`pnpm add recharts`）
- [x] `.env.example` を作成する（`NEXT_PUBLIC_` プレフィックス形式で）
- [x] `.env.local` が `.gitignore` に含まれていることを確認する

### ✅ 完了確認
- [x] `pnpm lint` がエラーなしで完了する
- [x] `pnpm build` が成功し `out/` ディレクトリが生成される
- [x] `pnpm dev` でブラウザに Next.js のトップページが表示される

---

## Phase 1 ― Firebase接続・Googleログイン

**ゴール: Googleサインインが成功し、uidが画面に表示される**

### Firebase SDK 導入
- [x] Firebase SDK を導入する（`pnpm add firebase`）
- [x] `src/lib/firebase.ts` でFirebaseを初期化する（`.env.local` の環境変数を使用）

### 認証
- [x] `useAuth.ts` フックを実装する（サインイン・サインアウト・認証状態監視）
- [x] `src/app/login/page.tsx` を実装する（Googleサインインボタン）
- [x] `AuthGuard.tsx`（Client Component）を実装する（`usePathname()` で `/login` を除外してリダイレクト）
- [x] `src/app/layout.tsx` から `AuthGuard.tsx` を呼び出す
- [x] サインイン後のトップページにログイン中のユーザー名・uidを表示する

### Firestore初期設定
- [x] `firestore.rules` にセキュリティルールを記述する（`docs/requirements.md` 参照）
- [x] Firestoreコンソールでセキュリティルールが反映されていることを確認する

### ✅ 完了確認
- [x] `pnpm build` が成功する
- [x] Googleサインインが成功する
- [x] サインイン後にユーザー名・uidが画面に表示される
- [x] 未サインイン状態でトップページにアクセスすると `/login` へリダイレクトされる
- [x] 別のユーザーIDのFirestoreパスにアクセスできないことを確認する

---

## Phase 2 ― 習慣のCRUD

**ゴール: 習慣の登録・編集・削除がFirestoreに反映される**

### 型定義・データ層
- [x] `src/types/index.ts` に `Habit` / `Record` / `Summary` の型を定義する
- [x] `src/lib/firestore.ts` に習慣の読み書き関数を実装する
- [x] `useHabits.ts` フックを実装する

### UI
- [x] `HabitForm.tsx` を実装する（名前・絵文字・メモ・カテゴリ・実施曜日）
- [x] `src/app/habits/new/page.tsx` を実装する
- [x] `src/app/habits/edit/page.tsx` を実装する（habitIdは `useSearchParams()` で取得）
- [x] `HabitList.tsx` を実装する（一覧表示・編集リンク・削除ボタン）
- [x] `src/app/habits/page.tsx` を実装する

### ✅ 完了確認
- [x] `pnpm build` が成功する
- [x] 習慣を新規登録するとFirestoreコンソールに追加される
- [x] 習慣を編集するとFirestoreコンソールの値が更新される
- [x] 習慣を削除すると `isActive: false` に更新される（物理削除されない）

---

## Phase 3 ― 今日のチェック機能

**ゴール: 今日の習慣をチェックするとFirestoreに記録される**

### データ層
- [x] `useRecords.ts` フックを実装する
- [x] `src/utils/dateUtils.ts` に日付ユーティリティ関数を実装する

### UI
- [x] `HabitCard.tsx` を実装する（チェックボタン・完了時のグレーアウト・取り消し線）
- [x] `ProgressBar.tsx` を実装する（達成率バー）
- [x] `src/app/page.tsx` を実装する（今日の習慣一覧・達成率表示）
- [ ] `Header.tsx` を実装する（タイトル・サインアウトメニュー）
- [ ] `BottomNav.tsx` を実装する（スマホ向けボトムナビゲーション）

### ✅ 完了確認
- [ ] `pnpm build` が成功する
- [ ] 今日の曜日に設定された習慣だけが一覧に表示される
- [ ] チェックするとFirestoreコンソールに `completed: true` のrecordが追加される
- [ ] 再度チェックすると `completed: false` に戻る
- [ ] 達成率が正しく計算されて表示される

---

## Phase 4 ― Firebase Hostingへのデプロイ

**ゴール: 公開URLでアプリが動作する**

### デプロイ設定
- [ ] Firebase CLI を開発依存として導入する（`pnpm add -D firebase-tools`）
- [ ] `package.json` の `scripts` に以下を追加する
  ```json
  "firebase:login": "firebase login",
  "firebase:init": "firebase init hosting",
  "deploy": "firebase deploy --only hosting"
  ```
- [ ] `pnpm firebase:login` でFirebaseにサインインする
- [ ] `pnpm firebase:init` を実行し `out` ディレクトリを指定する
- [ ] `firebase.json` の `public` が `"out"` になっていることを確認する

### デプロイ実行
- [ ] `pnpm build` でビルドが成功することを確認する
- [ ] `pnpm deploy` でデプロイする

### ✅ 完了確認
- [ ] 公開URLにアクセスしてアプリが表示される
- [ ] 公開URL上でGoogleサインインが成功する
- [ ] 公開URL上で習慣の登録・チェックがFirestoreに反映される
- [ ] スマホのブラウザからも公開URLにアクセスできる

---

## Phase 5 ― アニメーション・ストリーク・統計

**ゴール: チェックアニメーション・連続日数・グラフが表示される**

### アニメーション
- [ ] `CheckAnimation.tsx` を実装する（Framer Motionでチェック時アニメーション）
- [ ] `HabitCard.tsx` にアニメーションを組み込む

### ストリーク
- [ ] `useStreak.ts` フックを実装する（連続達成日数の計算ロジック）
- [ ] `StreakBadge.tsx` を実装する（「🔥 12日連続達成中！」表示）
- [ ] `src/app/page.tsx` にストリーク表示を追加する

### 統計
- [ ] `src/utils/statsUtils.ts` に統計計算ユーティリティを実装する
- [ ] `WeeklyGrid.tsx` を実装する（7日分のマス目ビュー）
- [ ] `MonthlyCalendar.tsx` を実装する（達成日が色付きのカレンダー）
- [ ] `RateBarChart.tsx` を実装する（Rechartsの棒グラフ・週/月切り替え）
- [ ] `src/app/stats/page.tsx` を実装する

### レスポンシブ対応
- [ ] スマートフォン（375px）での表示・操作を確認し崩れを修正する
- [ ] タブレット・PC表示を確認し調整する

### ✅ 完了確認
- [ ] `pnpm build` が成功する
- [ ] チェック時にアニメーションが表示される
- [ ] 連続達成日数が正しく計算されて表示される
- [ ] 統計画面で週間・月間のグラフが表示される
- [ ] `firebase deploy` でデプロイし公開URLでも動作確認する

---

## Phase 6 ― ダッシュボード連携・品質仕上げ

**ゴール: summaryが自動更新され、将来のダッシュボードから参照できる**

### ダッシュボード連携
- [ ] `src/lib/summary.ts` に summaryドキュメント更新処理を実装する
- [ ] チェック操作完了時に `users/{userId}/summary/latest` を自動更新する
- [ ] Firestoreコンソールで `summary/latest` の内容が更新されることを確認する

### 品質仕上げ
- [ ] Firestoreのオフラインキャッシュを有効化する
- [ ] バリデーションを強化する（習慣名の必須・文字数制限など）
- [ ] エラー発生時のUI表示（トースト通知など）を整える
- [ ] Firestoreセキュリティルールの最終確認をする

### ✅ 完了確認
- [ ] `pnpm build` が成功する
- [ ] チェック操作のたびに `summary/latest` が更新される
- [ ] 他ユーザーのデータにアクセスできないことをセキュリティルールで確認する
- [ ] ネットワークを切断した状態でも既存データが表示される
- [ ] `firebase deploy` でデプロイし公開URLで全機能を最終確認する

---

## 全体完了条件

- [ ] Phase 0〜6 のすべての完了確認がパスしている
- [ ] スマホ・PCの両方でログインからチェックまで一通り動作する
- [ ] `summary/latest` がチェック操作のたびに更新されている
