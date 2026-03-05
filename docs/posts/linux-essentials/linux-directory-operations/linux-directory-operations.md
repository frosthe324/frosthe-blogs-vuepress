---
title: Linux 基础 - 目录操作与 $PATH
description: 本文介绍了 Linux 系统有关目录的常用指令和 $PATH 变量的意义
excerpt: 本文介绍了 Linux 系统有关目录的常用指令和 $PATH 变量的意义
author: Frost He
date: 2016-04-28
lang: zh-CN
category:
- Linux Basic
tag:
- linux
---

本文大纲: 
<!-- TOC -->

- [绝对路径与相对路径](#%E7%BB%9D%E5%AF%B9%E8%B7%AF%E5%BE%84%E4%B8%8E%E7%9B%B8%E5%AF%B9%E8%B7%AF%E5%BE%84)
- [常用目录操作](#%E5%B8%B8%E7%94%A8%E7%9B%AE%E5%BD%95%E6%93%8D%E4%BD%9C)
  - [cd(change directory, 变换目录)](#cdchange-directory-%E5%8F%98%E6%8D%A2%E7%9B%AE%E5%BD%95)
  - [pwd(print working directory, 显示当前所在目录)](#pwdprint-working-directory-%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E6%89%80%E5%9C%A8%E7%9B%AE%E5%BD%95)
  - [mkdir(make directory, 新建目录)](#mkdirmake-directory-%E6%96%B0%E5%BB%BA%E7%9B%AE%E5%BD%95)
  - [rmdir(remove directory, 删除目录)](#rmdirremove-directory-%E5%88%A0%E9%99%A4%E7%9B%AE%E5%BD%95)
- [执行程序的环境变量: $PATH](#%E6%89%A7%E8%A1%8C%E7%A8%8B%E5%BA%8F%E7%9A%84%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F-path)

<!-- /TOC -->

# 绝对路径与相对路径
Linux 中路径分为绝对路径与相对路径
- 绝对路径：由根目录作为起始路径
- 相对路径：由当前所在路径作为起始路径，当前路径可用 `./` 表示

> 在编写 shell 脚本时最好采用绝对路径，因为这样不会随着脚本文件所在的路径而对代码执行结果产生影响

# 常用目录操作
Linux 系统常见的目录操作指令有: 
- cd: 变换目录
- pwd: 显示当前的目录
- mkdir: 创建新目录
- rmdir: 删除目录

## cd(change directory, 变换目录)
每一个登入 Linux 系统的用户第一个进入的目录都是该用户的 Home 目录，即 `~`，同样也可以执行 `cd ~` 回到 Home 目录，如果仅仅输入 `cd` 代表的就是 `cd ~`，`cd -` 代表回到前一个目录，在预设指令模式(bash shell)中，可以利用 tab 键来自动补齐路径。
## pwd(print working directory, 显示当前所在目录)
如果想要知道当前所在的工作目录，执行 `pwd` 即可。

`-P` 选项是显示当前目录链接的真实目录，例如，ubuntu 系统在 /var/spool/mail 下执行 `pwd` 会显示 `/var/spool/mail`，而执行 `pwd -P` 指令会显示 `/var/mail`，这表明 `/var/spool/mail` 链接到了 `/var/mail`。

返回上一级目录执行 `ls -al` 我们会看到 mail 目录指向了 ../mail/。
```bash
drwxr-xr-x 0 root   root 512 Sep 23  2017 ./
drwxr-xr-x 0 root   root 512 Mar  1 01:54 ../
drwxr-xr-x 0 root   root 512 Sep 23  2017 cron/
lrwxrwxrwx 1 root   root   7 Sep 23  2017 mail -> ../mail/
drwx------ 0 syslog adm  512 Apr  5  2016 rsyslog/
```
## mkdir(make directory, 新建目录)
默认情况下，执行 `mkdir /home/pango/testing` 目标目录需要一层一层的新建才行，为了递归创建目录，添加 `-p` 选项可以自动创建不存在的目录。

另外，通过 `-m` 选项可以在新建目录时为该目录指定权限，例如当执行 `mkdir -p -m 711 /home/pango/testing` 时，在该目录树上的所有新建的目录都会具有 `drwx--x--x` 权限。如果不指定 `-m` 选项，其默认权限会与 umask 有关，见后文。
## rmdir(remove directory, 删除目录)
与 `mkdir` 指令类似，默认情况下，目标目录需要一层一层的删除才行，且被删除的目录必须为空，即该目录下不能存在任何目录或文件。

而 `-p` 提供了递归删除目录选项，且会删除指定目录下的任何目录和文件，该操作比较危险，使用时需谨慎。

# 执行程序的环境变量: $PATH
指令 `ls` 的二进制可执行程序所在的目录为 `/bin/ls`，可是为何可以在任何目录下执行 `ls` 这个指令呢？这就是环境变量 `$PATH` 的作用。

当执行 `ls` 指令时，系统会根据 `PATH` 的值去每个定义的目录下搜索名称为 'ls' 的可执行文件，如果在 `PATH` 定义的目录中包含多个名称为 'ls' 的可执行文件，那么先被找到的指令会被执行。

执行 `echo $PATH` 会在屏幕上打印出所有定义的路径值，`$` 表示环境变量，`PATH` 表示环境变量的键，注意 `PATH` 一定都是大写字母，其定义的多个路径每个之间由 `:` 分隔。

现在，如果将 `ls` 指令从 `/bin/ls` 通过 `mv /bin/ls /root/` 移动到 `/root/` 目录下，
- 即使执行 `cd /root` 切换到与其相同的目录下，执行 `ls` 指令仍被告知找不到指定的指令，因为 `PATH` 中并未定义 `/root` 路径，系统搜索不到该指令。
- 可以通过使用绝对路径或相对路径来执行该指令: `/root/ls` 或 `./ls`。
- 可通过 `PATH="${PATH}:/root"` 将 `/root` 加入到 `PATH` 变量中。

此外，关于 `PATH` 需要注意以下几项: 
- 不同的用户的环境变量 `PATH` 的值是不同的。
- `PATH` 是可以修改的
- 相比修改 `PATH` 的值，优先使用绝对路径或相对路径来执行某个指令。
- 指令放置到正确的目录下
- 最好不要将当前目录 `.` 加入到 `PATH` 当中。