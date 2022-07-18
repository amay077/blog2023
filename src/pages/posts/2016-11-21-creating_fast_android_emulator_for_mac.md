---
templateKey: blog-post
title: Xamarin でも使える高速 Android エミュレータを簡単に作る方法(Mac編)
date: 2016-11-21T00:00:00.000+09:00
tags:
  - Xamarin
  - Android
  - VisualStudio
  - AndroidStudio
---
「『Android のエミュレータは遅い』という常識はもう古い」と言われてもう数年経ってる気がしますが HAXM エミュレータの普及率、どのくらいなんでしょう？

<!--more-->

この高速な HAXM エミュレータの作り方も随分と簡単になったので、改めて紹介します。

Mac編と言っているけど、Windows でもやる事は全く同じなので、Visual Studio 2015 で Xamarin やってる人も Android Studio 入れてやってください。

## Android Studio をインストールする

まずは Android Studio をダウンロードしてインストールしましょう。

* [Android Studio と SDK ツールをダウンロードする Android Studio](https://developer.android.com/studio/index.html?hl=ja)

Xamarin 使ってる人、「オレ Xamarin だから関係ないわｗ」とか言わないで。
Android SDK が２重に入っちゃうけど、まずはそのまま入れて下さい。

(てゆうか Xamarin で作る場合もネイティブの開発知識は必要だから、Android Studio なんて入ってるよね普通)

## Android Studio を起動する

Android Studio を起動して、適当な Android Project を作って下さい。ここで作るプロジェクトに全く意味はありません。エミュレータの作成が終わったら削除してOKです。

## Android SDK の場所を変更する

メニューの Android Studio -> Preference で設定画面を起動します。

![](/img/posts/making_android_haxm_emulator_01.png)

Appearance & Behavior -> System Settings -> Android SDK を選択し、Android SDK Location の右横の「Edit」を押して、Xamarin や Visual Studio for Mac がインストールした Android SDK のパスを指定します。

Xamarin がインストールした Android SDK は通常 ``~/Library/Developer/Xamarin/android-sdk-macosx`` にあります。

逆に、 Xamarin Studio や、 Visual Studio for Mac 側の設定を、 Android Studio に合わせてもOKです。

![](/img/posts/making_android_haxm_emulator_02.png)

Android SDK をどちらかに統一できたら、不要な方はディレクトリ毎削除して OK です。あ、 ``.bashrc`` などでパスを通してる場合はそちらの変更も忘れずに。

## Android エミュレータを作成する

さて、 Android Studio の画面にもどって、ツールバーにある「AVD Manager」のアイコンをクリックします。

![](/img/posts/making_android_haxm_emulator_a.png)

Android Vistual Device Manager の画面が表示されます。
ここで「Create Virtual Device」をクリックします。

![](/img/posts/making_android_haxm_emulator_b.png)

System Image の画面が表示されます。
重要なのは右下、 **「Install Intel HAXM for better emulation performance」** の表示です。
これが表示されているということは、PC に HAXM がインストールされていないので、その下にある **「Download and Install HAXM」** をクリックします。

![](/img/posts/making_android_haxm_emulator_c.png)

「Download and Install HAXM」をクリックすると、Emulator Settings の画面になります。
特に設定は変えずに「Next」を押します。

![](/img/posts/making_android_haxm_emulator_d.png)

HAXM のインストールが完了しました。
Finish で一旦画面を閉じて、再び「Create Virtual Device」をクリックします。

![](/img/posts/making_android_haxm_emulator_e.png)

再び System Image の画面です。
右下の、 「Install Intel HAXM for better emulation performance」 が消えているのがわかります。

さて下ごしらえができた所で、実際にエミュレータを作っていきましょう。
試しに「Marshmallow」の「x86_64」を選択して「Next」をクリックします。
（上の方の Release Name が ``null`` になってるの、なんででしょう？）

![](/img/posts/making_android_haxm_emulator_f.png)

Android Virtual Device の画面です。
特に設定を変更せず、「Next」をクリックします。

![](/img/posts/making_android_haxm_emulator_g.png)

はい、HAXM のインストールと、それを使用したエミュレータが作成されました。
「実行」ボタンをクリックして、起動してみましょう。

![](/img/posts/making_android_haxm_emulator_h.png)

起動して動かしてみた画面です。アニGIFなのでうまく伝えられてないかもですが、普通の Android エミュレータよりは全然速いです。

![](/img/posts/making_android_haxm_emulator_03.gif)

ということで、 Android Studio を使うと、もはや「普通の手順で」作られるエミュレータが、高速な HAXM エミュレータになっています。

## Xamarin Studio や Visual Studio for Mac からも使えます

作成したエミュレータは、もちろん Xamarin Studio や Visual Studio for Mac からも使えます。

下図は Visual Studio for Mac で、 Xamarin.Android のプロジェクトを実行するところですが、Android Studio で先ほど作成したエミュレータが選択肢に出てきます。

![](/img/posts/making_android_haxm_emulator_i.png)

## まとめ

Android Studio でエミュレータを作ると、ちょっと面倒な HAXM のインストールもウィザードに沿ってできて、高速エミュレータが簡単に作れるよ。

（自分が使ってる Android Studio がまだ v1.4 だったという盛大なブーメランｗｗ けどウィザードの画面はだいたい今も同じだから。）