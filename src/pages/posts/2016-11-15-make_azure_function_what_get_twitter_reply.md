---
templateKey: blog-post
title: Azure Functions で Twitter のリプライを受け取る WebAPI を作ってみた
date: 2016-11-14T00:00:00.000+09:00
tags:
  - Azure
  - Node.js
  - azure-functions
  - JavaScript
  - vscode
---
BOT Framework とか使えよｗ というものですが、 Twitter の自動応答BOTをWebAPI化してみたかったんですね。

<!--more-->

## 作りたいもののイメージ

### リクエスト

``https://xxxx.azurewebsites.net/api/myfunc1?text=明日の天気は？``

### レスポンス

> 晴れのちくもり

## Azure Functions を作る

* [Create your first Azure Function - Microsoft Azure](https://azure.microsoft.com/ja-jp/documentation/articles/functions-create-first-azure-function/)

を参考に Javascript で作りました。
（C# で作ろうと思ったんだけど、作成直後にエラーが出たもので。そっちは [MSDNフォーラムに投げたら速攻で回答してもらえた](https://social.msdn.microsoft.com/Forums/ja-JP/91983eb4-d9e1-4183-a332-be3e576d7846/c-azure-functions-?forum=windowsazureja#91983eb4-d9e1-4183-a332-be3e576d7846) のでありがたかったけどね。）

```javascript
module.exports = function (context, req) {
    // https://apps.twitter.com から得るやつ
    var oauth = {
        consumer_key: 'xxxx',
        consumer_secret: 'xxxx',
        token: 'xxxx',
        token_secret: 'xxxx'
    };

    var botTwitterName = "@hoge"; // メンション投げるTwitterアカウント名
    var botTwitterId = 999999999; // メンション投げるTwitterアカウントID
    var senderTwitterName = "@my_twitter_account "; // 自分のTwitterアカウント名
    var noComment = ['…', 'Nothing', 'EMPTY']; // リプライが得られなかった時の代替テキスト(ランダムで選ばれる)
    var waitForReply = 1000; // メンション投げてリプライを取得するまでの待ち時間

    if (!(req.query.text || (req.body && req.body.text))) {
        context.error('error! text no found');
        var res = {
            status: 200,
            body: noComment[0]
        };
        context.log("reply message:" + JSON.stringify(res));
        context.done(null, res);
        return;
    }

    var request = require('request');
    var rp = require('request-promise');

    // 会話相手との会話が以前にあったら、その続きにするために過去のツイートを取得する。
    var getLatestReplyUrl = 'https://api.twitter.com/1.1/statuses/mentions_timeline.json?count=10';
    rp({url:getLatestReplyUrl, oauth:oauth, json:true})
    .then(mentions => {
        
        // 自分の mention 群に会話相手からの投稿があったら、そのツイートIDを得る
        var latestRepId = null; 
        for (var i = 0; i < mentions.length; i++) {
            var men = mentions[i];
            if (men.user.id == botTwitterId) {
                latestRepId = men.id_str;
                break;
            }    
        }

        var formData = {"status":botTwitterName + " " + req.query.text};
        if (latestRepId != null) {
            formData["in_reply_to_status_id"] = latestRepId;
        }

        var options = {
            url: 'https://api.twitter.com/1.1/statuses/update.json',
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            json: true,
            oauth: oauth,
            include_rts: false,
            form: formData
        };
        
        return rp(options); // tweet
    })
    .then(r => {
        context.log("tweeted.res:" + JSON.stringify(r));
        return sleep(waitForReply).then(_ => r);
    }) // wait
    .then(r => { // get reply
        var getRepUrl = 'https://api.twitter.com/1.1/statuses/mentions_timeline.json?count=5&since_id=' + r.id;
        // var getRepUrl = 'https://api.twitter.com/1.1/statuses/mentions_timeline.json?count=10';
        return rp({url:getRepUrl, oauth:oauth, json:true})
        .then(mentsions => {
            context.log("get mentions." + JSON.stringify(r));
            var reply = {text:getNoComment()};
            mentsions.forEach(function(men) {
                if (men.in_reply_to_status_id == r.id) {
                    reply = men;
                }
            }, this);

            context.log("get reply." + JSON.stringify(reply));
            var res = {
                status: 200,
                body: reply.text.replace(senderTwitterName, "")
            };
            context.log("reply message:" + JSON.stringify(res));
            context.done(null, res);
        })
    })
    .catch(err => {
        context.error('error!:' + err);
        var res = {
            status: 200,
            body: noComment[0]
        };
        context.log("reply message:" + JSON.stringify(res));
        context.done(null, res);
    });

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    function getNoComment() {
        return noComment[Math.floor( Math.random() * noComment.length )];
    }
};
```

## やっている事


1. 自分の過去のメンション群を取得して、相手との会話があったら、その会話の続きとするようにツイートの ID を得る
2. 相手にメンションをツイートする（1. で ID 取れてたら ``in_reply_to_status_id `` に設定する）。投稿したツイートの ID を得ておく。
3. ｎ秒待つ
4. もう一度自分の過去のメンション群を取得する。検索パラメータに投稿時のツイートIDを指定して、投稿より未来のリプライしか得ないようにする。
5. メンション群から投稿時のツイートIDを ``in_reply_to_status_id`` に持つツイートを検索する。
6. それがリプライのツイートなので、レスポンスでその ``text`` を返す。

## 使用技術

node.js でまともなプログラムを作るのは初めてでした。
次の npm モジュールにお世話になりました。

* [request](https://www.npmjs.com/package/request)
* [request-promise](https://www.npmjs.com/package/request-promise)

特に ``request`` を使用した Twitter API の使い方は、

* [Node.jsでのTwitterタイムライン取得方法 - りぷろぐ](http://ripplation.co.jp/blogs/tech/archives/196)

を参考にさせてもらいました。

### その他Tips

#### Azure Functions への npm install の仕方

* [Azure Functions NodeJS 開発者向けリファレンス - Microsoft Azure](https://azure.microsoft.com/ja-jp/documentation/articles/functions-reference-node/#node)

の手順に沿うと、ブラウザ上で Terminal が使えるので、そこで ``npm install request-promise`` などとできます。``package.json`` ？、まだよく知らないです。

#### ローカルでの node.js の開発環境

Mac と Visual Studio Code を使いました。

* [Visual Studio CodeによるNode.jsのデバッグ（その１） - Developers.IO](http://dev.classmethod.jp/server-side/vscode-nodejs-1/)

がとても参考になりました（インテリセンスを使うための設定はしませんでした）。

はじめは C# でやろうと思ったけど、こういうのは Javascript の方がちゃちゃっと作れてよいですね。お互い適材適所だなーと思いました。

(今のところトライアルだけど Azure Functions の課金ってどうなるのかな？)
