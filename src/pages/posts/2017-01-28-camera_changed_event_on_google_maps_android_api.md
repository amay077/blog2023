---
templateKey: blog-post
title: Google Maps Android API のカメラ変更イベントについて
date: 2017-01-28T00:00:00.000+09:00
tags:
  - Android
  - google-maps-api
  - Java
---
Android 向けの Google Maps ライブラリには、カメラの変更（＝位置、回転、チルトのヘ変更）時に発生するイベント ``GoogleMap.OnCameraChangeListener`` があります。
<!--more-->
が、2016年８月のリリースで ``OnCameraChangeListener`` は非推奨になっており、代わりに４つのイベントが新たに追加されました。

* [Release Notes - August 1, 2016 ｜  Google Maps Android API](https://developers.google.com/maps/documentation/android-api/releases?hl=ja#august_1_2016)

> This release introduces a set of new camera change listeners for camera motion start, ongoing, and end events. You can also see why the camera is moving, whether it's caused by user gestures, built-in API animations or developer-controlled movements. Below is a summary of the new listeners. For details, see the guide to camera change events. (Issue 4636)
> 
> * The onCameraMoveStarted() callback of the OnCameraMoveStartedListener is invoked when the camera starts moving. The callback method receives a reason for the camera motion.
> * The onCameraMove() callback of the OnCameraMoveListener is invoked multiple times while the camera is moving or the user is interacting with the touch screen.
> * The OnCameraIdle() callback of the OnCameraIdleListener is invoked when the camera stops moving and the user has stopped interacting with the map.
> * The OnCameraMoveCanceled() callback of the OnCameraMoveCanceledListener is invoked when the current camera movement has been interrupted.


### onCameraMoveStarted - カメラの移動が開始された時

カメラの移動が開始された直後に１回発生します。 ``updateCamera`` や ``animateCamera`` などのメソッドによるカメラ移動でも、ドラッグ、ピンチなどのジェスチャによる場合でも同様です。

### onCameraMoveIdle - カメラの移動が終わった時

カメラの移動が完了した直後に１回発生します。 つまりなんらかのビューの変化が起こるときには、最後に``onCameraMoveIdle`` が必ず１回呼ばれます。アニメーションがキャンセルされたときも、``onCameraMoveIdle`` は呼ばれます。
非推奨となった ``onCameraChange`` と立ち位置的には同じようです。ちなみに ``onCameraChange`` が呼ばれたあとで、``onCameraMoveIdle`` が呼ばれます。

``onCameraMoveStarted`` と ``onCameraMoveIdle`` は必ず対になるかというと、 **そうでないケースが存在** します。 ``animateCamera`` による地図の移動中に、地図をドラッグして地図を移動させた場合です。これについては後述します。


### onCameraMove - カメラが移動した時

カメラが移動したときに発生します。 ``moveCamera`` によるダイレクトなカメラ位置への移動では、このイベントは **発生したり、しなかったりします** 。 ``animateCamera`` によるアニメーション付きの移動では、アニメーション中にこのイベントが発生します。ドラッグやピンチなどのジェスチャ操作でも発生します。

### onCameraMoveCanceled - アニメーションがキャンセルされた時

``animateCamera`` などのアニメーション付きのカメラ移動が、何らかの操作によりキャンセルされたときに発生します。「何らかの操作」とは、

* アニメーション中に ``stopAnimation`` が呼ぶ
* アニメーション中に画面をタップやドラッグする

です。

## 【おまけ】 ``animateCamera`` のコールバック

``animateCamera`` には、アニメーションの完了／中止を受信できるコールバックを指定できます。

```java
public final void animateCamera (
    CameraUpdate update, 
    GoogleMap.CancelableCallback callback)
```

## ケース毎のイベント発生の様子

サンプルアプリを作って、実際の操作でどのようなイベントが発生するのか、調べてみました。

![](/img/posts/deep_dive_in_camera_events_of_google_maps_android_api_01.gif)

### updateCamera メソッドの実行

1. onCameraMoveStarted
2. onCameraMove ←発生しないこともある
2. ~~onCameraChange~~
3. onCameraIdle

**``onCameraMove`` は発生することも、しないこともある** ようです、その条件についてはよくわかりませんでした（位置が変わるから ``onCameraMove`` が発生する、わけでもないようです）。 ``onCameraChange`` は非推奨なので打ち消し線を入れています。

### animateCamera メソッドの実行(中断なし)

1. onCameraMoveStarted
2. onCameraMove
3. onCameraMove
4. ・・・
5. animateCamera_onFinish
6. ~~onCameraChange~~
7. onCameraIdle

移動中に ``onCameraMove`` が複数回呼び出されます。回数はアニメーションの速度により変わります。
移動が完了すると ``animateCamera`` メソッドのコールバックに ``onFinish`` が通知され、その後、 ``onCameraIdle`` が呼び出されます。

### animateCamera メソッドの実行 → stopAnimation の実行

1. onCameraMoveStarted
2. onCameraMove
3. ・・・
4. onCameraMove
5. ``stopAnimation`` 呼び出し
6. onCameraMoveCanceled
7. animateCamera_onCancel
8. ~~onCameraChange~~
9. onCameraIdle

アニメーション中に ``stopAnimation`` を呼び出すと、カメラの移動が停止し、 ``onCameraMoveCanceled`` → ``animateCamera_onCancel`` の順で中止が通知されます。その後、 ``onCameraIdle`` が呼び出されるのは完了時と変わりません。

### animateCamera メソッドの実行 → 移動中にドラッグして地図を移動

1. onCameraMoveStarted ← animateCameraによる移動開始
2. onCameraMove
3. ・・・
4. onCameraMove
5. ドラッグで地図移動
6. onCameraMoveCanceled
7. onCameraMoveStarted ← ドラッグによる移動開始
7. animateCamera_onCancel
8. onCameraMove
8. onCameraMove
9. ・・・
5. ドラッグやめ
10. ~~onCameraChange~~ ← animateCameraによる移動終了？
11. onCameraMove
12. onCameraMove
10. ~~onCameraChange~~ ← ドラッグによる移動終了？
9. onCameraIdle

地図移動中にドラッグをすると、 ``onCameraMoveCanceled`` で中断が通知され、即座に 新しいカメラの移動として ``onCameraMoveStarted`` が通知されます。 ``animateCamera`` にアニメーション中止 ``animateCamera_onCancel`` が通知されるのはその後です。

その後、ドラッグによる ``onCameraMove`` が連続して発生し、ドラッグをやめると ~~``onCameraChange``~~ が２回、``onCameraIdle`` が最後に１回呼び出されました。

このケースでの要注意点をまとめると以下です。

* ``animateCamera`` に ``onCancel`` が通知されるよりも先に、ドラッグによる ``onCameraMoveStarted`` が通知される
* ``onCameraMoveStarted`` は２回通知される（``animateCamera`` 呼び出し時とドラッグ開始時）のに、 ``onCameraIdle`` は最後に１回しか通知されない。

RxJava などで複数のイベントをストリーム化する時は、どうしてもイベントの発生順序や回数を意識せざるを得ませんが、その時に問題になりそうな気がします。

### 非アニメーション時に stopAnimation を呼ぶ

1. ~~onCameraChange~~
2. onCameraIdle

ただ ``stopAnimation`` を呼ぶだけでも、 ~~``onCameraChange``~~、 ``onCameraIdle`` が呼ばれます。気持ち悪いですね。

## まとめ

* 非推奨になった ``onCameraChange`` の代わりとしては ``onCameraIdle`` が使えるが、ビミョーに発生タイミングが違うようなので注意！
* 新たに追加された ``onCameraMoveStarted`` でカメラ移動の開始、 ``onCameraMove`` で移動中のカメラを受信できる。 
* ``onCameraXXXX`` は、メソッドによるカメラ移動だけでなく、ジェスチャによるカメラ移動時にも通知が来る。 ``animateCamera`` のアニメーションの終了／中断は引数のコールバックで受信する。

### 【おまけ】 Google Maps SDK for iOS

姉妹ライブラリである iOS 向けの Google Maps SDK では、カメラ関連イベントは

* [GMSMapViewDelegate Protocol Reference  ｜  Google Maps SDK for iOS](https://developers.google.com/maps/documentation/ios-sdk/reference/protocol_g_m_s_map_view_delegate-p.html?hl=ja#aabd01d59d7680799a0c24d3c8b5e4622)

にあります。これによると、

* willMove
* didChangeCameraPosition
* idleAtCameraPosition

があります。Android 用とことなっていて悩ましいです。。。
