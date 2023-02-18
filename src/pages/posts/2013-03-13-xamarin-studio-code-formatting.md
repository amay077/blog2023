---
templateKey: blog-post
title: Xamarin Studio でコード整形を Visual Studio っぽくする
date: 2013-03-13T00:00:00.000+09:00
tags:
  - Xamarin
  - csharp
---
Xamarin Studio の既定のコードフォーマットは、メソッド名の後ろにスペースが空いていてどうにも気に入らない。いろいろ設定をさばくって(方言)いたら見つかりました。

<!--more-->

既定のフォーマットはこちら

!["default_formatting"](https://blog.amay077.net/img/posts/xamarin_studio_formatting_default.png)

変更は、システムメニュー → Preference から。

!["default_formatting"](https://blog.amay077.net/img/posts/xamarin_studio_formatting_preference.png)

次に、ソースコード → コード フォーマッティング → C#ソースコード ときて、愛しの「Visual Studio」を選択！

!["default_formatting"](https://blog.amay077.net/img/posts/xamarin_studio_formatting_codeformatting.png)

変更が適用されるのは、新しいクラスを作った時から。

!["default_formatting"](https://blog.amay077.net/img/posts/xamarin_studio_formatting_vs.png)

既存のクラスは、メニュー → 編集 → フォーマット で整形しなおせばおｋ
