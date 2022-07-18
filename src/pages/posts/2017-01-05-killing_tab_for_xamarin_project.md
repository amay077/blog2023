---
templateKey: blog-post
title: Xamarin Studio(Visual Studio for Mac)で tab を絶対殺す設定
date: 2017-01-05T00:00:00.000+09:00
tags:
  - Xamarin
  - Git
  - VisualStudio
---
インデントは space4 派です。

インストールした直後の Xamarin Studio や Visual Studio for Mac の設定だと、インデントが tab になっています。
<!--more-->

この状態で開発を始めてしまうと、意図せず tab がコードに挿入され、リポジトリに push してしまい、 [github で見た時に初めて気づき](https://github.com/nuitsjp/Xamarin.Forms.GoogleMaps.Bindings/commit/8399c57a6d83b291116be0e588ecca88405d4182#diff-5a747f9189b02ce61af4958a513f30f6) ヽ(｀Д´#)ﾉ ﾑｷｰ!! となるので、早めに手を打ちましょう。

## 第一の砦: Xamarin Studio のユーザー設定

できればインストールした直後にやっておきたい設定。
そもそもこの既定の設定値が Visual Studio for Win と異なるからいろいろ不幸が起こると思われ。

メニュー -> Xamarin Studio -> ユーザー設定 で「ユーザー設定」画面を起動し、ソースコード -> コードの書式設定 -> C# ソースコードを選択し、以下のように、

* タブ幅、インデント幅を 4 に
* タブをスペースに変換 にチェックを入れる

![](/img/posts/definitely_kill_tab_for_Xamarin_studio_01.png)

と設定します。（ポリシーで **Visual Sutdio** を選択すればいいんじゃん！）

## 第二の砦: ソリューション/プロジェクトの設定

ソースコードの書式設定が、ソリューションまたはプロジェクト毎にされている場合、第一の砦を突破される可能性があります。

ソリューションまたはプロジェクトを右クリックして、オプションを選択し、先ほどと同じように ソースコードの書式設定 を見直します。

![](/img/posts/definitely_kill_tab_for_Xamarin_studio_02.png)

Windows と Mac で共同作業する場合は、プロジェクト作成時に、この設定を明示的に行っておくのがよいと思います。

## 最後の砦: git のコミット時に tab を space に変換する設定

Xamarin Studio やプロジェクトの設定だけでは不安な場合は、最後の砦として、git のコミット時に tab を空白に変換してしまいましょう。

* [git で commit 時にホワイトスペースや改行コードを自動的に変換する - hogeblr](http://hogeblr.tumblr.com/post/49260745404/git-%E3%81%A7-commit-%E6%99%82%E3%81%AB%E3%83%9B%E3%83%AF%E3%82%A4%E3%83%88%E3%82%B9%E3%83%9A%E3%83%BC%E3%82%B9%E3%82%84%E6%94%B9%E8%A1%8C%E3%82%B3%E3%83%BC%E3%83%89%E3%82%92%E8%87%AA%E5%8B%95%E7%9A%84%E3%81%AB%E5%A4%89%E6%8F%9B%E3%81%99%E3%82%8B)
* [Can git automatically switch between spaces and tabs? - Stack Overflow](http://stackoverflow.com/questions/2316677/can-git-automatically-switch-between-spaces-and-tabs)

### 1. homebrew で coreutils を入れる

Terminal で、

``brew install coreutils``

を実行します。
homebrew が入っていない場合は、

* [Mac の開発を便利にするパッケージ管理ソフト Homebrew のインストール手順 ｜ WEB ARCH LABO](http://weblabo.oscasierra.net/homebrew-1/)

などを見て先にインストールしてください。

### 2. tab を space に変換するフィルタを作成

Terminal で、

``git config --global filter.tabspace.clean 'expand -t 4'``

を実行します。
これは、 「"tabspace" という名前のフィルターを作成する」という意味です。``--global`` を付けていますが、個別のローカルリポジトリにのみ適用する場合は ``--local`` として、ローカルリポジトリのディレクトリで実行してください。尚、この設定はリモートへは適用されません。

### 3. .gitattributes にフィルタを適用する拡張子を設定

ローカルリポジトリに ``.gitattributes`` というテキストファイルを作成し、以下を追記します。

```
*.cs filter=tabspace
```

「2 で作成したフィルタ "tabspace" を、拡張子 *.cs に適用する」という意味です。
``.gitattributes`` はリモートに送信されます。

### 4. ローカルリポジトリにフィルタを適用してあげる

Terminal で、

```
git rm -r --cached .
git add .
```

を実行します。
すべてのファイルを一旦キャッシュから削除して再追加してあげることでフィルタを適用します。（上記リンクでは ``git checkout HEAD -- **`` が紹介されてましたがうまくいかなかったんですよね。。）
リポジトリ内の *.cs ファイルに tab が含まれていた場合は、この操作で、それらのステータスが modified になり tab が space に変換されているでしょう。そのまま ``git commit`` すると、tab が space でコミットされます。

変更したファイルに tab があるとそれは space に変換されるし、テキストエディタで意図的に tab を挿入しても、space に変換されます。

## まとめ

さまざまな人がコミットするプロジェクトの管理者の立場で、 tab でなく space の使用をできるだけ強制したい場合は、

1. プロジェクト単位でコードの書式設定をしておく
2. ``.gitattributes`` をリポジトリに含める
3. ``git config --global filter.tabspace.clean 'expand -t 4'`` を作業Macで実行してもらう

が現状ですぐに採用できる対策かと思います。

1 をしないと、各作業者の環境の設定値が適用されてしまうので、明示的に設定した方が良いと思います。

git の filter は ``--global`` だと複数のリポジトリで衝突する可能性があるので、 ``--local`` の方が無難とも思います。
