---
templateKey: blog-post
title: GitHub Actions で Permission denied (publickey) が出ていたので直した 
date: 2022-07-08T00:00:00.000Z
tags:
  - GitHub
  - GitHub Actions
---

このブログは Github Pages でホストしていて、ソースの repo からホスト用の repo に GitHub Actions で push することでデプロイする仕組みになっている。

久しぶりに更新してデプロイしたら GitHub Actions でエラーが出ていた。

```
##[debug]Evaluating condition for step: 'Run git clone -b master git@github.com:amay077/amay077.github.com.git data --depth 1'
##[debug]Evaluating: success()
##[debug]Evaluating success:
##[debug]=> true
##[debug]Result: true
##[debug]Starting: Run git clone -b master git@github.com:amay077/amay077.github.com.git data --depth 1
##[debug]Loading inputs
##[debug]Loading env
Run git clone -b master git@github.com:amay077/amay077.github.com.git data --depth 1
##[debug]/usr/bin/bash -e /home/runner/work/_temp/96d95386-4acf-402a-b18c-992e32501447.sh
Cloning into 'data'...
Warning: Permanently added the ECDSA host key for IP address xxx.xxx.xxx.xxx' to the list of known hosts.
git@github.com: Permission denied (publickey).
fatal: Could not read from remote repository.
Please make sure you have the correct access rights
and the repository exists.
Error: Process completed with exit code 128.
##[debug]Finishing: Run git clone -b master git@github.com:amay077/amay077.github.com.git data --depth 1
```

以下、これを解決するために行ったこと。

1. 自PCで ssh-keygen で ``id_rsa`` と ``id_rsa.pub`` を生成
2. GitHub の Setting -> SSH and GPG keys に ``id_rsa.pub`` の内容を貼り付けて追加（名前は何でも）
    - ここの登録が何も無かったから、過去に気が触れて消しちゃったんだと思う。
3. GitHub Actions の repo の Setting -> Secrets -> Actions にある SSH_KEY と SSH_KEY_PUBLIC を ``id_rsa`` と ``id_rsa.pub`` の内容で Update 。
4. GitHub Actions を Re-run(failed jobs) を実行
5. 成功！
