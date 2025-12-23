# Experiments Never Fail

@amay077 の技術ブログ

https://blog.amay077.net

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| SSG | Gatsby 5.4.1 |
| UI | React 18 / Bulma (Sass) |
| コンテンツ | Markdown (Remark) |
| シンタックスハイライト | PrismJS |
| 状態管理 | Redux Toolkit / Redux Persist |
| デプロイ | Netlify |

## ディレクトリ構造

```
src/
├── components/     # React コンポーネント
│   ├── Layout.js       # レイアウト
│   ├── Navbar.js       # ナビゲーション
│   ├── BlogRoll.js     # 記事一覧
│   └── ...
├── templates/      # ページテンプレート
│   ├── blog-post.js    # 記事ページ
│   ├── index-page.js   # トップページ
│   └── tags.js         # タグページ
├── pages/
│   └── posts/      # ブログ記事 (Markdown)
├── img/            # 記事画像
└── all.scss        # グローバルスタイル

static/             # 静的アセット
```

## 開発コマンド

```bash
# 開発サーバー起動 (http://localhost:8000)
npm run develop

# 本番ビルド
npm run build

# ビルド結果の確認
npm run serve

# コードフォーマット
npm run format

# キャッシュクリア
npm run clean
```

## 設定ファイル

| ファイル | 説明 |
|---------|------|
| `gatsby-config.js` | プラグイン設定、サイトメタデータ |
| `gatsby-node.js` | ページ生成ロジック（ページネーション、タグページ） |
| `netlify.toml` | Netlify デプロイ設定 |
| `replace_absolute_image_url.sh` | ビルド時の画像 URL 変換スクリプト |

## デプロイ

Netlify で main ブランチへのプッシュ時に自動デプロイ。

### 環境変数

| 変数名 | 説明 |
|--------|------|
| `GATSBY_TRACKING_ID` | Google Analytics トラッキング ID |

## ライセンス

MIT
