---
templateKey: blog-post
title: Jekyll から Eleventy に移行した
date: 2021-01-12T15:00:00.000Z
tags:
  - Jekyll
  - SSG
  - Eleventy
  - Ruby
  - JavaScript
  - node.js
---
以前から Jekyll はビルド時間が長い上に Ruby でよくわからんという課題があり、ローカル実行環境もうまく動かせなくなってしまったのもあって思い切って別の Static Site Generator に移行した。
JavaScript/node 製で、既存のコンテンツを活かせそうなものとして Eleventy(11ty) を選択した。

以下、行ったこと。


## 1. URL の互換性維持

ブログの各記事が ``<domain>/blog/2019/11/21/toggle_vs_check/`` というURLだったのでそれを維持するように、各postの YAML Front Matter には以下のように記述した。

```
permalink: "/blog/{{ page.date | date: '%Y/%m/%d' }}/{{ page_name }}/index.html"
```

``page_name`` には、ファイル名の日付以降(ex.``toggle_vs_check``)を設定。
これらを行う移行用スクリプトを作って実行した。

## Tag の特殊文字対応

[C#] や [F#] などの ``#`` が netlify ではファイル名として許可されておらずデプロイでエラーに。
それぞれ C# → Csharp, F# → Fsharp というような置換を行うように改造した。

また、Tag は大文字小文字を中途半端に区別(コンテンツとしては区別するが、URLとしては区別しない)して、期待した結果にならなかったので、ここも改造(＋CSSでCAPITALIZEをやめた)。

## ブログ記事ページに日付と Tag 群を追加

## Google Analytics 導入

## TODO

- Discus の復活
- portfolio の復活
- tag の大文字小文字整理
- Edit on GitHub の復活
- Share by twitter などの復活
