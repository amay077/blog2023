---
templateKey: blog-post
title: Xamarin.iOS で NSDate を DateTime に変換する
date: 2016-11-02T00:00:00.000+09:00
tags:
  - Xamarin
  - ios
  - csharp
---
なんで ``NSDate`` ってこんなにわけわからんの？

<!--more-->

こんなもの ``System.DateTime`` に変換してやる、えーい！

```csharp
using System;
using Foundation;

namespace YourNameSpace
{
    public static class NSDateExtensions
    {
        public static DateTime ToDateTime(this NSDate date)
        {
            DateTime reference = TimeZone.CurrentTimeZone.ToLocalTime(
                new DateTime(2001, 1, 1, 0, 0, 0));
            return reference.AddSeconds(date.SecondsSinceReferenceDate);
        }
    }
}

```

参考は↓だけど、使いやすいように Extension Method にしました。

* [I code therefore I am. - NSDate to DateTime and Back](http://sourcerer.tumblr.com/post/502919332/nsdate-to-datetime-and-back)


