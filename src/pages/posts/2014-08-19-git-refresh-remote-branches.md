---
templateKey: blog-post
title: Git でリモートリポジトリの更新が反映されないとき
date: 2014-08-19T00:00:00.000+09:00
tags:
  - git
  - SourceTree
---
GitHub のWebサイトでブランチを削除したあと、クライアント（SourceTreeとか）のリモートブランチの表示に、削除したはずのブランチが残っていて、気持ち悪いなあ、と思っていた。
<!--more-->

git のコマンド一発だった。

```
git remote update -p
```

これでクライアント側のリモート情報がリフレッシュされる。