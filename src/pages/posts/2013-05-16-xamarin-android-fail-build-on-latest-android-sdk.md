---
templateKey: blog-post
title: Android SDK を最新の r22 にしたら、Xamarin.Android でビルドできなくなった件
date: 2013-05-16T00:00:00.000+09:00
tags:
  - Xamarin
  - Android
---
[Google I/O 2013](https://developers.google.com/events/io/) で[いろいろ発表](http://japanese.engadget.com/2013/05/15/google-i-o-2013/)があったので、試してみたくなるのがエンジニアってもんでしょう。
<!--more-->

## 2013.5.19 追記
Xamarin.Android の 4.6.6 で Android SDK r22 に対応したので、この記事は無意味になりました。

![image5](/img/posts/xamarin_android_fail_build_on_latest_android_sdk5.png)

アップデート後、r22 でも無事ビルドできるようになりました。

## 1.Eclipse のエラー

Keynote から一夜明け、Android SDK を r22 に更新しました。
するとまず、昨日までビルドできていた Java の Android のプロジェクトがビルドできなくなりました。

この症状は、こちらのツイート:

<blockquote class="twitter-tweet" lang="ja"><p>状況・ライブラリプロジェクトを使用・r22 でビルドが死んだ対策・SDK Build-tools を入れた（antは復旧）・&lt;classpathentry combineaccessrules="false" kind="src" path="/hoge"/&gt; 追加</p>&mdash; dmpさん (@dmp) <a href="https://twitter.com/dmp/status/334839819781955586">2013年5月16日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

に加えて、[Eclipse の ADT Plugin](http://developer.android.com/sdk/installing/installing-adt.html) を更新することで解決できました。(私の場合、``<classpathentry〜`` は行わなくても大丈夫でした。［勝手に追加されてました］)

## 2.Xamarin.Android のエラー

やれやれと思ったところで、こんなツイートが。

<blockquote class="twitter-tweet" lang="ja"><p>I know you are all eager to try the new stuff but since Google shuffled some binaries in the latest SDK, it breaks Xamarin.Android for now</p>&mdash; Jérémie Lavalさん (@jeremie_laval) <a href="https://twitter.com/jeremie_laval/status/334879715611529217">2013年5月16日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

「Google が SDK の場所を替えたので、Xamarin.Android は今壊れてる(意訳)」とのことです。

マジで？と思って、試してみると確かにビルド時にエラーががが。

![image1](/img/posts/xamarin_android_fail_build_on_latest_android_sdk1.png)

> Error: Error executing tool '/…/android-sdk-macosx/platform-tools/aapt': 

## そして回避へ

先のトラブルで、「SDK Build-tools が新しく追加された」=「今までの場所にはもうない」、つまり、エラーになっているのは aapt(Android のパッケージ作成ツール) が意図した場所に存在しないからでは？と考えられます。

というわけで、 aapt はどこへ行ったのか、Android SDK のフォルダを Finder(エクスプローラ)で覗いてみます。

![image2](/img/posts/xamarin_android_fail_build_on_latest_android_sdk2.png)

むう、確かに ``/platform-tools`` の中には ``aapt`` は存在せず、代わりに ``/build-tools/17.0.0`` の中にあります。

Xamarin Studio の設定で、aapt の場所を /build-tools に変更できれば良かったのですが、残念ながら見つけられず、仕方ないので ``/build-tools/17.0.0`` 配下のファイルとフォルダを、 ``/platform-tools`` にコピーしました。

![image3](/img/posts/xamarin_android_fail_build_on_latest_android_sdk3.png)

そして Xamarin Studio に戻り、もう一度ビルドを実行、無事ビルドできました。

![image4](/img/posts/xamarin_android_fail_build_on_latest_android_sdk4.png)

近いうちに Xamarin さん側で対応してくれると思いますが、それまでのつなぎとして。
