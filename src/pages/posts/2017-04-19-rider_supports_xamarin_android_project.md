---
templateKey: blog-post
title: JetBrains Rider で Xamarin.Android プロジェクトのデバッグが行えるようになりました
date: 2017-04-19T00:00:00.000+09:00
tags:
  - Android
  - Xamarin
  - JetBrains
  - Rider
---
クロスプラットフォーム対応の.NET向けIDE、JetBrains Rider の EAP(Early Access Program) ver.20 で、ついに Xamarin.Android の「実行」がサポートされました（今までも「ビルドだけ」はできたのですが）。

<!--more-->

* [Rider EAP 20: Xamarin Android, Node.js, .NET Core improvements, and more - dotnet Tools Blog.NET Tools Blog](https://blog.jetbrains.com/dotnet/2017/04/14/rider-eap-20-xamarin-android-node-js-net-core-improvements/)

たとえば [Xamarin Samples](https://developer.xamarin.com/samples/) の

* [ButtonCode - Xamarin](https://developer.xamarin.com/samples/xamarin-forms/ButtonCode/)

を Rider で開いてビルド、デバッグ実行してみます。
これは Xamarin.Forms のソリューションですが、その中の Android プロジェクトは実行できます。

![](/img/posts/rider_supports_xamarin_android_project_01.png)

上図のように、エミュレータも起動でき、ブレークポイントを置いてのステップイン・ステップオーバーなども実行できます。
デバッグ画面のルック＆フィールは JetBrains 製品らしくなっており、Android Studio を使っている人にとっても馴染みがあります。

また、Rider で Xamarin.Android プロジェクトを新規作成することも可能です。
が、Rider で作成したプロジェクトをXamarin Studioなどで開くとエラーになってしまいます。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">JetBrains Rider  Xamarin Android プロジェクト作成→Run→エミュ起動→アプリ実行、までできたけど、その .sln/csproj を Visual Studio for Mac で開くとエラー <a href="https://t.co/u0HXb4dVSr">pic.twitter.com/u0HXb4dVSr</a></p>&mdash; あめい@超技術書典4/30 あ-12 (@amay077) <a href="https://twitter.com/amay077/status/852912306056863744">2017年4月14日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

こちらは今後の開発進行に伴い改善されていくでしょう。