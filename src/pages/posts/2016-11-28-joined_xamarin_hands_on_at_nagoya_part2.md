---
templateKey: blog-post
title: JXUGC #20 Xamarin ハンズオン大会 第二弾でサポートスタッフしてきました
date: 2016-11-28T00:00:00.000+09:00
tags:
  - Xamarin
  - 勉強会
---
[JXUGC #20 Xamarin ハンズオン大会 第二弾 名古屋支部 ＆ 学生支部](https://jxug.connpass.com/event/41648/) で、ハンズオンのサポートスタッフとして参加してきました。

<!--more-->

遅刻してすいません。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">うおおおお！ <a href="https://twitter.com/hashtag/jxug?src=hash">#jxug</a> <a href="https://t.co/lc7x6vaNWl">pic.twitter.com/lc7x6vaNWl</a></p>&mdash; これがあめいの選択だよ (@amay077) <a href="https://twitter.com/amay077/status/802320470204788737">2016年11月26日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

午前中は座学で、午後がハンズオンでした。

## 午前

午前は、 [@biac](https://twitter.com/biac) さん、 [@garicchi](https://twitter.com/garicchi) さん、 [@chomado](https://twitter.com/chomado) さんの発表でした。

* [JXUGC #20 Xamarin ハンズオン大会 第二弾 名古屋支部 ＆ 学生支部 - 資料一覧 - connpass](https://jxug.connpass.com/event/41648/presentation/)

に資料があがるはず！ご免！

## 午後

午後はハンズオン。Xamarin Dev days の内容をみんなでやりましょうというお題でした。
めいめいでやるよりみんなで一歩ずつ進んでいく感じ、こっちの方が初学者には優しいかな、と思います。

### ハンズオンのソースコード

* [xamarin/dev-days-labs as xamarin](https://github.com/xamarin/dev-days-labs/tree/ce494e381416e023787c4adcbe54039a205bab43)

### 日本語のドキュメント

* [xamarin-dev-doc/readme.md at chomado/xamarin-dev-doc](https://github.com/chomado/xamarin-dev-doc/blob/f615a3935a6038c03df935eda0c515306ced357e/hands-on/readme.md)

ソース・ドキュメントとも、開催当日時点のハッシュがリンク先になっていますので、最新とは異なります。

私は、ハンズオンの内容を司会の田淵さんと一緒にトレースしながら、会場内の皆さんの様子を伺ってトラブルシュートするという感じで過ごしました。

トレースには、Mac で Xamarin Studio と同時に JetBrains の C# IDE である [JetBrains Rider](https://blog.jetbrains.com/jp/2016/01/13/569) を使ってみました。

現在は [Public EAP](https://blog.jetbrains.com/dotnet/2016/11/21/jetbrains-rider-public-preview/) 公開中で、 Xamarin プロジェクトの「実行」はできないものの、C# ソースコードや XAML の編集は問題なく行えます（XAML プレビューはありません）。

JetBrains Rider には Resharper が実装されており、コード入力に対して圧倒的なサポートをしてくれます。
（ハンズオン当日は、Visual Studio の Xamarin 拡張にはバグがあり、XAML上でのインテリセンスが効かなかったようで、余計に助かりました。）

Xamarin Studio と JetBrains Rider を一緒に起動させておくと、ファイルの編集は相互に適用されるので、

1. Rider で C# ソースコードを編集
2. Xamarin Studio で実行

という手順で開発していました。

Visual Studio for Mac が発表されて間もないですが、JetBrains Rider も正式公開に向けて要チェックです！

ハンズオンの成果物は、

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">Xamarin ハンズオン、iOS と Android でここまで簡単に来られます（よね？） <a href="https://twitter.com/hashtag/jxug?src=hash">#jxug</a> <a href="https://t.co/xI5cQyUQ63">pic.twitter.com/xI5cQyUQ63</a></p>&mdash; これがあめいの選択だよ (@amay077) <a href="https://twitter.com/amay077/status/802392119755145216">2016年11月26日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

です。

Xamarin ハンズオンは毎度思うのですが、やっぱり「Win+Visual Studioでの環境構築だなー」と。

私が対応したトラブルシュートは、

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">昨日のXamarinハンズオンでのトラブルシュート（全部Win）<br>アプリ実行後すぐ落ちる→Fastdevをoff<br>.netcoreでエラー→UWPprjを削除<br>Bonjourでエラー→iOSprjを削除<br>JDK1.8が入ってない→入れた<br>XAMLでtypoしてもエラーにはならない</p>&mdash; これがあめいの選択だよ (@amay077) <a href="https://twitter.com/amay077/status/802711502297776128">2016年11月27日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

こんな感じでした。

午前に登壇してくれて、午後はサポートも行ってくれた がりっちさん（ @garicchi ）からも、素晴らしいフィードバックをいただきました。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr"><a href="https://twitter.com/ytabuchi">@ytabuchi</a> <a href="https://twitter.com/amay077">@amay077</a> <a href="https://twitter.com/chomado">@chomado</a> <a href="https://twitter.com/Fumiya_Kume">@Fumiya_Kume</a> 先日はお疲れ様でした&amp;遅刻すみませんでした。ハンズオン中に参加者いただいた質問をまとめましたので次回以降の参考にしていただければと思います。 <a href="https://t.co/FIU4J8iiZW">https://t.co/FIU4J8iiZW</a></p>&mdash; がりっち🔜 (@garicchi) <a href="https://twitter.com/garicchi/status/802736736237273090">2016年11月27日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Xamarin はバージョンアップが激しいので、トラブルシューティングのノウハウも陳腐化が激しいのですが、Wiki とかに情報をまとめて（すぐ更新できるようにして）、環境構築時のトラブルを少しでも減らせるとよいなと思います。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">Xamarin の開発環境構築FAQ集に「サバイバルガイド」って名前付けようかw</p>&mdash; これがあめいの選択だよ (@amay077) <a href="https://twitter.com/amay077/status/802856193727217667">2016年11月27日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

## LT

「Visual Studio を学校のPCに入れてください」とお願いしたら先生に断られて、それじゃあという事で高校生の [@MogamiTsuchikaw](https://twitter.com/MogamiTsuchikaw) 君が作った、 USBに入れて持ち運べる C# 開発環境「C#_GO」

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">USBに入れて、いつでも·どこでもC#!!<br>【C#_GO】<br>このアカウントでは、アップデートや使い方等の情報を発信しています。<br><br>現在クローズドベータテストを実施に向け開発中です。<br>フォローしていただき、DMにてベータテスト参加の意思を送っていただければ、参加できます。</p>&mdash; C#_GO (@Csharp_GO) <a href="https://twitter.com/Csharp_GO/status/795096003988721664">2016年11月6日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

がいろいろスゴいので是非応援してあげてください。フロッピーディスク知ってるとかヤバイな最近の高校生ｗ

あと [kekyo](https://twitter.com/kekyo2) さんのこれｗ

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">寿司が延々と流れていく Visual Studio <a href="https://t.co/J9tCF3PKW8">pic.twitter.com/J9tCF3PKW8</a></p>&mdash; 田淵 義人＠エクセルソフト (@ytabuchi) <a href="https://twitter.com/ytabuchi/status/802383908562046976">2016年11月26日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

私は、 Xamarin Advent Calendar 2016 の募集をしました。

* [Xamarin advent calendar 2016 参加者募集](http://www.slideshare.net/amay077/xamarin-advent-calendar-2016)

* [[初心者さん・学生さん大歓迎！] Xamarin その2 Advent Calendar 2016 - Qiita](http://qiita.com/advent-calendar/2016/xamarin-welcome)

が募集中ですので、参加よろしくおねがいします。
それから Xamarin Advent Calendar 2016 シリーズ４つ、

* 通常1 - [http://qiita.com/advent-calendar/2016/xamarin](http://qiita.com/advent-calendar/2016/xamarin)
* 通常2 - [http://qiita.com/advent-calendar/2016/xamarin-student](http://qiita.com/advent-calendar/2016/xamarin-student)
* 初心者・学生さん向け1 - [http://qiita.com/advent-calendar/2016/xamarin2](http://qiita.com/advent-calendar/2016/xamarin2)
* 初心者・学生さん向け2 - [http://qiita.com/advent-calendar/2016/xamarin-welcome](http://qiita.com/advent-calendar/2016/xamarin-welcome)

ウォッチしておいてくださいね。

## 懇親会！

懇親会の感想は、

* 「SIer も Web系 も一括りにはできないよ？」
* 「最近の大学生スゴい、高校生スゴい」
* 「オレの地元、IT人材豊富じゃない？」

の３本です。

最後に、企画・主催の [くぅ(@Fumiya_Kume)くん](https://twitter.com/Fumiya_Kume)、運営の皆さま、登壇者・参加されたみなさん、ありがとうございました。
名古屋でも Xamarin、またやるみたいなので、その時にお会いしましょう。
