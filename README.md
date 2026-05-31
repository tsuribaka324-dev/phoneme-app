# Phoneme — 英語発音練習アプリ

Next.js 14 + Tailwind CSS + Supabase（オプション）で動くWebアプリ。

## ローカル開発

```bash
# 1. 依存関係をインストール
npm install

# 2. 環境変数を設定（Supabase使う場合）
cp .env.local.example .env.local
# .env.local を編集して Supabase の URL と ANON KEY を入力

# 3. 開発サーバー起動
npm run dev
# → http://localhost:3000
```

## Vercelにデプロイ（推奨）

```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
vercel

# 本番デプロイ
vercel --prod
```

Vercel の Environment Variables に以下を設定：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase セットアップ（スコア保存を有効にする場合）

1. [supabase.com](https://supabase.com) でプロジェクト作成
2. Dashboard → SQL Editor に `supabase-schema.sql` の内容を貼り付けて実行
3. Project Settings → API から URL と anon key をコピーして `.env.local` に設定

## ページ構成

| ページ | パス | 説明 |
|--------|------|------|
| ランディング | `/` | トップページ |
| 音素ドリル | `/practice` | メイン練習画面 |
| 最小対 | `/pairs` | ペア聞き比べ |
| 音素一覧 | `/phonemes` | 全18音素一覧 |
| 記録 | `/stats` | スコアダッシュボード |

## 技術スタック

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Web Speech API** — ネイティブ音声合成 + 音声認識
- **Supabase** — 認証・スコア保存（将来対応）
- **localStorage** — 現在のスコア保存先

## 収益化ロードマップ

- [ ] Supabase Auth でログイン対応
- [ ] スコアのクラウド同期
- [ ] Stripe で月額プラン（フリーミアム）
- [ ] 単語ドリルとの統合
