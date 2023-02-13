---
templateKey: blog-post
title: VB.NET でパスワード付き共有フォルダにファイルをコピーする
date: 2016-12-10T00:00:00.000+09:00
tags:
  - VisualBasic
---
[Visual Basic Advent Calendar 2016](http://qiita.com/advent-calendar/2016/vb) 10日目です。
「ユーザー／パスワードが必要な共有フォルダにファイルをコピーしたい」という要件がありまして。なぜかそれが Visual Basic のプログラムだったので参加してみました。

<!--more-->

「.NET Framework で用意されてるだろ」と思ったら無くて、「nuget か OSS のライブラリがあるだろ」と探してみても見つからず。

まさかこんな事の為に、今 Win32 API を Declare することになろうとは夢にも思いませんでした。

ググって見つかったサンプルコード達は、対象環境が古いのか微妙に定義が違うのかうまく動かないものが多かったので、 **動いた** コードを載せておきます。

```vbnet
'' NetWorkModule.vb
Namespace SomeNameSpace
    Public Module NetWorkModule

        Public Declare Unicode Function WNetAddConnection2 Lib "mpr.dll" Alias "WNetAddConnection2W" (
        ByRef lpNetResource As NETRESOURCE, ByVal lpPassword As String, ByVal lpUserName As String, ByVal dwFlags As Integer) As Integer

        Public Declare Function WNetCancelConnection2 Lib "mpr.dll" Alias _
            "WNetCancelConnection2W" (ByVal lpName As String,
                                      ByVal dwFlags As Integer,
                                      ByVal fForce As Integer) As Integer

        Public Const RESOURCE_CONNECTED As Integer = &H1
        Public Const RESOURCETYPE_ANY As Integer = &H0
        Public Const RESOURCEDISPLAYTYPE_SHARE As Integer = &H3
        Public Const CONNECT_UPDATE_PROFILE As Integer = &H1
        '
        <StructLayout(LayoutKind.Sequential, CharSet:=System.Runtime.InteropServices.CharSet.Unicode)>
        Public Structure NETRESOURCE
            Public dwScope As Integer
            Public dwType As Integer
            Public dwDisplayType As Integer
            Public dwUsage As Integer
            Public lpLocalName As String
            Public lpRemoteName As String
            Public lpComment As String
            Public lpProvider As String
        End Structure

        Public Function Copy(localPath As String, networkPath As String, userId As String, password As String) As String
            Dim result As Integer
            Dim myResource As NETRESOURCE
            myResource.dwScope = 2
            myResource.dwType = 1
            myResource.dwDisplayType = 3
            myResource.dwUsage = Nothing
            myResource.lpComment = Nothing
            myResource.lpLocalName = Nothing
            myResource.lpProvider = Nothing
            myResource.lpRemoteName = Path.GetDirectory(networkPath)

            Try
                '' なぜか Password が UserID より先！
                result = NetWorkModule.WNetAddConnection2(myResource, password, userId, 0)
                If result <> 0 Then
                    Return "ネットワークドライブに接続できませんでした status = " + result
                End If

                File.Copy(localPath, networkPath)

            Catch ex As Exception
                Return "ファイルのコピーに失敗しました " + ex.Message
            Finally
                NetWorkModule.WNetCancelConnection2(myResource.lpRemoteName, 0, True)
            End Try

            Return ""
        End Function
    End Module
End Namespace
```

``NetWorkModule.Copy("¥¥server¥path¥hoge.txt", "C:¥temp¥hoge.txt", "user", "pass")`` というように使います。

戻り値が ``String`` で空文字だったら成功、とかちょっとヒドい関数ですけど、まあ使えればいいかな。

他には、こんな情報も教えていただきました。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr"><a href="https://twitter.com/amay077">@amay077</a> アプリにもよりますが WNetAddConnection3 でユーザーID/パスワードを省略して必要に応じて自動的にダイアログボックスでユーザーID/パスワードをユーザーに入力させるやり方が一番オススメですよ。</p>&mdash; 道仂師＠S落ちシャープマーカー使い (@wraith13) <a href="https://twitter.com/wraith13/status/806157456682274816">2016年12月6日</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

## 久しぶりに VB を書いた感想

せっかくなので、久しぶりに VB を書いてみた感想を書いておきますね。（普段は C# ばかり書いています。 VB.NET より VB6 の方が昔たくさん書きました。）

### ラムダと（いうか匿名メソッド）使えるんだ

``hoge.Where(Function(h) h.IsHoge)`` と書けるんですね。果たしてどのくらいの人がVB で LINQ to Objects を使ってるのか分かりませんが。

### async/await もあるんだ

まさか使えると思ってなかったです（失礼）。

```vbnet
:
Async Sub HogeMethod()
    Await Task.Delay(1000)
    
    MessageBox.Show("hogehoge")
End Sub
```

### WithEvents と ReadOnly が併用できない

「イベントを受け取るイミュータブルなメンバ変数」を使いたいのだけど、

``````
Private ReadOnly WithEvents _hoge As Timer = New Timer()
```

と書けない。イベント受信を捨てるわけにはいかないので ReadOnly を諦めるしかない。。。

### 変数の型定義を省略すると？

``Dim h As Hoge = New Hoge()`` と書くところを、
``Dim h = New Hoge()`` と書けるので便利〜、と思っていたけど、どんな条件か ``h`` が ``Hoge型`` だと解決してくれないケースがあって…よく分かりません。

### 変数名 objHoge

C# だと 
``var hoge = new Hoge()`` みたく書くので、VB でも、
``Dim hoge = New Hoge()`` と書くと、変数は大文字小文字を **区別しない** ので NG。このような衝突を避けるために ``objHoge`` みたいなプレフィックスが有効だったりしたのかなあとちょっと思いました。

### private setter なプロパティには自動実装プロパティが使えない

C# だと

```csharp
public string Hoge { get; private set; }
```

と書けるやつ。VB での自動実装プロパティは

``````
Public Property Hoge As String
```

としか書けず、getter/setter 別々にアクセス修飾子を指定できない。。。普通のプロパティ構文をつかいました 。

## おわりに

とまあ、 VB へのグチになってしまった感はありますが、全体的にも C# に比べて VB の方がコードが長くなってしまうので、やっぱり C# の方がいいなあと思いました。

アプリ自体は WPF で、Prism というフレームワークを使いました。まさか VB + Prism の情報がネットにあるとは思っていなかったので大変お世話になりました。

まじめに、 Visual Basic が活きる場所はどこ？というのを聞いてみたいです。
それが習得容易性なら、プログラミング教育に VB は向いている？とか。

## 参考

* [WPF+Prism 5.0 でMVVMアプリを作る（前準備） - VB.NETで作る！](http://mk3008net.hatenablog.com/entry/2015/01/12/234030)
* [VB　.NET4.5 Async/Await Cheat Sheet - VB.NETで作る！](http://mk3008net.hatenablog.com/entry/2015/05/24/200135)
* [LINQの便利さに感動したのでその時のメモ - Qiita](http://qiita.com/hondasports8/items/7793f3d31dafe9cf49ba)
* [Auto-Implemented Properties (Visual Basic)](https://msdn.microsoft.com/ja-jp/library/dd293589.aspx?f=255&MSPPError=-2147217396)
