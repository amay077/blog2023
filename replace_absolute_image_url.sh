#!/bin/bash

# 変数定義
dir="src/pages/posts"

# ディレクトリ内の .md ファイルを検索して置換
find "$dir" -name '*.md' -type f -exec sed -i.bak 's|https://raw.githubusercontent.com/amay077/blog2023/main/static/img/|/img/|g' {} \;