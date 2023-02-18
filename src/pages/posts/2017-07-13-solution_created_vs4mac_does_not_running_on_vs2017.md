---
templateKey: blog-post
title: Visual Studio for Mac で作ったプロジェクトを Visual Studio 2017 で実行する時気をつけること
date: 2017-07-13T00:00:00.000+09:00
tags:
  - Xamarin
  - VisualStudio
  - csharp
---
小ネタです。
<!--more-->

Xamarin でのモバイルアプリ開発では、 Mac の方が（主に iOS 関連で）都合がよいことが多いので、Visual Studio for Mac を使っています。

そんなわけなので新規ソリューション作成も Visual Studio for Mac（以前は Xamarin Studio） で行っているのですが、これらで作成したソリューションを Windows の Visual Studio 2017 で開いてビルドし、いざ実行しようと「デバッグの開始(F5)」を押しても、一向にアプリが起動しません。それどころかAndroidエミュレータも起動しません。

こんなこと初めてだなー、と思っていろいろみていたら、ふとソリューションの構成マネージャーに、「配置」をいう項目が増えているのに気づきました。

![](/img/posts/solution_created_vs4mac_does_not_running_on_vs2017_01.png)

「キミ、いつからそこに居たの・・・」、完全にこれが犯人じゃん。
ということで、この「配置」にチェックを入れて、再度 F5 で実行すると、無事、エミュレータが起動してアプリが実行できました。

ちなみに下は Visual Studio for Mac の構成マネージャー的な画面ですが、「配置」なんてないんですよね。。。

![](/img/posts/solution_created_vs4mac_does_not_running_on_vs2017_02.png)

Win と Mac で同じ機能はまったく期待してない Visual Studio ですが、細かいところ（可能なところ）は統一してほしいなあと思います。
