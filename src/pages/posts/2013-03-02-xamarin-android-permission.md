---
templateKey: blog-post
title: Xamarin.Android で PERMISSION を設定する
date: 2013-03-02T00:00:00.000+09:00
tags:
  - Xamarin
  - Android
  - csharp
---
Xamarin.Android でプロジェクト作ると AndroidManifest.xml が見当たらない。
GPS使いたいんだけど権限設定どうしよう、と思ったらこうできました。

<!-- more -->

プロジェクトのオプションから、
!["option"](https://blog.amay077.net/img/posts/xamarin_android_project_option.png)

ビルド→Android Application と来て、
!["add"](https://blog.amay077.net/img/posts/xamarin_android_application_add.png)

Add すると権限などが設定できるようになります。
!["added"](https://blog.amay077.net/img/posts/xamarin_android_application_created.png)

その後、おなじみ AndroidManifest.xml ができてました。
!["source"](https://blog.amay077.net/img/posts/xamarin_android_androidmanifestxml.png)

Activity の設定はオートでやってくれるみたいなのでありません。
これでオレオレ Applocation クラスも動かせるのかなあ。。。
