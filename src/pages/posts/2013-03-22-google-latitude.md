---
templateKey: blog-post
title: Google Latitude の履歴情報を晒してみる
date: 2011-01-05T00:00:00.000+09:00
tags:
  - Android
  - Gps
  - Map
---
昨年の暮れ、Google Latitude の iPhone 版が公開され、ツイッターなどでにぎわってましたが、自分は Android で 二年前から使ってたわー（嘘）、数ヶ月前から使ってました。
<!--more-->

その機能の中に 「履歴を保存する」 というのがあって、これまた興味本位で 「ON」 にしていたのですが、PC 版の [Google Latitude](https://www.google.com/latitude/) サイトで見られたんですね、初めて気づきました。

で、その中には、自宅や職場の位置が教えてもいないのに表示されていて、これがまた当たってるもんだから Google こえーわー なんですが、どんな位置が保存されているかも見ることができます。

試しに自分の行動履歴を晒してみます。

!["1"](https://blog.amay077.net/img/posts/latitude_1.png)

といっても 自宅（豊橋）と職場（名古屋）を往復するだけの日々ですねｗ
これなら Google さんにとっても自宅と職場の位置は容易に推測できるでしょう。
なんか、大阪 や 岡山 へ行ったことになってますが、記憶にないですｗ
恐らく例の WiFi による測位で位置がぶっ飛ぶ現象だと思います。
データの時刻を見てみると、驚くことに２４時間、定期的に位置情報が送信されていることが分かります。こわー。
深夜時間帯は１時間に１回、日中は短ければ１分間隔にもなりますね。たぶん移動具合によって感覚を伸ばしたり縮めたりしてるんでしょうね、Google さんの事ですから。
位置の取得方法は、 GPS＋WiFi＋携帯基地局 のハイブリッドなようです。
次の画像を見てください。

!["2"](https://blog.amay077.net/img/posts/latitude_2.png)

履歴の点をクリックすると、Accuracy （精度） の円が表示されます。
この絵では半径５kmくらいなので恐らく携帯基地局からの推定位置ですが、他の点をクリックすると、円の大きさが小さいものも確認できます。
ただ、さすがに深夜に勝手に GPS を起動させてるとは思いにくいので、基本は WiFi＋基地局で、他のアプリで GPS を使ってる時だけ、コバンザメのように GPS の位置をもらって送信してるんだと思います。

あとあと、画面の右上に ▲ の再生ボタンがあって、行動履歴をトレースできます。致せり尽くせりですね。

さあ、こんな Google の怖くて便利な世界に、あなたも飛び込んでみませんか？
Android 版 Google Latitude では、メニュー の プライバシー から、「ロケーション履歴を有効にする」を ON にするだけです。
簡単ですね、あーこわいこわい♪