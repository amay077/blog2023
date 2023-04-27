---
templateKey: blog-post
title: Xamarin.Forms で XAML Preview 中かどうかを判別する方法
date: 2017-01-12T00:00:00.000+09:00
tags:
  - Xamarin
  - xamarin-forms
---
Xamarin.Forms 向けのUIライブラリを提供する人向けの内容です。
<!--more-->
[XAML Previewer](https://developer.xamarin.com/guides/xamarin-forms/xaml/xaml-previewer/) によって、XAML のコーディングも捗るようになってきました。

## XAML Previewer の動き

[Custom Renderer](https://developer.xamarin.com/guides/xamarin-forms/custom-renderer/) を使って、独自のコントロールを作成し、それを Page で使用した場合、XAML Previewer は、そのカスタムコントロールもレンダリングしようとします。

アプリ実行時とほぼ変わらない処理が行われるようです。
その為、特に意識しなくとも、カスタムコントロールをプレビューすることができます。

一方で、プレビュー時には、アプリ実行時とは異なる動きをさせたい場合があります。

私の作成している [Xamarin.Forms.GoogleMaps](https://github.com/amay077/Xamarin.Forms.GoogleMaps) は地図を表示するためのカスタムコントロールです。
これは、次の理由で、プレビュー時には、実行時の処理をさせたくありません。

1. Android/iOS の Google Maps SDK に依存しているが、プレビュー時はこれが使用できない
2. 動作に必要な API Key はメソッドで渡すため、プレビュー時には API Key が無い
3. そもそもプレビュー時に地図が見えても、嬉しい人は少ない

Xamarin.Forms.GoogleMaps 以外でも、例えば Android/iOS 端末内のデータを読んで表示・描画するようなものや C/C++ のライブラリに依存したカスタムコントロールも該当すると思います。

このような場合、XAML Previewer による **プレビュー中かどうか** を判断し、プレビュー中なら背景色をグレイにする、何か文字を表示する、などの特別な処理をしたいです。

## プレビュー中かどうかの判断は可能か？

Windows.Forms で言えば ``DesignMode`` プロパティ、Blend だと ``DesignModeEnabled`` に相当するような、「プレビュー中かどうか」を明確に知る手法は、現在の Xamarin.Forms には提供されていませんでした。

## プレビュー中かどうかを判断する代替手法１: Application.Current が null か

* [Xamarin.Forms XAML Previewer - Determine if in Design Mode in Code Behind and XAML similar to Blend — Xamarin Forums](https://forums.xamarin.com/discussion/68440/xamarin-forms-xaml-previewer-determine-if-in-design-mode-in-code-behind-and-xaml-similar-to-blend)

で紹介されていますが、 「``Application.Current`` が ``null`` だったらプレビュー中である」という判断方法があるようです。

ところが、``App.xaml.cs`` で ``MainPage = new NavigationPage(new SomePage());`` としている場合、iOS ではプレビュー中にも関わらず ``Application.Current`` が ``null`` ではありませんでした（XAML Previewer が ``App.xaml.cs`` もパースして実行している？）。

## プレビュー中かどうかを判断する代替手法２: MyLib.Init() が呼ばれたか

* [Xamarin.Forms 向けのUIライブラリを作る時の注意点 - Qiita](http://qiita.com/amay077/items/b40d0383b9aaa75ab3f1)

で書きましたが、ライブラリを提供する場合、そのアセンブリが確実にロードされるようにするには、``MainActivity.cs`` や ``AppDelegate.cs`` で、UIライブラリの何らかのメソッド(``MyLib.Init()``のような)を明示的に呼び出す必要があります。

これは、「実行時にのみ、 ``MyLib.Init()`` が呼び出される」前提になるので、「``MyLib.Init()`` が呼び出されていなければプレビュー中である」と疑似的に判断することができます。

こちらは XAML Previewer でも正常に判断されました。
Xamarin.Forms.GoogleMaps では、``Xamarin.FormsGoogleMaps.Init()`` という初期化メソッドを提供していますが、これが呼び出されていない場合には、地図の描画をせず、背景色付きのラベルを配置するようにしました。

その修正のコミットが↓です。

* [Render empty bounds when FormsGoogleMaps.Init not called · amay077/Xamarin.Forms.GoogleMaps@5d483e8](https://github.com/amay077/Xamarin.Forms.GoogleMaps/commit/5d483e85ef8e64fdb5047e23b36e20862d79df21)

``OnElementChanged`` で、``Init`` が呼び出されていない場合は、``MapView`` ではなく ``UILabel`` をセットするようにしています。

```csharp
// iOS/MapRenderer.cs
protected override void OnElementChanged(ElementChangedEventArgs<View> e)
{
    base.OnElementChanged(e);

    // For XAML Previewer or FormsGoogleMaps.Init not called.
    if (!FormsGoogleMaps.IsInitialized)
    {
        var label = new UILabel()
        {
            Text = "Xamarin.Forms.GoogleMaps",
            BackgroundColor = Color.Teal.ToUIColor(),
            TextColor = Color.Black.ToUIColor(),
            TextAlignment = UITextAlignment.Center
        };
        SetNativeControl(label);
        return;
    }

    // 以下略
```

## プレビュー中はスキップした方がよい処理

前述のコミットにも示されていますが、Android/iOS それぞれの Custom Renderer の実装で、

コンストラクタ, ``OnElementChanged``, ``OnLayout``, ``OnElementPropertyChanged``, ``LayoutSubviews`` など、親クラスを override しているメソッドは、プレビュー中にも呼び出される可能性があるので、処理をスキップした方がよいです。

Xamarin.Forms.GoogleMaps では、以下のような感じで処理をスキップしています。

* [iOS/MapRenderer.cs - OnElementPropertyChanged](https://github.com/amay077/Xamarin.Forms.GoogleMaps/blob/5d483e85ef8e64fdb5047e23b36e20862d79df21/Xamarin.Forms.GoogleMaps/Xamarin.Forms.GoogleMaps.iOS/MapRenderer.cs#L130)

## 結果

これらを対応した結果、Xamarin.Forms.GoogleMaps は、Visual Studio for Mac の XAML Preview では下図のような背景色付きのラベルで表示されるようになりました。

![](/img/posts/determine_if_in_Xamarin_xaml_previewer_01.png)

プロジェクトが使用している Xamarin.Forms の nuget パッケージが古いとプレビューが表示されないようです（この記事投稿時、2.3.0 では「古い」と言われ、最新の 2.3.3 に上げたら表示されるようになりました）。

尚、未検証ですが、``Init`` が呼ばれたか、という手法なら、XAML Previewer 以外のプレビューソリューション（Gorilla Player とか）でも使用可能と思われます。
