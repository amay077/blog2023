---
templateKey: blog-post
title: Microsoft Connect(); 2016 雑感(おもに Xamarin 周り)
date: 2016-11-17T00:00:00.000+09:00
tags:
  - Xamarin
  - Microsoft
---
[Microsoft Connect(); 2016](https://connectevent.microsoft.com/) の、日本でのライブを観てました。

<!--more-->

## Visual Studio for Mac

* [Visual Studio for Mac](https://www.visualstudio.com/vs/visual-studio-mac/)

まあ、記憶から消してたアレ。
Xamarin Studio をベースにした IDE だけど、 .NET Core アプリ開発や Azure 連携が入るみたい。

個人的には、これは標準のIDEとして使いつつも、コーディングには JetBrains の [Rider](https://www.jetbrains.com/rider/) に期待している。VS for Mac にも Resharper や CodeLens 並みの機能が載ってくれば別だけど。

Xamarin Studio は OSS だったけど、VS for Mac はどうなんだろう？ MonoDevelop との関係は？

## Visual Studio 2017

* [Visual Studio 2017 RC](https://www.visualstudio.com/vs/visual-studio-2017-rc/)

何というか、 Xamarin の導入が簡単になってるといいな。

## Visual Studio Mobile Center

* [Visual Studio Mobile Center](https://www.visualstudio.com/vs/mobile-center/)

なんか Microsoft の ｍBaaS はこれになるっぽい？
サイトに、

> Mobile platforms	Objective-C, Swift, Java, Xamarin, React Native
> Lifecycle features	Build, Test, Crash, Beta Distribution, Analytics
> Cloud features	Authentication, Easy tables, Offline sync

と書いてあるので。あれ？ [Azure Mobile Apps](https://docs.microsoft.com/ja-jp/azure/app-service-mobile/app-service-mobile-value-prop) と被るよねこれ？

mBaaS に加えて CI の要素もあるようなので、AWS の Mobile Hub や Google Firebase を超える機能を持つことになりますね。

## Xamarin.Forms.Platforms.Tizen

ふいたｗ
まさかの Tizen 復活、そしてそれは Xamarin.Forms のチカラによってｗ

なんか、 「Xamarin.Forms.Platforms.WinForms」 とか自作できそう。

## かんそう

なんか勢いあるねマイクロソフト。

[Google が .NET Foundation に加わったり、MS が Linux Foundation に加わったり](http://www.windowscentral.com/microsoft-joins-linux-foundation-welcomes-google-net-community) 、企業間抗争もしてないし、オープンソースとも仲良くやってる感じ。

ライブ始まってから２時間経っても Windows のトピックが出てこなかったり、デモが Mac だったり iPhone だったり、「もうそんな時代じゃねーんだよ」とは以前から言ってるけど、ここまでとはｗ

日本のライブのゲストに及川さん(は元MSだけど)や、伊藤直也さんを呼んだのも、そういう「広がり」を意識してるのかな？

いろいろな世界と仲良くしつつ、モダンさを保ち続けられる C# と .NET が使える場所を広げていく。
改めて、「.NET Framework と C# ってスゴい」ですね！

Xamarin人材としては、Xamarin Studio →  Visual Studio for Mac や Xamarin test cloud → Visual Studio Mobile Center など、徐々に「Xamarinブランド」が Visual Studio に吸収されていくのは仕方ないけど、一方で Tizen 対応などに Xamarin Platform の発展を見ることができるので、Microsoft のなかで重要なポジションに位置するモノであり続けるのかな、と思いました。

いや、Stackoverflow や teratail で Xamarin タグが無くなると質問するのに困るし、「Xamarinはいいぞ！」って言い続けたいしね。

ともあれ、「ざまりん三銃士」おつかれさまでした！

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">なう <a href="https://twitter.com/hashtag/MSFTConnect?src=hash">#MSFTConnect</a> <a href="https://twitter.com/hashtag/vsjp?src=hash">#vsjp</a> <a href="https://t.co/VLbtzYV2rL">pic.twitter.com/VLbtzYV2rL</a></p>&mdash; 田淵 義人＠エクセルソフト (@ytabuchi) <a href="https://twitter.com/ytabuchi/status/798883310277513216">2016年11月16日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

[Connect(); の２日目](https://connectevent.microsoft.com/#day2) も Visual Studio や Xamarin のトピックがあるので、あー睡眠時間がー。 

(ライブ中に naoya_ito さんが、テストサービスについて「Windows Phone は使えないんですかね？」って場を凍らせてたけど、KeyNote後の Miguel と Nat への Q&A で「対応するよ」的なこと言ってた気がする)