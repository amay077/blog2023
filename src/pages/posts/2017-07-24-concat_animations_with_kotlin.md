---
templateKey: blog-post
title: Androidでアニメーションを連続で実行するのが面倒なのを Kotlin で便利にした話
date: 2017-07-24T00:00:00.000+09:00
tags:
  - Kotlin
  - Android
  - Java
  - Xamarin
  - csharp
---
Android で「浮いてるように見える」アニメーションを実装する機会がありまして。次の画像のようなものなんですが。
<!--more-->

![](/img/posts/concat_animations_with_kotlin_01.gif)

このアニメーションは、

1. 2秒かけて上へ少し移動する
2. 2秒かけて下へ少し移動する

を「連続で」「繰り返し」実行させることで実現しています。
「連続で」とは、 1. のアニメーションが終わったら 2. のアニメーションを開始する、という意味です。

## Java-Android では…

これを Android の View のアニメーションAPI で実現すると、普通にひどいコードになります。次がそれ。

```java
// 2秒かけて上へ移動するアニメーション
final TranslateAnimation anim1 = new TranslateAnimation(
        Animation.RELATIVE_TO_SELF,  0.0f,
        Animation.RELATIVE_TO_SELF,  0.0f,
        Animation.RELATIVE_TO_SELF,  0.0f,
        Animation.RELATIVE_TO_SELF, -0.1f);
anim1.setDuration(2000);

// 2秒かけて下へ移動するアニメーション
final TranslateAnimation anim2 = new TranslateAnimation(
        Animation.RELATIVE_TO_SELF,  0.0f,
        Animation.RELATIVE_TO_SELF,  0.0f,
        Animation.RELATIVE_TO_SELF, -0.1f,
        Animation.RELATIVE_TO_SELF,  0.0f);
anim2.setDuration(2000);

anim1.setAnimationListener(new Animation.AnimationListener() {
    @Override
    public void onAnimationStart(Animation animation) { }

    @Override
    public void onAnimationEnd(Animation animation) {
        anim2.setAnimationListener(new Animation.AnimationListener() {
            @Override
            public void onAnimationStart(Animation animation) { }

            @Override
            public void onAnimationEnd(Animation animation) {
                // 3. 下へのアニメーションが終わったら、上へ移動するアニメーションをまた開始
                view.startAnimation(anim1);
            }

            @Override
            public void onAnimationRepeat(Animation animation) { }
        });

        // 2. 上へのアニメーションが終わったら、下へ移動するアニメーションを開始
        view.startAnimation(anim2);
    }

    @Override
    public void onAnimationRepeat(Animation animation) { }
});

// 1. 上へ移動するアニメーションを開始
view.startAnimation(anim1);
```

コールバックのネストに、行いたい処理とコードの記述順が逆という二重苦、これはやってられません。

これだけで Kotlin を使いたい案件です（Java でも Deferred が使えるライブラリ＜RxJava でも可＞を使えばマシにはなります）。

## これが Kotlin だと…

というわけで Kotlin でやってみました。

まず、「アニメーションを実行して、アニメーションが終わったら次へ継続する関数」を作成します。
ここでは ``View`` の拡張関数として定義してみました。

```kotlin
package net.amay077.animsample

import android.view.View
import android.view.animation.Animation
import kotlin.coroutines.experimental.suspendCoroutine

suspend fun View.startAnimationAsync(anim: Animation) {

    return suspendCoroutine { continuation ->
        anim.setAnimationListener(object : Animation.AnimationListener {
            override fun onAnimationStart(animation: Animation?) { }

            override fun onAnimationEnd(animation: Animation?) {
                continuation.resume(Unit)
            }

            override fun onAnimationRepeat(animation: Animation?) { }
        })

        this.startAnimation(anim)
    }
}
```

呼び出し側は次のような感じ。
コールバック地獄の Java に比べて天国かよここは…。
アニメーションはUIスレッドから呼び出す必要があるので ``async() { }`` ではなく ``launch(UI) { }`` を使う必要があるようです。

```kotlin
val button1 = findViewById(R.id.button1)

val anim1 = TranslateAnimation(
        Animation.RELATIVE_TO_SELF, 0.0f,
        Animation.RELATIVE_TO_SELF, 0.0f,
        Animation.RELATIVE_TO_SELF, 0.0f,
        Animation.RELATIVE_TO_SELF, -0.5f)
anim1.duration = 2000

val anim2 = TranslateAnimation(
        Animation.RELATIVE_TO_SELF, 0.0f,
        Animation.RELATIVE_TO_SELF, 0.0f,
        Animation.RELATIVE_TO_SELF, -0.5f,
        Animation.RELATIVE_TO_SELF, 0.0f)
anim2.duration = 2000

launch(UI) { // メインスレッドから async するよ
    // ずっとくりかえし
    while (true) {
        button1.startAnimationAsync(anim1) // 1. 2秒かけて上へ移動するアニメーションを実行
        button1.startAnimationAsync(anim2) // 2. 2秒かけて下へ移動するアニメーションを実行
    }
}
```

Kotlin をまともに使うのが初めてなのでまだ改善できるかも。。
よいコードがありましたらご指摘ください。

※Kotlin の coroutine(async/await) は 2017年7月現在、正式リリースされていません(experimental 版です)。

Kotlin での実装には、次のサイトを参考にさせていただきました

* [Android開発ではじめるKotlin - Qiita](http://qiita.com/Kogarasi/items/4bd0a37763b057e9d796)
* [Kotlin覚書-環境構築 - Qiita](http://qiita.com/ke__kyukyun1828/items/c4c321650d888765140e)
* [Kotlin+Androidでasync/await - Qiita](http://qiita.com/k-kagurazaka@github/items/702c92bc3381af36db12)
* [How to instantiate an anonymous class that implements an interface in Kotlin - Stack Overflow](https://stackoverflow.com/questions/37805860/how-to-instantiate-an-anonymous-class-that-implements-an-interface-in-kotlin)
* [gildor/kotlin-coroutines-retrofit: Kotlin Coroutines await() extension for Retrofit Call](https://github.com/gildor/kotlin-coroutines-retrofit)

## ちなみに C# でもできます

C#（つまり Xamarin.Android）でも ``async/await(つまり Task)`` と ``TaskCompletionSource`` を組み合わせて実現できます。

C# にも拡張メソッドがあり、次のように定義することができます。

```csharp
public static class ViewAnimationExtensions
{
    public static Task<bool> StartAnimationAsync(this View view, Animation anim)
    {
        var source = new TaskCompletionSource<bool>();
        EventHandler<Animation.AnimationEndEventArgs> handler = null;

        handler = (sender, e) =>
        {
            anim.AnimationEnd -= handler; // 購読解除を忘れずに
            source.SetResult(true); // kotlin の continuation.resume(Unit) にあたるトコ
        };
        anim.AnimationEnd += handler; // イベントを購読

        view.StartAnimation(anim);
        return source.Task;
    }
}
```

よびだし側はこう。
呼び出し時に ``await`` キーワードをつけ、それが含まれるメソッド(ここでは ``OnCreate``)に ``async`` キーワードをつけます。

```csharp
protected async override void OnCreate(Bundle savedInstanceState)
{
    /* 省略 */

    while (true)
    {
        await button1.StartAnimationAsync(anim1);
        await button1.StartAnimationAsync(anim2);
    }
}
```

Kotlin は同一プロジェクト内に Java と混ぜて使うことができるのがよいですね。
