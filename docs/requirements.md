# 習慣トラッカーアプリ 要件定義書

> バージョン: 1.0  
> 作成日: 2026-05-31

---

## 1. プロジェクト概要

毎日の習慣をチェックして記録・可視化するWebアプリケーション。  
スマートフォン・PCの両方から同一データにアクセスでき、将来的にダッシュボードアプリへ統合することを前提とした設計とする。

---

## 2. 技術スタック

| レイヤー | 採用技術 | 理由 |
|---------|---------|------|
| フロントエンド | Next.js + TypeScript | App Router採用・静的エクスポートでFirebase Hostingに対応 |
| スタイリング | Tailwind CSS | ユーティリティファーストで実装速度が高い |
| アニメーション | Framer Motion | チェック時アニメーションを簡潔に実装できる |
| グラフ | Recharts | Reactとの親和性が高く軽量 |
| データベース | Firebase Firestore | リアルタイム同期・無料枠が広い |
| 認証 | Firebase Authentication（Google Sign-in） | 複数デバイス間のデータ同期に必要 |
| ホスティング | Firebase Hosting | Firestoreと同一プロジェクトで管理可能 |

### Next.js 設定方針

- **App Router** を使用する（`src/app/` ディレクトリ）
- **Static Export**（`output: 'export'`）を使用し、Firebase Hostingに静的ファイルとして配信する
- Firestoreへのアクセスはすべてクライアントサイドで行うため、SSR・APIルートは使用しない
- ビルド成果物は `out/` ディレクトリに出力される

---

## 3. システム構成

```
[ユーザー（ブラウザ）]
      ↕ HTTPS
[Firebase Hosting]  ← Next.js静的エクスポート（out/）を配信
      ↕
[Firebase Authentication]  ← Googleアカウントで認証
      ↕
[Firebase Firestore]  ← データの読み書き（クライアントサイド）
```

### 認証フロー

- Googleアカウントでサインイン（Firebase Authentication）
- サインイン後、ユーザーIDに紐づいたデータのみ読み書き可能
- 未認証ユーザーはサインイン画面へリダイレクト

---

## 4. Firestoreデータモデル

### コレクション構造

```
users/
  {userId}/
    habits/
      {habitId} (document)
    records/
      {recordId} (document)
    summary/
      latest (document)  ← ダッシュボード連携用
```

---

### 4-1. habits コレクション

```typescript
interface Habit {
  id: string;               // Firestoreが自動生成
  name: string;             // 習慣名（例: "毎朝ストレッチ"）
  emoji: string;            // 絵文字アイコン（例: "🧘"）
  memo: string;             // 一言メモ（例: "5分でOK"）
  category: string;         // カテゴリ（例: "健康"）
  targetDays: number[];     // 実施曜日（0=日〜6=土、例: [1,2,3,4,5]）
  isActive: boolean;        // 表示中かどうか（削除はisActiveをfalseにする）
  order: number;            // 表示順
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 4-2. records コレクション

```typescript
interface Record {
  id: string;          // `${date}_${habitId}` で固定（例: "2026-05-31_abc123"）
  habitId: string;
  date: string;        // YYYY-MM-DD形式（例: "2026-05-31"）
  completed: boolean;
  completedAt: Timestamp | null;
}
```

> **recordIdの設計方針**  
> `recordId = \`${date}_${habitId}\`` と固定することで、同一習慣・同一日付のrecordが1件のみ存在することを保証する。  
> チェックのON/OFFは新規ドキュメントの作成ではなく、同一ドキュメントの `completed` を更新することで行う。  
> これにより連打によるrecordの重複を防ぎ、達成率・ストリークの計算を安定させる。

---

### 4-3. summary（ダッシュボード連携用）

ダッシュボードアプリが参照しやすいよう集計データを保持する。  
チェック操作が行われるたびにクライアントサイドで自動更新する。

```typescript
interface Summary {
  todayTotal: number;        // 今日の習慣の総数
  todayCompleted: number;    // 今日の完了数
  todayRate: number;         // 今日の達成率（%）
  topStreak: {
    habitName: string;       // 最長連続達成中の習慣名
    emoji: string;
    days: number;
  };
  weeklyRate: number;        // 今週全体の達成率（%）
  updatedAt: Timestamp;
}
```

将来のダッシュボードはこのパスを参照する。
```
Firestoreパス: users/{userId}/summary/latest
```

---

## 5. 機能要件

### 5-1. 認証

| 機能 | 仕様 |
|------|------|
| サインイン | Googleアカウントでのサインイン |
| サインアウト | ヘッダーのメニューからサインアウト |
| 未認証アクセス | サインイン画面へリダイレクト |

> **認証ガードの実装方針**  
> 認証ガードは `AuthGuard.tsx`（Client Component）として実装し、`src/app/layout.tsx` から呼び出す。  
> `usePathname()` で現在のパスを確認し、`/login` の場合はリダイレクト処理をスキップする。  
> これにより「ログイン画面に遷移しようとしたら認証ガードが反応してループする」事故を防ぐ。
>
> ```tsx
> // AuthGuard.tsx のイメージ
> const pathname = usePathname()
> if (!user && pathname !== '/login') {
>   router.push('/login')
> }
> ```

---

### 5-2. 今日の習慣リスト（メイン画面）

| 機能 | 仕様 |
|------|------|
| 表示対象 | 今日の曜日に設定された習慣のみ表示 |
| 達成率表示 | 「今日は5個中3個できた（60%）」のように表示 |
| チェック操作 | ボタンをタップ/クリックで完了・未完了を切り替え |
| 完了アニメーション | Framer Motionでチェック時にふわっとしたアニメーションを実装 |
| 完了済みの見た目 | グレーアウト＋テキストに取り消し線 |
| リアルタイム反映 | Firestoreのonsnapshotリスナーで即時反映 |

---

### 5-3. 習慣の管理

| 機能 | 仕様 |
|------|------|
| 新規登録 | 名前・絵文字・メモ・カテゴリ・実施曜日を入力して保存 |
| 編集 | 登録済み習慣の各項目を変更して保存 |
| 削除 | isActiveをfalseに更新（物理削除は行わない） |
| 並び替え | ドラッグ&ドロップでorderを更新 |
| バリデーション | 習慣名は必須・50文字以内 |

---

### 5-4. 連続達成日数（ストリーク）

| 機能 | 仕様 |
|------|------|
| 計算ロジック | 今日から遡ってrecordsを確認し、completed=trueが連続している日数を算出 |
| 対象日の考慮 | targetDaysに含まれない曜日はスキップして計算 |
| 表示形式 | 「🔥 12日連続達成中！」 |
| リセット条件 | 対象曜日にcompleted=falseの日が1日でもあればリセット |

---

### 5-5. 統計・グラフ画面

| 機能 | 仕様 |
|------|------|
| 週間ビュー | 今週7日分のチェック状況をマス目（カレンダーグリッド）で表示 |
| 月間ビュー | カレンダー形式で達成日を色付きで表示 |
| 達成率グラフ | Rechartsの棒グラフで週・月単位の達成率を表示 |
| 習慣別フィルター | 習慣を選択して個別の統計を確認できる |

---

## 6. 画面・コンポーネント設計

### 画面一覧

| 画面名 | パス | ファイル |
|--------|------|---------|
| サインイン | `/login` | `src/app/login/page.tsx` |
| 今日の習慣 | `/` | `src/app/page.tsx` |
| 統計 | `/stats` | `src/app/stats/page.tsx` |
| 習慣管理 | `/habits` | `src/app/habits/page.tsx` |
| 習慣登録 | `/habits/new` | `src/app/habits/new/page.tsx` |
| 習慣編集 | `/habits/edit?id={habitId}` | `src/app/habits/edit/page.tsx` |

> **Static Export と動的ルートについて**  
> `output: 'export'` では動的ルート（`/habits/[id]/edit`）はビルド時に全パスを確定する必要があるが、FirestoreのhabitIdは実行時に生成されるため事前列挙が不可能。  
> そのため編集画面はクエリパラメータ方式（`/habits/edit?id=xxxxx`）を採用する。habitIdは `useSearchParams()` フックで取得する。

> **`useSearchParams()` のSuspense対応**  
> Next.js App Router + Static Export では `useSearchParams()` を使うコンポーネントは Client Component に切り出し、`page.tsx` から `<Suspense>` でラップする必要がある。  
> これを省略すると `pnpm build` がエラーになる。
>
> ```
> src/app/habits/edit/
>   ├── page.tsx              # Suspenseでラップするだけ（Server Component）
>   └── HabitEditClient.tsx   # useSearchParams()を使うClient Component
> ```

---

### コンポーネント構成

```
src/
├── app/                             # Next.js App Router
│   ├── layout.tsx                   # ルートレイアウト（Header・BottomNav含む）
│   ├── page.tsx                     # 今日の習慣（/）
│   ├── login/
│   │   └── page.tsx                 # サインイン
│   ├── stats/
│   │   └── page.tsx                 # 統計
│   └── habits/
│       ├── page.tsx                 # 習慣一覧
│       ├── new/
│       │   └── page.tsx             # 習慣登録
│       └── edit/
│           ├── page.tsx             # Suspenseでラップ（Server Component）
│           └── HabitEditClient.tsx  # useSearchParams()使用（Client Component）
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── BottomNav.tsx            # スマホ向けボトムナビゲーション
│   ├── habits/
│   │   ├── HabitCard.tsx            # 習慣カード（チェックボタン含む）
│   │   ├── HabitForm.tsx            # 習慣登録・編集フォーム
│   │   ├── HabitList.tsx
│   │   └── StreakBadge.tsx
│   ├── stats/
│   │   ├── WeeklyGrid.tsx
│   │   ├── MonthlyCalendar.tsx
│   │   └── RateBarChart.tsx         # Recharts棒グラフ
│   └── ui/
│       ├── CheckAnimation.tsx       # Framer Motionアニメーション
│       ├── ProgressBar.tsx
│       └── EmojiPicker.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useHabits.ts
│   ├── useRecords.ts
│   └── useStreak.ts
├── lib/
│   ├── firebase.ts
│   ├── firestore.ts
│   └── summary.ts                   # summaryドキュメント更新処理
├── types/
│   └── index.ts
└── utils/
    ├── dateUtils.ts
    └── statsUtils.ts
```

### Next.js App Router の注意点

- Firestoreなどのクライアントサイド処理を含むコンポーネントには必ず先頭に `'use client'` を記述する
- `src/app/layout.tsx` でフォント・グローバルCSSを設定する
- 認証ガード（未認証時のリダイレクト）は `AuthGuard.tsx` に集約し、`/login` は対象外にする

---

## 7. 非機能要件

| 項目 | 要件 |
|------|------|
| レスポンシブ | スマートフォン（375px〜）・タブレット・PCに対応 |
| パフォーマンス | 初回表示3秒以内 |
| オフライン | Firestoreのオフラインキャッシュを有効化 |
| セキュリティ | Firestoreセキュリティルールで自分のデータのみ読み書き可能に制限 |
| 環境変数 | FirebaseのAPIキーは`.env`ファイルで管理し、リポジトリに含めない |

---

### Firestoreセキュリティルール

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 8. プロジェクト構成

```
habit-tracker/
├── public/
│   └── favicon.ico
├── src/
│   └── app/ 他（セクション6参照）
├── docs/
│   ├── requirements.md    ← 本ファイル
│   ├── status.md          ← 実装進捗チェックリスト
│   └── constraints.md     ← NEVERルール
├── AGENTS.md
├── CONTRIBUTING.md
├── README.md
├── .env.local             # Gitに含めない
├── .env.example
├── .gitignore
├── firebase.json          # Hostingのpublicディレクトリを "out" に設定する
├── .firebaserc
├── firestore.rules
├── next.config.ts         # output: 'export' を設定する
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### next.config.ts の設定

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',      // 静的エクスポートを有効化
  trailingSlash: true,   // Firebase Hostingとの互換性のため
  images: {
    unoptimized: true,   // 静的エクスポート時はNext.js画像最適化を無効化
  },
}

export default nextConfig
```

### firebase.json の設定

```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 9. 環境変数（.env.example）

Next.jsではクライアントサイドで使う環境変数に `NEXT_PUBLIC_` プレフィックスが必要。

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```
