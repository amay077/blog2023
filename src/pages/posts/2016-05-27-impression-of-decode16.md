---
templateKey: blog-post
title: d
date: 2016-05-27T00:00:00.000+09:00
tags:
  - .NET
  - Xamarin
  - Microsoft
  - csharp
---
Microsoft の開発者向けイベント [de:code 2016](https://www.microsoft.com/ja-jp/events/decode/2016/) に参加させてもらいましたので感想を書きます。
<!--more-->
Microsoft のカンファレンスに参加するのは何年ぶりでしょう、パシフィコ横浜でやってた Tech・ED とか Tech・Days 以来です。

ここ数年 Android や iOS もモバイルアプリ開発ばかりやってきて、 Xamarin で C# に戻ってきて〜って感じだったので、 「Xamarin 以外の Microsoft テクノロジーを広く浅く知る」 という目的で参加しました。

# セッションの感想

## Day1

### [Keynote](https://www.microsoft.com/ja-jp/events/decode/2016/keynote.aspx)

なんかこういう全体像まとめるの苦手、というか何番煎じなので、他の人のまとめをみてくれい（爆

とりあえず、
**「りんな が想像以上に自然すぎて、LINE で会話してるのをカミさんに見られたら、完全に誤解されそう」**
です。

### [DEV-013 まだまだ進化が止まらない！開発者のための Microsoft Azure 最新機能](https://www.microsoft.com/ja-jp/events/decode/2016/session.aspx#DEV-013)

Azure の現在の提供機能を知りたくて。

Scale Sets、Batch Service、Container Service、Service Fabric、Azure Function など、だいたい AWS を後追いして遜色ない感じになってるのかなー、と。

Region は AWS や Google より多い（日本にも２つある）のは初めて知った。

### [CLT-006 HoloLens 概要 〜未来を見る新しい方法〜](https://www.microsoft.com/ja-jp/events/decode/2016/session.aspx#CLT-006)

期待値の高い HoloLens の概要を知った。
AR や VR との対比で MR(複合現実：Mixed Reality)という。
Google Glass(AR)、 Oculus Rift(VR) は体験したことがあるので、HoloLens も体験すると、ものすごくオドロキがあるんだろうな。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">HoloLens でスプラトゥーンやりたい <a href="https://twitter.com/hashtag/decode16?src=hash">#decode16</a></p>&mdash; 3度目S+のあめいスピナーデコ (@amay077) <a href="https://twitter.com/amay077/status/734998372906471424">2016年5月24日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

とツイートしたが、その時は VR(仮想現実) の文脈で言ってたことにあとで気づいた。
MR:複合現実で考えると、目の前にある現実のもの（机とか家の壁とか）にインクで色が塗れる、「でもそれどうやって多人数対戦型ゲームになるんだ？」とかまだまだ発想力が乏しい。

（例のおさわり会、２周目やってほしいです。。。）

### [DEV-020 Bot Framework & Cognitive Services 〜自動応答ソリューション開発に挑戦〜](https://www.microsoft.com/ja-jp/events/decode/2016/session.aspx#DEV-020)

Bot Framework と Cognitive Services を使ってBOTを作る様子を見た。
まだ理解できていない感じ、どこまでプログラムしないといけないのか、とか。

## Day2

### [ARC-003 モダン Web：たった今と、ほんの少し未来のはなし](https://www.microsoft.com/ja-jp/events/decode/2016/session.aspx#ARC-003)

あんまりWeb界隈に詳しくないけど、Twitterで流れてくる情報はウォッチしてたので、だいたい知ってはいた感じ。
セッション時間足りないよなあと思いつつも、react.js や仮想DOM についての話も聞きたかった。

今後の要素として Web Components, Progressive Web Apps, Native Assembly があったが Safari が軒並み「動作：×」になってて、以前見かけた「将来 Safari が IE のようになる」ってツイート思い出した、そうなんでしょうか？

### [DEV-011 TypeScript 〜Any browser, Any host, Any OS. Open Source〜](https://www.microsoft.com/ja-jp/events/decode/2016/session.aspx#DEV-011)

TypeScript も存在は知りつつ放置してたので最新情報を収集。
Visual Studio Code で C# ライクにコードが書けて、ちょうど今仕事で Javascript を書いてるので、すぐにでも使ってみようと思った。
tsc が出力する Javascript コードを参考にして Javascript を書いてもいいかな、とも思った。

### [SNR-018 Azure と NEST で始める Elastic Stack](https://www.microsoft.com/ja-jp/events/decode/2016/session.aspx#SNR-018)

全文検索の Elasticsearch 周りのセッション。
仕事で Apache Solr を知って、その後 [Elasticsearch を知ってためして](http://qiita.com/amay077/items/9fb99ab9e6801033977d)、[Auto-Rebalancing に感動して](http://qiita.com/amay077/items/ca1ce05ac0d295e7c323) 仕事でも採用されて現在に至る。

Azure との関連はこじつけｗに近かったが、 .NET のクライアントライブラリがあるのは知らなかった。

### [CHK-005 All about 機械学習！ 〜機械学習は魔法の杖か、単なる Big Data のはけ口か〜](https://www.microsoft.com/ja-jp/events/decode/2016/session.aspx#CHK-005)

タイトルは釣りｗ
実際は、聴講者が登壇者へ質問を投げつけていくチョークトーク。
スピーカーお二人が R&D と実務としてデータ解析を行われている方だったので、とても説得力があった。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">データマイニングについて。「陳腐化したデータのなかに宝物なんてない」 <a href="https://twitter.com/hashtag/roomH?src=hash">#roomH</a> <a href="https://twitter.com/hashtag/decode16?src=hash">#decode16</a></p>&mdash; 3度目S+のあめいスピナーデコ (@amay077) <a href="https://twitter.com/amay077/status/735329131051778048">2016年5月25日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

データマイニングとの違いとは？という問いに対して。
「人が」「時間をかけて」「データを解析」し、結果が出てから実装していては遅いし、そういう時代は終わった。だからこその機械学習、解析まで機械同士でやってくれと。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">Q:どのくらい勉強しなければならないのか？<br>A:時間軸次第。２～３年先には機械学習もパターン化すると予想。その後にはアルゴリズムを選択する必用もなくなると思う。 <a href="https://twitter.com/hashtag/roomH?src=hash">#roomH</a> <a href="https://twitter.com/hashtag/decode16?src=hash">#decode16</a></p>&mdash; 3度目S+のあめいスピナーデコ (@amay077) <a href="https://twitter.com/amay077/status/735333613085020160">2016年5月25日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

エンジニアが機械学習についてどこまで学習する必要があるのか？という問いに対して。識者の方々が、割と短い期間の内に、機械学習がコモディティ化すると予想されていて、ちょっと驚きと安心。わかりました勉強しませんｗ いろいろな機械学習のツールやサービスを知って、使うフェーズに入っているんだなーと思った。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">Q. 機械学習は人間の役割の置き換えになるのか？<br>人間の経験や感覚は、正しい確率が高いわけではない。測定可能なデータをお元に推測ができる機械学習は、多くの場で有用だろう。（筆者意訳）<a href="https://twitter.com/hashtag/decode16?src=hash">#decode16</a> <a href="https://twitter.com/hashtag/RoomH?src=hash">#RoomH</a></p>&mdash; dz づ (@dz_) <a href="https://twitter.com/dz_/status/735337240327524352">2016年5月25日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

機械学習によって仕事を奪われる人をどうやって説得する？という問いに対して。
かしこい人ほど "カンの妥当性の低さ" を自認しているので、ニーズはあるよなー、と思った。

### [DEV-002 .NET Core / ASP.NET Core が実現するクロスプラットフォーム .NET の今と未来](https://www.microsoft.com/ja-jp/events/decode/2016/session.aspx#DEV-002)

「.NET Framework はマルチプラットフォームにできます（やらないけどな）」と言ってた時代がなつかしい、実際に Mac や Linux で「動く」 .NET の話。

Xamarin は Mono を使っているけれど、今後は .NET Core に寄せていく(と思われる)ので、今後も要チェック。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">Mac + Xamarin Studio で普通に <a href="https://t.co/KM1FpPjJ4s">https://t.co/KM1FpPjJ4s</a> Webアプリが作れてちょっと感動した。 <a href="https://twitter.com/hashtag/roomB?src=hash">#roomB</a> <a href="https://twitter.com/hashtag/decode16?src=hash">#decode16</a></p>&mdash; 3度目S+のあめいスピナーデコ (@amay077) <a href="https://twitter.com/amay077/status/735344072546783232">2016年5月25日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

実際のところ、VS より Xamarin Studio の方が機能が少なくて軽量なので、サクッと Webアプリ作るには Xamarin Studio でいいじゃん？とか思った。

### [DEV-023 Xamarin Deep Dive - Xmarin.Forms の可能性](https://www.microsoft.com/ja-jp/events/decode/2016/session.aspx#DEV-023)

「Xamarin.Forms？まだ早いでしょ」派の人間だけど、「なかなかイケるらしい」という噂を聞いてたので参加した。
りんなセッションに客を取られたもののほぼ満員だった。

(Alpha版だから？)相変わらずイレギュラーな動作はするものの、 Behavior, Effects, Previewer など、だいぶ使えるようになってきた感じ。

DataPages は、カスタマイズできると強そう。Workbooks は良いぞ！

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr"><a href="https://twitter.com/hashtag/RoomF?src=hash">#RoomF</a> <a href="https://twitter.com/hashtag/decode16?src=hash">#decode16</a><br>Xamarin Workbooks ！<br>「実行できる仕様書」みたいなやつ！<a href="https://t.co/4gkVcVzALR">https://t.co/4gkVcVzALR</a> <a href="https://t.co/SLSfKMYHoE">pic.twitter.com/SLSfKMYHoE</a></p>&mdash; ちょまど@MS入社して2ヶ月 (@chomado) <a href="https://twitter.com/chomado/status/735377175935913984">2016年5月25日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

[Evolve アプリ](https://blog.xamarin.com/browse-through-the-evolve-2016-mobile-app-source-code/) も Xamarin.Forms を使ってるので、ロックイン覚悟でそろそろ本格的に使ってみますか、という気になった（ただし Mac でな）。

### [DOO-012 FinTech だけじゃモッタイ無い！ブロックチェーンとクラウドが作る未来](https://www.microsoft.com/ja-jp/events/decode/2016/session.aspx#DOO-012)

FinTech とか ブロックチェーン などのバズワードを追ってなかったので聴講。
何気に一番の発見だった。
ブロックチェーン と プログラムを動かす事 が関係あるとは思ってなかった。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">ブロックチェーンの今後として契約と履行がある。履行＝プログラムの実行、なので開発者もブロックチェーンについて知っておいた方がよい。 <a href="https://twitter.com/hashtag/roomG?src=hash">#roomG</a> <a href="https://twitter.com/hashtag/decode16?src=hash">#decode16</a></p>&mdash; 3度目S+のあめいスピナーデコ (@amay077) <a href="https://twitter.com/amay077/status/735396922966564864">2016年5月25日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

知らないワードのオンパレードだったが、開発者としても今後ウォッチしていかないといけない事が分かって、聞いてよかった。

Smart Contract, Ethereum およびこれらの要素を利用したサービス、ビジネスについてウォッチ必須。

とりあえず、 **Smart Contract Conference** というイベントが開催されるそうなので、これは是非行きたい。

# その他の感想

## Xamarin!Xamarin!Xamarin!

Xamarin のセッションが４つも！Day2は常にどこかでセッションやってる感じでしたね。
そのどれもが満員だった模様で関心の高さが伺えました。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">もう Xamarin だけで 1day イベントやったら感 <a href="https://twitter.com/hashtag/decode16?src=hash">#decode16</a></p>&mdash; 3度目S+のあめいスピナーデコ (@amay077) <a href="https://twitter.com/amay077/status/735302315146498048">2016年5月25日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

って感じですね（スピーカーワンチャンある？）。

## Google や Apple の開発者向けイベントと比べて

まず 米国の [//build](https://build.microsoft.com/) というイベントの後に、国内でも公式なイベントとして de:code を開催してくれる、これは素直にありがたいです。

「技術者は英語を聞けて読めて米国から発信される最新情報をキャッチアップすべき」という意見には賛同しつつも、全ての人がそうはなれない訳で、そういった方々にもキチンと企業として情報発信していく、それを専門とするエヴァンジェリストが国内にたくさん居るのはマイクロソフトの良いところかなと思います。

エヴァンジェリストの方々の多様性にも驚きました。踊ったり、コスプレしたり、漫画描いたり、プレゼンの神だったり…。その多様な活動が話題になることも含めて、今の Google や Apple にはできない、効果の高いことだと思います。

ただ、開発者向けイベントには、その全てが最先端テクノロジーを利用して行われる事を期待してしまうのですが、

1. 公式なイベントアプリがない（[Google I/O にはある](https://play.google.com/store/apps/details?id=com.google.samples.apps.iosched)）
2. 参加証を紙で用意しないといけない
3. アンケートも紙で書かないといけない

あたりが残念、今後「変化」を期待したいところです。

特に 1. に関しては、Microsoft が買収した Xamarin の単体のイベント "Evolve" でも Win/Android/iOS全対応の [公式アプリ](https://blog.xamarin.com/download-the-xamarin-evolve-2016-conference-app/) を用意している（Microsoft の技術をふんだんに使って）わけなので、 mobile first をうたうなら、このくらいやって欲しかったなあという印象です（これは build もそうですが）。

大抵のイベントアプリには、

* 聞きたいセッションをお気に入り登録する機能（Azure で管理）
* フロアマップ
* セッションへのフィードバックを送る機能

があります。アプリがあるだけでもイベント運営がいろいろ改善しそうな気がします。

また、技術コミュニティ/関連企業が主催する Android や iOS の国内イベントでは、有志の開発者がコミュニティ主導でイベントアプリを開発しています。

* [オープンソースでDroidKaigiのカンファレンスアプリ作ってる - Konifar's WIP](http://konifar.hatenablog.com/entry/2016/02/11/031257)
* [tryswift/trySwiftApp: try! Swift Conference App](https://github.com/tryswift/trySwiftApp)

こういった動きができるととても良いと思います（そのためにはイベント情報を Microsoft がオープンデータにしてくれる必要があるわけですが）。

## あと感じたことをだらだら書く

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">「○年後は○○だ！」とか明確なビジョンが見えなくても、数年後にはなんとなく思ってたような事やってるし、その為の情報を仕入れにこういうイベントに参加するんだよな。そしてそれは会社ではなく個人の問題。だから来年も来ます。 <a href="https://twitter.com/hashtag/decode16?src=hash">#decode16</a></p>&mdash; 3度目S+のあめいスピナーデコ (@amay077) <a href="https://twitter.com/amay077/status/735414344226242561">2016年5月25日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

参加者はスーツの人が多かったですね。
高額なイベントだし、業務の一環で参加しているとしたら当然会社へ戻って報告の義務があるのでしょう、スライドをカメラでパシャパシャ撮って、一生懸命メモ取ってる人も居ました（かくいう自分も、会社のカネで参加した Tech・ED はそうでしたね）。
会社のカネで参加した人は感想をブログに書くのは抵抗があるのでしょうね。明確にそれを禁止する会社だとしたら残念な会社だと思います。

幸い私の勤め先はじゃんじゃん情報発信してけ的なスタンスだったので良かったですが、それでもこういうイベントは個人(の目的)として参加しています、好きでエンジニアやってるんで。

あと、明確な目標を持つ・決めるのって苦手で、それより
「目を閉じてなんとなく”匂い”のする方に手探りで歩いていたら、なんとなく望んでいた事になってた気がする」
って感じですかね。”匂いを嗅ぐ”のがこういうイベントで、ストリーミングとかではなかなかできないですね。

最後に、こういうイベントではぼっちな事が多かったんですが、Xamarin について数年前からブログに書いてた関連で、 JXUG というコミュニティの皆さんと仲良くさせてもらい、現地でもあいさつ、お話できました。

これについては KeyNote で伊藤執行役が、

> 「エンジニアがコミュニティに参加することを制限したり、就業時間以外や休日に限定したり、会社名を伏せて参加するといった体質を持っていることにも問題がある。日本のエンジニアが、もっと自由に情報交換をしたり、スキルを磨ける環境を作ることに、日本マイクロソフトとしても支援をしたい」

− from   [「日本のデベロッパーには国境を越えてほしい」～Microsoft・グッゲンハイマーCVP - クラウド Watch](http://cloud.watch.impress.co.jp/docs/news/20160525_758975.html)

と言われているので、会社のカネかどうかに関係なく、じゃんじゃんアウトプットしていきましょう。

ではまた来年！
