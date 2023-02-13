---
templateKey: blog-post
title: Kotlin製のAndroidアプリを Visual Studio Mobile Center でビルドして DeployGate にアップロードする
date: 2017-10-18T00:00:00.000+09:00
tags:
  - Android
  - DeployGate
  - VisualStudio
---
タイトル長いｗ
<!--more-->

## VSMC とは

Visual Studio Mobile Center(以下 VSMC) は Microsoft が提供している CI サービスです。

* [iOS／Androidアプリの開発を支援する「Visual Studio Mobile Center （preview）」を使ってみよう (1/5)：CodeZine（コードジン）](https://codezine.jp/article/detail/10095)

あまり知られていないでしょうが、 Java/Kotlin で書かれた普通の Android アプリもビルドできます。（そしてもちろん Swift 製の iOS アプリも対応してます。あと React Native もな。）

Kotlin/Java な Android Studio プロジェクトのレポジトリを VSMC に設定してやるだけでビルドまではできるのでなんにも難しいことはないです。

* [Visual Studio Mobile CenterでiOSアプリをビルドしてみた ｜ Developers.IO](https://dev.classmethod.jp/smartphone/visual-studio-mobile-center-ios-app-build/)

今日のメインは、VSMC でもようやくビルド後にスクリプトを実行させることができるようになったので、その紹介です。

## VSMC がビルドスクリプトに対応した

* [Build Scripts ｜ Visual Studio Mobile Center ｜ Microsoft Docs](https://docs.microsoft.com/en-us/mobile-center/build/custom/scripts/)

これによると、プロジェクトのレポジトリに、特定のスクリプトファイルを入れておくと、ビルド後（やビルド前）に、そのスクリプトファイルを実行してくれる、というものです。

現在は、３つのトリガに対応していて、それぞれ次に示すファイル名のスクリプトファイルをリポジトリのプロジェクトディレクトリにおいておきます。

* Post-clone(クローン後) - ``mobile-center-post-clone.sh`` 
* Pre-build(ビルド前) - ``mobile-center-pre-build.sh``
* Post-build(ビルド後) - ``mobile-center-post-build.sh``

プロジェクトディレクトリとは、Android Studio プロジェクトの場合、プロジェクトの ``build.gradle`` がある場所、大抵は ``app`` ディレクトリになります（下図参照）。

![01](/img/posts/upload_android_apps_made_by_kotlin_to_deploygate_using_visual_studio_mobile_center_01.png)

試しにビルドされた apk ファイルを DeployGate にアップロードする、というのをやってみます。
VSMC にもアプリの配信機能はありますが、社内で既に DeployGate を使っているし、DeployGate の方が専用アプリが用意されていてβテストサービスとしては勝っているので、今回例としました。

まず、当然ながら DeployGate 側の準備が必要です。ユーザー登録をして、手動でビルドした apk を DeployGate にアップロードしておきます。

そして、次のようなファイルを ``mobile-center-post-build.sh`` というファイル名で ``app`` ディレクトリの中に入れておきます。

```bash
#!/usr/bin/env bash

echo "Upload to DeployGate"

curl \
  -F "token={deploygateのAPI key}" \
  -F "file=@$MOBILECENTER_OUTPUT_DIRECTORY/app-release.apk" \
  -F "message=build by Visual Studio Mobile Center - #$MOBILECENTER_BUILD_ID" \
  https://deploygate.com/api/users/{deploygateのユーザーID}/apps
```

``{deploygateのAPI key}`` には、DeployGate のアカウント設定のページから API key の値を転記します。
``{deploygateのユーザーID}`` には、DeployGate に作成したユーザーのユーザーID を転記します（正しければ上記のURLが存在するはず）。
``file=`` に記述した ``app-release.apk`` は、ビルド構成（Build Variant）が release の場合です。デバッグの場合は ``app-debug.apk`` になるはずです（未確認）。

``mobile-center-post-build.sh`` をコミット、プッシュして VSMC の Build Configulation を見ると「Build scripts」 の項目に **Post-build** とチェックされ、正しく認識できていることがわかります。

![02](/img/posts/upload_android_apps_made_by_kotlin_to_deploygate_using_visual_studio_mobile_center_02.png)


あとは、 apk への署名を忘れないようにしましょう。Sign builds を On にして、 keystore ファイルなどを指定します。
社内配布であればデバッグ時と同じいいやってことで、開発用PCに入っている(Mac なら ``~/.android/`` にある) ``debug.keystore`` をアップロード、入力項目は次のとおりです。

* Keystore password: android
* Key alias: androiddebugkey
* Key password: android

![03](/img/posts/upload_android_apps_made_by_kotlin_to_deploygate_using_visual_studio_mobile_center_03.png)


設定できたら、「Save & Build」 を押すと、ビルドが開始され、ビルドログを見るとスクリプトが実行されていることが確認できます。

![04](/img/posts/upload_android_apps_made_by_kotlin_to_deploygate_using_visual_studio_mobile_center_04.png)

## これで勝つる？

よっしゃー！これでスクリプトさえ書けば Bitrise や CircleCI 並みになんでもできるぞー、と思いました。

が、 **スクリプトファイルをリポジトリに含める** のが作動条件なので、今回試したような 「DeployGate へのアップロード」というシナリオでは DeployGate の API key をリポジトリに含めることになってしまい、これは推奨されることではありません（公開リポジトリではご法度モノ）。

なんという「Microsoft、分かってない」感。なんでこんな仕様にしたのでしょう。
VSMC はプライベートリポジトリ推奨なのでしょうか…。私はプライベートなアプリのビルドを、Bitrise の無料プランでぶん回していたらビルド時間制限の上限に達してしまったので VSMC に移行してきたのですが、そういうシナリオなのでしょうか。

早いとこカスタムな Environment variables を作れるようにして欲しいところです。
