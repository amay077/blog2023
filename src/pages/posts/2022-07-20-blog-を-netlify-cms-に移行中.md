---
templateKey: blog-post
title: Blog を Netlify CMS に移行中
date: 2022-07-20T13:44:28.818Z
description: " "
featuredpost: false
featuredimage: /img/apple-touch-icon.png
tags:
  - CMS
  - Netlify
  - Markdown
  - SSG
---
性懲りもなく、また Blog のフレームワークを移行している。

[Eleventy(11ty)](/posts/2021-01-12-moved_to_eleventy/) は正直よく分からなかった。

あと、ブログを書くのに VSCode で定型のファイル作って Markdown で書いて、デプロイして…、ってやるのが面倒になってきて。

例えば Qiita だったら、サクッと書いて画像もコピペで貼り付けられて…って利便性は確かにあった。

Static Site Gen の良さは維持しつつ、Markdown で書けてしかもリッチエディタも使えて…となるとだいぶ選択肢が少ない。

[microCMS](https://microcms.io/) は良さそうだけど、純粋な Markdown 管理ではなさそうだったし。

ということで [Netlify CMS](https://www.netlifycms.org/) を試してみる。Site Generator は gatsby で。