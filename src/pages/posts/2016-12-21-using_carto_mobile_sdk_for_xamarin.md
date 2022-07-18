---
templateKey: blog-post
title: CARTO の Xamarin 向けモバイル用SDKを使ってみる
date: 2016-12-21T00:00:00.000+09:00
tags:
  - Xamarin
  - CARTO
  - foss4g
---
[FOSS4G 二個目だよ Advent Calendar 2016](http://qiita.com/advent-calendar/2016/foss4gvol2) 21日目です。
CARTO やるやる詐欺してました、すみません。
CARTO といえば、地図関連で今一番イケてるサービスの一つですね。
<!--more-->

* [CARTO - Predict through location](https://carto.com/)
* [ChizuDB - CARTO 日本向けサービス](http://chizudb.jp/)

紹介される媒体が Web なので、Web地図の事例しか見たことなくて、「スマホアプリで表示できないのかなー」と思っていましたら…あるじゃん！モバイル用の CARTO SDK が！

* [Mobile — CARTO](https://carto.com/engine/mobile/)
* [Mobile SDK — CARTO Documentation](https://carto.com/docs/carto-engine/mobile-sdk/)

どうやら、 Android、iOS に対応している様子。
そしてなんと、C# - Xamarin 用のSDKとサンプルも発見！

* [CartoDB/mobile-dotnet-samples: CARTO Mobile SDK samples for Xamarin and WP .NET](https://github.com/CartoDB/mobile-dotnet-samples)

さっそく使ってみましょう。

## mobile-dotnet-samples を動かしてみる

[MIERUNE. LLC](http://www.mierune.co.jp/) さんが作られて、public に公開されている、

* [北海道内土砂災害危険箇所・土砂災害警戒区域・避難施設](https://mierune2016team.carto.com/viz/8a9450a2-6456-11e6-8a7a-0ee66e2c9693/public_map)

を使わせていただきます。
これを iOS で表示してみます。

### STEP1: サンプルソースコードを Clone する

* https://github.com/CartoDB/mobile-dotnet-samples

をローカルにクローンします（ZIPでダウンロードでもおｋ）。

### STEP2: Xamarin Studio/Visual Studio でソリューションを開く

``mobile_dotnet_samples.sln`` というファイルがあるので、Mac では Xamarin Studio、 Windows では Visual Studio で開きます。
私は Visual Studio for Mac を使っているので、それでも大丈夫です。

### STEP3: スタートアッププロジェクトを CartoMap.iOS に変更する

Mac だとこんな↓感じで。

![](/img/posts/running_carto_mobile_sample_01.png)

### STEP4: CartoMap.iOS のプロジェクト設定でアーキテクチャを x86_64 に変更する

iOS アプリはもはや 64bit に移行しているので、プロジェクト設定を変更します。

![](/img/posts/running_carto_mobile_sample_02.png)

これをしないと、アプリを実行したときに「May slow down〜」などと言われます。

### STEP5: ビルド＆実行

適当な iOSシミュレータを選んで、実行します。

![](/img/posts/running_carto_mobile_sample_03.png)

実行すると、下図のような感じに動くと思います。

![](/img/posts/running_carto_mobile_sample_04.gif)

### STEP5: 表示する地図を変えてみる

サンプルアプリの 「Countries Vis」を選択したときに表示される地図を、冒頭で紹介した、「北海道内土砂災害危険箇所・土砂災害警戒区域・避難施設」に変更してみましょう。

読み込む地図の指定は、 ``CartoMap.iOS/Sections/CARTO.js API/CountriesVisController.cs`` で行っています。

これを以下のように修正します。

```csharp
// CountriesVisController.cs
using System;
namespace CartoMap.iOS
{
	public class CountriesVisController : BaseVisController
	{
		public override string Name { get { return "Countries Vis"; } }

		public override string Description { get { return "Vis displaying countries in different colors using UTFGrid"; } }

		protected override string Url
		{
			get
			{
//				return "http://documentation.cartodb.com/api/v2/viz/2b13c956-e7c1-11e2-806b-5404a6a683d5/viz.json"; // 修正前
				return "https://mierune2016team.carto.com/api/v2/viz/8a9450a2-6456-11e6-8a7a-0ee66e2c9693/viz.json"; // 修正後
			}
		}
	}
}
```

CARTO をブラウザで見るときの URL と、Mobile SDK に指定する時の URL の違いに注目してください。 ``/viz/`` を ``/api/v2/viz`` に、 ``public_map`` を ``viz.json`` に置き換えると、モバイルSDK用の URL になるようです。(仕様未確認)

https://mierune2016team.carto.com/viz/8a9450a2-6456-11e6-8a7a-0ee66e2c9693/public_map
↓
https://mierune2016team.carto.com/api/v2/viz/8a9450a2-6456-11e6-8a7a-0ee66e2c9693/viz.json

これを実行すると、↓のようになります。

![](/img/posts/running_carto_mobile_sample_05.gif)

レスポンスにやや問題がある、凡例がないので主題の意味がわからないなどの問題はありますが、Web で観られる地図と同じものが iOS 端末でも観られます。


## ソースコード

元のリポジトリは進化が早く、最新のソースだと挙動が変わるかもしれないので、私のアカウントに Fork しました(SDKが新しくなると動かなくなるかも知れませんが)。

* https://github.com/amay077/mobile-dotnet-samples/tree/20161221_blogged

## まとめ

CARTO の Mobile SDK を紹介しました。
今回は Xamarin.iOS でのみトライしましたが、 Xamarin 用 SDK には他にも Android と [Windows Phone 用もあるよう](https://github.com/CartoDB/mobile-dotnet-samples/tree/master/CartoMap.WindowsPhone) です。

また、iOS / Android ネイティブ用の SDK とサンプルもあります。

* [CartoDB/mobile-ios-samples: iOS mobile app with CARTO Mobile SDK](https://github.com/CartoDB/mobile-ios-samples)
* [CartoDB/mobile-android-samples: Android sample for CARTO Mobile SDK](https://github.com/CartoDB/mobile-android-samples)

Xamarin版SDK はまだプレリリースでした。ネイティブ版SDK はどうだかわかりませんが、CARTO の地図をモバイルアプリで使いたい！という機会があったら思い出してください。
