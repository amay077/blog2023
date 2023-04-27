---
templateKey: blog-post
title: Google Maps JavaScript API を使うときには必ず region の設定をしてくださいおねがいします
date: 2017-08-21T00:00:00.000+09:00
tags:
  - JavaScript
  - google-maps-api
---
3年くらい前に
<!--more-->

* [Googleマップ禁止令が出たのなら、地理院地図をGoogleマップで使えばいいじゃない - Qiita](http://qiita.com/amay077/items/979dfc858a21c8bbb7a9)

という記事を書きました。

これはGoogleマップにて、「竹島や北方領土などが政府方針と反する名称で表記されているケース」があることに対して、ならば「地理院地図」を使えばいいじゃん？という内容でした。

その後、Googleマップ側でも対応がなされ、「ローカライズ」という機能を使うことで、「その国の法律に準拠した地図」にすることができるようになりました（これについても前述の記事の「2013.10.17 追記」に書きました）。

このローカライズについて、もう一度書きます。

**日本向けのWebサービスでGoogleマップを使う場合は、必ず「ローカライズ」の機能を使用してください**

具体的には、 次の通りです。

* [Google Maps JavaScript API / マップのローカライズ](https://developers.google.com/maps/documentation/javascript/localization?hl=ja)

Google Maps JavaScript API の埋め込みスクリプトタグで、

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&language=ja&region=JP">
</script>
```
のように ``region=JP`` を付けてください、これだけです。

## 対応どうでしょう？

さて著名なWebサービスではちゃんと設定してくれてますよね？
※Google Maps のスクショを貼るのは規約で禁止されているのでボカしてます（これでクリアできているとも思いませんが）。

### 期待される表記

いわゆる「政府方針の通りの表記」のみがされている状態

![](/img/posts/should_set_region_jp_to_googlemaps_01.png)

### 楽天トラベル

あぼーん

![](/img/posts/should_set_region_jp_to_googlemaps_02.png)

### じゃらん

ぐえぇぇ

![](/img/posts/should_set_region_jp_to_googlemaps_03.png)

### ぐるなび

ぎゃあぁぁあ

![](/img/posts/should_set_region_jp_to_googlemaps_04.png)

### たべろぐ

お、おぅ

![](/img/posts/should_set_region_jp_to_googlemaps_05.png)

ぜ、全滅だと・・・・。

## まとめ

お願いですからGoogleマップを使うときは「ローカライズ」をしてください。
私自身はそんなに気にしないのですが、へんなツイートみちゃったか[ら](https://twitter.com/yamazogaikuzo/status/899396971433086976)。こういうことに税金使われたい？
