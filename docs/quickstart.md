# クイックスタートガイド
## AIエージェントに作業を頼む前にやること

> 所要時間の目安: 約30〜60分  
> 難しいコマンドは一切ありません。画面の指示に従うだけでOKです。

---

## 全体の流れ

```
STEP 1  必要なソフトをインストールする
STEP 2  GitHubのアカウントを作る
STEP 3  GitHubにリポジトリを作る
STEP 4  Firebaseのプロジェクトを作る
STEP 5  プロジェクトをパソコンに用意する
STEP 6  Antigravityに渡す準備をする
```

---

## STEP 1 ｜ 必要なソフトをインストールする

以下の3つをインストールします。すべて無料です。

---

### 1-1. Node.js（プログラムを動かす土台）

1. [https://nodejs.org](https://nodejs.org) を開く
2. 「LTS」と書かれた緑のボタンをクリックしてダウンロード
3. ダウンロードしたファイルを開いて「次へ」を押し続けてインストール

**確認方法**  
PowerShellを開いて以下を入力してEnter

```powershell
node -v
```

`v22.0.0` のようにバージョンが表示されればOK

---

### 1-2. pnpm（パッケージ管理ツール）

Node.jsをインストールしたあと、PowerShellで以下を入力してEnter

```powershell
corepack enable pnpm
```

**確認方法**

```powershell
pnpm -v
```

バージョンが表示されればOK

---

### 1-3. Git（変更履歴を管理するツール）

1. [https://git-scm.com](https://git-scm.com) を開く
2. 「Download for Windows」をクリックしてダウンロード
3. ダウンロードしたファイルを開いて「Next」を押し続けてインストール
4. インストール後、PowerShellを**一度閉じてから再度開く**

**確認方法**

```powershell
git -v
```

バージョンが表示されればOK

---

### 1-4. Gitの初期設定（最初に1回だけやる）

PowerShellで以下を入力する。`"名前"` と `"メールアドレス"` は自分のものに変える

```powershell
git config --global user.name "自分の名前"
git config --global user.email "メールアドレス"
```

---

## STEP 2 ｜ GitHubのアカウントを作る

※すでに持っている場合はスキップ

1. [https://github.com](https://github.com) を開く
2. 「Sign up」をクリック
3. メールアドレス・パスワード・ユーザー名を設定してアカウント作成
4. メールに届いた確認コードを入力して認証完了

---

## STEP 3 ｜ GitHubにリポジトリを作る

「リポジトリ」とは、プロジェクトのファイルを保管するGitHub上の場所です。

1. GitHubにサインインする
2. 右上の「＋」ボタン →「New repository」をクリック
3. 以下の通りに設定する

| 項目 | 設定値 |
|------|--------|
| Repository name | `habit-tracker` |
| Visibility | Public（誰でも見られる） |
| Add a README file | チェックしない |

4. 「Create repository」をクリック
5. 作成後の画面に表示される URL をコピーしておく  
   （例: `https://github.com/あなたのユーザー名/habit-tracker.git`）

---

## STEP 4 ｜ Firebaseのプロジェクトを作る

Firebaseはデータの保存と認証を担当します。Googleアカウントがあればすぐ使えます。

---

### 4-1. プロジェクトを作成する

1. [https://console.firebase.google.com](https://console.firebase.google.com) を開く
2. Googleアカウントでサインイン
3. 「プロジェクトを追加」をクリック
4. プロジェクト名に `habit-tracker` と入力
5. Google アナリティクスは「有効にする」のチェックを外してOK
6. 「プロジェクトを作成」をクリック

---

### 4-2. Googleサインインを有効にする

1. 左メニューの「Authentication」をクリック
2. 「始める」をクリック
3. 「Sign-in method」タブをクリック
4. 「Google」をクリック
5. 右上のスイッチを「有効」にする
6. プロジェクトのサポートメールを選択して「保存」

---

### 4-3. データベースを有効にする

1. 左メニューの「Firestore Database」をクリック
2. 「データベースの作成」をクリック
3. 「本番環境モード」を選択して「次へ」
4. ロケーションは `asia-northeast1`（東京）を選択して「有効にする」

---

### 4-4. ホスティングを有効にする

1. 左メニューの「Hosting」をクリック
2. 「始める」をクリック
3. 画面の手順が表示されるが、**今はそのまま「次へ」「完了」で進めてOK**  
   （実際のデプロイはAntigravityがやってくれます）

---

### 4-5. アプリの設定情報をコピーする（重要）

この情報はあとで `.env.local` に貼り付けます。

1. 左メニュー上部の歯車アイコン →「プロジェクトの設定」をクリック
2. 「全般」タブの下にある「マイアプリ」セクションまでスクロール
3. 「＋アプリを追加」→ ウェブ（`</>`）アイコンをクリック
4. アプリのニックネームに `habit-tracker-web` と入力
5. 「Firebase Hosting も設定する」はチェックしてOK
6. 「アプリを登録」をクリック
7. 以下のようなコードが表示されるのでコピーしておく

```javascript
// この中の値をあとで使います
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "habit-tracker-xxxxx.firebaseapp.com",
  projectId: "habit-tracker-xxxxx",
  storageBucket: "habit-tracker-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

---

## STEP 5 ｜ プロジェクトをパソコンに用意する

---

### 5-1. ZIPファイルを展開する

1. 受け取った `habit-tracker-docs.zip` を展開する
2. 展開してできた `habit-tracker` フォルダを作業したい場所に置く  
   （例: `C:\Users\自分の名前\projects\habit-tracker`）

---

### 5-2. GitHubと紐づける

PowerShellで以下を順番に入力する。  
`habit-tracker` フォルダのパスは自分の環境に合わせて変える

```powershell
# habit-trackerフォルダに移動する
cd C:\Users\自分の名前\projects\habit-tracker

# Gitを初期化する
git init

# すべてのファイルをステージする
git add .

# 最初のコミットをする
git commit -m "chore: プロジェクト初期設定"

# mainブランチに切り替える
git branch -M main

# GitHubと紐づける（URLはSTEP 3でコピーしたもの）
git remote add origin https://github.com/あなたのユーザー名/habit-tracker.git

# GitHubにプッシュする
git push -u origin main
```

---

### 5-3. 環境変数ファイルを作る

`habit-tracker` フォルダの中に `.env.local` という名前のファイルを作り、以下を貼り付ける。  
各値はSTEP 4-5でコピーした `firebaseConfig` の中身に置き換える

```
NEXT_PUBLIC_FIREBASE_API_KEY=ここにapiKeyの値
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ここにauthDomainの値
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ここにprojectIdの値
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ここにstorageBucketの値
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=ここにmessagingSenderIdの値
NEXT_PUBLIC_FIREBASE_APP_ID=ここにappIdの値
```

> ⚠️ `.env.local` はGitにコミットしないこと。`.gitignore` に記載済みなので自動で除外されます。

---

## STEP 6 ｜ Antigravityに渡す準備をする

ここまで完了したら、Antigravityに作業を頼む準備が整いました。

---

### 6-1. Antigravityを開く

1. [https://antigravityide.com](https://antigravityide.com) を開く（またはデスクトップアプリを起動）
2. Googleアカウントでサインイン

---

### 6-2. プロジェクトを読み込む

1. 「Open Project」または「フォルダを開く」から `habit-tracker` フォルダを選択する

---

### 6-3. 最初の指示を送る

`docs/agent_prompt.md` の **「作業開始時」** のテンプレートをコピーしてAntigravityのチャット欄に貼り付け、Enterを押す。

以降の作業は `docs/agent_prompt.md` のテンプレートを場面に応じて使い分ける。

---

## うまくいかないときは

| 症状 | 確認すること |
|------|------------|
| `node -v` でエラーが出る | Node.jsのインストールをやり直す |
| `pnpm -v` でエラーが出る | PowerShellを閉じて再度開いてから試す |
| `git push` でエラーが出る | GitHubにサインインできているか確認する |
| Antigravityがエラーを出す | エラーメッセージをそのままAntigravityに貼り付けて「これを直して」と送る |

---

> 💡 **困ったときのコツ**  
> エラーが出ても焦らなくてOK。エラーメッセージをAntigravityに貼り付けて「これが出て困っています」と送れば解決してくれます。
