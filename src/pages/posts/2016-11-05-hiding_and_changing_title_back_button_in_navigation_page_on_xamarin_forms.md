---
templateKey: blog-post
title: Xamarin.Forms の NavigationPage で戻るボタンを消す＆タイトルを変える
date: 2016-11-05T00:00:00.000+09:00
tags:
  - Xamarin
  - Android
  - iOS
---
Xamarin.Forms で ``NavigationPage`` を使うと、 iOS では [ナビゲーションバー(UINavigationBar)](https://developer.apple.com/jp/documentation/UserExperience/Conceptual/MobileHIG/Bars/Bars.html#//apple_ref/doc/uid/TP40006556-CH12-SW3)、Android では [Action Bar](https://developer.android.com/design/patterns/actionbar.html) がそれぞれ使用されます。

<!--more-->

プラットフォーム標準のナビゲーション機能が共通の定義で使えるのは便利ですが、アプリの要件によっては、カスタマイズした場面もあるでしょう。

## 戻るボタンを消す

戻るボタンを消したい場合、 Page の XAML に ``NavigationPage.HasBackButton="false"`` を追加します。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms" 
			 xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml" 
			 x:Class="WorkingWithNavigation.Page2Xaml"
			 NavigationPage.HasBackButton="false"
			 Title="Page 2">
```

コードでは、 ``NavigationPage.SetHasBackButton(page2, false)`` と書けます。

これを実行すると、下のようになります。

![](/img/posts/customize_back_button_in_Xamarin_forms_01.gif)

Page2 に仕掛けているので、iOS では Page2 だけ、戻るボタンが表示されないのが確認できます。
Android はちょっとわかりにくいですが、ActionBar のアイコンの横に着いている ＜ のアイコンが、 Page2 だけ表示されないのが確認できます。


## 戻るボタンのタイトルを変える

iOS の UINavigationBar では、戻るボタンには前画面のタイトルが表示されます。
Xamarin.Forms の NavigationPage も同じくです。
これを変更するには、 ``NavigationPage.BackButtonTitle="たいとる"`` を使います。

要注意なのは、これを仕掛けたPageの戻るボタンタイトルが変わるのではなく、 **これを仕掛けたPageが戻り先となる場合に、戻るボタンタイトルが変わる** ということです。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms" 
			 xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml" 
			 x:Class="WorkingWithNavigation.Page2Xaml"
			 NavigationPage.BackButtonTitle="BACK"
			 Title="Page 2">
```

コードでは、 ``NavigationPage.SetBackButtonTitle(page2, "BACK")`` と書けます。

これを実行すると、下のようになります。

![](/img/posts/customize_back_button_in_Xamarin_forms_02.gif)

Page2 に ``BackButtonTitle="BACK"`` を仕掛けているので、Page2 ではなく、それが戻り先となる Page3 の戻るボタンが「BACK」になっています。

尚、Android では、戻るボタンは「＜」のアイコンだけなので、この機能は無視されます。

## 参考

* [Hierarchical Navigation - Xamarin](https://developer.xamarin.com/guides/xamarin-forms/user-interface/navigation/hierarchical/)
* [サンプル：Hierarchical Navigation - GitHub](https://github.com/xamarin/xamarin-forms-samples/tree/master/Navigation/Hierarchical)
* [MotzCod.es by James Montemagno — Changing iOS’s Back Button Text in Xamarin.Forms](http://motzcod.es/post/136765476207/changing-ioss-back-button-text-in-xamarinforms)
