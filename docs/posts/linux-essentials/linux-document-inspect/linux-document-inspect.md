---
title: Linux 基础 - 档案内容查阅(cat/tac/nl/more/less/head/tail/od/touch)
description: 本文介绍了 Linux 系统与档案内容查阅相关的指令
excerpt: 本文介绍了 Linux 系统与档案内容查阅相关的指令
author: Frost He
date: 2016-04-30
lang: zh-CN
category:
- Linux Basic
tag:
- linux
---

# cat(concatenate)
``` bash
cat [-AbEnTv] 档案名
```
参数与选项:
- `-A`: 忽略空白字符，列出不可见的特殊字符
- `-b`: 列出行号，仅针对非空白行
- `-E`: 将结尾的换行字符 `$` 显示出来
- `-n`: 列出行号，包括空白行
- `-T`: 将 `Tab` 以 `^|` 显示
- `-v`: 列出不可见的特殊字符

> 在使用 `cat -A` 指令后，Tab 以 `^|` 显示，而换行符以 `$` 显示，这样有助于查看空白部分到底是什么字符。

# tac(反向串联)
`tac` 命令恰好是 `cat` 命令反写，`cat` 从第一行输出至最后一行，而 `tac` 从最后一行输出到第一行。

# nl(添加行号)
``` bash 
nl [-bnw] 档案名
```
参数与选项:
- `-b`: 指定行号的方式，主要有两种:
    - `-ba`: 类似 `cat -n`，空行也列出行号
    - `-bt`: 忽略空白行的行号，预设值
- `-n`: 列出行号表示方法，主要三种:
    - `-n ln`: 行号位于左侧
    - `-n rn`: 行号位于右侧
    - `-n rz`: 行号位于右侧，且添零补齐
- `-w`: 行号占位字符数
举例:
``` bash
nl -ba -n rz -w 3 /etc/issue
001 \S
002 Kernel \r on an \m
003
```

# 翻页(more 和 less)
`ln`, `cat` 和 `tac` 都是将档案的全部内容一次性输出到屏幕上，`more` 与 `less` 指令提供了翻页功能。
## more
``` bash
more /etc/man_db.conf
#
#
# This file is used by the man-db package to configure the man and cat paths.
# It is also used to provide a manpath for those without one by examining
# their PATH environment variable. For details see the manpath(5) man page.
#
--More--(28%) 
```
使用 `more` 指令后，可以注意到最下端一行多出了一个百分比，此时如果按下:
- `Space`: 下一页
- `b`: 上一页
- `Enter`: 下一行
- `q`: 退出 `more` 指令
- `/{字符串}`: 向下查找 「字符串」 匹配的文本，按下 `Enter` 开始查找，按下 `n` 查找下一个，
- `:f`: 显示档案名及当前显示的行数
## less
`less` 在 `more` 的基础上做了改进，less 使用 `PGUp` 和 `PGDown` 来翻页。并且多出了一些选项:
- `Space`: 下一页
- `pagedown`: 下一页
- `pageup`: 上一页
- `/{字符串}`: 向下查找 「字符串」 匹配的文本
- `?{字符串}`: 向上查找 「字符串」 匹配的文本
- `n`: 重复前一个查找
- `N`: 反向重复前一个查找
- `g`: 跳转至第一行
- `G`: 跳转至最后一行
- `q`: 退出 `less` 指令

> `man` 指令是执行 `less` 指令产生的结果，所以两者在用法上是相通的

# 文本截取(head 和 tail)
## head
``` bash
head [-n number] 档案名
```
选项与参数:
- `-n`: 后接数字，代表显示前 n 行，如果不指定 `-n` 参数，默认情况下该指令显示前 10 行，如果指定为 `-100`，则表示显示最后 100 行之前的所有行
举例: 
``` bash
head /etc/man_db.conf # 输出前 10 行
head /etc/man_db.conf -n 20 # 输出前 20 行
head /etc/man_db.conf -n -100 # 输出最后 100 行前的所有行
```
## tail
``` bash
tail [-n number] 档案名
```
选项与参数:
- `-n`: 后接数字，表示输出最后 n 行，默认值为 10，
- `-f`: 表示实时侦测文档，`Ctrl + C` 来取消
举例:
``` bash
tail /etc/man_db.conf # 输出最后 10 行
tail -n 20 /etc/man_db.conf # 输出最后 20 行
tail -n +100 /etc/man_db.conf # 输出 100 行后的所有行
tail -f /var/log/messages  # 实时监测该文档的内容，可与 -n 并用
```
> 如果希望输出某个文档的第 10-20 行，那么可以执行 `head -n 20 /etc/man_db.conf | tail -n 10`，意为先去前 20 行，再将其结果交给 `tail` 指令输出最后 10 行。

``` bash
cat -n /etc/man_db.conf | head -n 20 | tail -n 10 # 取 /etc/man_db.conf 的 10-20 行，并显示行号
```

# 非纯文本档案: od
上述的所有指令都是针对纯文本的档案读取，对非纯文本档案的读取使用 od 指令:
``` bash
od [-t TYPE] 档案名
```
选项与参数:
- `-t`: 接档案类型，类型有:
    - a: 使用预设的字符输出
    - c: 使用 ASCII 输出
    - d[size]: 使用十进制(decimal)输出资料，每个整数占用 [size] 字节
    - f[size]: 使用浮点数(floating)输出资料，每个数占用 [size] 字节
    - o[size]: 利用八进(octal)制输出资料，每个整数占用 [size] 字节
    - x[size]: 利用十六进制(hexadecimal)来输出资料，每个整数占用 [size] 字节

> 该命令可用于快速定位字符的 ASCII 编码，例如: echo password | od -t oCc

# 修改档案时间或新建档案: touch
对于某个档案，其主要有 3 个时间变动的入口:
- modification time(mtime): 档案的「内容」更改时，会更新该时间
- status time(ctime): 档案的「状态」改变时，会更新该时间，例如权限和属性被更改
- access time(atime): 「档案的内容被读取」时，会更新该时间，例如用 `cat` 指令读取某个档案

默认情况下，当使用 `ls` 指令时，得到的时间是 `mtime`，即该档案内容上次被修改的时间，如果发现时间不对，可 `touch` 指令修改时间:
``` bash
touch [-acdmt] 档案名
```
选项和参数:
- `-a`: 仅修改 aceess time
- `-c`: 仅修改档案时间，若档案不存在则不建立新档案
- `-d`: 修改 atime 和 mtime，后接目标时间，可用 --date="日期或时间"代替
- `-m`: 仅修改 mtime
- `-t`: 修改 atime 和 mtime，后接目标时间，格式为 [YYYYMMDDhhmm]
举例:
```bash
touch testtouch # 建立新的空档案，三个时间都会更新会当前时间
date; ll bashrc; ll - -time=atime bashrc; ll --time=ctime bashrc
touch -d "2 days ago" bashrc # 修改
```
> `;` 用于分割连续下达的指令，这些指令会依次执行，`ctime` 是无法通过指令修改的，即便是完全复制一条档案，也无法复制 `ctime`，该属性记录了档案的状态变化时间。