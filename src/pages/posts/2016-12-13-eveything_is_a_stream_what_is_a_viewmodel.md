---
templateKey: blog-post
title: Everything is a stream, ViewModel is 何？
date: 2016-12-13T00:00:00.000+09:00
tags:
  - RxJava
  - Android
  - data-binding
  - MVVM
---
[RxJava Advent Calendar 2016](http://qiita.com/advent-calendar/2016/rxjava) 13日目 です。
RxJava と Android の DataBinding と MVVM についての話をします。

<!--more-->

## Everything is a stream

![](/img/posts/everythis_is_a_stream_what_is_viewmodel_01.jpg)

via [Rob Wormald](http://slides.com/robwormald/everything-is-a-stream#/)

いいコトバですね。

Android アプリ開発では、事実上 stream is an (RxJava の) ``Observable<T>``、
つまり 
**Everything is an ``Observable<T>``** と言ってもいいでしょう。

ところで、 Android アプリ開発でも DataBinding の登場以来、MVVM パターンの話題が増えてきました。

Everything is a ``Observable<T>``、では ViewModel はどうでしょう？

```java
public class MainViewModel {

    public final ObservableField<String> name = new ObservableField<>();
    public final ObservableField<String> location = new ObservableField<>();
    public final ObservableField<String> bio = new ObservableField<>();
    
}
```

``ObservableField<T>`` … ``Observable<T>`` じゃない！（``BaseObservable`` でも同じね）

これの何がイヤかというと、Model から流れてくる値を View に表示してやるために、ViewModel で subscribe しないといけない所です。

```java
public class MainViewModel {
    public MainViewModel() {
        // めんどい
        _someModel.getUserName().subscribe(x -> {
            name = x;
        });
    }
}
```

RxJava の ``Observable<T>`` をそのまま View にバインドできたらどれだけ楽だろうか、それを実現してくれるのが **rx-property-android** というライブラリです。

* [k-kagurazaka/rx-property-android: Bindable and observable property for Android Data Binding](https://github.com/k-kagurazaka/rx-property-android)
* [RxPropertyでRxJavaとAndroid Data Bindingを連携する - Qiita](http://qiita.com/k-kagurazaka@github/items/3fc1fc19ea608cac9913) ←作者: @k-kagurazaka@github さんによる解説

## rx-property-android を使ってみる

「UserID を指定して、GitHub のユーザー情報を取得する」という単純なサンプルを作ってみます。

こんなのです。

![](/img/posts/everythis_is_a_stream_what_is_viewmodel_02.gif)

実装の説明の前に、MVVM に関するこのスライドを見てください。

* [Vue.jsで実現するMVVMパターン Fluxアーキテクチャとの距離 // Speaker Deck](https://speakerdeck.com/shinpeim/vue-dot-jsdeshi-xian-surumvvmpatan-fluxakitekutiyatofalseju-li)
* [実況中継シリーズ Vue.jsで実現するMVVMパターン Fluxアーキテクチャとの距離 - Re.Ra.Ku アドベントカレンダー day 13 - Re.Ra.Ku tech blog](http://techblog.reraku.co.jp/entry/2016/12/13/080000)

とっても勉強になります。

* **「注意深く設計された MV* は単一データフローになる」**
* **「ModelについてViewModelが行うことは、イベントに対する反応と戻り値のないメソッドの呼び出ししかない」** via [MVVMのModelにまつわる誤解](http://ugaya40.hateblo.jp/entry/model-mistake)

では実装を説明します、まずモデル。

ロジック自体は本題ではないので、公開インターフェースだけ載せます。

```java
// GutHubModel.java
public class GitHubModel {
    // 外部に公開する Hot な Observable
    public final Observable<User> user = _user;

    // 指定した UserID の GitHub ユーザー情報を得る
    // Model だから戻り値の無いメソッドだよ
    public void getUser(String user) {
       /* ごにょごにょやって user の onNext を呼び出す */
    }
}
```

「イベントに対する反応」が ``Observable<User> user`` で、
「戻り値のないメソッド」が ``void getUser(String user)`` ですね。

メソッドが呼ばれると、GitHub API で通信して User を得、``user`` の ``onNext`` を呼び出して、変更を通知します。

次、本題の ViewModel です。

```java
// MainViewModel.java
public class MainViewModel {
    // View(EditText) と TwoWay Binding する RxProperty
    public final RxProperty<String> userId = new RxProperty<>();
    // ボタンをおした時に実行されるコマンド(＝ボタンを押した時に onNext が呼ばれる Observable)
    public final RxCommand<Void> getUserCommand;

    // Model -> View DataBinding 用の RxProperty（name.value で DataBinding できる）
    // OneWay Binding だから ReadOnlyRxProperty の方が望ましい
    public final RxProperty<String> name;
    public final RxProperty<String> location;
    public final RxProperty<String> bio;

    // GitHub からユーザー情報を得る Model. DIしようね
    final GitHubModel _gitHubModel = new GitHubModel();

    public MainViewModel() {
        // Model -> ViewModel -> View のデータの流れ道を作っておきましょう
        // GitHubModel の user が変更されたら、name/location/bio にそれぞれデータを流すよ
        name = new RxProperty<>(_gitHubModel.user.map(user -> user.getName()));
        location = new RxProperty<>(_gitHubModel.user.map(user -> user.getLocation()));
        bio = new RxProperty<>(_gitHubModel.user.map(user -> user.getBio()));


        // ユーザー取得コマンドは userID が空でない時のみ使用可能です
        getUserCommand = new RxCommand<>(userId.asObservable().map(x -> !TextUtils.isEmpty(x)));
        // ユーザー取得が実行されたら GitHubModel の getUser を呼ぶよ
        getUserCommand.asObservable().subscribe(x -> {
            _gitHubModel.getUser(userId.get());
        });
    }
}
```

rx-property-android を使用した結果、

* ``ObservableField<T>`` が ``RxProperty<T>`` に
* ``ボタンのイベントハンドラ`` が ``RxCommand`` に

置き換わっています。
そしてこれらは、その名が示すとおり全て ``Observable<T>`` と連携しています。

例えば ``RxProperty<String> name`` は、 ``_githubModel.user`` を map オペレータで ``getName()`` に変換しています。他の２つも同様です。

``RxCommand getUserCommand`` も ``Observable<T>`` です。
これは、「コマンドが実行されたら onNext() が呼び出される」という Observable です([RxBinding](http://qiita.com/Reyurnible/items/b2888d2d1d13110d2250) のようなイメージ)。

このように、全て ``Observable<T>`` にすることができました。
イミュータブルなフィールドとコンストラクタで「定義」するだけ、美しい・・・。

Everything is an ``Observable<T>``, **ViewModel is also ``Observable<T>``**

さて、ではこの ``RxProperty<T>`` と ``RxCommand`` を View(xml) でバインドします。

```xml
// activity_main.xml
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    tools:context="net.amay077.rxretrofitsample.MainActivity">
    <data>
        <variable name="viewModel" type="net.amay077.rxretrofitsample.viewmodels.MainViewModel"/>
    </data>
    
    (中略)
            <EditText android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="@={viewModel.userId.value}"/>
            <Button
                android:id="@+id/buttonGetUser"
                android:text="Get User"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                app:rxCommandOnClick="@{viewModel.getUserCommand}"
                />
            <TextView android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="@{viewModel.name.value}"/>
            <TextView android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="@{viewModel.location.value}"/>
            <TextView android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="@{viewModel.bio.value}"/>
    (中略)
</layout>
```

RxProperty のバインドは ``<プロパティ名>.value`` とします。 .value をよく忘れるので注意が必要です。
RxCommand は ``app:rxCommandOnClick`` を使ってバインドします。

## ソースコード

完成形のソースコードは、

* [amay077/RxPropertyRetrofitSample](https://github.com/amay077/RxPropertyRetrofitSample)

にあります。

## まとめ

[rx-property-android](https://github.com/k-kagurazaka/rx-property-android) を使うと DataBinding と ``Observable<T>`` の連携ができます。

全てが ``Observable<T>`` なら、

**「左手はそえるだけ、ViewModel はつなぐだけ」**

流れるような DataBinding + MVVM ライフを。

### おまけ

rx-property-android は、 .NET の [ReactiveProperty](https://github.com/runceel/ReactiveProperty) というライブラリを Android 向けに移植してくださっているものです。

ReactiveProperty は .NETアプリケーション他、 Xamarin によるモバイルアプリケーションでも多数の事例があります([NHK紅白アプリ](https://twitter.com/ytabuchi/status/806706768042606592)とかね)。

私は [DroidKaigi 2017](https://droidkaigi.github.io/2017/) で Xamarin.Android について話しますが、ReactiveProperty を使った Android/iOS 共通な ViewModel の話も少ししたいなーと思っています、ご興味あれば是非。
