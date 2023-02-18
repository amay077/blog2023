---
templateKey: blog-post
title: Mastodon のクライアントアプリを .NET Core で作ってみた
date: 2017-04-13T00:00:00.000+09:00
tags:
  - csharp
  - Mastodon
  - .NET
---
Mastodon という「自由で」「オープンソースな」（Twitter のような） SNS がなんか流行りだして、もともとあった [mastodon.cloud](https://mastodon.cloud/) や [@nullkal](https://twitter.com/nullkal) 氏が立てたインスタンス [mstdn.jp](https://mstdn.jp/) に日本人が多くあつまって祭りみたいになってる。

<!--more-->

* [ASCII.jp：Twitterのライバル？　実は、新しい「マストドン」（Mastodon）とは！｜遠藤諭のプログラミング＋日記](http://ascii.jp/elem/000/001/465/1465842/)

API ももちろんあって、 .NET 製の APIライブラリもあった。 @kagasu さん :ok_hand:

<blockquote class="twitter-tweet" data-lang="ja"><p lang="tl" dir="ltr">glacasa/Mastonet: C# Library for Mastodon<a href="https://t.co/BwR9n1Eqbd">https://t.co/BwR9n1Eqbd</a></p>&mdash; ♣ ♥ ♠ ♦🍍 (@kagasu) <a href="https://twitter.com/kagasu/status/852206484347912192">2017年4月12日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

で、試しにこの「[Musto.NET](https://github.com/glacasa/Mastonet)」を使って、 mastodon.cloud の連邦？タイムラインを表示するだけのコンソールアプリを作ってみた。

* [amay077/MastoConsoleNetStandard: Mastodon クライアントのサンプルコンソールアプリ for .NET Standard](https://github.com/amay077/MastoConsoleNetStandard)

API はとってもシンプルで、次のような単純なコードでTOOTのストリーミング受信ができる。

```csharp
static async void RunAsync(string email, string password)
{
    var instanceUrl = "mastodon.cloud";

    // MastodonClient.CreateApp で得たものを保存しとく必要があるけど面倒だから UnitTest(MastodonClientTests)のを使わせてもらった
    //var appRegistration = await MastodonClient.CreateApp(instanceUrl, "MastoConsoleStandard", Scope.Read);
    var appRegistration = new AppRegistration 
    {
        ClientId = "ぎっはぶをみてね",
        ClientSecret = "ぎっはぶをみてね"
    };

    var client = new MastodonClient(instanceUrl, appRegistration);
    var auth = await client.Connect(email, password);
    var streaming = client.GetPublicStreaming();

    // Register events
    streaming.OnUpdate += (_, e) =>
    {
        Console.WriteLine("--");
        Console.WriteLine($"{e.Status.CreatedAt.ToLocalTime().ToString()} - {e.Status.Account.AccountName}:");
        Console.WriteLine(e.Status.Content);
    };

    // Start streaming
    streaming.Start();
}
```

アプリは、まず mastodon のインスタンスに``MastodonClient.CreateApp``で「アプリを登録」して、``AppRegistration``を得る必要がある。
これは実際には ``ClientId`` と ``ClientSecret`` で、一度登録したら保存して使う。
mastodon の既定の実装では、特に制限なくすぐにレスポンスが返ってくるが、コードを変更してインスタンス管理者の承認制などにすることもできるのだろう。

そしてアプリの登録は mastodon のインスタンス毎に行わなければならないので、たとえば現在出回っているクライアントアプリは、 mastodon.cloud では使えるが mstdn.jp では使えない、ということもある。

「アプリをインスタンスに登録する」仕組みまで備えたクライアントアプリも作成可能で、[Amaroq for Mastodon](https://itunes.apple.com/us/app/amaroq-for-mastodon/id1214116200) というアプリはそのひとつだと[教えてもらった](https://mastodon.cloud/@fk2000/519030)。

mastodon のユーザーはインスタンス毎に違うので、そのインスタンスで作った email/password で ``connect`` する。
あとは、 ``OnUpdate`` でストリームを受信しておいて、 ``Start`` すればよい、と。

Masto.NET が .NET Standard に対応しているので、 .NET Standard な実行環境,
 Mac/Linux なら .NET Core がインストールされた環境なら動作する。

適切に責務分割された Twitter クライアントなら、それほど手間なく mastodon クライアントアプリになれるかも。
前述のとおり複数インスタンス対応は必要だけど。アプリが対応するインスタンスとその``ClientId`` と ``ClientSecret``の保存のために、サーバーサイド(mBaaS)が必要になると思う。

一応わたしもアカウントつくりました→ https://mastodon.cloud/@amay077
mstdn.jp にも作ったけど、メインはこっちで。頑張ってる人は [応援したい](https://mastodon.cloud/@login/508935) し [応援した](https://mstdn.jp/@nullkal/37086) 。
