---
templateKey: blog-post
title: Xamarin でも使える高速 Android エミュレータを簡単に作る方法(Windows編)
date: 2016-11-22T00:00:00.000+09:00
tags:
  - Xamarin
  - Android
  - VisualStudio
  - android-studio
---
* [Xamarin でも使える高速 Android エミュレータを簡単に作る方法(Mac編) - Qiita](http://qiita.com/amay077/items/48b7f3d5096b9677d70a)

の Windows 版です。

<!--more-->

「『Android のエミュレータは遅い』という常識はもう古い」と言われてもう数年経ってる気がしますが HAXM エミュレータの普及率、どのくらいなんでしょう？

この高速な HAXM エミュレータの作り方も随分と簡単になったので、改めて紹介します。

## Android Studio をインストールする

まずは Android Studio をダウンロードしてインストールしましょう。

* [Android Studio と SDK ツールをダウンロードする / Android Studio](https://developer.android.com/studio/index.html?hl=ja)

Xamarin 使ってる人、「オレ Xamarin だから関係ないわｗ」とか言わないで。
Android SDK が２重に入っちゃうけど、まずはそのまま入れて下さい。
※インストール時に、既存の Android-SDK のディレクトリを指定することもできるようです。

(てゆうか Xamarin で作る場合もネイティブの開発知識は必要だから、Android Studio なんて入ってるよね普通)

## Android Studio を起動する

Android Studio を起動して、適当な Android Project を作って下さい。ここで作るプロジェクトに全く意味はありません。エミュレータの作成が終わったら削除してOKです。

## Android SDK の場所を変更する

メニューの File -> Settings で設定画面を起動します。

![](/img/posts/making_android_haxm_emulator_win_01.png)

Appearance & Behavior -> System Settings -> Android SDK を選択し、Android SDK Location の右横の「Edit」を押して、Xamarin や Visual Studio for Mac がインストールした Android SDK のパスを指定します。

Xamarin がインストールした Android SDK は通常 ``C:¥Program Files (x86)¥Android¥android-sdk`` にあります。

ところが、このパスを Android Studio に指定すると、「Android SDK location should not contain whitespace」（空白付きのディレクトリを使うな！）と怒られます。まあ気持ち悪いので、この際、``c:¥dev¥android-sdk`` などに移動してしまいましょう。

![](/img/posts/making_android_haxm_emulator_win_02.png)


Android SDK をどちらかに統一できたら、不要な方はディレクトリ毎削除して OK です。あ、Android SDK にパスを通してる場合はそちらの変更も忘れずに。

## Android エミュレータを作成する

さて、 Android Studio の画面にもどって、ツールバーにある「AVD Manager」のアイコンをクリックします。

![](/img/posts/making_android_haxm_emulator_win_03.png)

Android Virtual Device Manager の画面が表示されます。

ここで Hyper-V が ON になっていると「Android Emulator is incompatible with Hyper-V」というメッセージが表示されます。Hyper-V を OFF にしないとエミュレータは使えないので「Turn off Hyper-V」をクリックして Hyper-V を切り、OS を再起動します。

![](/img/posts/making_android_haxm_emulator_win_04.png)

再度 Android Studio を起動してこの画面に戻ってくると、先程のエラーは消え、今度は「HAXE is not installed」というメッセージが表示されます。こちらも、その右のリンク「Install Haxm」をクリックします。

![](/img/posts/making_android_haxm_emulator_win_05.png)


Emulator Settings の画面になります。
特に設定は変えずに「Next」を押します。

![](/img/posts/making_android_haxm_emulator_win_06.png)

HAXM のインストールが完了しました。
Finish で一旦画面を閉じます。

![](/img/posts/making_android_haxm_emulator_win_07.png)

再び Android Virtual Device Manager の画面を開き、「Create Virtual Device」をクリックします。

![](/img/posts/making_android_haxm_emulator_win_08.png)

System Image の画面が表示されます。
下ごしらえができた所で、実際にエミュレータを作っていきましょう。

試しに「x86 Images」タブから

* Lollipop
* API Level 21
* x86_64 (Windows が 32bitOS なら x86)」
* Android 5.0(with Google APIs)

のエミュレータを作ってみましょう。(with Google APIs) を選択しているのは Google Maps などの Google Play services も使えるようにするためです。この時点では未だ必要な SDK や System Image が入ってないので「Download」をクリックします。

![](/img/posts/making_android_haxm_emulator_win_09.png)

足りないコンポーネントのインストールが終わると、行がアクティブになり「Next」ボタンが使用可能になるので、クリックします。

![](/img/posts/making_android_haxm_emulator_win_10.png)

Android Virtual Device の画面です。
特に設定を変更せず、「Next」をクリックします。

![](/img/posts/making_android_haxm_emulator_win_11.png)

はい、HAXM のインストールと、それを使用したエミュレータが作成されました。
「実行」ボタンをクリックして、起動してみましょう。

![](/img/posts/making_android_haxm_emulator_win_12.png)

起動してプリインストールされている Google マップアプリを表示させた画面です。

![](/img/posts/making_android_haxm_emulator_win_13.png)


## Visual Studio からも使えます

作成したエミュレータは、もちろん Visual Studio からも使えます。2015 で確認、2017 は知らない。

下図は Visual Studio 2015 Community で、 Xamarin.Android のプロジェクトを実行するところですが、Android Studio で先ほど作成したエミュレータが選択肢に出てきます。

![](/img/posts/making_android_haxm_emulator_win_14.png)

## まとめ

Windows でも、Android Studio でエミュレータを作ると、ちょっと面倒な HAXM のインストールもウィザードに沿ってできて、高速エミュレータが簡単に作れるよ。

あと、Android SDK はショートパスな場所に移動して、自分で管理しような。
