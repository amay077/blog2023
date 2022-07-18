---
templateKey: blog-post
title: Xamarin プロジェクトにおける API key など秘密情報管理のベスト？プラクティス
date: 2016-12-20T00:00:00.000+09:00
tags:
  - Xamarin
  - VSTS
  - CI
  - Git
---
[Xamarin Advent Calendar 2016](http://qiita.com/advent-calendar/2016/xamarin) 19日目です。
API key や SecretKey はハードコードダメ、git リポジトリでの管理もダメ、というわけでどうしたもんかと。

<!--more-->

Android アプリ開発では、

* [【Android Studio】Api keyを始めとしたgit管理したくない定数を環境変数で管理する - shimbaroid’s diary](http://shimbaroid.hatenablog.jp/entry/2016/08/15/010350)

のような仕組みで、システム環境変数をビルド時の変数に inject してくれる仕組みがあるのでいいですね。

Xamarin（というか .NET アプリケーション、MSBuild）のエコシステムには、そういう仕組みがなさそう（見つからなかった…）なので、自力でやるしかなさそうです。

# ケース1:Google Maps の API キー

私は [Xamarin.Forms.GoogleMaps](https://github.com/amay077/Xamarin.Forms.GoogleMaps) というライブラリを開発していて、それの [サンプルアプリケーションのコードも](https://github.com/amay077/Xamarin.Forms.GoogleMaps/tree/master/XFGoogleMapSample) 公開しています。

Android や iOS で Google Maps を使うには、各々の API Key を入手して、ライブラリに設定する必要があるわけで、サンプルアプリケーションでそれをやっているのですが、API key をソースコードに直書きしてしまうと、それをうっかりコミットしてしまう危険があるし、これを Fork してくれる人にもそのような間違いを起こして欲しくありません。

## STEP1:APIキーの定義を分離する

まずは APIキーを Static なクラスに追い出します。

```csharp
// Variables.cs
public static class Variables
{
    // https://developers.google.com/maps/documentation/android-api/signup
    public const string GOOGLE_MAPS_ANDROID_API_KEY = "your_google_maps_android_api_v2_api_key";

    // https://developers.google.com/maps/documentation/ios-sdk/start#step_4_get_an_api_key
    public const string GOOGLE_MAPS_IOS_API_KEY = "your_google_maps_sdk_for_ios_api_key";

    // https://msdn.microsoft.com/windows/uwp/maps-and-location/authentication-key
    public const string BING_MAPS_UWP_API_KEY = "your_bing_maps_apikey";
}
```

``static readonly `` なプロパティにせず ``const`` にしているのは、Android での [API Key の指定が属性になっている](https://github.com/amay077/Xamarin.Forms.GoogleMaps/blob/master/XFGoogleMapSample/Droid/MyApp.cs#L8-L9) からです。

## STEP2:Variables.cs を .gitignore に追加する

https://github.com/amay077/Xamarin.Forms.GoogleMaps/blob/master/XFGoogleMapSample/.gitignore

Variables.cs を .gitignore に追加して、 git で管理しないようにします。

これで ``Variables.cs`` に正しいAPIKeyを設定しても、コミット対象にならないので、間違えて API Key が流出することが防げます。

ただ、開発者がどんな ``Variables.cs`` を用意すればいいか分からないので、``Variables.cs`` を ``Variables_sample.cs`` という名前でコミットしておきます。もちろんこちらには正しい APIKey は記述しません。

これで、 ``README.md`` などに、 「``Variable_sample.cs`` を ``Variable.cs`` にリネームして、あなたのAPIKeyを設定して使ってください」とでも記述しておけば、大抵の開発者は理解できると思います。

## STEP3:ビルドイベントで ``Variables_sample.cs`` を ``Variables.cs`` にコピーする

このままでもまあよいのですが、git clone してすぐビルドしてエラーになるのは悪いような良いような…。

Visual Studio、Xamarin Studio のビルドシステムには「ビルドイベント」という、ビルド前後などに任意のコマンドを実行する機能があるので、それを使って ``Variables_sample.cs`` を ``Variables.cs`` にコピーできます。


``.csproj`` に次のように追加します。全ソースは [こちら](https://github.com/amay077/Xamarin.Forms.GoogleMaps/blob/156bfc449e25c40d4455d677a761d9a7d6661253/XFGoogleMapSample/XFGoogleMapSample/XFGoogleMapSample.csproj) 。

```xml
// XFGoogleMapSample.csproj
（前略）
  </ProjectExtensions>
  <PropertyGroup Condition=" '$(OS)' == 'Windows_NT' ">
    <PreBuildEvent>if not exist "$(ProjectDir)Variables.cs" copy "$(ProjectDir)Variables_sample.cs" "$(ProjectDir)Variables.cs" >nul</PreBuildEvent>
  </PropertyGroup>
  <PropertyGroup Condition=" '$(OS)' != 'Windows_NT' ">
    <PreBuildEvent>rsync -u "$(ProjectDir)Variables_sample.cs" "$(ProjectDir)Variables.cs"</PreBuildEvent>
  </PropertyGroup>
</Project>
```

Windows と Mac 両方に対応しないといけないのが面倒な点１。
これは ``Condition=" '$(OS)' == 'Windows_NT' "`` と ``Condition=" '$(OS)' != 'Windows_NT' "`` で行っています。

しかも、Visual Studio でビルドイベントを設定すると ``Condition`` が設定できないし、Xamarin Studio と Visual Studio で ``.csproj`` に記述される書式が違うしで、結局 ``.csproj`` に手書きするしかありませんでした。

次に、「``Variables.cs`` が既に存在していたらコピーしない」としたいが、

* Windows の ``copy`` コマンドは「上書きしない」オプションがないらしく、 ``if not exist`` を使う羽目に…
* Mac の ``cp`` コマンドは「上書きしない」オプションはあるものの、上書きしない場合にエラーコードを返すらしく、それを MSBuild が検知してビルド失敗してしまうため、 ``rsync`` を使う羽目に…

と、それぞれ回りくどいことが必要なのが面倒な点２。
ここまでしてなんとか実現できました。

これで、「ソースを取得してすぐビルドできるけど、 ``Variables.cs`` は git では管理されない」ようになりました。

# ケース2:CI(継続的インテグレーション)への対応

Visual Studio Team Services(VSTS)などの CI サービスで自動ビルドすることを考えると、CIサービスの機能で ``Variables.cs`` に、正しい APIKey を設定してやる必要があります。

冒頭で紹介した Android でのビルドの事例は、 gradle を使い、システム環境変数を AndroidManifest.xml に伝搬させています（``manifestPlaceholders`` という仕組みなのかな？）。

.NET のビルドシステムである MSBuild に同類の機能があることを確認できなかったので、CIサービスが提供する一般的な機能を使って実現するしかなさそうです。

* (本番用のAPIKeyが記述された) ``Variables.cs`` をコピーする
* ``Variables.cs`` の内容を置換して本番用のAPIKeyを注入する

などです。

* [Building and Deploying apps using VSTS and HockeyApp - Part 2 : Android - Raghu Rana's blog](http://www.raghurana.com/building-and-deploying-apps-using-vsts-and-hockeyapp-part-2nbsp-android)

の例では、Perl を使って ``AndroidManifest.xml`` のプレースホルダを置換してAPIKeyを差し込んでいるようです。

## Visual Studio Mobile Center ではどうよ？

Connect(); で発表され、今はプレビュー版を誰でも試せるようになっている 

* [Visual Studio Mobile Center / Visual Studio](https://www.visualstudio.com/vs/mobile-center/)

にも、github などからソースを取得して自動ビルドできる機能があります。
が、今のところ、VSTS や他のCIサービスほど機能が用意されていない為か、ビルド前に任意のコマンドを実行させることはできません、今のところ(期待を込めて２回言った)。

# 求む！ベストプラクティス

というわけで、泥臭い方法をいくつか使わないと実現できないのがなんだかなあ、という感じです。

「こういうもの」なのか、「もっとスマートな方法がある」のか、情報をお待ちしております。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">これと同じ事を Xamarin というか .NET アプリでやりたいよ～。MSBuild でできる？ /【Android Studio】Api keyを始めとしたgit管理したくない定数を環境変数で管理する <a href="https://t.co/OPfOZSCjDS">https://t.co/OPfOZSCjDS</a></p>&mdash; これがあめいの選択だよ (@amay077) <a href="https://twitter.com/amay077/status/809752860707561473">2016年12月16日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

## やばい

<blockquote class="twitter-tweet" data-cards="hidden" data-lang="ja"><p lang="ja" dir="ltr">とりあえずこんなんでどうかな… <a href="https://t.co/2teIgC2NkQ">https://t.co/2teIgC2NkQ</a> <a href="https://t.co/zJjgsvvMdT">https://t.co/zJjgsvvMdT</a></p>&mdash; Atsushi Eno (@atsushieno) <a href="https://twitter.com/atsushieno/status/811061374361047041">2016年12月20日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
