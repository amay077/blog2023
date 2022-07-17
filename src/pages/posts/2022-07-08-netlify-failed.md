---
templateKey: blog-post
title: Netlify でも Permission denied (publickey) が出ていたので直した
date: 2022-07-08T01:00:00.000Z
tags:
  - Netlify
  - GitHub
---

このブログは Github Pages でホストしているといったな、あれはウソだ。
実際には、Netlify とも連動させていて、ドメイン管理共々 Netlify の CDN でホスティングされている。

で、久しぶりに更新してデプロイしたら GitHub Actions に続いて Netlify でもエラーが出ていた。

## エラー1: Build image no longer supported

```
10:01:49 AM: Build ready to start
10:01:50 AM: ---------------------------------------------------------------------
  UNSUPPORTED BUILD IMAGE

  The build image for this site uses Ubuntu 14.04 Trusty Tahr, which is no longer supported.

  To enable builds for this site, select a later build image at the following link:
  https://app.netlify.com/sites/geologist-bells-42765/settings/deploys#build-image-selection

  For more details, visit the build image migration guide:
  https://answers.netlify.com/t/end-of-support-for-trusty-build-image-everything-you-need-to-know/39004
  ---------------------------------------------------------------------
```

Site settings -> Build & Deploy -> Continuous Deployment の Build image selection で "Ubuntu Focal 20.04" を選択して解決。

これで Retry すると次のエラー。

## エラー2: git@github.com: Permission denied (publickey).

またか。

```
WARNING: Your site had a deprecated version of Ruby pinned (2.3.6), which is incompatible with this
build image. This build image only supports 2.4.x and later. We changed it to 2.7.2.

To learn how to set a custom Ruby version, visit the following link:
https://docs.netlify.com/configure-builds/manage-dependencies/#ruby

If you set a custom Ruby version lower than 2.4.x, you will need to select a different build image (Ubuntu Xenial 16.04).
The current build image only supports 2.4.x and later. You can select a different build image at the following link:
https://app.netlify.com/sites/geologist-bells-42765/settings/deploys#build-image-selection
---------------------------------------------------------------------
10:05:09 AM: build-image version: 0e2f4c52031ab562db66aec633308326e3b108d0 (focal)
10:05:09 AM: build-image tag: focal
10:05:09 AM: buildbot version: ed990b4b6588208e959ba45b6b7b05738f8b6004
10:05:09 AM: Fetching cached dependencies
10:05:09 AM: Failed to fetch cache, continuing with build
10:05:09 AM: Starting to prepare the repo for build
10:05:09 AM: User git error while checking for ref refs/heads/master
10:05:09 AM: Creating deploy upload records
10:05:09 AM: Failing build: Failed to prepare repo
10:05:09 AM: Failed during stage 'preparing repo': error checking for ref: Warning: Permanently added 'github.com' (ECDSA) to the list of known hosts.

git@github.com: Permission denied (publickey).

fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
: exit status 128
10:05:09 AM: Finished processing build request in 829.555573ms
```

以下、これを解決するために行ったこと。

1. Site settings -> Build & Deploy -> Deploy key に ``ssh-rsa ...`` な公開鍵が載っているので、これをコピー
2. GitHub の Setting -> SSH and GPG keys に追加して貼り付け（名前は何でもよいが Netlify とでもしておく）
    - ここの登録が何も無かったから、過去に気が触れて消しちゃったんだと思うII。
3. Netlify で Retry
4. 成功！

ただし、↑の方法だと Netlify に GitHub の My repo's へのフルアクセスを提供していそうなので、
[Repository permissions and linking | Netlify Docs](https://docs.netlify.com/configure-builds/repo-permissions-linking/?_ga=2.59853678.25272126.1657242224-795194358.1657242224#access-other-repositories-at-build)
に書かれているように Read-only な Personal access token を作成して、それを使った方が良いのかも知れない。
