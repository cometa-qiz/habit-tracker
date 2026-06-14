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
- [x] `Header.tsx` を実装する（タイトル・サインアウトメニュー）
- [x] `BottomNav.tsx` を実装する（スマホ向けボトムナビゲーション）

### ✅ 完了確認
- [x] `pnpm build` が成功する
- [x] 今日の曜日に設定された習慣だけが一覧に表示される
- [x] チェックするとFirestoreコンソールに `completed: true` のrecordが追加される
- [x] 再度チェックすると `completed: false` に戻る
- [x] 達成率が正しく計算されて表示される

---

## Phase 4 ― Firebase Hostingへのデプロイ

**ゴール: 公開URLでアプリが動作する**

### デプロイ設定
- [x] Firebase CLI を開発依存として導入する（`pnpm add -D firebase-tools`）
- [x] `package.json` の `scripts` に以下を追加する
  ```json
  "firebase:login": "firebase login",
  "firebase:init": "firebase init hosting",
  "deploy": "firebase deploy --only hosting"
  ```
- [x] `pnpm firebase:login` でFirebaseにサインインする
- [x] `pnpm firebase:init` を実行し `out` ディレクトリを指定する
- [x] `firebase.json` の `public` が `"out"` になっていることを確認する

### デプロイ実行
- [x] `pnpm build` でビルドが成功することを確認する
- [x] `pnpm deploy` でデプロイする

### ✅ 完了確認
- [x] 公開URLにアクセスしてアプリが表示される
- [x] 公開URL上でGoogleサインインが成功する
- [x] 公開URL上で習慣の登録・チェックがFirestoreに反映される
- [x] スマホのブラウザからも公開URLにアクセスできる

---

## Phase 5 ― アニメーション・ストリーク・統計

**ゴール: チェックアニメーション・連続日数・グラフが表示される**

### アニメーション
- [x] `CheckAnimation.tsx` を実装する（Framer Motionでチェック時アニメーション）
- [x] `HabitCard.tsx` にアニメーションを組み込む

### ストリーク
- [x] `useStreak.ts` フックを実装する（連続達成日数の計算ロジック）
- [x] `StreakBadge.tsx` を実装する（「🔥 12日連続達成中！」表示）
- [x] `src/app/page.tsx` にストリーク表示を追加する

### 統計
- [x] `src/utils/statsUtils.ts` に統計計算ユーティリティを実装する
- [x] `WeeklyGrid.tsx` を実装する（7日分のマス目ビュー）
- [x] `MonthlyCalendar.tsx` を実装する（達成日が色付きのカレンダー）
- [x] `RateBarChart.tsx` を実装する（Rechartsの棒グラフ・週/月切り替え）
- [x] `src/app/stats/page.tsx` を実装する

### レスポンシブ対応
- [x] スマートフォン（375px）での表示・操作を確認し崩れを修正する
- [x] タブレット・PC表示を確認し調整する

### ✅ 完了確認
- [x] `pnpm build` が成功する
- [x] チェック時にアニメーションが表示される
- [x] 連続達成日数が正しく計算されて表示される
- [x] 統計画面で週間・月間のグラフが表示される
- [x] `firebase deploy` でデプロイし公開URLでも動作確認する

---

## Phase 6 ― ダッシュボード連携・品質仕上げ

**ゴール: summaryが自動更新され、将来のダッシュボードから参照できる**

### ダッシュボード連携
- [x] `src/lib/summary.ts` に summaryドキュメント更新処理を実装する
- [x] チェック操作完了時に `users/{userId}/summary/latest` を自動更新する
- [x] Firestoreコンソールで `summary/latest` の内容が更新されることを確認する

### 品質仕上げ
- [x] Firestoreのオフラインキャッシュを有効化する
- [x] バリデーションを強化する（習慣名の必須・文字数制限など）
- [x] エラー発生時のUI表示（トースト通知など）を整える
- [x] Firestoreセキュリティルールの最終確認をする

### ✅ 完了確認
- [x] `pnpm build` が成功する
- [x] チェック操作のたびに `summary/latest` が更新される
- [x] 他ユーザーのデータにアクセスできないことをセキュリティルールで確認する
- [x] ネットワークを切断した状態でも既存データが表示される
- [x] `firebase deploy` でデプロイし公開URLで全機能を最終確認する

---

## Phase 7 ― 機能追加・改善

**ゴール: 入力・記録・出力まわりの使い勝手を改善し、スマホ表示の崩れを直す**

### 統計グラフの修正（スマホ）
- [x] `RateBarChart.tsx` の XAxis ラベルがスマホ幅（375px）で重ならないよう修正する（日付を `M/D` 形式に短縮 ＋ 必要に応じて `interval` で間引く）
- [ ] スマホ幅（375px）で週別グラフの日付ラベルが崩れないことを確認する

### 入力UIの改善
- [ ] カテゴリの固定候補リストを定数として定義する（例: `健康` / `運動` / `勉強` / `仕事` / `生活` / `趣味` / `その他`）
- [ ] `EmojiPicker.tsx` を候補グリッドからの選択方式にする（自由入力を廃止）
- [ ] `HabitForm.tsx` の絵文字入力を `EmojiPicker.tsx` に置き換える
- [ ] `HabitForm.tsx` のカテゴリ入力を固定候補のプルダウン ＋「新規追加」入力の併用にする（`category` は string のまま）

### 過去日の記録修正（TODO記入忘れ対応）
- [ ] `src/utils/dateUtils.ts` に日付選択・曜日判定のユーティリティを追加する（今日以前のみ許可）
- [ ] 過去日付を選べる日付ピッカーUIを実装する（未来日は選択不可）
- [ ] 選んだ日付の「その曜日が対象の習慣」を一覧表示し、`HabitCard` で完了状態をトグルできるようにする
- [ ] トグル時に `recordId = ${selectedDate}_${habitId}` の record を上書き更新する（新規作成しない）
- [ ] 過去日を修正したあと、ストリーク・統計に正しく反映されることを確認する

### 統計カレンダーの月移動
- [ ] `MonthlyCalendar.tsx` に「表示中の月」の state と前月／翌月ボタンを追加する
- [ ] 表示中の月の records を取得して達成日を色付き表示する
- [ ] 翌月ボタンが当月より先に進めないよう制限する

### データエクスポート（AIレビュー導線）
- [ ] `users/{userId}` 配下の habits ＋ records をまとめて JSON でダウンロードする処理を実装する（クライアントサイド・Blob使用）
- [ ] 同じデータを CSV 形式でもダウンロードできるようにする
- [ ] エクスポートボタンを統計画面に配置する
- [ ] 書き出したデータをAIに貼り付けてレビューしてもらうための手順表示（プロンプト例つき）を用意する

### ✅ 完了確認
- [ ] `pnpm lint` がエラーなしで完了する
- [ ] `pnpm build` が成功し `out/` が生成される
- [ ] スマホ幅（375px）で週別グラフの日付が崩れない
- [ ] 絵文字・カテゴリが候補選択／プルダウンで入力できる
- [ ] 過去日のチェックを修正でき、ストリーク・統計に反映される
- [ ] 統計カレンダーで前月・過去月を遡って表示できる
- [ ] JSON / CSV でデータを書き出せる
- [ ] `firebase deploy` でデプロイし公開URLで全機能を確認する

---

## 全体完了条件

- [x] Phase 0〜6 のすべての完了確認がパスしている
- [x] スマホ・PCの両方でログインからチェックまで一通り動作する
- [x] `summary/latest` がチェック操作のたびに更新されている
