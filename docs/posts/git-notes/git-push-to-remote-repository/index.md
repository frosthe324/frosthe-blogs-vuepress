---
title: Git - 推送至远程仓库
date: 2015-07-03 21:35:17
description: 在远程机器上搭建 Git Repository
categories: 
- Git
tag: 
- git
- remote-repository
---

## 生成仓库目录
``` bash
mkdir -p development/hobby-project/my-first-git-repository
cd development/hobby-project/my-first-git-repository
```
> 不带任何参数的 `mkdir` 命令将不会递归创建目录，`-p` 选项在任何层级的目录不存在的情况下递归创建目录

## 初始化仓库
现在，`development/hobby-project/my-first-git-repository` 将作为远程 `repository` 根目录，执行：
``` bash
$ sudo git init --bare
Initialized empty Git repository in /Users/XXX/development/hobby-project/my-first-git-repository/
```
> `git init --bare` 参数指明该 `repository` 用于分布式版本控制的中心仓库，`git` 将仅保存历史记录，一般来说服务器上的仓库多使用 `--bare` 创建，其目的在于分发而非修改，参考 [what is a git bare repository](http://www.saintsjd.com/2011/01/what-is-a-bare-git-repository/)。

使用 `local protocol` 在本地拉取 `git repo`:
```bash
$ git clone file://{path-to-your-repo}
```
git 支持 4 种 protocol，具体参考[Git on the Server - The Protocols](https://git-scm.com/book/en/v2/Git-on-the-Server-The-Protocols)。