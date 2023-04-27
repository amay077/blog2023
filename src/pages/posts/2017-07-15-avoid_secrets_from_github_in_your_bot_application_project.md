---
templateKey: blog-post
title: Bot Application のソースコードを GitHub で公開する時に秘匿情報を含めない方法
date: 2017-07-15T00:00:00.000+09:00
tags:
  - bot-framework
  - csharp
  - dotnet
  - asp-dot-net
  - visual-studio
---
別に Bot Application に限った話ではないのですけどね。
<!--more-->

Microsoft の Bot Framework を使った Bot Application の作成方法は、いくつかWebで公開されていますが、それらに沿って作成したソースコードを GitHub などの誰でも閲覧できるリポジトリで管理・公開すると、本来公開すべきでない以下の情報が含まれてしまいます。

* Bot Directory へ登録する際に発行される「Bot ID」, 「App ID」, 「App Password」
* Azure へ発行する際の設定情報

これらをソースコード管理に含めないようにする方法を紹介します。

## 「Bot ID」, 「App ID」, 「App Password」 をソースコード管理に含めないようにする

たとえば、

* [5ステップでズバリ！笑顔判定BOT を作成しよう by Microsoft Bot Framework and Cognitive Services – 青い空の向こうへ](https://blogs.msdn.microsoft.com/bluesky/2016/11/15/5-step-tutorial-smilescorebot-bot-framework-cognitive-services-ja/)

では、BotのIDやパスワードなどを、``Web.config`` の ``<app key="BotId"`` などに設定するよう書かれています。
実際プロジェクト作成直後の ``Web.config`` を見ても "YourBotID" などと書かれており、「ここに書くのが当然」感を醸し出しています。これがよくない！

```xml
<!-- Web.config -->
<configuration>
    <appsettings>
    <!-- update these with your BotId, Microsoft App Id and your Microsoft App Password-->
    <add key="BotId" value="YourBotID" />
    <add key="MicrosoftAppId" value="" />
    <add key="MicrosoftAppPassword" value="" />
    </appsettings>
: (略)
```

``Web.config`` 及び ``Web.Debug.config``, ``Web.Release.config`` は、 ASP.NET の Webアプリケーションに関する設定を記述するもので、ソースコード管理に含めるべき情報です。
**ここにIDやパスワードを記述してはいけません**

ではどこに記述するかというと、

* [ASP.NET Web アプリで、APIキーなどの "秘密のキー" をどこに保存するべきか? : @jsakamoto](http://devadjust.exblog.jp/20400427/)

で紹介されている方法を使って、別のファイルに逃します。

具体的には、

1. 新たに ``Web.local.config`` というファイル（ファイル名は何でもよい）をプロジェクトに追加し、秘匿情報を含む XML のブロックはそちらに記述する
2. ``Web.config`` に上記ファイルへの参照を記述する

とします。

``Web.local.config`` は、 ``Web.config`` などと同じディレクトリに追加し、ビルドアクションを「コンテンツ」とします。

![](/img/posts/avoid_secrets_from_github_in_your_bot_application_project_01.png)

``Web.local.config`` の内容は以下です。

```xml
<!-- Web.local.config -->
<appSettings>
  <add key="BotId" value="＜あならのBOTID＞" />
  <add key="MicrosoftAppId" value="＜あなたのMicrosoftAppId＞" />
  <add key="MicrosoftAppPassword" value="＜あなたのMicrosoftAppPassword＞" />
</appSettings>
```

``Web.config`` に記述していた ``<appSettings>`` 要素を切り出してきた感じですね。

そして、 ``Web.config`` を次のように修正します。

```xml
<!-- Web.config -->
<configuration>
  <appSettings file="Web.local.config">
    <!-- 秘匿でない設定情報があればここに書く -->
  </appSettings>
: (略)
```

``<appSettings file="Web.local.config">`` と記述することで、``Web.local.config`` の内容をここに注入できます。

あとは ``Web.local.config`` を ``.gitignore`` に追加するなどしてソースコード管理対象から除外します。
``Web.local.config`` が存在しなくてもビルドや実行はできるようですが、初見の人には不親切なので、 ``README.md`` で補足説明をしておくのがよいでしょう。

## 開発用とプロダクト用で 「Bot ID」, 「App ID」, 「App Password」 を切り替える

前の手順で設定したID、パスワードなどは「開発用」の情報です。
Azureに配置した本番環境では、別のID、パスワードを使用したいケースは普通にあります。
本番環境の設定はAzureポータルから行えます。

![](/img/posts/avoid_secrets_from_github_in_your_bot_application_project_02.png)

この図のように、

1. Azure ポータル（https://portal.azure.com/） で、配布した Bot Application（App Service） を開き、さらに「アプリケーション設定」を開きます
2. 「アプリ設定」で、 本番用の「Bot ID」, 「App ID」, 「App Password」を追加します
3. 最後に「保存」を押します

ここで設定した内容は、配布した ``Web.config`` にある ``<appSettings>`` の内容を上書きします。

## Azure へ発行する際の設定情報をソースコード管理に含めないようにする

Visual Studio 2017 は、IDE から Azure への発行ができてとても便利なのですが、発行のための情報も保持してしまうので、その際の情報もソースコード管理に含めるべきではありません。

![](/img/posts/avoid_secrets_from_github_in_your_bot_application_project_03.png)

これらの情報はプロジェクトのディレクトリの ``Properties\PublishProfiles`` というサブディレクトリに、 ``*.pubxml``, ``*.pubxml.user`` というファイル名で保存されるようなので、このディレクトリ毎、あるいは個別のファイルを ``.gitignore`` に追加すればよいです。

## まとめ

* ``Web.config`` には秘匿情報を書かない
* ``Web.local.config`` を作って、そちらに書く、このファイルはソースコード管理しない
* 本番用のIDやパスワードはAzureポータルで設定する
* Azureへ発行する際の設定情報もソースコード管理しない

結果、 ``.gitignore`` に次の２行を追加するとよいです。

```bash
# .gitignore
＜省略＞

*.local.config
PublishProfiles/
```

手前味噌ですが、上記以外の ``.gitignore`` の設定は https://www.gitignore.io/ で "VisualStudio" と検索して生成されるものを使用すると便利です（上の2行が含まれているわけではありません）。
