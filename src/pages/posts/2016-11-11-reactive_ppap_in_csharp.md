---
templateKey: blog-post
title: C# で Reactive PPAP
date: 2016-11-11T00:00:00.000+09:00
tags:
  - csharp
  - ズンドコキヨシ
  - ReactiveExtensions
---
エンジニア立ち居振舞いには乗らないが、こういうのには乗ってしまうｗ
<!--more-->

* [Swift3でPPAPキヨシ - Qiita](http://qiita.com/on0z/items/ef32f79bde5452a2ccec)

C# と Reactice Extension で。[以前の](http://qiita.com/amay077/items/85dfc4bd194f57c52c57) をちょっと改造しただけだが。

```csharp
//PPAPClass.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Linq;
using System.Threading.Tasks;
using System.Reactive.Threading.Tasks;

namespace PPAPConsole
{
    class PPAPClass
    {
        public static void Main(string[] args)
        {
            var random = new Random();
            var FIN = "Pen-Pineapple-Apple-Pen";
            var PPAP = new string[] { "ペン", "パイナッポー", "アッポー", "ペン" };
            var WORDS = new string[] { "ペン", "パイナッポー", "アッポー" };

            var ppapObservable = Observable.Interval(TimeSpan.FromMilliseconds(100))
                .Select(_ => WORDS[random.Next(WORDS.Length)]) // ランダムに
                .Buffer(PPAP.Length, 1) // 要素数4のBufferを1ずつズラしてく
                .SelectMany(queue => queue.SequenceEqual(PPAP) ? // パターンと一致したら…
                    Observable.Concat(
                        Observable.Return(queue.Last()),   // Queueの最後
                        Observable.Return(string.Empty)) : // + 空文字(終了判定用)
                    Observable.Return(queue.Last()))
                    .TakeWhile(x => !string.IsNullOrEmpty(x));  // 空文字になるまで繰り返す

            Observable.Return("PPAP") // 最初に言うので
                .Concat(Task.Delay(TimeSpan.FromMilliseconds(1000)).ToObservable() // なんとなく待つ
                .SelectMany(ppapObservable))
                .Subscribe(
                    x => Console.WriteLine(x),
                    () => Console.WriteLine(FIN));

            Console.Read();
        }
    }
}
```

#### 結果

> PPAP
パイナッポー
ペン
ペン
アッポー
ペン
パイナッポー
アッポー
アッポー
アッポー
アッポー
ペン
アッポー
ペン
アッポー
ペン
パイナッポー
アッポー
ペン
Pen-Pineapple-Apple-Pen


apple-pen と pineapple-pen をうまく活かした感じにしたいですね。
