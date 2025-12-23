# CLAUDE.md - AI エージェント向け指示書

## プロジェクト情報

- プロジェクト名: amayblog2023
- 種別: Gatsby 製技術ブログ
- 言語: 日本語（コード・コミットメッセージ含む）
- ライセンス: MIT

## ビルド確認

```bash
npm run build
```

## 記事作成・更新のルール

### 記事ファイル

- パス: `src/pages/posts/YYYY-MM-DD-HH-MM-SS.md`
- 例: `src/pages/posts/2024-12-22-00-15-47.md`

### フロントマター（必須）

```yaml
---
templateKey: blog-post
title: 記事タイトル
date: 2024-12-21T14:55:29.507Z  # ISO 8601 形式
tags:
  - タグ1
  - タグ2
---
```

### タグ規約

タグは URL に使用されるため **kebab-case（小文字・ハイフン区切り）** で統一する。

#### 命名規則

- すべて小文字
- 複数単語はハイフン `-` で区切る
- 日本語タグも使用可（URL エンコードされる）

```
# 良い例
android, javascript, type-script, google-maps-api, xamarin-forms, node-js

# 避けるべき例
Android, JavaScript, TypeScript, Node.js, VisualStudio
```

#### 主要タグ一覧（今後の正式表記）

| 旧表記 | 新表記（kebab-case） |
|--------|---------------------|
| `Android` | `android` |
| `JavaScript` | `javascript` |
| `TypeScript` | `typescript` |
| `Xamarin` | `xamarin` |
| `Node.js` | `node-js` |
| `google-maps-api` | `google-maps-api` ✓ |
| `xamarin-forms` | `xamarin-forms` ✓ |
| `reactive-extensions` | `reactive-extensions` ✓ |
| `VisualStudio` | `visual-studio` |
| `ReactiveX` | `reactive-x` |
| `RxJava` | `rx-java` |
| `iOS` | `ios` |
| `csharp` | `csharp` ✓ |
| `dotnet` | `dotnet` ✓ |

#### ドラフト（非公開）

`tags` に `draft` を含めると記事一覧に表示されない。

```yaml
tags:
  - draft
  - 作業中のタグ
```

#### 注意

過去記事には旧表記（PascalCase 等）が残っている。新規記事では kebab-case を使用すること。

### 画像の配置

| 配置場所 | 用途 |
|---------|------|
| `src/img/` | 記事内で参照する画像 |
| `static/img/` | ビルド後もパスが変わらない静的画像 |

ビルド時に `replace_absolute_image_url.sh` が GitHub raw URL をローカルパスに変換する。

## コーディング規約

### React コンポーネント

- 関数コンポーネントを使用
- PropTypes で型定義
- 既存コンポーネントのパターンに従う

### スタイル

- Bulma ベース
- カスタムスタイルは `src/all.scss` に追加
- PurgeCSS が未使用 CSS を削除

### コード品質

```bash
npm run format  # Prettier でフォーマット
```

## 運用ルール

### 禁止事項

- 独断でのコミット・プッシュ禁止（必ず指示者の承認を得る）
- テストなしの本番デプロイ禁止
- `git push --force` 禁止
- 既存記事の意図しない削除・変更禁止

### 作業フロー

1. 変更前に `npm run develop` で動作確認
2. 変更後に `npm run build` でビルド成功を確認
3. 指示者の承認後にコミット

### 注意事項

- gatsby-node.js の `createPages` がページ生成を担当
- タグページは記事のタグから自動生成される
- 20 件ごとにページネーションが適用される
