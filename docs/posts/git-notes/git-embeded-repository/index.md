---
title: Git Module 与嵌套 Repository
date: 2015-09-13 21:11:22
description: 当在项目中引用了其他开源库的源代码，如何进行管理？
categories: 
- Git
tag:
- git
- embeded-repository
---

本文大纲: 
<!-- TOC -->

- [添加一个 Submodule](#%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA-submodule)
- [获取子项目更新](#%E8%8E%B7%E5%8F%96%E5%AD%90%E9%A1%B9%E7%9B%AE%E6%9B%B4%E6%96%B0)
- [Git Module](#git-module)

<!-- /TOC -->

Git 可将一个 Git repository 作为另外一个 Git repository 的子目录，这允许在你的项目中引用另一个项目，并将两个项目分开维护。假设我们希望将一个现有的 Git repository 作为一个 submodule 添加到当前工作项目上，执行 `git submodule add` 并跟上绝对或相对 url 作为参数来添加 submodule。

Submodules 至少有两种应用场景：
1. 项目依赖一个外部项目，并希望将两者分开维护
2. 将一个大项目拆分为多个小项目并将它们黏合在一起

## 添加一个 Submodule

``` bash
$ git submodule add https://github.com/chaconinc/DbConnector
```
默认情况下，submodules 将使用与 Git repository 一致的名称作为 directory 添加到当前项目的根目录下，在这个例子中为 "DbConnector"。也可以在命令最后指定一个自定义的路径作为该 submodule 的目录。

执行 `git status`，看到以下变化：
``` bash
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.

Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

	new file:   .gitmodules
	new file:   DbConnector
```
一个新的文件 `.gitmodules` 被创建了，该配置文件存储了当前项目与 submodule 之间的关系映射，以下是其内容举例：
``` bash
[submodule "DbConnector"]
	path = DbConnector
	url = https://github.com/chaconinc/DbConnector
```
如果包含多个 submodule，那么该文件会有更多的 entry，值得注意的是，该文件一起受 `git` 版本控制。

作为 submodule 被管理的 Git repository 将不会受到父级 Git repository 的状态追踪。因此，在当前项目执行 `git push origin master` 之后，从另一台机器 `git clone` 父级项目时，将只包含 `.gitmodules` 文件及对应于各个 submodules 的空的 directory。
``` bash
$ git clone https://github.com/chaconinc/MainProject
Cloning into 'MainProject'...
remote: Counting objects: 14, done.
remote: Compressing objects: 100% (13/13), done.
remote: Total 14 (delta 1), reused 13 (delta 0)
Unpacking objects: 100% (14/14), done.
Checking connectivity... done.

$ cd MainProject
$ ls -la
total 16
drwxr-xr-x   9 schacon  staff  306 Sep 17 15:21 .
drwxr-xr-x   7 schacon  staff  238 Sep 17 15:21 ..
drwxr-xr-x  13 schacon  staff  442 Sep 17 15:21 .git
-rw-r--r--   1 schacon  staff   92 Sep 17 15:21 .gitmodules
drwxr-xr-x   2 schacon  staff   68 Sep 17 15:21 DbConnector
-rw-r--r--   1 schacon  staff  756 Sep 17 15:21 Makefile
drwxr-xr-x   3 schacon  staff  102 Sep 17 15:21 includes
drwxr-xr-x   4 schacon  staff  136 Sep 17 15:21 scripts
drwxr-xr-x   4 schacon  staff  136 Sep 17 15:21 src

$ cd DbConnector/
$ ls
$
```
要获得与提交之前的 submodules，一种方式是执行 `git submodule init` 指令来初始化本地配置和 `git submodule update` 从 submodules 对应的地址 `clone` 所有数据并签出对应的 `commit`。
``` bash
$ git submodule init
$ git submodule update
```
或者：
``` bash
git submodule update --init --recursive
```
另外一种方式是在执行 `git clone` 父级项目时添加 `--recurse-submodules` 参数，将一次完成父级项目及所有 submodules 的克隆
``` bash
$ git clone --recurse-submodules https://github.com/chaconinc/MainProject
```
之后，如果希望同父级项目一同获取所有 submodules 的更新，执行
``` bash
git pull --recurse-submodules
```

## 获取子项目更新

使用 Git Submodules 一个最典型的应用场景是，引用一个由外部维护的 Git repository，仅仅使用它而不做任何修改。

首先导航到指定 submodule 所在目录，执行 `git fetch` 和 `git merge` 获取本地更新。
``` bash
$ git fetch
From https://github.com/chaconinc/DbConnector
   c3f01dc..d0354fc  master     -> origin/master

$ git merge origin/master
Updating c3f01dc..d0354fc
Fast-forward
 scripts/connect.sh | 1 +
 src/db.c           | 1 +
 2 files changed, 2 insertions(+)
```
回到父级项目目录，执行 `git diff --submodule`，可以看到 submodules 已经获得更新并列出一个添加到该项目的 commit 列表。如果不想每次在执行 `git diff` 时都输入 `--submodule` 参数，可在 `git config` 文件中添加该命令的默认参数或执行 `git config diff.submodule log`，之后再执行 `diff` 将会将列出所有子项目更新日志。
``` bash
$ git config --global diff.submodule log
$ git diff
Submodule DbConnector c3f01dc..d0354fc:
  > more efficient db routine
  > better connection routine
```
此时如果主项目提交至远程 Git repository，之后其他开发人员再获取代码时将会得到与主项目同步后的 submodule。

另外一种方式是直接在主项目目录下执行 `git submodule update --remote` 命令，git 将自动更新所有 submodules。
``` bash
$ git submodule update --remote DbConnector
remote: Counting objects: 4, done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 4 (delta 2), reused 4 (delta 2)
Unpacking objects: 100% (4/4), done.
From https://github.com/chaconinc/DbConnector
   3f19983..d0354fc  master     -> origin/master
Submodule path 'DbConnector': checked out 'd0354fc054692d3906c85c3af05ddce39a1c0644'
```
该命令将默认以所有 submodules 的 master branch 作为更新依据，如何以另外一个 branch name 作为默认更新的依据，参考下文的[Git Module](#Git-Module)

可在 git config 文件中为 `status` 命令添加默认参数或执行 `git config status.submodulesummary 1`，之后执行 `git status` 显示简短的摘要
``` bash
$ git config status.submodulesummary 1

$ git status
On branch master
Your branch is up-to-date with 'origin/master'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   .gitmodules
	modified:   DbConnector (new commits)

Submodules changed but not updated:

* DbConnector c3f01dc...c87d55d (4):
  > catch non-null terminated lines
```

## Git Module

`submodule` 是嵌套在另一个 repository 中的 repository，`submodule` 有自己的版本历史，包含子模块的 repository 称为 `superproject`

`.gitmodules` 放置在一个 Git 工作树的顶级目录下，该文件是一个匹配 [git-config](https://git-scm.com/docs/git-config) 的文本文件。该文件的每个 subsection 代表一个 submodule 的配置项，subsection 的值为 submodule 的名称，如果不显式指定 name 选项，该名称值将取该 submodule 的路径作为名称。同时，每一个 subsection 包含以下必填值：
- submodule.`<name>`.path: 相对于 Git working tree 顶层目录的路径，默认迁出位置，**该值不能以 `/` 结尾**，所有 submodule 的路径必须唯一。
- submodule.`<name>`.url: 克隆 submodule 的 url，该值可以是一个绝对 url，也可以 `./` 或 `../` 起头作为 superproject origin repository 的相对 url。

同时，还有以下可选参数：
- submodule.`<name>`.update: 定义 submodue 的默认更新行为，在 superproject 执行 `git submodule update` 指令时如何更新
- submodule.`<name>`.branch: 提供用于检测更新的 branch 名称，如果不指定该值，默认取 master。`.` 作为特殊值告知 git 取与当前 repository 当前 branch 一致的名称
- submodule.`<name>`.fetchRecurseSubmodules: 该用于控制对 submodule 的递归 fetch，如果在 superproject 的 `.git/config` 中已经设置了该值，那么该值将覆盖在 .gitmodules 中的值。两者均可被 `git fetch` 和 `git pull` 使用 `--[no-]recurse-submodules` 选项覆盖
- submodule.`<name>`.ignore: `git status` 和比较器如何对已经做出修改的 submodules 进行反应，可取以下值
    - all: submodule 永远不会被认为已经 modified，但在 staged 后会显示出来
    - dirty: 所有对 submodule 工作目录下做出的修改将被忽略，只有其 Head 与 superproject 的记录状态会纳入考虑
    - untracked: 只有 untracked 文件会被忽略
    - none: 所有修改都不会被忽略
- submodule.`<name>`.shallow: 当设置为 true 时，该 submodule 会执行浅 clone(只包含一层深度的历史信息)

例子：
``` bash
[submodule "libfoo"]
	path = include/foo
	url = git://foo.com/git/lib.git
```

文件系统中，一个 `submodule` 通常
1. 在 `superproject` 的 `$GID_DIR/modules/` 有一个 Git 目录
2. 在 `superproject` 工作目录下有一个对应的子目录作为其工作目录
3. 在其工作目录中根目录下包含一个 .git 文件指向 (1) 所在的位置

假设一个 submodule 的 Git 目录位于 `$GIT_DIR/modules/foo/`，工作目录位于 `path/to/bar/`，`superproject` 通过一个 `path/to/bar/` 目录树下的 `gitlink` 和 `.gitmodules` 文件中的一个条目 `submodule.foo.path = path/to/bar` 来追踪这个 `submodule`。

参考资料：
- https://git-scm.com/book/en/v2/Git-Tools-Submodules
- https://git-scm.com/docs/gitmodules
- https://git-scm.com/docs/gitsubmodules