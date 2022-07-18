---
templateKey: blog-post
title: Xamarin を使用したアプリ開発での、問題解決の方法
date: 2017-07-18T00:00:00.000+09:00
tags:
  - Xamarin
  - C#
  - Android
  - iOS
  - .NET
---
Xamarin はクロスプラットフォームアプリ開発ツールで、しかも「ネイティブAPI をラップするだけ」のタイプなので、トラブルの解決方法は、ネイティブアプリ開発の情報やノウハウの中にある場合が多いです。

<!--more-->

![](/img/posts/how_to_troubleshoots_about_xamarin_programming_01.png)

私が Xamarin.Forms でアプリ開発をしていて、書いたコードが期待通り動作しない場合、以下のような手順で問題解決を試みていますよーというのを紹介します（環境面のトラブルではなく書いたコードの問題についてです）。

ひとつ最初に言いたいのは、問題が発生したときにまず行うことは、 **問題が発生する最小の環境を作り出す** ことです。修正のためにコードを書き換えたり、人に聞いたりするのはその後です。これは Xamarin に限らず、いやプログラミングに限らず、問題解決する際にはいつも心がけている事です。

## 1. それはネイティブ（Java-Android や Swift-iOS）でも起こり得る事象か切り分ける

まずは、直面している問題は Java での Android アプリ開発や Swift での iOS アプリ開発でも起こり得るかを考えてみましょう。とりあえず「Android + Java + あなたが直面している問題」をキーワードにググってみても良いかもしれません。

画面のUIパーツの挙動、GPSなどセンサー類の使い方、通知や課金周りのトラブルなどは、ここに該当する場合が多いです。

もっと大雑把に言うと、 Xamarin.Forms を使っている人は、何か問題が起こったら、Xamarin.Forms ではなく、Xamarin.Android や Xamarin.iOS で試しにアプリを作ってみて、同様の問題に直面するか切り分けてみてください(Java や Swift で再現コードを書くなら、それがベストです)。

もしそれが Xamarin.Android や Xamarin.iOS でも起こる問題ならば、解決方法はネイティブ（Java-Android や Swift-iOS）アプリ開発の情報の中にあります。ネイティブアプリ開発に詳しい人に聞くのもよいでしょう（逆に Xamarin.Forms のソースコードを Java や Swift でのアプリ開発に詳しい人に見せても、お互いよい結果にはならないでしょう）。

## 2. それは Xamarin固有の事象か、.NET全般で起こりえるか切り分ける

ネイティブが原因である可能性を排除できたら、次は Xamarin 固有の事象かどうかを切り分けます。

Xamarin 固有とは、言い換えればほとんど [Xamarin.Forms](https://developer.xamarin.com/guides/xamarin-forms/) の機能に関する問題かどうかです。

* Xamarin.Forms の画面レイアウト(ContentPage, MasterDetailPage, ContentView, …)
* Xamarin.Forms の画面ナビゲーション(NavigationPage, PushAsync, PushModalAsync, …)
* (Xamarin.Forms の)XAML
* (Xamarin.Forms の)データバインディング
* カスタムレンダラー
* Effects, Behavior

などはここに該当するでしょう。

解決方法を探るには Xamarin.Forms + あなたが直面している問題 をキーワードにググる（英語の方が見つかりやすい）、 [teratail](https://teratail.com/) や [JXUG の Facebook ページ](https://www.facebook.com/groups/xm.jxug/)に、 Xamarin.Forms のタグを付けて、聞いてみるのもよいです。

ちなみに現在日本で発売されている Xamarin に関する書籍は、マイクロソフト公式である

* [プログラミングXamarin 上 Xamarin.FormsとC#によるクロスプラットフォームモバイルアプリ開発](http://amzn.to/2vcXNGb)

を筆頭に、ほとんどが Xamarin.Forms に関するものです。書籍から解決方法が得られるかも知れません。
日本で発売済、または発売予定の書籍一覧は

* [Xamarin(ザマリン) とはなんぞや - 日本語情報について - 書籍](http://qiita.com/amay077/items/38ee79b3e3e88cf751b9#%E6%9B%B8%E7%B1%8D)

でも紹介しています。

Xamarin.Forms 向けと誤解されやすいのですが [Plugins for Xamarin（Xamarin Plugins）](https://github.com/xamarin/XamarinComponents) と呼ばれるライブラリ群があります。
ここでトラブルに遭遇した場合、それは Xamarin固有 ですが Xamarin.Forms には依存しません。つまり 1. に戻って「Xamarin.Android、Xamarin.iOS で試してみる」ことが可能になります。さらにこれらはオープンソースなので、デバッグも可能です。ソースコードを追えば、Xamarin Plugins は各ネイティブのAPIを使った実装に対して、共通なインターフェースを与えているだけであることが分かると思います。

## 3. .NET全般で起こりえる問題であれば、.NET系の情報源から解決方法を探す

ここまで来ると、「Android/iOSネイティブが原因ではない」「Xamarin固有の機能(≒Xamarin.Forms)が原因でもない」となっているはずです。

ここであり得る問題は、

1. C# の言語機能に関すること
2. .NET Framework(や Mono)クラスライブラリの使い方や仕様に関すること
3. .NETプラットフォームを対象とした有償やOSSのライブラリに関すること

くらいしか想定される原因がないと思います。

1 は言語の知識を得れば解決すると思いますが、言語の最新バージョンが使用できるか否かに関わるトラブルはあり得ます。

2 も、.NET Framework のクラスライブラリの使い方の（新しめの）情報を当たれば、単純な How to であれば解決します。

ちょっと複雑な問題である場合もあります。
例えば 「.NET Framework のクラスを使用した通信処理が Android では正しく動作しない、使い方は正しいはずである。」という問題が起こった場合、次のように切り分けていく必要があります。

* そのコードは iOS でも動作するか？
* そのコードは Windows(コンソールアプリ) でも動作するか？

.NET Framework は、プラットフォームによって実装が異なるため、同じコードでも「あるプラットフォームだけ動作しない」可能性はあり得ます。そのような場合、動作させたい全てのプラットフォームで期待通り動作するコードに辿りつければよいですが、そうでない場合、プラットフォーム固有の回避（ワークアラウンド）コードを埋め込む必要があるかもしれません。

AOT(Ahead Of Time)コンパイルを使用するiOS固有の事象として「iOSシミュレータでは動作するが、端末では動作しない」というものがあります。[Limitations - Xamarin](https://developer.xamarin.com/guides/ios/advanced_topics/limitations/) に引っかかってないか確認しましょう（Android でも端末による挙動の違いはありますが、主旨がズレるので割愛します）。

3 は、有名どころだと [Json.NET](http://www.newtonsoft.com/json) のような、主に nuget で配布されているライブラリです。これらに関する問題であれば、発生している事象と、再現に必要な最小限の情報を突き止めて、 GitHub の issue や開発元へコンタクトを取るなどを行いましょう。ソースコードが公開されているので、大抵の場合、自分でデバッグして問題点を特定し、修正のパッチを投げることも可能です。

中には（[Prism.Forms](https://github.com/PrismLibrary/Prism) のように）、Xamarin.Forms を対象としたライブラリもあります(Prism はその他のプラットフォームにも対応していますが)。そのような場合でも、まずは問題が Xamarin.Forms にあるのか Prism.Forms にあるのかを切り分けて、適切な質問をしましょう。

# まとめ

もう一度言います。

**問題が発生する最小の環境を作り出し** てから、解決方法を探ったり、人に聞きましょう。

【おまけ】
他のクロスプラットフォーム開発ツールに比べて Xamarin が秀でているのは 1. の
「ネイティブ（Java-Android や Swift-iOS）でも起こり得る事象かの切り分けが簡単」
なことです。なぜなら Xamarin は「ネイティブAPI をラップするだけ」だから。
ここで紹介したトラブルシューティングの手間が面倒だ(＝メリットよりデメリットの方が大きい)と感じるのであれば、Xamarin は使わない方がよいでしょう。
