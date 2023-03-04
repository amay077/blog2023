---
templateKey: blog-post
title: Objective-C の Dictionary は、キーに基本データ型が使えないのね 
date: 2014-01-28T00:00:00.000+09:00
tags:
  - iOS
  - Objective-C
  - Java
  - csharp
---

```
くやしいので他の言語と比較しておく。
当然ながら Dictionary に限った話でない（はず）。
<!--more-->
### Objective-C

```
NSMutableDictionary* dic = [[NSMutableDictionary alloc] init];
[dic setObject:@"hoge" forKey:[NSNumber numberWithInt:1]]; // これは OK
[dic setObject:@"huga" forKey:@1]; // これも OK (@1 は NSNumber のリテラル構文なので)
[dic setObject:@"piyo" forKey:2]; // これはダメ（落ちる
```

キーと値が他の言語と逆なのにまずハマって、
キーに int型 の値を入れてたのに気づかずまたハマった。
せめてコンパイルエラーにして欲しいよ。
言語仕様上、型指定できないのでキーも値もどんな型でも突っ込めちゃう、こわい。

### Java

```java
Map<Integer, String> dic = new HashMap<Integer, String>();
Map<int, String> dic = new HashMap<int, String>(); // これはダメ(コンパイルできない)
dic.put(Integer.valueOf(1), "hoge"); // OK
dic.put(2, "piyo"); // これも OK（へー
```

int と Integer ってのがあって、int を使って HashMap を宣言できない。
これはコンパイル時に分かるので良いけど、int と Integer の変換が必要なことがしばしば。

### C＃

```csharp
var dic = new Dictionary<int, string>(); // 型推論＆Generic
dic.Add(1, "hoge"); // OK
dic.Add(2, "piyo"); 
dic.Add(3, "huga"); 
```

一番スッキリ書けますね。
　
　
　


…Xamarin いいよ、Xamarin