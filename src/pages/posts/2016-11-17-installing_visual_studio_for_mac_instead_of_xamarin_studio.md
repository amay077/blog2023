---
templateKey: blog-post
title: Xamarin Studio をアンインストールして Visual Studio for Mac(Preview) をインストールする
date: 2016-11-17T00:00:00.000+09:00
tags:
  - Xamarin
---
Visual Studio for Mac(Preview) のインストール、失敗にもいろいろあるようですが、私の場合、インストーラを実行すると、しばらくして以下の画面が表示されてしまうというケースでした。

<!--more-->

![](/img/posts/install_failed_vs_for_mac_01.png)

これの原因が本当によくわからなくて、

* Xamarin Studio のアンインストール
* Mono のアンインストール
* Android SDK の削除

とかいろいろやってみたけど症状変わらずでした。

改めて、ディスクの中に Xamarin 関係の残骸が残っていないかチェックしてみると、 ``/Developer/MonoAndroid`` にシンボリックリンクを発見！「おまえかー！」と叫びながらそれを削除。

さらにアプリケーションの中に

* Xamarin Workbooks
* Xamarin Inspector

なども残ってました。

そして何度目かのインストーラ実行…ついに…


![](/img/posts/install_failed_vs_for_mac_02.png)

インストールできたぁ！

## まとめ

Xamarin Studio をアンインストールして、Visual Studio for Mac をクリーンインストールするには、

1. [Uninstalling Xamarin - Xamarin](https://developer.xamarin.com/guides/cross-platform/getting_started/installation/uninstalling_xamarin/) に従って、Xamarin Studio をアンインストールする（``./xamarin_uninstall.sh`` が便利ですぞよ）
2. Xamarin Workbooks とか Inspector とか、「Xamarin関連の」アプリが残ってないかチェックしてそいつらも消す
3. [Xamarinをアンインストール後、関連ファイルを手動で削除した（Mac OS X）](http://qiita.com/gayou/items/3919b567c226e155cb1c) に沿って、残骸を探して消す（私が見つけるのに苦労した ``/Developer/MonoAndroid`` も載ってます）

でOKなはずです。 

この状態で Visual Studio for Mac をインストールしてみましょう。

ちなみに Android SDK は削除しなくて OK です。ディスク内に Android SDK が入っている場合は、 Visual Studio のインストール時にそれを選択することもできます。

さあ、 Mac で Visual Studio 生活、はじめましょうか。