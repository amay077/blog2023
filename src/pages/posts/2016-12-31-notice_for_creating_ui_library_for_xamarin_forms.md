---
templateKey: blog-post
title: Xamarin.Forms 向けのUIライブラリを作る時の注意点
date: 2016-12-31T00:00:00.000+09:00
tags:
  - Xamarin
  - Xamarin.Forms
  - Android
  - iOS
---
[[学生さん・初心者さん大歓迎！]Xamarin Advent Calendar 2016](http://qiita.com/advent-calendar/2016/xamarin-student) 16日目です。
[【Xamarin.Forms】自作ライブラリのカスタムコントロール使用時にSystem.IO.FileNotFoundExceptionが発生する場合の対処 - ぴーさんログ](http://ticktack.hatenablog.jp/entry/2015/11/19/083000)
<!--more-->

これ系の話です。

Xamarin.Forms 向けのライブラリで、使う側が XAML のみで完結しそうなものは、次のような種類があります。

* ValueConverter
* Behavior
* Effects
* Custom Renderer

上２つと下２つで、症状と対策が異なるので、それぞれ説明します。

## ValueConverter, Behavior の場合

## 症状

これらのライブラリを XAML でしか使用していない（C# のコードで使用していない）場合、冒頭のリンクで紹介したような ``System.IO.FileNotFoundException`` が発生することがあります。
これは iOS プロジェクトの実行で顕著なようです。（Android プロジェクトの場合、通常の実行ではプロジェクトで参照されているアセンブリが全て配布されるためでしょうか。）

## 対策

これを回避するには、 P3PPP さんが書いているように ``new MyLib.MyControl()`` などと、そのアセンブリを参照するコードを明示的に書いておきます。

あるいは、XAMLC という、XAML の事前コンパイル機能を使用することでも回避できます。これによりコンパイル時に XAML がパースされ、それに必要なアセンブリが配布されるためです。

* [XAML Compilation - Xamarin](https://developer.xamarin.com/guides/xamarin-forms/xaml/xamlc/)

XAMLC は互換性維持のためデフォルトではOFFになっており、ON にするためには ``XamlCompilationOptions.Compile`` を namespace または page class に付与します。


```csharp
// アセンブリまるっと指定
using Xamarin.Forms.Xaml;
...
[assembly: XamlCompilation (XamlCompilationOptions.Compile)]
namespace PhotoApp
{
  ...
}


// 特定ページにのみ指定
using Xamarin.Forms.Xaml;
...
[XamlCompilation (XamlCompilationOptions.Compile)]
public class HomePage : ContentPage
{
  ...
}
```

では XAMLC を強制させればOKかというとそうでもありません。これで解決できるのは、 ValueConverter, Behavior のライブラリのみです。

そもそも XAMLC も、 [Native Embedding と併用できない](https://blog.xamarin.com/adding-bindable-native-views-directly-to-xaml/) など、ON を強制できない事情もあります。

## Effects, Custom Renderer の場合

### 症状

3rd party ライブラリとして提供される Effects, Custom Renderer には、 PCL による共通インターフェース部と、 Xamarin.Android、Xamarin.iOS によるプラットフォーム実装のアセンブリが存在します。

これらの場合、プラットフォーム実装のアセンブリ(``MyLib.Droid.dll`` や ``MyLib.iOS.dll`` のこと)もまた、配布されない場合があることに注意が必要です。

CustomRenderer も Effects も DependencyService や RootingEffect を利用してプラットフォーム固有のアセンブリに制御を委譲していますが、プラットフォーム固有のアセンブリを参照するコードがあなたのアプリプロジェクトに存在しない場合、やはりプラットフォーム固有のアセンブリは配布されず、Effects や Custom Renderer が機能しないことになります。この場合、特に例外は出ません、機能するはずの Effects、CustomRenderer が表示されない、といった症状になります。

### 対策

これの対策は、C# でそのアセンブリを参照するコードを書くしかありません。しかも **プラットフォーム毎に書く必要があります** 。

#### Android 側

```csharp
// MainActivity.cs
public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsAppCompatActivity
{
    protected override void OnCreate(Bundle bundle)
    {
        TabLayoutResource = Resource.Layout.Tabbar;
        ToolbarResource = Resource.Layout.Toolbar;

        base.OnCreate(bundle);

        global::Xamarin.Forms.Forms.Init(this, bundle);

        MyLib.Initializer.InitForDroid(); // ←これ！

        LoadApplication(new App());
    }
}
```

#### iOS 側

```csharp
// AppDelegate.cs
public partial class AppDelegate : global::Xamarin.Forms.Platform.iOS.FormsApplicationDelegate
{
    public override bool FinishedLaunching(UIApplication app, NSDictionary options)
    {
        global::Xamarin.Forms.Forms.Init();

        LoadApplication(new App());

        MyLib.Initializer.InitForiOS(); // ←これ！

        return base.FinishedLaunching(app, options);
    }
}
```

アセンブリを読み込ませるだけのコードなので、プラットフォーム毎、アセンブリ毎に１回だけ呼べばOKです。

私が開発・配布している [Xamarin.Forms.GoogleMaps](https://github.com/amay077/Xamarin.Forms.GoogleMaps) も、Custom Renderer を使っているのでこれに該当しますが、 X.F.GoogleMaps は、各プラットフォームで Google Maps の API Key を指定してもらう必要があるため、もともと ``MainActivity.cs`` や ``AppDelegate.cs`` で ``Xamarin.FormsGoogleMaps.Init("your_api_key")`` を呼び出してもらう必要があったため、本件の問題は発生していませんでした。

## まとめ

Effects, Custom Renderer の場合の対応策である

「``MainActivity.cs`` や ``AppDelegate.cs`` で ``MyLib.Initializer.InitForDroid()``, ``MyLib.Initializer.InitForiOS()`` を呼んでもらう」

は、ValueConverter, Behavior の対策も包括します。よって、Xamarin.Forms 向けの UI ライブラリを提供しようと考えている人は、とりあえず **実装は空っぽの ``Initializer.Init()`` メソッドを用意して、それを各プラットフォームの起動直後に呼び出してもらう** 、という「運用でカバー」をお願いします。

今は ValueConverter、 Behavior しか提供するつもりがなくても、将来的に Effect、Custom Renderer も提供する可能性がゼロではない場合は、最初から各プラットフォームのプロジェクトも作って、上の ``Init()`` メソッドを用意しておいた方がよいと思います。

「なんだかな〜」という気もしますが、現状はこうするしかなさそうです。
