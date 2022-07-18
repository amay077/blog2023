---
templateKey: blog-post
title: Jekyll で作ったブログを Google AMP に対応させた
date: 2017-02-03T00:00:00.000+09:00
tags:
  - AMP
  - Google
  - Markdown
  - jekyll
---
自分のブログは Jekyll を使って Markdown から生成し、それを GitHub pages でホストしている。
GitHub 側でのページ生成はしてなくて、ローカルで Jekyll を実行して、その結果を push している。

<!--more-->

特につよい興味があったわけでもないけど、 Jekyll のテーマに AMP 対応をうたうものがあったから使ってみたら、それだけではダメで、いろいろ四苦八苦した（してる）という事を書きます。

## Jekyll テーマ

* [ageitgey/amplify: A Jekyll html theme in the vague style of Medium.com built using Google AMP](https://github.com/ageitgey/amplify)

という AMP 対応とされるテーマを使っている。

``<html lang="en">`` になってたので、 ``<html lang="ja">`` に直したりした。
テンプレートのタグは AMP 対応になってたので、まあ便利、余計なプラグインなどは入ってなくてシンプルなのもよい。

## 画像

AMP では、``<amp-img>`` というタグを使わないといけなくて、しかも ``width`` と ``height`` が必須だと言う。
Markdown から HTML の変換は ``<img>`` タグを出力するので、その結果を ``<amp-img>`` に置換するようにしたが、Markdown では画像のサイズは指定できない。
Markdown の方言でサイズが指定できるものもあるようだが、書きたくないし。

仕方がないので、Markdown から変換された HTML のタグを置換しつつ、画像を読み込んで縦横のサイズを取得し、 ``<amp-img width=? height=? `` に変換するツールを作った。
なぜか Mono 製ｗ

* [amay077/AmpImgnizer: img タグを amp-img タグに置換する mono コンソールアプリ](https://github.com/amay077/AmpImgnizer)

ビルドしてできた ``AmpImgnizer.exe`` を以下のようにして使う。

```bash
find $(pwd) -type f -name "*.html" -print | xargs -0 mono ../AmpImgnizer/AmpImgnizer.exe
```

相対URLと絶対URL、あと SVG にも対応してたりするし、一度サイズを取得したら、そのURLをキーにキャッシュして、時間は画像を読み直さず処理するようになっている。
（副次的な効果として、 404 な画像を発見できる。）

Markdown から生成された HTML を対象にしているので、 HTML パーサなんぞは使ってなくて、テキストとして1行ずつ回していくテキトーな実装。
でもこれで十分使えてる。

## ツイートの貼り付け

自分や誰かのツイートをブログに貼り付ける時、 Twitter の Webサイトから生成できるスクリプトをそのまま貼り付けるのが楽で使っている。
そのタグはこう↓

```html
<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">うおおおお！ <a href="https://twitter.com/hashtag/jxug?src=hash">#jxug</a> <a href="https://t.co/lc7x6vaNWl">pic.twitter.com/lc7x6vaNWl</a></p>&mdash; これがあめいの選択だよ (@amay077) <a href="https://twitter.com/amay077/status/802320470204788737">2016年11月26日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
```

が、 AMP は外部のスクリプトを実行できないので、 ``<script>`` タグは使えない。

ツイートを埋め込むためには、 [amp-twitter](https://www.ampproject.org/ja/docs/reference/components/amp-twitter) という "許可された" スクリプトを定義し、 ``<amp-twitter>`` タグを使う必要がある。

いちいちこのタグを書くのも面倒だし、AMP が廃れて使えなくなった時も考えて、オリジナル(Markdown)は Twitter 公式の埋め込みにしておきたい。

なので、これも前述の ``AmpImgnizer`` で変換した。
上の ``<blockquote 〜 /script>`` は、以下のように変換される。

```html
<amp-twitter data-tweetid="802320470204788737" width="800" height="600" layout="responsive" ></amp-twitter><!-- うおおおお！ <a href="https://twitter.com/hashtag/jxug?src=hash">#jxug</a> <a href="https://t.co/lc7x6vaNWl">pic.twitter.com/lc7x6vaNWl</a> by @amay077 -->
```

こっちもテキトーな実装なので、変換出来ないケースがあるかも。

## 広告

Amazon の広告を各ページに配置している。もともとの広告タグは ``<iframe>`` だが、AMP では ``<amp-iframe>`` を使う必要がある。

これはもともと 

* [Jekyllでamazonアソシエイトリンクを作るためのgem ”jekyll-amazon”](http://okzk.org/blog/jekyll-amazon-gem)

を使っていたので、そのソースを少し改造して ``<amp-iframe`` を吐くようにした。結果は以下のようなものだ。

```html
<amp-iframe src="https://rcm-fe.amazon-adsystem.com/e/cm?t=oku2008-22&o=9&p=48&l=st1&mode=books-jp&search=Xamarin%7C%E5%8B%89%E5%BC%B7%E4%BC%9A&lt1=_blank&lc1=469AF6&bg1=FFFFFF&f=ifr" width="728" height="90" frameborder="0" scrolling="no"></amp-iframe>
```

## DISQUS

コメントシステムに [DISQUS](https://disqus.com/) を採用している。

* [Disqus now compatible with Google AMP](https://blog.disqus.com/disqus-now-compatible-with-google-amp)

ってことで「Disqus も AMP 対応したぜ！」って言ってるけど、実体は ``<amp-iframe`` を使っているだけだ。
しかも amp-iframe の src に指定するコンテンツは自分でホストしなければならない。ちょっと面倒だったので、

* [Supporting Disqus in AMP](http://dangoldin.com/2016/09/13/supporting-disqus-in-amp/)

で Dan Goldin さんが使用している s3 を間借りしちゃってる、怒られたら謝る。

## CSS とか Analytics

これらは何も特殊なことはしてなくて、CSS はリンクせずに各ページに Jekyll で埋め込んじゃってる。

```html
  <!--head.html-->
  <style amp-custom>
  ｛％ capture include_to_scssify ％｝
    ｛％ include styles.scss ％｝
  ｛％ endcapture ％｝
  ｛｛ include_to_scssify | scssify ｝｝

  ｛％ include syntax.css ％｝
  </style>
```

シンタックスハイライトに使う CSS も毎ページに埋め込まれてるので、冗長と言えば冗長。

Google Anaytics は、 ``</amp-analytics>`` を使ってる。

## ビルドとデプロイ

下のような感じで、 Jekyll でビルドした後、例の AmpImgnizer で img と twitter を変換して、サイトに push してる。

```bash
jekyll build
cd _site
git add .
git commit -m "site update"
find $(pwd) -type f -name "*.html" -print | xargs -0 mono ../AmpImgnizer/AmpImgnizer.exe
git add .
git commit -m "replace img to amp-img"
echo "press enter to deploy"
read
git push
cd ..
```

## まとめ

ここまで対応して、ほとんどのページを AMP 対応にする事ができた。
2017/2/3現在では、まだ AMP として認識されているページは少ないけど、放っておけば更新されてくのかな？

AMP 対応した方が SEO 的にも効く、との情報もあるけど、まあそのへんは期待してないです。

何の役にたつかわからないけど、このサイトの Jekyll プロジェクトと、github page のリポジトリは以下です。

* [amay077/blog.vNext](https://github.com/amay077/blog.vNext)
* [amay077/amay077.github.com: My blog powered by jekyll.](https://github.com/amay077/amay077.github.com)
