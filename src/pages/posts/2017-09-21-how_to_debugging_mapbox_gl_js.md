---
templateKey: blog-post
title: Mapbox GL JS をデバッグするまで
date: 2017-09-21T00:00:00.000+09:00
tags:
  - mapbox
  - JavaScript
  - geo
---
オープンソースのベクトル地図ライブラリ Mapbox GL JS のデバッグがしたいので調べました。

<!--more-->

## Mapbox なにそれ？

* Google Maps JavaScript API みたいなもん
* こういうの → [Display a map / Mapbox](https://www.mapbox.com/mapbox-gl-js/examples/)
* 要は地図を表示・操作するためのオープンソース JavaScript ライブラリ
* 類似のライブラリとして OpenLayers, leaflet などがある
* 上記との違いは「ベクトルタイル」を「WebGL」で描画するものであるということ
* "GL" とは WebGL を差しており、姉妹ライブラリとして Mapbox GL Native がある（こちらはモバイルやデスクトップの "ネイティブ" アプリ用であり、OpenGL を使用している）。

つまり、 Google Maps JavaScript API 以外の方法で、Google Maps のようなベクトル地図レンダリングをしたければ、Mapbox GL JS を使うのが現在の事実上唯一の方法である。

## 何をしらべたいの？（あるいは何を調べてないの？）

* ライブラリの使い方は調べてない（ってか Google Maps とそんなに変わらないはず）
* Mapbox GL JS の（非同期な）地図データ取得の仕組み
* Mapbox GL JS の高速な描画の仕組み

今回は、その足がかりとして、Mapbox GL JS のデバッグ環境を作ります。

## 調べたわたしは

* JavaScript 力はあんまりない
* WebGL やったことない
* OpenGL もない
* Mapbox GL Native のソースを追ってみたが C++14 が分からずあきらめた

大丈夫か・・・？

## デバッグ環境を作る

### 用意するもの(というか私の環境)

* https://github.com/mapbox/mapbox-gl-js のローカルクローン
* macOS
* Xcode（入ってた)
* homebrew
* yarn とかいうやつ（homebrew で入れる）
* node.js(v4.0以上)
* Visual Studio Code (デバッグするのに使う。VSCodeと略すかも)
* Debugger for Chrome (Visual Studio Code の拡張機能)

すでに「yarn って何？」というレベルです・・・。

### デバッグ環境を作る手順1(mapboxのセットアップ)

https://github.com/mapbox/mapbox-gl-js/blob/master/CONTRIBUTING.md に丁寧に書いてあることの写しだけど。

1. Xcode Command Line Tools を入れる(入ってた。けど一度 Xcode を起動て License に agree しないといけなかった）
2. ``brew install node`` で node をインストール（以前 anyenv/ndenv で入れてあったので余裕）
3. ``brew install yarn`` で yarn というやつを入れる
4. ``cd mapbox-gl-js`` でクローンしたリポジトリに移動して、 ``yarn install`` で何かをインストールする（何？）
5. https://www.mapbox.com/studio/account/tokens/ で、 Mapbox の API キーを生成する。Mapbox アカウントがなければ同じく作る
6. [Serving the Debug Page](https://github.com/mapbox/mapbox-gl-js/blob/master/CONTRIBUTING.md#serving-the-debug-page) にあるように ``MAPBOX_ACCESS_TOKEN=pk.iEkc36fR… yarn run start-debug`` を実行する

んでブラウザで http://localhost:9966/debug にアクセスすると、地図が表示されるはずである。

この状態で、 Chrome のデベロッパーツールでデバッグできるけど、効率上げるために Visual Studio Code を使う。その手順が以下。

### デバッグ環境を作る手順2(VSCodeのセットアップ)

* [Visual Studio Codeを使いこなせ！ Chromeと接続してJSをデバッグする方法 - ICS MEDIA](https://ics.media/entry/11356)
* https://github.com/Microsoft/vscode-chrome-debug#launch

を参考に。

1. VSCode で mapbox-gl-js のフォルダを開く
2. メニュー → デバッグ → 構成の追加 とすると ``.vscode/launch.json`` が生成されるので、下記の ``launch.json`` のように記述する
3. 前述の ``MAPBOX_ACCESS_TOKEN=pk.iEkc36fR… yarn run start-debug`` をしたまま、VSCode のメニュー → デバッグ → デバッグの開始（F5 でもおｋ）すると、新しいタブに地図が表示される。

```json
// launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome against localhost",
            "url": "http://localhost:9966/debug/",
            "webRoot": "${workspaceRoot}"
        }
    ]
}
```

![how_to_debugging_mapbox_gl_js_01.png](/img/posts/how_to_debugging_mapbox_gl_js_01.png)

### 試しにデバッグしてみる

``src/render/draw_line.js`` の 14行目あたりにブレークポイントを置いてみる（F9 で）。F5 でデバッグ開始する。

地図が表示される過程でブレークポイントで一時停止し、その箇所の「変数」「ウオッチ」「コールスタック」などが見られる。下図は、 ``drawLine`` 関数の ``coords`` 変数の中身を表示しているところ。描画するラインの頂点が確認できる。

![how_to_debugging_mapbox_gl_js_02.png](/img/posts/how_to_debugging_mapbox_gl_js_02.png)

ちなみに、この ``drawLine`` 関数をスキップ（すぐに ``return``）すると、次図のようにラインが描画されない地図になる。

![how_to_debugging_mapbox_gl_js_03.png](/img/posts/how_to_debugging_mapbox_gl_js_03.png)

「デバッグするまで」としてはこんな感じで。
