---
templateKey: blog-post
title: NumberPicker の DisplayItems の増減が面倒すぎる
date: 2017-01-03T00:00:00.000+09:00
tags:
  - Android
---
[``NumberPicker``](https://developer.android.com/reference/android/widget/NumberPicker.html) には数値だけじゃなくて ``setDisplayedValues`` で数値以外の任意の文字列を項目群として設定できる。
<!--more-->

以下のようにすると、 NumberPicker には 「A, B, C」が表示される。

```java
final List<String> words = Arrays.asList("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O");
final NumberPicker numPicker1 = (NumberPicker)findViewById(R.id.numPicker1);

numPicker1.setMinValue(0);
numPicker1.setMaxValue(2);
String[] displayWords = words.subList(0, 3).toArray(new String[3]); // A,B,C
numPicker1.setDisplayedValues(displayWords);
```

項目群を、 A,B,C から A,B,C,D に増やしたいときに、下のようコードを書くと、

```java
final Button buttonAdd = (Button)findViewById(R.id.buttonAdd);
buttonAdd.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View view) {
        int newMax = numPicker1.getMaxValue() + 1;
        String[] displayWords = words.subList(0, newMax + 1).toArray(new String[newMax]);

        numPicker1.setMaxValue(newMax);
        numPicker1.setDisplayedValues(displayWords);
    }
});
```

``setDisplayedValues`` で ``ArrayIndexOutOfBoundsException`` が出て落ちる。

> E/AndroidRuntime: FATAL EXCEPTION: main
                  Process: net.amay077.numberpickersample, PID: 3828
                  java.lang.ArrayIndexOutOfBoundsException: length=4; index=4
                      at android.widget.NumberPicker.ensureCachedScrollSelectorValue(NumberPicker.java:1825)
                      at android.widget.NumberPicker.initializeSelectorWheelIndices(NumberPicker.java:1640)
                      at android.widget.NumberPicker.setMaxValue(NumberPicker.java:1445)
                      at net.amay077.numberpickersample.MainActivity$1.onClick(MainActivity.java:36)

項目を増やすときは、``setMaxValue`` よりも  ``setDisplayedValues`` を先に呼ばないといけないらしい。

```java
final Button buttonAdd = (Button)findViewById(R.id.buttonAdd);
buttonAdd.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View view) {
        int newMax = numPicker1.getMaxValue() + 1;
        String[] displayWords = words.subList(0, newMax + 1).toArray(new String[newMax]);

        // 増やすときは先に setDisplayedValues
        numPicker1.setDisplayedValues(displayWords);

        numPicker1.setMaxValue(newMax);
    }
});
```

逆に、項目を減らすときは、``setMaxValue`` よりも  ``setDisplayedValues`` を後に呼ばないといけないらしい。

```java
final Button buttonRemove = (Button)findViewById(R.id.buttonRemove);
buttonRemove.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View view) {
        int newMax = numPicker1.getMaxValue() - 1;
        String[] displayWords = words.subList(0, newMax + 1).toArray(new String[newMax]);

        numPicker1.setMaxValue(newMax);

        // 減らすときは後で setDisplayedValues
        numPicker1.setDisplayedValues(displayWords);
    }
});
```

![](/img/posts/android_numberpicker_01.gif)

項目が増えたときと減ったときで、呼び出しの順番を変えないといけないのが面倒すぎる。
