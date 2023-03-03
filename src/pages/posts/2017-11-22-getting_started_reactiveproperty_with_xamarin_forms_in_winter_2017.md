---
templateKey: blog-post
title: 2017年冬から始める ReactiveProperty + Xamarin.Forms
date: 2017-11-22T00:00:00.000+09:00
tags:
  - Xamarin
  - csharp
  - dotnet
  - Android
  - iOS
---
つい最近まで PCL な Xamarin.Forms では、 ReactiveProperty の 2.x 系しか使えないと思っていたのですが、いろいろな方の協力で使える方法が分かったので示しておく。
<!--more-->

今から ReactiveProperty を（Xamarin で）使ってみたいぞ、という人向けのクイックスタートも兼ねております。

## 1. ソリューションを作る

Visual Studio for Mac で行きます。

新しいソリューションから、 アプリ - 空白フォームのアプリ を選んで、適当な名前で作成します。ここでは 「ReactivePropertySample」 としますね。

![image.png](https://qiita-image-store.s3.amazonaws.com/0/8227/8cfdeb53-c9d5-1134-b9d7-042a3a9f5536.png)

## 2. PCL のプロファイルを "44" に変える

ソリューションが作成できたら、３つあるプロジェクトの中のコアプロジェクト(.Droid や .iOS のついてないもの)を選択して右クリック → 「オプション」を開きます。

![image.png](https://qiita-image-store.s3.amazonaws.com/0/8227/7d58f3ae-6641-a079-8fe1-08770a6c3bdd.png)

ダイアログから、「ビルド」 → 「全般」を選択して、Target Framework の 「.NET ポータブル」の横にある「変更」を押し、プロファイルを **「PCL 4.6 - Profile44」** に変更して OK を押します。対応プラットフォームから Windows Phone のチェックが外れますが **まったく問題ありません** 。

![snap1.png](https://qiita-image-store.s3.amazonaws.com/0/8227/62a20ef9-1a16-41f9-8c4d-7be50d4a3c31.png)

## 3. System.Runtime.InteropServices.RuntimeInformation の nuget パッケージを追加する

@yamachu さんが書かれた、

* [XamarinなどのPCLプロジェクトにSystem.Reactiveを導入しようとすると失敗することへの対策 - 窓を作っては壊していた人のブログ](http://teitoku-window.hatenablog.com/entry/2017/11/18/185501)

の通りです。ReactiveProperty 3.x が依存している System.Reactive をインストールするには、まず 
System.Runtime.InteropServices.RuntimeInformation を入れる必要があります。

コアプロジェクトを選択して、 メニュー → プロジェクト → Nuget パッケージの追加 とし、右上検索ボックスに "System.Runtime.InteropServices.RuntimeInformation" をタイプして絞り込みます。

![snap2.png](https://qiita-image-store.s3.amazonaws.com/0/8227/8d61fc47-b069-a850-873b-824c8c1c2bf2.png)

見つかったら、右下の追加ボタンでインストールします。現在の最新バージョンは 4.3.0 です。

## 4. System.Reactive の nuget パッケージを追加する

次に、ReactiveProperty 3.x が依存している System.Reactive をインストールします（いきなり ReactiveProperty を入れてもよいのかもだけど、まあ順番にやってみましょう）。

方法は 3. と同じです。 nuget のダイアログボックスで System.Reactive とタイプして、結果から選択して追加します（雑になってきたｗ）。

![snap3.png](https://qiita-image-store.s3.amazonaws.com/0/8227/52afd47b-5998-6ac3-90d8-c38c47fa6afe.png)

## 5. ReactiveProperty の nuget パッケージを追加する

ついに ReactiveProperty のインストールです。 3. 4. と同じ方法で追加しましょう（雑）。

![snap4.png](https://qiita-image-store.s3.amazonaws.com/0/8227/42902eb0-9f29-0e3b-e9b0-5d00d0ab7021.png)

バージョン 3.x 系をついにいれる事ができました。現在の最新stableは 3.6.0 です。

できてしまえば簡単ですが、この方法に辿りつくまでに多くの労力と時間とご協力をいただきました。みなさまありがとうございました。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">うーん，なんというか微妙なハックですけど，System.Runtime.InteropServices.RuntimeInformation 4.0.0(Reactive 3.1.1が依存しているバージョン)の依存にMicrosoft.NETCore.Platformsが含まれていて，そのせいでPCLのでの展開が出来ないんじゃないかなぁと睨んでいます．</p>&mdash; 留まり奈緒 (@y_chu5) <a href="https://twitter.com/y_chu5/status/931805975878582274?ref_src=twsrc%5Etfw">2017年11月18日</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">PCL Profile111 が Windows Phone を含んでるならそのせいですね</p>&mdash; かずき@66.8kg (@okazuki) <a href="https://twitter.com/okazuki/status/932919102351450112?ref_src=twsrc%5Etfw">2017年11月21日</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## ReactiveProperty を使ってみよう

せっかくいれたのでちゃちゃっと使ってみましょう。
ぜんぶコアプロジェクトでやります。

### I. MainViewModel を作る

``MainViewModel`` というクラスを作って、次のように書きます。

```csharp
using System;
using System.Reactive.Linq;
using Reactive.Bindings;

namespace ReactivePropertySample
{
    public class MainViewModel
    {
        public ReactiveProperty<long> Counter { get; }

        public MainViewModel()
        {
            Counter = Observable.Interval(TimeSpan.FromSeconds(1)).ToReactiveProperty();
        }
    }
}
```

``Counter`` という変更通知プロパティを ReactiveProperty を使ってつくります。
Reactive Extensions の機能を使って、「１秒おきに１ずつカウントアップ」していきます。

### II. 画面(Page)とバインドする

プロジェクトを作った時に ``ReactivePropertySamplePage.xaml`` という画面ができていると思うので、それを編集します。 XAML の編集だけでいきましょう。

```xml
<?xml version="1.0" encoding="utf-8"?>
<ContentPage 
    xmlns="http://xamarin.com/schemas/2014/forms"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:local="clr-namespace:ReactivePropertySample" 
    x:Class="ReactivePropertySample.ReactivePropertySamplePage">

    <ContentPage.BindingContext>
        <local:MainViewModel />
    </ContentPage.BindingContext>
    
    <Label Text="{Binding Counter.Value}" 
        VerticalOptions="Center" 
        HorizontalOptions="Center" />
    
</ContentPage>
```

``<ContentPage.BindingContext>`` で、 ``MainViewModel`` をバインド対象としています。
そして、ラベルの Text に ``"{Binding Counter.Value}"`` と書くことで、 Counter 値をデータバインドしています。 **.Value を付けるのを忘れずに！**（と言っても忘れるんだよ、分かる。みんなやってる。）


### III. 動かす

OK, これで完成です。 Android でも iOS でも動きます。

![Untitled2.gif](https://qiita-image-store.s3.amazonaws.com/0/8227/0166bdbd-c0e0-4c6f-8289-49fec91335bf.gif)

文字ちっさ！

## まとめ

最新の環境で ReactiveProperty を使う方法を紹介しました。

ReactiveProperty は、Reactive Extension のパワーを View とのデータバインディングにそのまま活用できる、現代においては必須のライブラリです。
もちろん、変更通知プロパティを手書きする手間をなくす目的で使うのもよいですね。

「ReactiveProperty のここがすごい！」というのをもう少し、別記事で紹介していきたいと思います。

ちなみに、コアプロジェクトが PCL でなく .NET Standard なら、もうちょっといろいろ楽…なハズ！それについては誰かが書いてくれることを望みます :pray: 

## おまけ

これだけなのにインストールされたパッケージ群がえらいことになった。。。。

![snap5.png](https://qiita-image-store.s3.amazonaws.com/0/8227/cf41f313-9ab7-2bd1-5736-f8551d701029.png)
