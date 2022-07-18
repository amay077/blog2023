---
templateKey: blog-post
title: Xamarin.Forms をガチで使う時のプロジェクト構成(2016冬Ver)
date: 2016-12-01T00:00:00.000+09:00
tags:
  - iOS
  - Android
  - Xamarin
  - Xamarin.Forms
---
[Xamarin Advent Calendar 2016 "その1"](http://qiita.com/advent-calendar/2016/xamarin) の初日です。今年もよろしくお願いします。
<!--more-->

Xamarin.Forms も大分安定し、機能も増え、ライブラリも充実してきました。既に実戦投入されていらっしゃる方も多いと思います。事例も増えてきました。

（一方で、プラットフォーム固有のUIをフルに活用したい場合は Xamarin.Forms は使うべきでありません。例えば Android には、[Floating Action Button - FAB](https://material.google.com/components/buttons-floating-action-button.html?utm_campaign=io15&utm_source=dac&utm_medium=blog)、[ラベル付きのTextField](http://www.materialdoc.com/edit-text/) と言った特徴的なUIパーツがあります。これらは Xamarin.Forms ではサポートされません。※ちょっとだけ頑張れば使うことはできます。）


そこで初日は、 「Xamarin.Forms をガチで使う時のプロジェクト構成(2016冬Ver)」と題して、現在のベストプラクティスと呼べるプロジェクト構成案を示してみようと思います。

これは、以前に書いた、

* [Xamarin.Forms をガチで使うときのプロジェクト構成案 - Qiita](http://qiita.com/amay077/items/e66108afb0d1e1dc26c8)

の Update 版です。

## コンセプト

* Xamarin.Forms 
* 且つ、非Xamarin への相互運用も視野に
* Shared でなく PCL
* Prism.Forms で MVVM
* ReactiveProperty で Rx + Data Binding

## プロジェクト構成

![プロジェクト構成図](/img/posts/xamarin_forms_gachi_projects_2016_winter_01.png)

プロジェクトは以下の5つです。

1. Hoge.Droid
3. Hoge.iOS
4. Hoge.UWP
5. Hoge.ViewCore
2. Hoge.Core

1 〜 3 は Xamarin.Forms のソリューションを作成すると作られる各プラットフォーム向けのプロジェクトです。
4 は Xamarin.Forms のソリューションを作成すると作られる共通部分のプロジェクトです。XAML や Page などはここに記述します。プロジェクト作成直後は、 Hoge という名前ですが、説明しやすさのために Hoge.ViewCore と名称変更しています。
5 は ViewModel-Model層を担うプロジェクトです。なぜ 4 と分けているのかに意味があります。

では、それぞれ説明します。

### Hoge.Droid/iOS/UWP プロジェクト

Xamarin.Forms では「スタートアップ プロジェクト」としての役割が多いですが、以下のものを置きます。

* Custom Renderer
* Effects
* プラットフォーム固有の機能

プラットフォーム固有の機能はここに実装し、（Prism における PlatformInitializer を用いて）Dependency Injection します。

### Hoge.ViewCore プロジェクト

**Xamarin.Forms として** のメインプロジェクト。

* XAML / Page
* ValueConverter
* カスタムView
* Behavior

などを置きます。
ここには ViewModel や Model層の機能は置きません。

### Hoge.Core プロジェクト

ViewModel, Model層を配置するプロジェクト。

ここは **Xamarin.Forms に依存しません** 。そう、ViewModel や Model 層を Hoge.ViewCore に置いてしまうと、それは Xamarin.Forms に依存しているため、Xamarin.Native プロジェクトから参照できないし、Xamarin と関係ないプロジェクト(WPF とか)からも使えなくなってしまいます。

また、View層と明確に切り離すことで、View層の部品を誤って参照してしまう、といったミスをなくすことができます（それは ViewModel, Model にも言えて、規模によっては Model は別プロジェクトにすべきかも知れません）。

よって、ここには以下のものを配置します。

* ViewModel
* Model
* 各種API
* プラットフォーム固有機能の共通インターフェース

各種APIとは、SQLite/Realm などのDBライブラリ、HttpClient などのWeb通信ライブラリなどのインターフェースです。[Azure](https://docs.microsoft.com/ja-jp/azure/app-service-mobile/app-service-mobile-value-prop) 等 mBaaS 用機能も含まれるかな。
プラットフォーム固有機能の共通インターフェースは、Hoge.Droid/iOS/UWP プロジェクトでそれぞれ実装する機能クラスのインターフェースです。

## 推奨ライブラリ

### MVVMフレームワーク = Prism.Forms

* [Prism for Xamarin.Forms入門　はじめに - nuits.jp blog](http://www.nuits.jp/entry/2016/08/11/160313)

もはや鉄板とも言えるのかも。
本 Advent Caledar でこのネタもよく出ると思いますので、多くは語りませんが、いま一番勢いのあるライブラリです。

### DIコンテナ = Unity

Prism.Forms の標準のコンテナがこれなので、まあ良いかなと。
Xamarin.Forms の DependencyService は、使わない方針です。理由は二つ、ユニットテストが難しいのと、ViewModel,Model層 は Xamarin.Forms に依存しない、です。

＊＊追記(2017/1/11)＊＊

DIコンテナの Unity は開発停止しているとの情報が。

* [ゲームじゃないUnityの開発が停止している疑惑について - nuits.jp blog](http://www.nuits.jp/entry/is-unity-dead)

Unity は実績も豊富で枯れているので当面使用に問題はないでしょうが、新しいフレームワークへの追従などが期待できなくなるリスクはあります（.NET Standard とか）。

Prism 自体は、さまざまはDIコンテナに対応していて、 @Nuits さんが最新の比較をしてくれていますので、こちらも参考に。

* [IoC Battle in 2017 - nuits.jp blog](http://www.nuits.jp/entry/ioc-battle-in-2017)

### Data Binding = ReactiveProperty

* [ReactiveProperty · runceel/ReactiveProperty](https://github.com/runceel/ReactiveProperty/blob/master/README-ja.md)

こちらも鉄板。
ViewModel-Modelのやり取りは ``Task<T>`` あるいは ``Observable<T>``、Page と ViewModel のバインディングは ReactiveProperty でやるのが理想。

でも Rx 難しいという人は Prism にも ``INotifyPropertyChanged`` のヘルパーがあるので、そちらを使用してもおｋです。

### 端末内データ保存 = Akavache

Akavache については、昨年の Advent Calendar で書きました。

* [クロスプラットフォーム対応KVS Akavache を使ってお手軽にデータを保存する - Qiita](http://qiita.com/amay077/items/356ad0028b7e6fbf089f)

Key-Value Store なので、アプリケーションの設定情報などの保存に便利です。

### ロガー = MetroLog

``Debug.WriteLine`` ではツラい時はこれ。

* [MetroLog Lightweight Logging for Portable and WinJS 1.0.1](https://www.nuget.org/packages/MetroLog/)

名前がよくないですか？「Metro」ってｗ
Log4j ライクに使えるので、割と重宝しています。

[Firebase](https://firebase.google.com/docs/analytics/?hl=ja) や [HockeyApp](https://hockeyapp.net/) や [Visual Studio Mobile Center](https://blogs.msdn.microsoft.com/visualstudio_jpn/2016/11/18/visual-studio-mobile-center/) といった「継続的デプロイメントサービス」には、少し目的の違った（ユーザーの導線を知るような）ロギング機能があります。それらの SDK も選択肢に入るかと思います。

### [PR] 地図 = Xamarin.Forms.GoogleMaps

ここは宣伝です。Xamarin.Forms で地図を使うなら是非！

* [amay077/Xamarin.Forms.GoogleMaps: Map library for Xamarin.Forms using Google maps API](https://github.com/amay077/Xamarin.Forms.GoogleMaps)

(サンプルではこっそり Google Maps っではなく「地理院地図」を使うという Trick を見せています)

## 懸案

Hoge.Core を Xamarin.Forms から切り離したとは言え Prism には依存しているので、それが邪魔になる可能性はあります。特定の MVVM フレームワークに依存したくなければ Prism.Forms の使用をあきらめるしかないと思いますが、Model層だけは別プロジェクトに逃がして、再利用する選択肢もあります。

## サンプルアプリ

本ポストの指針に基づいたサンプルアプリを作ってみました（全てのライブラリを使っているわけではありませんが）。

これは、

1. テキストボックスに住所を入力してボタンを押す
2. 住所から緯度経度を取得（ジオコード）して、次の画面に渡す
3. 地図上にマーカーを立てる

という単純なものです。

![サンプル](/img/posts/xamarin_forms_gachi_projects_2016_winter_02.gif)


本ポストで提示したプロジェクト構成になっており、

* Prism.Forms による MVVM サポート、ナビゲーション、DI
* ReactiveProperty による Data Binding

を実装しています。よければ参考にしてください。

* [amay077/XamarinFormsGachiSample2016Winter](https://github.com/amay077/XamarinFormsGachiSample2016Winter)

※ 住所→緯度経度の変換（ジオコーディング）には、 OpenStreetMap の [Nominatim](http://wiki.openstreetmap.org/wiki/JA:Nominatim) を使用しています。
※ 地図の表示には、 国土地理院 - 地理院地図の [地理院タイル](http://maps.gsi.go.jp/development/ichiran.html) を使用しています。

## まとめ

「プロジェクトを分ける」ことを意識することで、それぞれの責務に関心が持てます。

小規模アプリなら、デフォルトの4つでもよいでしょうし、大規模アプリだとこので紹介した5つでは足りないかも知れません。

原理主義的に分けすぎるのも考えものですが、いつも心に留めておきたいですし、開発前にできるだけ設計したいですね。

では、本日より25日間、 Xamarin Advent Calendar 2016 シリーズをお楽しみ下さい。

* [Xamarin Advent Calendar 2016 - Qiita](http://qiita.com/advent-calendar/2016/xamarin)
* [Xamarin(その2) Advent Calendar 2016 - Qiita](http://qiita.com/advent-calendar/2016/xamarin2)
* [[学生さん・初心者さん大歓迎！]Xamarin Advent Calendar 2016 - Qiita](http://qiita.com/advent-calendar/2016/xamarin-student)
* [[初心者さん・学生さん大歓迎！]Xamarin その2 Advent Calendar 2016 - Qiita](http://qiita.com/advent-calendar/2016/xamarin-welcome)
