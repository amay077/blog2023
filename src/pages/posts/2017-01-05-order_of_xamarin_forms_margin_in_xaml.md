---
templateKey: blog-post
title: Xamarin.Forms XAML で、Margin の上下左右の順番
date: 2017-01-05T00:00:00.000+09:00
tags:
  - Xamarin
  - Xamarin.Forms
  - XAML
---
Xamarin.Forms の XAML で マージン(Margin)やパディング(Padding)を書くとき、上下左右の順番がわからなくなるのでメモ。
<!--more-->

XAML に Margin や Padding （いわゆる ``Thickness``）をリテラルで書くときの順番は、 **「left, top, right, bottom」** だ。

```csharp
<?xml version="1.0" encoding="utf-8"?>
<ContentPage xmlns="http://xamarin.com/schemas/2014/forms" 
		xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml" 
		xmlns:local="clr-namespace:MarginTest" 
		x:Class="MarginTest.MarginTestPage" 
		BackgroundColor="Silver">
	
	<BoxView 
		Margin="10, 20, 30, 40"
		BackgroundColor="Red"
		HorizontalOptions="FillAndExpand" 
		VerticalOptions="FillAndExpand" />
	
</ContentPage>
```

![](img/xamarin_forms_margin_definition_01.png)

**「"左" をスタートに時計まわり」** と覚えておきたい。

Thickness のコンストラクタの引数を見てもよい。

* [Thickness(double, double, double, double) - Xamarin](https://developer.xamarin.com/api/constructor/Xamarin.Forms.Thickness.Thickness/p/System.Double/System.Double/System.Double/System.Double/)

```csharp
// syntax
public Thickness (Double left, Double top, Double right, Double bottom)
```

ちなみに css の ``margin: 10px 20px 30px 40px;`` は、 ”上” をスタートに時計まわり だ、紛らわしい。
