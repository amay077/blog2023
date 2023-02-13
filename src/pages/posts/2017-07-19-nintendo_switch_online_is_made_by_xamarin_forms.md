---
templateKey: blog-post
title: Nintendo Switch Online アプリは Xamarin(Xamarin.Forms)製です
date: 2017-07-19T00:00:00.000+09:00
tags:
  - Xamarin
  - C#
  - Android
  - iOS
---
[ニンテンドースイッチのオンラインサービス](https://www.nintendo.co.jp/hardware/switch/onlineservice/)用のアプリ「Nintendo Switch Online」が、なんと **Xamarin 製** でした。
<!--more-->

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">きたな！ Nintendo Switch Online アプリ(Android/iOS) は Xamarin(Xamarin.Forms)製です！ <a href="https://t.co/lJX5CBckgt">pic.twitter.com/lJX5CBckgt</a></p>&mdash; あめい@バレル待ち (@amay077) <a href="https://twitter.com/amay077/status/887610194947067904">2017年7月19日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Android アプリと iOS アプリの権利表記の画面から使用されているライブラリを整理してみました。使用されているライブラリを見るとアプリは Xamarin.Forms 製のようです。

## Xamarin とか Android/iOS/.NET とか関係なさそうなやつ

### Echo Cancellation Program by Nippon Telegraph and Telecom Corp

* NTT やん
* ボイスチャットのエコーキャンセラっぽいですね

## libSRTP by Cisco Systems, Inc

* https://github.com/cisco/libsrtp
* Secure Realtime Transport Protocol とのこと、これもボイチャ関連ですかね

### Opus by Xiph.Org, Skype Limited

* http://opus-codec.org/
* 音声コーデックでした

### WebRTC AudioProcessing by Google Inc

* https://webrtc.org/
* WebRTC で音声関連ですねー


### BreakPad by Google Inc

* https://chromium.googlesource.com/breakpad/breakpad/
* クラッシュレポーティングシステムらしいです

### Curl by Deniel Stenberg

* https://ja.wikipedia.org/wiki/CURL
* cURL のことですよね？


### Libdisasm

* http://bastard.sourceforge.net/libdisasm.html ？
* ディスアセンブラ？よくわかりません

### gflags by Google Inc

* https://gflags.github.io/gflags/
* コマンドラインツール？

### Linux Syscall Support by Google Inc

* https://chromium.googlesource.com/linux-syscall-support/ ？
* わかりません

### musl by Rich Felker

* https://www.musl-libc.org/
* C++ 関連はわからんなー

## Android 関連のやつ

### Lottie by AirBnB

* https://airbnb.design/lottie/
* アニメーションライブラリですね。

### square-bindings

* https://github.com/mattleibow/square-bindings
* Androidアプリ開発者の御用達、Square社のAndroid向けライブラリをXamarin.Androidから呼べるようにしたラッパーです

### Okio

* https://github.com/square/okio
* これも Square の。通信ライブラリですね。

## iOS 関連のやつ

### Lottie by AirBnB

* Android と同じ〜

### WebP.Touch

* https://github.com/luberda-molinet/WebP.Touch
* 画像フォーマット「WebP」のデコーダです


## Xamarin.Forms 関連のやつ

### Xamarin SDK

* https://www.xamarin.com/
* はい出ました

### Plugins for Xamarin by James Montemagno / Refractored LLC

* https://github.com/xamarin/XamarinComponents
* Xamarin の機能を拡張するライブラリ群です

### Share Plugin by Jakob Gurtl

* http://guertl.me/post/136407883480/share-plugin-for-xamarin-and-windows
* 「他のアプリで開く」的な機能を提供するやつ

### Hockey SDK

* https://hockeyapp.net/
* クラッシュレポートとか配布自動化とかユーザーメトリクス収集とか（被ってるライブラリがあるけど）

### CarouselView.FormsPlugin by alexrainman

* https://github.com/alexrainman/CarouselView
* 横にスワイプして画面切り替えるやつ

### Xamarin Forms Lab

* https://github.com/XLabs/Xamarin-Forms-Labs
* Xamarin.Forms の機能を拡張するライブラリ（もうメンテ終了してて、作者は Xamarin に JOIN したけど）

### Current Activity Plugin by James Montemagno

* https://github.com/jamesmontemagno/CurrentActivityPlugin
* Android 向けと思われるが…

### FFImageLoading by Fabien Molinet

* https://github.com/luberda-molinet/FFImageLoading
* 画像読み込みライブラリ。まあ Picasso や Glide みたいなやつですわ。

### SkiaSharp

* https://github.com/mono/SkiaSharp
* 出ました、クロスプラットフォームの２Dグラフィックス描画ライブラリ

## .NET 関連のやつ

### ModernHttpClient by Paul Betts

* https://github.com/paulcbetts/ModernHttpClient
* 各プラットフォームの通信ライブラリと .NET の HttpClient の橋渡しをします

### Json.NET by James Newton-King

* http://www.newtonsoft.com/json
* いわずとしれた Json を扱うライブラリ

### PCLCrypto

* https://github.com/AArnott/PCLCrypto
* 暗号化ライブラリです

### Math.NET Numerics by Math.NET

* https://numerics.mathdotnet.com/
* Math というくらいなので数学系のライブラリなのでしょう

### P/Invoke by Andrew Arnott and more

* https://github.com/AArnott/pinvoke
* Win32DLLを簡単に呼び出せるようにするライブラリっぽいですが、一体何のために？

### Validation

* https://github.com/aarnott/Validation
* メソッドでバリデーションして例外投げるのを簡単にしてくれるっぽい


## まとめ

Xamarin の事例としては久しぶりのビッグネームじゃあないでしょうか、しかもワールドクラス(Microsoft がプレスリリースだせば良いのに)。

Xamarin.Forms製のようなので、Windows 10 や macOS 向けのアプリも(Nintendo にやる気があれば)開発できる気がしますね！

とはいえ推測ですが、WebRTCでボイスチャットみたいなコアな機能は C/C++ でやってるだろうし、ゲームの紹介的な画面は HTML だろうし、いろんな「クロスプラットフォームアプリ開発技法」を組み合わせて使っているのでしょうね。

権利表記に [自作ライブラリ](https://github.com/amay077/Xamarin.Forms.GoogleMaps) が載るの、ワンチャンあるで！
