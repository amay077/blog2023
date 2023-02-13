---
templateKey: blog-post
title: Xamarin(ザマリン) とはなんぞや
date: 2013-12-01T00:00:00.000+09:00
tags:
  - Xamarin
  - XAC13
  - iOS
  - Android
  - C#
---

【2017年5月時点の情報で更新しました。】

Xamarin(ザマリンと読みます) とはなんぞや、個人開発者として使う時にどうなるの、的な事をさらっと書いてみようと思います。
<!--more-->

Xamarin は 2016年2月、Microsoft に買収され、 Visual Studio に無償で同梱されることになりました。

* [【速報】Xamarin のこれからについて！ - Xamarin 日本語情報](http://ytabuchi.hatenablog.com/entry/ms-xamarin)
* [Xamarin が Microsoft に買収された結果 - Qiita](http://qiita.com/amay077/items/6e5c40abe0c21fc79e6a)

Xamarin 自体は元企業名であり、その歴史は .NET の Linux 版を開発していた Ximian という企業が Novell に買収されて、その後レイオフされて作った企業で・・・した。
このあたりの歴史については [@atsushieno さん](http://atsushieno.hatenablog.com/entry/2013/12/24/213950) や [ちょまどさん](https://blogs.msdn.microsoft.com/chomado/xamarin/xamarin-history-as-a-company/) のブログが（読み物としても）おもしろいです。
Microsoftに買収されたことにより企業としての Xamarin はなくなりますが、現在のところ Xamarin という開発ツールの名称は、Visual Studio や、Xamarin Studio の中に見ることができます。

* [Xamarin - Official site](http://xamarin.com/)
* [Xamarin - Wikipedia](http://ja.wikipedia.org/wiki/Xamarin)

で、同社が開発した、 .NET技術で iOS や Android アプリが作成できる SDK が、Xamarin.iOS だったり、Xamarin.Android だったりするわけですが、それらに Mac アプリを開発できる Xamarin.Mac や、Xamarin Studio という統合開発環境を加えたツール群をまるごとひっくるめて Xamarin と呼んでいます。
（Xamarin社は他にも、クラウド上で実機テストができる [Xamarin Test Cloud](https://www.xamarin.com/test-cloud), C#のPlaygroundツール[Xamarin Workbooks](https://developer.xamarin.com/guides/cross-platform/workbooks/) などのプロダクトがあります）

## 作成できるアプリケーション

開発ツールの Xamarin を利用して作成できるアプリは、まず以下のものがあります。

* Mono を利用したアプリケーション、クラスライブラリ
* iOSアプリ(Xamarin.iOS)
* Androidアプリ(Xamarin.Android)
* macOSアプリ(Xamarin.Mac)
* 複数のプラットフォームで再利用可能なクラスライブラリ(PCL)

さらに、 Xamarin.Forms というフレームワークによって、以下のアプリも作成可能です。

* Windowsアプリ（UWPのみ）
* Tizenアプリ（※開発中）

Windows 用の .NETアプリ(Windows.Forms や WPF)は、Xamarin 自体では作成できません。それは Visual Studio の役割です。ただ、PCL(Portable Class Library)と呼ばれる、プラットフォームを問わず動作するアセンブリ(DLL) を作成できますし、そもそも Mono と .NET の API はほとんど同じなので、書いたコードは Windows でも流用できます。

## どこが共通化できる？

まず、Xamarin.Android, Xamarin.iOS, Xamarin.Mac が提供するのは、

**各プラットフォーム(PF)版の.NET API ＋ 各PFのAPIの.NETラッパクラス**

です。

「各PF版の.NET API」とは、いわゆる基本クラスで、基本的な型だったり、文字列処理だったり LINQ だったりその他もろもろです。

一方、「各PFのAPIの.NETラッパクラス」とは、Android なら Android SDK、iOS なら CocoaTouch の API を .NET で記述できるラッパーです。ここにプラットフォーム間の互換性はありません。

なので、画面を作るのに Xamarin.Android なら ``Activity`` クラスを使いますし、Xamarin.iOS なら ``ViewController`` クラスを使います。
GPS を使うのに、.Android なら ``LocationManager`` を使いますし、.iOS なら ``CLLocationManager`` を使います。

つまり、共通にできるのは「コア」な部分だけで、「画面」と「各PF固有の機能」は共通化することができません。従って、各プラットフォーム の API は理解しておく必要があります。それから .NET Framework の基本クラスライブラリも。

上司に言うと「なんだその程度か」と返されると思いますが、コア部分だけでも、 **Javaと Swift でそれぞれ実装しなくて良い** というのは十分に価値があると思うんですよね僕は。

* [XamarinでWindows / Mac OSX 両対応のデスクトップアプリを作る](http://qiita.com/okajima/items/8ca53ff00a825f28dbc6)

は、異なるプラットフォームで共通化できる箇所が具体的に示された有益な情報です。

ほかのクロスプラットフォーム開発可能な SDK（Titanium とか Abobe AIR とか）との比較はこちら → かきました : [Xamarin vs 他のクロスプラットフォーム開発ツール](http://qiita.com/amay077/items/01917ef1be3da9259348)

## 画面まで共通化できる [Xamarin.Forms](https://www.xamarin.com/forms) 

これはいわゆる Titanium Mobile や Adobe Air, Delphi XE, 最近では React Native と同じアプローチで、共通の画面定義体から、各種プラットフォーム（Android, iOS, Windows Phone, UWP<Universal Windows Platform >）向けの画面を生成します。Adobe Air, Delphi XE と異なるのは、それぞれのプラットフォームが提供するUIパーツが使用されるという点です。
画面定義体は XAML（ザムル, WPF のそれとは違います）か C＃ のコードで記述します。他にも ValueConverter, バインディング可能なプロパティなど .NET アプリ開発者に馴染みのある要素を使って開発できます。
XAML のグラフィカルなエディタはないので手書きするしかありませんが、[XAML Previewer for Xamarin.Forms](https://developer.xamarin.com/guides/xamarin-forms/xaml/xaml-previewer/)や、[Gorilla Player](http://gorillaplayer.com/)を使って、リアルタイムにプレビューさせることができます。

このXamarin.Formsフレームワークの活用は広がりを見せていて、以下のものに対応（または目下対応中）します。

* Android
* iOS
* UWP
* macOS
* Tizen

2016年11月に、[TizenがXamarin.Forms対応プラットフォームに加わった事](http://nakasho-dev.hatenablog.jp/entry/2016/11/18/030310)は、ちょっとした驚きとともに迎え入れられました。今後は [WPF への対応もあるかも](https://twitter.com/migueldeicaza/status/827220707465654272) しれません。

Xamarin.Formsは発展途上でも何でもありません。**実戦投入できるフレームワーク** です。
複数プラットフォームで辻褄を合わせて共通なインターフェースとして公開しなければならないので、提供されるUIコントロールは少ないですが、Xamarin.Android, Xamarin.iOS の上に成り立っているので、 **ネイティブの部品をXamarin.Forms化することは容易** です。なぜならネイティブのAPIも同じ言語で同じIDEを使って開発・デバッグできるからです(例えば React Native では、AndroidネイティブのAPIをJavaScript側にブリッジする箇所は Java で**書か**なければなりません)。

## Macの人は Visual Studio for Mac、Win の人は Visual Studio で開発しますよ

Mac 向けの Visual Studio、[Visual Studio for Mac](https://www.visualstudio.com/ja/vs/visual-studio-mac/) がされました。
中身は実質 Xamarin Studio で、 Windows版の Visual Studio の機能がすべて搭載されているわけではありません。
Xamarin Studio もしばらくは Visual Studio for Mac と同じ機能を搭載していくようなので、どちらを使ってもよいと思います。

Windows の場合、Visual Studio 2017 に同梱されるようになり、また無料化されたため、 Visual Studio Community でも利用できるようになりました。
(これまで提供されてきた Windows版の Xamarin Studio は、提供終了となりました。)
Visual Studio 2015 でも使用可能ですが、環境構築でハマることが多いので Visual Studio 2017 を推奨します。Visual Studio 2017 では、Xamarin のインストールが簡単になっています。それでも既定の選択だとかなりの容量が必要なので、次のリンクを参考に、定義オプションを外すとよいでしょう。

* [Xamarin やりたい人向け Visual Studio 2017 インストール手引書 - Xamarin 日本語情報](http://ytabuchi.hatenablog.com/entry/visualstudio2017)
* [Xamarin の為だけに Visual Studio 2017 をミニマムインストールする - Qiita](http://qiita.com/amay077/items/43cd700e4d125a6517b7)

Visual Studio 2015 と Visual Studio 2017 は共存が可能です。

その他の開発ツールには [JetBrains Rider](https://www.jetbrains.com/rider/) があります。また開発中の製品ですが、現時点でも開発に使用することができます。

* [JetBrains Rider で Xamarin.Android プロジェクトのデバッグが行えるようになりました - Qiita](http://qiita.com/amay077/items/c22f608c5ec4c2e39d88)

また iOS アプリを開発する場合は、ビルドや実行・デバッグのために Mac が必要なので、現実的には Mac 必須です。これは買収された後も変わっていません。
Remoted iOS Simulator (for Windows) が搭載され、Windows の画面でアプリを実行することができるようになりましたが、iOS アプリのビルドには Mac がどうしても必要になります。

## だからiOSアプリを作るならMacは必要なんだってば！

[Xamarin Live Player](https://www.xamarin.com/live) が発表されて、次のような日本語記事が公開されています。

* [WindowsでiOSアプリを開発、テスト、公開できる――MicrosoftがXamarin Live Playerを発表 | TechCrunch Japan](http://jp.techcrunch.com/2017/05/12/20170511microsoft-now-lets-ios-developers-deploy-run-and-test-their-apps-directly-from-windows/)
* [iOSアプリ開発でMac OSが不要に、Windowsで開発・テスト・公開可能な「Xamarin Live Player」 -INTERNET Watch](http://internet.watch.impress.co.jp/docs/news/1059302.html)

が、 「macOS不要でiOSアプリが **公開** できる」というのは間違い（誤訳）です。
Xamarin Live Player(XLP)の実行形式は、

* [Xamarin Live Playerの仕組みを想像してた - ぴーさんログ](http://ticktack.hatenablog.jp/entry/2017/05/13/022611)

で解説されているとおり、XLP用のiOSアプリがソースコードをインタープリタ形式で実行しているに過ぎません。つまり、実際のアプリが動作しているわけではなく、アプリを配布・公開するには、これまで通りmacOSでビルドする必要があります。あと [これ](https://twitter.com/amay077/status/862838700568334336)。

## Xamarin のコアライブラリはオープンソースになりました

Xamarin の基盤となっている [Mono](http://www.mono-project.com/) は元々オープンソースです。

Xamarin.Android, Xamarin.iOS, Xamarin.Mac, Xamarin.Forms のこれまでプロプライエタリだったライブラリ群は、いずれもMITライセンスによるオープンソースになりました → [Xamarin Open Source SDK](http://open.xamarin.com/)

Xamarin Studio の IDE としての機能は元々オープンソースである MonoDevelop なので、純粋な Mono アプリケーションを作成するのにも使用されます。Xamarin Studio の Xamarin固有のプラグイン部は、オープンソース化されないとのことです。つまり、Microsoftとしては「開発ツールが収益源」ということになります。

## 価格

Xamarin自体は無償になりましたが、企業利用の場合、大抵は Visual Studio の購入が必要になります。

### 個人の場合

Windowsの人は、[Visual Studio Community](https://www.visualstudio.com/ja-jp/products/visual-studio-community-vs.aspx) で開発・配布ができるようになりました。
Macの人は、Visual Studio for Mac で（もちろん [Xamarin Studio](https://www.xamarin.com/studio) でも） 開発・配布ができるようになりました。

### 企業の場合

Windowsの人は、Visual Studio のサブスクリプションの購入が必要です。
Macの人は、Visual Studio for Mac で開発を行いますが、Windowsと同様、Visual Studio サブスクリプションの購入が必要です。

詳しくは、 [Xamarin の開発環境を整理しよう - Xamarin 日本語情報](http://ytabuchi.hatenablog.com/entry/2016/04/02/163106) を参考に、あるいは Microsoft へ問い合わせてください。

[@nuits_jp](https://twitter.com/nuits_jp) さんが「絶対わかるXamarinライセンスの判断方法」を書いてくれました！

* [絶対わかるXamarinライセンスの判断方法 - nuits.jp blog](http://nuits.hatenadiary.jp/entry/2016/07/11/231323)

## 日本語情報について

2017年5月現在、Xamarin の日本語情報もだいぶ増えてきました。

### 書籍

2017年6月、ついに Xamarin.Formsバイブルの日本語書籍が発売されます。

#### [プログラミングXamarin 上 Xamarin.FormsとC#によるクロスプラットフォームモバイルアプリ開発](http://amzn.to/2pEHd38)

ついに登場、Xamarin.Formsのバイブル「[ペゾルド本](https://developer.xamarin.com/guides/xamarin-forms/creating-mobile-apps-xamarin-forms/)」の日本語訳書籍、@atsushieno さんが [XamarinFormsBookReading](https://xamarinformsbookreading.connpass.com/) で巡回されてるやつですね。

#### [Xamarinエキスパート養成読本 (Software Design plus)](http://amzn.to/2nExEQ0)

「エキスパートになる」というよりは、「初心者の人がとりあえずXamarin.Formsでアプリを作れるようになる」ところまでが書かれています。

#### [Xamarinではじめるスマホアプリ開発](http://amzn.to/2nEBKrD)

こちらも初心者向け。Visual Studio for Mac が使われていてどちらかというとiOSアプリ寄りの解説がされています。

#### [C#によるiOS、Android、Windowsアプリケーション開発入門](http://www.amazon.co.jp/dp/B00MN5P6PY/?tag=oku2008-22)

内容は少し古いですが、基礎の理解には問題ありません。

#### [.NET開発テクノロジ入門2016年版 Visual Studio 2015対応版](http://www.amazon.co.jp/dp/4822298612/?tag=oku2008-22)

.NET開発全般についての書籍ですが、Xamarinについての章があります。C＃/.NET自体もこれから勉強するという方にはふさわしいでしょう。

#### [かずきのXamarin.Forms入門（Kindle版)](http://amzn.to/2l7oQNK)

元MVPで現Microsoftの中の人 @okazuki さんによる自費出版本です。Xamarin.Formsの日本語での入門にはピッタリです。

### Webサイト、ブログ

* [ものがたり](http://atsushieno.hatenablog.com/) - Xamarin の中の人である [@atsushieno](https://twitter.com/atsushieno) 氏のブログ
* [ちょ窓帳 – 千代田まどか(ちょまど)のブログ](https://blogs.msdn.microsoft.com/chomado/) - Microsoftエバンジェリストのちょまどさんのブログ
* [Xamarin 日本語情報](http://ytabuchi.hatenablog.com/) - Xamarinコミュニティ(JXUG)主宰の @ytabuchi さんのブログです。
* [Xamarin逆引きTips - Build Insider](http://www.buildinsider.net/mobile/xamarintips) - Xamarinに関するTipsが集まっています
* [Qiita の "Xamarin" タグ](http://qiita.com/tags/xamarin/items)
* [Experiments Never Fail](/) - ワタシのブログです😅
* [teratail の "Xamarin" タグ](https://teratail.com/questions/search?q=Xamarin) - 分からない事はここで聞いてみると大抵回答があります

### コミュニティ

* [Japan Xamarin User Group (JXUG)](http://jxug.org/) - @ytabuchi さんが代表と務められているコミュニティ。定期的に勉強会、ハンズオンなどを開いています。
* [JXUG - connpass](https://jxug.connpass.com/) - 登録しておくとXamarinのハンズオンや勉強会の通知を受け取れます

Microsoft に買収され、より多くの人に知ってもらえ、使ってもらえるようになった Xamarin、事実上クロスプラットフォーム開発の最良の選択肢になったと言えますね。

## 最後に注意点

Visual Studio ＋ Xamarin はクロスプラットフォームアプリ開発が行える非常に強力な開発ツールですが、Android や iOS のアプリ開発の知識は **必須** です。

また、Visual Studio は最強のIDEであるのはその通りですが、Androidアプリ開発には Android Studio、iOSアプリ開発にはXcodeという公式な開発ツールがあり、それらの方が便利な機能もあります。

そのため、Android Studio や Xcode で Android、iOSアプリを開発できるようになった上で、Visual Studio+Xamarin でクロスプラットフォーム開発をするのが、最大の効果を得られる方法です。

**Java も Swift も学んで C# で D.R.Y(Don't Repeat Yourself) するのが Xamarin です**

## 技術書典2/超技術書典に出展しました！

**Essential Xamarin Yin/Yang (陰/陽)** という Xamarin の技術同人誌を数名で書きました。
2017年にXamarinアプリケーション開発技術の入り口から最先端の世界までを日本語で読める、希少な書籍です。是非ごらんください。

[技術書典2](https://techbookfest.org/event/tbf02/circle/5699714196439040) に出展・販売しました。2時間ほどで完売となりありがとうございました。
続いて[超技術書典](https://techbookfest.org/event/cho01)にも出展しました。たくさんのご来場ありがとうございました。

* [技術書典2/超技術書典 出展情報 - Xamaritans](https://atsushieno.github.io/xamaritans/tbf2.html)

また、通販や商業本化も進んでいきますので、ご期待下さい！

<blockquote class="twitter-tweet" data-cards="hidden" data-lang="ja"><p lang="ja" dir="ltr"><a href="https://t.co/kubQuMJvYM">https://t.co/kubQuMJvYM</a><br>というわけで Essential Xamarin は商業出版計画が進行中🎉ですのでお楽しみに！<br>通信販売も予定してます。直近は超技術書典よろしくです！ <a href="https://t.co/tT3ktAOJrs">pic.twitter.com/tT3ktAOJrs</a></p>&mdash; あめい@超技術書典4/30 あ-12 (@amay077) <a href="https://twitter.com/amay077/status/854348960864944128">2017年4月18日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
