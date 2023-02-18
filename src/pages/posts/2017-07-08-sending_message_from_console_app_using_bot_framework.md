---
templateKey: blog-post
title: コンソールアプリからBot Frameworkを使ってBotからクライアントにメッセージを送る
date: 2017-07-08T00:00:00.000+09:00
tags:
  - .NET
  - BotFramework
  - csharp
  - skype
  - VisualStudio
---
[Microsoft の Bot Framework](https://docs.microsoft.com/en-us/Bot-Framework/index) を使った Botアプリケーションの開発にハマっています（楽しい方の意味で）。

<!--more-->

## 自作BotをAzureにデプロイしてSkypeで対話

まず、

* [Visual Studio2017でBot Frameworkを試す - Qiita](http://qiita.com/Shinji-Hashimoto/items/80515f26c5b07b71b600)
* [5ステップでズバリ！笑顔判定BOT を作成しよう by Microsoft Bot Framework and Cognitive Services – 青い空の向こうへ](https://blogs.msdn.microsoft.com/bluesky/2016/11/15/5-step-tutorial-smilescorebot-bot-framework-cognitive-services-ja/)
* [Microsoft Bot Frameworkを使ってSkypeボットを作る - dorapon2000’s diary](http://dorapon2000.hatenablog.com/entry/2016/09/04/031821)

このあたりの情報を元に、

* 簡単な Bot アプリをビルドして Botエミュレータで実行してみる
* その Bot を Azure にデプロイする
* Azure に配置した Bot を Skype と繋げる
* 自分の Skype アカウントと Bot で対話する

まで行うことができました。

![](/img/posts/my_first_bot_app_01.jpg)

## コンソールアプリから Skype のユーザー（クライアント）へメッセージを送信する

さて、私が本当にやりたいのは「定期的にBotからユーザーへメッセージを送る（時報とか）」ことです。
が、 Visual Studio の Bot Application のプロジェクトテンプレートでは?（あるいは「Botアプリケーション」では）、処理の起点は必ずユーザー(クライアント)からBotへのメッセージ送信をBotが受信するところから始まるようです（違ってたら教えてください）。

Bot Framework の REST API には [Send and receive messages](https://docs.microsoft.com/en-us/bot-framework/rest-api/bot-framework-rest-connector-send-and-receive-messages) もあるので、任意のタイミングでメッセージを送信することも可能なはず。

いろいろ探していたら

* [Starting a conversation with Microsoft bot builder and microsoft bot framework - Stack Overflow](https://stackoverflow.com/a/39274159/3309589)

という情報を発見。おお、コンソールアプリからメッセージを送信できれば、これをcron的なものやAzure Functionsで定期的に実行させられそうです。

コード例を元に悪戦苦闘した結果、下のようなコードでメッセージ送信ができました。

```csharp
// Program.cs
static void Main(string[] args)
{
    var serviceUrl = "https://smba.trafficmanager.net/apis/";
    var appId = "<APP_ID>";
    var appPassword = "<APP_PASSWORD>";

    MicrosoftAppCredentials.TrustServiceUrl(serviceUrl); // ※これがないと認証エラーになる
    var connector = new ConnectorClient(new Uri(serviceUrl), appId, appPassword);
    var botAccount = new ChannelAccount(id: "28:8734b597-b313-2457-bda6-d7c342245fea"); // 送信元(Botの)ユーザー ※IDは適当だけどこんな感じの文字列だった
    var userAccount = new ChannelAccount(id: "29:2WLwfakXxSbEze4gfeGxeS31nXfELePLX3deELoxHw"); // 送信先ユーザー ※IDは適当だけどこんな感じの文字列だった
    var res = connector.Conversations.CreateDirectConversation(botAccount, userAccount);

    IMessageActivity message = Activity.CreateMessageActivity();
    message.From = botAccount;
    message.Recipient = userAccount;
    message.Conversation = new ConversationAccount(id: res.Id);
    message.Text = "こんにちわ";
    message.Locale = "ja-Jp";
    connector.Conversations.SendToConversation((Activity)message);
}
```

以下、ポイント

* コンソールアプリプロジェクトを作ったら、ターゲットフレームワークを .NET Framework 4.6 に上げる（４．５ だと Bot.Builder が入れられなかった）
* Nugetパッケージマネージャから「Microsoft.Bot.Builder」を入れる（ここで入れたのは v3.8.0 です）
* ＜APP_ID＞、＜APP_PASSWORD＞は、Botを https://dev.botframework.com/ に登録する仮定で得られるやつ
* ``MicrosoftAppCredentials.TrustServiceUrl(serviceUrl)`` をしないと、``CreateDirectConversation`` で認証(401)エラーになりました。 [Bot Framework Unauthorized when creating a conversation (C#) - Codedump.io](https://codedump.io/share/43fLSEl1kzYX/1/bot-framework-unauthorized-when-creating-a-conversation) が大変役に立ちました。
* ``serviceUrl`` は、なんかよく分からんけどこれらしい
* ``serviceUrl``、 ``botAccount`` のId、 ``userAccount`` のIdは、[BotBuilder-Samples/CSharp/core-GetConversationMembers](https://github.com/Microsoft/BotBuilder-Samples/tree/master/CSharp/core-GetConversationMembers) も参考にして、Bot ApplicationのHelloWorldを改造して取得しました。

このプログラムを実行すると、 ``userAccount`` が示すSkypeユーザー(ここでは私)に「こんにちわ」のメッセージが送信されます、やった！

![](/img/posts/my_first_bot_app_02.png)

今作りたいと思っているのは「タイムカード打刻BOT」で、月末に EXCEL に退勤時間を書くのが面倒なので、毎日、18:00 になったら、Botに「仕事おわった？」と聞いて欲しいのです。「はい」と回答すればその時刻を打刻、「いいえ」と答えたら１時間後にまた聞いてくる・・・、という感じで（弊社は Skype 常時起動させてるから Skype で試してるけど Bot Connector により Slack などの別ツールにも対応できるはず）。

これを行うには、クライアント起点の対話でなく、BOT起点の対話が必要で、コンソールアプリからメッセージ送信することができたので、次はAzure Functionでやってみようかと思います。

BOT開発、しばらく楽しめそうです。
