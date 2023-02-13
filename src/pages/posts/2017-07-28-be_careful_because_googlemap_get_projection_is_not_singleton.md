---
templateKey: blog-post
title: Google Maps Android API の GoogleMap.getProjection はシングルトンじゃないから注意
date: 2017-07-28T00:00:00.000+09:00
tags:
  - Android
  - GoogleMapsAPI
  - Java
---
Android で Google Maps を使用するときに使用する Google Maps Android API の話です。
<!--more-->

* [Google Maps Android API / Google Developers](https://developers.google.com/maps/documentation/android-api/?hl=ja)

この SDK の機能の一つに「地図座標（緯度経度）と画面座標の相互変換」というものがあります。
これを使うと、

* 画面中心の緯度経度を取得して、任意の外部APIを呼び出す（カーナビみたく中心位置の住所を検索するとか）
* 地図上のマーカーの位置に任意の View を吹き出しのように配置する

で、これを行うには ``GoogleMap.getProjection()`` で ``Projection`` クラスのインスタンスを使用して、``fromScreenLocation`` または ``toScreenLocation`` を呼び出します。

* [Projection  /  Google APIs for Android](https://developers.google.com/android/reference/com/google/android/gms/maps/Projection?hl=ja)

この ``GoogleMap.getProjection()`` で取得できるインスタンス、シングルトンというか、いつ取得しても同じインスタンスな気がしませんか？ ``GoogleMap.getUiSettings()`` がそうであるように。 ``map.getProjection().fromScreenLocation``と書くのはダルいので地図の生成時に一度だけ取得して使いまわしたいと思いませんか？

```java
private Projection _proj;

@Override
public void onMapReady (GoogleMap map) {
    // 最初に取得して使い回せばいいよねー、そう思っていた時期が私にもありました・・・
    _proj = map.getProjection();
}
```

ところがこれが間違いです。

ためしに「地図の位置が変わったら、画面の左上(0, 0)の緯度経度を得る」というのを書いてみます。

```java
private Projection _proj;

@Override
public void onMapReady (GoogleMap map) {
    // 最初に取得して使い回せばいいよねー、そう思っていた時期が私にもありました・・・
    _proj = map.getProjection();

    // カメラの移動が完了してアイドル状態になったときのイベント（RetroLambda使用） 
    map.setOnCameraIdleListener(() -> {
        // 画面原点の緯度経度を得る
        LatLng latlng = _proj.fromScreenLocation(new Point(0, 0));
        Log.d("TEST", "lat:" + latlng.latitude + ", long:" + latlng.longitude); 
    });
}
```

地図をスクロールさせると ``setOnCameraIdleListener`` のハンドラが呼び出されますが、期待した結果が得られません。たぶんマイナスとかゼロに近い値になっていると思います。

正しい結果を得るには、

```
map.setOnCameraIdleListener(() -> {
    // 画面原点の緯度経度を得る
    Projection prj = map.getProjection();
    LatLng latlng = prj.fromScreenLocation(new Point(0, 0));
    Log.d("TEST", "lat:" + latlng.latitude + ", long:" + latlng.longitude); 
});
```

のように、「その時点での」 ``Projection`` インスタンスを得る必要があります。

さてではここで API Reference の説明を見てみましょう。

* [GoogleMap.getProjection / Google APIs for Android](https://developers.google.com/android/reference/com/google/android/gms/maps/GoogleMap.html?hl=ja#getProjection())

> The Projection returned is a snapshot of the current projection, and will not automatically update when the camera moves. As this operation is expensive, you should get the projection only once per screen. Google Maps uses the Mercator projection to create its maps from geographic data and convert points on the map into geographic coordinates.

*The Projection returned is a snapshot of the current projection, and will not automatically update when the camera moves.*

*現在の投影のスナップショットを返します。カメラの移動で自動的に更新されません！！！*

しっかり書いてあったー！

Projection とは投影法（メルカトル図法）を示すもの、その投影法（＝投影を行う公式）は不変なものだから取得の度にスナップショットが作られるとは思いませんでした。
この挙動に気づけなくて、３時間くらい悩みつづけました。

悩んだら、固定概念を捨ててキホンを見直そうぜ、という教訓になりました。が敢えて言わせてもらえれば、 ``getCurrentProjection()`` のようなメソッド名だったら、「最初に取得して使いまわす」という発想にはならなかったかも知れません。SDK作る身として、命名にも配慮したいと思いました。
