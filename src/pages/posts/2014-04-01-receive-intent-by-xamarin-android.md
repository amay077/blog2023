---
templateKey: blog-post
title: Xamarin.Android で Intent を受けとるには？
date: 2014-04-01T00:00:00.000+09:00
tags:
  - Xamarin
  - Android
---
例えば、他のアプリからテキストを「送る」して、自作の Xamarin アプリでそれを受け取りたい時。
<!--more-->

普通の Android アプリ開発だと ``AndroidManifest.xml`` にこう書く。

```xml
//AndroidManifest.xml
<activity
  android:name="com.example.intenttest.MainActivity"
  android:label="@string/app_name" >
  <intent-filter>
    <action android:name="android.intent.action.MAIN" />
      <category android:name="android.intent.category.LAUNCHER" />
  </intent-filter>

  <intent-filter>
    <action android:name="android.intent.action.SEND" />
    <category android:name="android.intent.category.DEFAULT" />
    <data android:mimeType="text/plain" />
  </intent-filter>
</activity>
```

Xamarin.Android では、Activity のソースファイルの属性として、以下のように書く。

```csharp
//MainActivity.cs
[Activity(Label = "MainActivity", MainLauncher = true)]
[IntentFilter (new []{ Intent.ActionSend }, 
  Categories = new []{ Intent.CategoryDefault },
  DataMimeType = "text/plain" )]
public class MainActivity : Activity
{
    protected override void OnCreate(Bundle bundle)
    {
        base.OnCreate(bundle);
```

テキストでない場合は、mimetype を適宜変更する。省略したら動作しなかった。