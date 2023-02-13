---
templateKey: blog-post
title: Visual Basic で Xamarin.Forms アプリ開発どこまでいける？
date: 2016-12-31T00:00:00.000+09:00
tags:
  - Xamarin
  - VisualBasic
  - Android
  - iOS
---
[[初心者さん・学生さん大歓迎！] Xamarin その2 Advent Calendar 2016](http://qiita.com/advent-calendar/2016/xamarin-welcome) 25日目です。
Xamarin アプリ開発で使用できる言語は、公式には C# と F# のみですが、初心者にやさしいとされる Visual Basic.NET(VB.NET) を使って Xamarin（今回は Xamarin.Forms）アプリは開発できないのでしょうか？
<!--more-->

チャレンジしてみました。

## いきなり結論

まあだいたい察しがつくので先に結論言っちゃいますけど、VB.NET での Xamarin.Forms アプリ開発は、 **「部分的に可能」** です。

部分的に、というのは PCL で作れる箇所で、且つ Xamarin.Forms の XAML 以外です。

PCL は Xamarin でなく  .NET 標準のライブラリだから、.NET 系の言語ならなんでも作れるわけですね。

## 一般的な構成の Xamarin.Forms アプリは、どこまで Visual Basic 化できるか？

### Not XAML の場合

Xamarin.Forms プロジェクトをテンプレートから作成すると、

* MyApp
* MyApp.Droid
* MyApp.iOS
* MyApp.UWP

の４つのプロジェクトがいずれも C# で作成されます。
（この内、もともと MS の管轄である UWP は今回のネタからは除外します）

コアとなる MyApp プロジェクトは PCL なので、ここは Visual Basic が使えます。
ちょっとやってみましょう。

![](/img/posts/xamarinforms_with_vb_01.png)

を

![](/img/posts/xamarinforms_with_vb_02.png)

こうします。

C# で適当な Xamarin.Forms プロジェクトを作成した後、追加 -> 新しいプロジェクト で、 **Visual Basic のポータブルクラスライブラリ** を作成します。

![](/img/posts/xamarinforms_with_vb_03.png)

なんかプロファイルを聞かれるので、 Xamarin.Android と Xamarin.iOS と UWP あたりを含ませます。

![](/img/posts/xamarinforms_with_vb_04.png)

VB.NET の PCL に、nuget パッケージマネージャから「Xamarin.Forms」を追加します。

``App.vb`` クラスを追加し、以下のように書きます。

```vbnet
Imports Xamarin.Forms

Public Class App
    Inherits Application

    Private WithEvents _button1 As Button

    Sub New()

        Dim layout = New StackLayout() With {
                 .VerticalOptions = LayoutOptions.Center
        }

        _button1 = New Button() With {
            .Text = "Goto Second"
            }

        layout.Children.Add(New Label() With {
            .HorizontalTextAlignment = TextAlignment.Center,
            .Text = "Xamarin.Forms with Visual Basic!"
        })
        layout.Children.Add(_button1)

        Dim content = New ContentPage() With {
            .Title = "TryXFWithVB",
            .Content = layout
        }

        MainPage = New NavigationPage(content)

    End Sub

    Private Sub Button1_Clicked(sender As Object, args As EventArgs) Handles _button1.Clicked
        ''次のページに遷移する処理を書く
    End Sub
End Class
```

最後に、 Droid と iOS プロジェクトが参照するプロジェクトを、C# の PCL プロジェクトから VB.NET の PCL プロジェクトに切り替えます。

で、実行すると、こうなります（iOS の場合）。

![](/img/posts/xamarinforms_with_vb_05.png)

ほら VB.NET で Xamarin.Forms 、できました。C# 側の PCL プロジェクトは削除してしまって問題ないです。

### XAML の場合

コードで画面を書くのはできましたが、Xamarin.Forms XAML は使えるのでしょうか？
使えなさそう……使えませんでしたー。

C# の Xamarin.Forms XAML や、VB.NET の WPF の XAML プロジェクトを見て、見よう見まねでプロジェクトファイル(``.vbproj``) を、書いてみましたが、「XAML とコードビハインド」として認識されず…。

![](/img/posts/xamarinforms_with_vb_06.png)

## Prism.Forms プロジェクトを VB.NET 化してみる

画面を XAML で書きたいとなったら、VB.NET をあきらめるしかありません。
が、コードビハインドに１行も書かないマン＆ウーマンだったら、Xamarin.Forms のプロジェクトが C# でも問題ないはず。なぜなら ViewModel や Model のプロジェクトを切り離して、そっちを VB.NET にすれば良いのだから！

試しに Prism.Forms のプロジェクトを VB.NET 化してみましょう。
ここでは @Nuits さんの

* [PrismAndMoqHansOn/01.HandsOn-Overview.md at master · jxug/PrismAndMoqHansOn](https://github.com/jxug/PrismAndMoqHansOn/blob/master/docs/01.HandsOn-Overview.md)
* [Prism and Moqハンズオンのドキュメントを大幅に加筆修正しました - nuits.jp blog](http://www.nuits.jp/entry/2016/11/06/202916)

を題材にさせてもらいます。

### ViewModel、Model を VB.NET 化する

このハンズオンのプロジェクトは、

![](/img/posts/xamarinforms_with_vb_07.png)

のようになっているので、ViewModels と Models を VB.NET のプロジェクトに追い出してこう

![](/img/posts/xamarinforms_with_vb_08.png)

します。

コード長いんで、 github に上げました。

* [amay077/PrismHandsOnVB](https://github.com/amay077/PrismHandsOnVB)

[``BatteryPageViewModel.vb``](https://github.com/amay077/PrismHandsOnVB/blob/master/TextSpeaker/TextSpeakerCoreVB/ViewModels/BatteryPageViewModel.vb) とか見ると分かるんですけど、 Xamarin.Forms の MVVM も、Prism.Forms も、ちゃんと VB.NET でも動くんですよ（あたりまえだけど）

Prism.Forms で、View とは別アセンブリにある ViewModel を ``AutoWireViewModel`` で見つかるようにするために、同じく @Nuits さんの、

* [PrismでViewとViewModelを別アセンブリにする場合のコードサンプル](https://gist.github.com/nuitsjp/d3e3d819fb68e31b884800caa94a56bc)

を [適用してます](https://github.com/amay077/PrismHandsOnVB/blob/master/TextSpeaker/TextSpeaker/App.cs#L47) 。

これで、ViewModel とビジネスロジックは VB.NET で記述することができるようになりました。

### プラットフォーム固有の処理を VB.NET 化できるか？

どうせなら、TextSpeaker.Droid/iOS で C# で行っている「ITextSpeaker の実装」も、VB.NET プロジェクトに追い出して、こう

![](/img/posts/xamarinforms_with_vb_09.png)

できないかなー、とトライしてみたのですが、できませんでした。

理由は、 「Xamarin.iOS/Android をサポートするクラスライブラリを VB.NET で作成できない事」です。Xamarin.iOS/Android はともに Monoランタイムを基盤としますが、これを基盤とする VB.NET のクラスライブラリを作成することができませんでした（少なくとも Visual Studio 2015 では）。

* [Visual Basic support ｜ Mono](http://www.mono-project.com/docs/about-mono/languages/visualbasic/)
* [Mono DevelopでVBのソースをコンパイルする。 ｜ かるあのメモ on WordPress](https://karuakun.wordpress.com/2011/12/19/mono-develop%E3%81%A7vb%E3%81%AE%E3%82%BD%E3%83%BC%E3%82%B9%E3%82%92%E3%82%B3%E3%83%B3%E3%83%91%E3%82%A4%E3%83%AB%E3%81%99%E3%82%8B%E3%80%82/)

この辺を見ると ``vbnc`` ってコンパイラでできそう？いや Xamarin.Android/iOS はそれに対応してないからダメ？とかよくわかりません。

初心者向けの Visual Basic を使うのにトリッキーなことをするのも本末転倒なので深掘りは辞めておきます。

## まとめ

というわけでまとめ。

Visual Basic を使って Xamarin.Forms アプリの開発は、

* **XAML を使わない Xamarin.Forms アプリ開発**
* **ViewModel とビジネスロジック**

は可能です（特に後者を "Xamarin の" と呼んでよいかはお任せします）。

逆に Visual Basic では不可能なのは、

* Xamarin.Forms の XAML の使用
* Xamarin.Android, Xamarin.iOS の使用

です。

CustomRenderer、Effects などプラットフォーム固有の処理は C#/F# で書くしかありません。

Visual Basic エンジニアと分業するなら、彼らはモバイル系のAPIに関与できないので、逆に分かりやすいかも知れません。

半分ネタのつもりだったけど、VB要員も活かせるという意味では、ありかも知れませんね。

とここまで書いて、

* [Xamarin.Forms using Visual Basic.NET - Xamarin](https://developer.xamarin.com/guides/cross-platform/application_fundamentals/pcl/portable_visual_basic_net/xamarin-forms/)
* [【朗報？】Visual Basic ユーザーも Xamarin.Forms でモバイル開発者になれます！ - Xamarin 日本語情報](http://ytabuchi.hatenablog.com/entry/2015/09/09/173455)

と丸かぶりだったことに気づく（しかも 2015年9月の情報）！
まあ今でも変わらないよ、ということで。
