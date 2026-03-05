---
title: Linux 基础 - 档案与目录管理(ls/cp/rm/mv/basename/dirname)
description: 本文介绍了 Linux 系统与档案与目录管理相关的指令
excerpt: 本文介绍了 Linux 系统与档案与目录管理相关的指令
author: Frost He
date: 2016-04-29
lang: zh-CN
category:
- Linux Basic
tag:
- linux
---

档案管理主要涉及: 
- 显示档案详情
- 拷贝
- 删除档案
- 移动档案

# ls(检视档案)
``` bash
ls [-aAdfFhilnrRSt] 档名或目录名
ls [--color={never,auto,always}] 档名或目录名
ls [--full-time] 档名或目录名
```
ls 常用的选项有:
- `-a`: 全部档案，包括隐藏档案
- `-A`: 全部的档案，包括隐藏档案，但不包括 `.` 与 `..` 两个目录
- `-d`: 仅列出目录
- `-f`: 直接列出结果，而不进行排序(`ls` 预设会以名称排序)
- `-F`: 为档案名添加特殊符号以标识其类别，例如 `*` 代表可执行档案，`/` 代表目录，`=:` 代表 socket 档案，`|:` 代表 FIFO 档案。
- `-h`: 将档案容量以人类友好的方式列出(GB, KB)
- `-i`: 列出 inode 号码
- `-l`: 列出详情
- `-n`: 使用 UID 与 GID 而非用户名称和群组名称
- `-r`: 将排序结果反向输出
- `-R`: 递归显示所有目录
- `-S`: 以档案容量大小排序
- `-t`: 以时间排序

ls 指令包含了很多功能，Linux 档案系统记录了与档案有关的权限和属性，这些数据都放在 i-node 里面，有关 i-node 的详情，见后文。

由于 `ls -l` 非常常用，很多 `Linux` 的发布版本使用 `ll` 指令使其成为 `ls -l` 的缩写，而这是由 Bash shell 的 alias 功能实现的，有关这部分内容，见后文。
# cp(复制档案或目录)
``` bash
cp [-adfilprsu] source destination
cp [options] source1 source2 source3 .... directory
```
cp 常用选项:
- `-i`: 若目标已经存在，则要求询问是否覆盖
- `-d`: 若源为 link 档，则复制 link 档的属性而非档案本身的属性
- `-f`: force 的简写，若目标档已经存在且无法开启，则移除后再试一次
- `-p`: 复制档案及其属性，备份常用
- `-r`: 启用递归复制
- `-s`: 复制为符号链接(symbolic link)
- `-l`: 复制为硬式链接(hard link)
- `--preserve=all`: 除了 `-p` 的相关属性外，还加入 SELinux 的属性，links，xattr 也复制。
- `-a`: 相当于 `-dr --preserve=all`

> 如果不加任何选项，档案被复制后其属性会发生改变，如果想要完全复制档案，则需要加上 `-a` 选项。

在复制其他用户的资料时(必须要有 Read 权限)，总是希望得到的档案权限归自身用户所有，所以 `cp` 指令预设复制后的档案归复制者所有，这意味着在不加任何选项的情况下，得到的档案权限与复制者用户一致。在使用 `cp` 指令进行复制时，考虑以下几点:
- 是否需要完整保留原始档案的咨询？
- 原始档是否为符号链接档
- 原始档是否为特殊的档案，例如 FIFO，socket 等？
- 原始档是否为目录？

# rm(移除档案或目录)
``` bash
rm [-fir]档案或目录
```
`rm` 指令关键选项:
- `-f`: force 的简写，忽略不存在的档案，不会出现警告
- `-i`: 互动模式，在删除询问使用者
- `-r`: 递归删除

> 使用 `*` 通配符可以删除任意匹配的档案或目录

Linux 系统下，为了防止档案被 root 误删，很多发行版预设加入了 `-i` 这个选项。但是使用 `rm -r` 这个指令系统不会再次询问，使用前要特别注意。如果确定目录不要了，那么使用 `rm -r` 来递归删除是不错的方式。

# mv(移动档案与目录，或更改名称)
``` bash
mv [-fiu] source destination 
mv [options] source1 source2 source3 .... directory 
```
`mv` 指令关键选项:
- `-f`: force 的缩写，如果目标档已经存在，则不询问而直接覆盖
- `-i`: 互动模式，若目标档案已经存在，则会询问是否覆盖
- `-u`: 若目标档案已经存在，且原始档较新才会执行移动

> `-u` 选项可以用来测试新旧档案，看看是否需要搬移；`rm` 指令可以用来重命名文件，但 Linux 有另外一个 `rename` 指令可以进行批量改名。

# basename 和 dirname
``` bash
basename /etc/sysconfig/network
network
```
`basename` 用于获取档案本身的名称
``` bash
dirname /etc/sysconfig/network
/etc/sysconfig
```
`dirname` 用于获取包含档案的目录的完整路径