---
templateKey: blog-post
title: Xamarin.Forms 向けのピッカーコントロールを作った
date: 2016-12-27T00:00:00.000+09:00
tags:
  - Xamarin
  - xamarin-forms
  - iOS
  - Android
---
[Xamarin Advent Calendar 2016](http://qiita.com/advent-calendar/2016/xamarin) 23日目です。
iOS の [UIPickerView](http://swift-salaryman.com/uipickerview.php)、 Android の [NumberPicker](https://akira-watson.com/android/numberpicker.html) は Xamarin.Forms では、標準コントロールで用意されていないみたいだったので Custom Renderer で作りました。
<!--more-->

特に nuget パッケージとかにはしてなくて、サンプルアプリと一緒になってます（><）

こんな感じのコントロールです。

こんな感じで使えます。

![](/img/posts/pickerview_for_Xamarin_forms_screenshot01.gif)

``ItemsSource`` と ``SelectedIndex`` の２つのバインダブルなプロパティしかなくて、``SelectedIndex`` の方は TwoWay です。

```xml
<?xml version="1.0" encoding="utf-8"?>

<ContentPage xmlns="http://xamarin.com/schemas/2014/forms"
             xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
             xmlns:local="clr-namespace:PickerViewSample"
             x:Class="PickerViewSample.PickerViewSamplePage"
			 Title="PickerView Sample">

    <ContentPage.BindingContext>
        <local:Model />
    </ContentPage.BindingContext>

    <ContentPage.Resources>
        <ResourceDictionary>
            <local:ItemsSourceConverter x:Key="itemsConv"/>
        </ResourceDictionary>
    </ContentPage.Resources>

    <Grid>
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto" />
            <RowDefinition Height="Auto" />
            <RowDefinition Height="Auto" />
        </Grid.RowDefinitions>

        <Grid.ColumnDefinitions>
            <ColumnDefinition Width="Auto" />
            <ColumnDefinition Width="*" />
            <ColumnDefinition Width="Auto" />
        </Grid.ColumnDefinitions>

        <local:PickerView
            Grid.Row="0" Grid.Column="0" Grid.ColumnSpan="3"
            ItemsSource="{Binding ItemsSource, Converter={StaticResource itemsConv}}"
            SelectedIndex="{Binding SelectedIndex}" />

        <Label Grid.Row="1" Grid.Column="0" Text="ItemsSource" />
        <Entry Grid.Row="1" Grid.Column="1" Text="{Binding ItemsSource, Mode=TwoWay}" />

        <Label Grid.Row="2" Grid.Column="0" Text="SelectedIndex" />
        <Entry Grid.Row="2" Grid.Column="1" Text="{Binding SelectedIndex, Mode=TwoWay}" />
    </Grid>
</ContentPage>
```

ソースコードは、

* [amay077/Xamarin_Forms_PickerViewSample](https://github.com/amay077/Xamarin_Forms_PickerViewSample)

にありますので、 Fork などして使ってください。

iOS の ``UIPickerView`` は、それ自体が複数の列を持てるようですが、Android のはそうではないので、１列しか使ってません。

Custom Renderer のサンプルにもなると思います。

## 追記: PickerView を並べて数値を選択する UI も作った

![](/img/posts/pickerview_for_Xamarin_forms_screenshot02.gif)

ソースコードは上と同じギッハブにあります。
