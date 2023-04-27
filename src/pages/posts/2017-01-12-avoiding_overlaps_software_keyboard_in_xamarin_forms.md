---
templateKey: blog-post
title: Xamarin.Forms でソフトウェアキーボードが表示された時に画面が隠れないようにする
date: 2017-01-12T00:00:00.000+09:00
tags:
  - Xamarin
  - xamarin-forms
  - Android
  - iOS
---
Xamarin.Forms で、ソフトウェアキーボードを表示した時の動きが、Android と iOS で違って、いずれも目的の動作と合わなかったので、調べてみました。
<!--more-->

## やりたいこと

これ↓

![](/img/posts/keyboard_ovelapping_in_Xamarin_forms_04.gif)

いわゆる LINE のような画面、リストビューと文字列入力があって、文字列入力にフォーカスが当たるとソフトウェアキーボードが表示され、その分リストビューの高さが縮む、という動きです。
これを Xamarin.Forms(Android と iOS)で実現したいです。

## Android の場合

Xamarin.Forms アプリの Android 側で、特になにもせずに LINE 風の画面を作って動かすと、下図のようになります。

![](/img/posts/keyboard_ovelapping_in_Xamarin_forms_01.png)

ソフトウェアキーボードによって、画面が隠れることはありませんが、ListView の高さが縮んでいるのではなく、 **画面全体が上へスライド** しています。そのため、キーボードを表示したまま、ListView の先頭の項目を見ることができません。

Android ネイティブでは、 ``AndroidManifest.xml`` の activity の属性に ``windowSoftInputMode="adjustResize"`` を設定することで実現できます（付けなくても既定値がこれなのかな？）。

* [[Android] IME表示時にアクティビティーを伸縮させる - adakoda](http://www.adakoda.com/adakoda/2010/08/android-ime.html)

おーけーおーけー、Xamarin では ``AndroidManifest.xml`` ではなく ``MainActivity.cs`` のクラスの属性に書けばOKだな、というわけで下のように記述してみました。

```csharp
// MainActivity.cs
[Activity(Label = "ImeStretchSample.Droid",
            Icon = "@drawable/icon",
            Theme = "@style/MyTheme",
            MainLauncher = true,
            ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation,
            WindowSoftInputMode = SoftInput.AdjustResize)]  // ←ここだよー！！！
public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsAppCompatActivity
{
    protected override void OnCreate(Bundle bundle)
    {
        // 以下略
```

ところがこれが機能しません。

ググってみると Bugzilla に登録されてました。

* [39765 – WindowSoftInputMode Attribute is Ignored When Using AppCompat](https://bugzilla.xamarin.com/show_bug.cgi?id=39765#c4)

> ``Application.Current.On<Android>().UseWindowSoftInputModeAdjust(``

Xamarin.Forms の 2.3.3 以降で、上記メソッドが使えるらしい、と。
現在の Stable は 2.3.3.180 なので使えますね、使ってみましょう。

```csharp
// MainActivity.cs
protected override void OnCreate(Bundle bundle)
{
    TabLayoutResource = Resource.Layout.Tabbar;
    ToolbarResource = Resource.Layout.Toolbar;

    base.OnCreate(bundle);
    global::Xamarin.Forms.Forms.Init(this, bundle);
    LoadApplication(new App());

    App.Current.On<Xamarin.Forms.PlatformConfiguration.Android>()
        .UseWindowSoftInputModeAdjust(WindowSoftInputModeAdjust.Resize); // ←ここ！！
}
```

これを実行すると、

![](/img/posts/keyboard_ovelapping_in_Xamarin_forms_02.png)

ListView は適切に縮んでいますが、 **なんだあのステータスバー付近の空白は！！！**

さらにググります。

* [AdjustResize Workaround for Xamarin.Forms](https://gist.github.com/jimmgarrido/e36033b26f01e8da091fd321d41d991a#file-forms-2-3-2-L9)

こんな Workaround を見つけました。
適用してみます。

```csharp
// MainActivity.cs
protected override void OnCreate(Bundle bundle)
{
    TabLayoutResource = Resource.Layout.Tabbar;
    ToolbarResource = Resource.Layout.Toolbar;

    base.OnCreate(bundle);

    if (Build.VERSION.SdkInt >= BuildVersionCodes.Lollipop)
	{
		Window.DecorView.SystemUiVisibility = 0;
		var statusBarHeightInfo = typeof(FormsAppCompatActivity).GetField("_statusBarHeight", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic);
		statusBarHeightInfo.SetValue(this, 0);
		Window.SetStatusBarColor(new Android.Graphics.Color(18, 52, 86, 255));
	}

    global::Xamarin.Forms.Forms.Init(this, bundle);
    LoadApplication(new App());

    App.Current.On<Xamarin.Forms.PlatformConfiguration.Android>()
        .UseWindowSoftInputModeAdjust(WindowSoftInputModeAdjust.Resize);
}
```

リフレクションを使っていたり、 ``SetStatusBarColor`` が色固定になっていたりと激しく不安ですが、これでようやく、期待どおりの動きになりました。

![](/img/posts/keyboard_ovelapping_in_Xamarin_forms_03.png)


## iOS の場合

Xamarin.Forms の iOS 側で、特になにもせずに、ソフトウェアキーボードを表示させると、ListView と文字列入力項目の手前に被さってしまいます。

![](/img/posts/keyboard_ovelapping_in_Xamarin_forms_06.png)

通常の画面なら、 ScrollView で囲ってあげることで、適切に ScollView の高さが縮んで、その中がスクロール可能になります。
が、ScrollView と ListView のようにスクローラブルなコントロールを入れ子で使うとトラブルの素なので、ScrollView は選択できません。

iOS ネイティブでは、キーボードが表示されたかどうかを検知して、AutoLayout の制約を設定したり、自力で View のサイズを再計算するようです。

* [Auto Layoutを利用してキーボードに合わせてビューをリサイズする方法 - Qiita](http://qiita.com/rizumita/items/7852124d03a2a59d4252)

Xamarin.Forms の iOS 側での対策をググって探します。
こんなライブラリを見つけました。

* [Xamarin.Forms.Plugins/KeyboardOverlap at master · paulpatarinski/Xamarin.Forms.Plugins](https://github.com/paulpatarinski/Xamarin.Forms.Plugins/tree/master/KeyboardOverlap)

これを適用してみると、以下のような動きになります。

![](/img/posts/keyboard_ovelapping_in_Xamarin_forms_07.png)

んー、 Android 側の初期状態とおなじく、 **画面全体が上へスライド** しています。

このライブラリの [ソースコード](https://github.com/paulpatarinski/Xamarin.Forms.Plugins/blob/master/KeyboardOverlap/KeyboardOverlap/KeyboardOverlap.Forms.Plugin.iOSUnified/KeyboardOverlapRenderer.cs) を見てみます。
これは Custom Renderer で実現されていて、キーボードが表示されたら、Page の位置を上方向へ移動させているようです(``ShiftPageUp()``, ``ShiftPageDown()`` というメソッド名だし)。

であれば、この処理を改造して、「移動」ではなく「高さのリサイズ」をすればよいことになります。
以下のように修正しました（コメントアウトは旧コードです）。

```csharp
// KeyboardOverlapRenderer.cs
private void ShiftPageUp(nfloat keyboardHeight, double activeViewBottom)
{
    var pageFrame = Element.Bounds;

//    var newY = pageFrame.Y + CalculateShiftByAmount(pageFrame.Height, keyboardHeight, activeViewBottom);
//    Element.LayoutTo(new Rectangle(pageFrame.X, newY,
//        pageFrame.Width, pageFrame.Height));

    var newHeight = pageFrame.Height + CalculateShiftByAmount(pageFrame.Height, keyboardHeight, activeViewBottom);
    Element.LayoutTo(new Rectangle(pageFrame.X, pageFrame.Y,
        pageFrame.Width, newHeight));

    _pageWasShiftedUp = true;
}

private void ShiftPageDown(nfloat keyboardHeight, double activeViewBottom)
{
    var pageFrame = Element.Bounds;

//    var newY = pageFrame.Y - CalculateShiftByAmount(pageFrame.Height, keyboardHeight, activeViewBottom);
//    Element.LayoutTo(new Rectangle(pageFrame.X, newY,
//        pageFrame.Width, pageFrame.Height));

    var newHeight = pageFrame.Height + keyboardHeight;
    Element.LayoutTo(new Rectangle(pageFrame.X, pageFrame.Y,
        pageFrame.Width, newHeight));

    _pageWasShiftedUp = false;
}
```

これを動かすと、下図のようになります。

![](/img/posts/keyboard_ovelapping_in_Xamarin_forms_08.png)

iOS 側も、求めていた動きになりました。

## まとめ

改めて、期待通りの動きになった Xamarin.Forms での画面(Android と iOS)です。

![](/img/posts/keyboard_ovelapping_in_Xamarin_forms_09.gif)

Android 側は、 ``MainActivity.cs`` に ``UseWindowSoftInputModeAdjust(WindowSoftInputModeAdjust.Resize)`` と、WORKAROUND のコードを書きます。

iOS 側は、 KeyboardOverlap.Forms.Plugin のカスタムレンダラー ``KeyboardOverlapRenderer.cs`` を少し修正して使用します。

どちらもサンプルアプリを作りました。

* [amay077/ImeAutoAjustSample](https://github.com/amay077/ImeAutoAjustSample)

``/Android`` が、 Android-Java で作成した「期待値」で、
``/XamarinFormsCustomRenderer`` が、 Xamarin.Forms で「期待値」を再現した iOS/Android アプリです。

ListView + Entry のチャット画面に加えて、 ScrollView を使った画面も用意しています。

## 最後に

このポストのきっかけは、


<amp-twitter
 	data-tweetid="818794518849781760"
 	width="800"
 	height="600"
 	layout="responsive"></amp-twitter>

からの [一連の流れ](https://twitter.com/amay077/status/819123872611975168) です。もともと自分のプログラムでも懸案だったので調べてみました。

ここに書かなかったけど知見になりそうなツイートを貼っておきます。

<amp-twitter
 	data-tweetid="819142125929447424"
 	width="800"
 	height="600"
 	layout="responsive"></amp-twitter>

<amp-twitter
 	data-tweetid="819103490609856513"
 	width="800"
 	height="600"
 	layout="responsive"></amp-twitter>

関わっていただいた皆さん、ありがとうございました。
