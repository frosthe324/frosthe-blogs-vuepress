---
title: Linux 基础 - 指令与档案的搜索(which/whereis/locate/updatedb/find)
description: 本文简要介绍了 Linux 下搜索指令与档案相关的指令
excerpt: 本文简要介绍了 Linux 下搜索指令与档案相关的指令
author: Frost He
date: 2016-05-01
lang: zh-CN
category:
- Linux Basic
tag:
- linux
---

## which(寻找「可执行文件」)
```bash
$ which [-a] command 
```
- `-a`: 将所有定义在 `$PATH` 中与该指令相关的路径都列出来。

例如:
```bash
$ which ifconfig
/sbin/ifconfig

$ which which
alias which='alias | /usr/bin/which --tty-only --read-alias --show-dot --show-tilde'
        /bin/alias
        /usr/bin/which
```
> 这里涉及到了命令别名

`which` 预设是搜索 `PATH` 内定义的目录，有些 `bash` 内建的指令并没有在 `PATH` 中定义，所以有可能找不到，例如 `history` 指令。

## whereis
`whereis` 仅针对特定目录进行查找，所以速度会比 `find` 指令快，想知道哪些目录，执行 `whereis -l` 即可。
```bash
$ whereis [-bmsu] 档案名或目录名
```
- `-l`: 列出 `whereis` 查询的主要目录
- `-b`: 只找 `binary` 类型的文件
- `-m`: 只找在说明档 `manual` 路径下的档案
- `-s`: 只招 `source` 来源档案
- `-u`: 搜寻不在上述三个项目中的其他特殊档案

举例:
```bash
$ whereis ifconfig
/sbin/ifconfig /usr/share/man/man8/ifconfig.8.gz
```

## locate / updatedb
locate 在「已经建立的资料库(`/var/lib/mlocate/`)」中搜索，因此速度很快，但不同的 Linux 发行版建立资料库的预设周期都不同(CentOS 7.x 是每天更新一次)，如果在资料库新建之前使用该命令，有可能找不到目标资料，这时可执行 `updatedb` 手动更新资料库，`updatedb` 指令首先读取 `/etc/updatedb.conf` 配置文件，再去硬盘里搜索档案名，最后更新整个资料库档案，由于要进行硬盘操作，整个过程可能会比较慢。
```bash
$ locate [-ir] 关键字
```
- `-i`: 忽略大小写
- `-c`: 不输出档案名称，仅计算找到的档案数量
- `-l`: 输出行数，如输出 5 行则是 `-l 5`
- `-S`: 输出 `locate` 所使用的资料库档案的相关咨询，包括该资料库记录的档案/目录数量等
- `-r`: 后接正则表达式

## find
```bash
$ find [PATH] [option] [action]

选项与参数：
1. 与档案权限及名称有关的参数：
   -name filename：搜寻档案名称为 filename 的档案；
   -size [+-]SIZE：搜寻比 SIZE 还要大 (+) 或小 (-) 的档案。这个 SIZE 的规格有：
                   c: 代表 byte， k: 代表 1024 bytes。所以，要找比 50KB
                   还要大的档案，就是『 -size +50k 』
   -type TYPE ：搜寻档案的类型为 TYPE 的，类型主要有：一般正规档案(f), 装置档案(b, c),
                   目录(d), 连结档(l), socket(s), 及 FIFO(p) 等属性。
   -perm mode ：搜寻档案权限『刚好等于』 mode 的档案，这个 mode 为类似 chmod
                 的属性值，举例来说，`-rwsr-xr-x` 的属性为 4755 ！
   -perm -mode ：搜寻档案权限『包含 mode 的权限』的档案，举例来说，
                 我们要搜寻 `-rwxr--r--` ，亦即 0744 的档案，使用 -perm -0744，
                 当一个档案的权限为 `-rwsr-xr-x` ，亦即 4755 时，也会被列出来，
                 因为 `-rwsr-xr-x` 的属性已经包括 -rwxr--r-- 的属性了。
   -perm /mode ：搜寻档案权限『包含任一 mode 的权限』的档案，举例来说，我们搜寻
                 `-rwxr-xr-x` ，亦即 -perm /755 时，但一个档案属性为 `-rw-------`
                 也会被列出来，因为他有 -rw.... 的属性存在！

找出档名为passwd这个档案 
[root@study ~]# find / -name passwd

找出档名包含了passwd这个关键字的档案 
[root@study ~]# find / -name "*passwd*" 
#利用这个-name可以搜寻档名啊！预设是完整档名，如果想要找关键字，
# 可以使用类似* 的任意字元来处理

找出/run目录下，档案类型为Socket的档名有哪些？
[root@study ~]# find /run -type s 
#这个-type的属性也很有帮助喔！尤其是要找出那些怪异的档案，
# 例如socket 与FIFO 档案，可以用find /run -type p 或-type s 来找！

搜寻档案当中含有SGID或SUID或SBIT的属性 
[root@study ~]# find / -perm /7000 
#所谓的7000就是---s--s--t ，那么只要含有s或t的就列出，所以当然要使用/7000，
# 使用-7000 表示要同时含有---s--s--t 的所有三个权限。而只需要任意一个，就是/7000 ～了乎？
```
更多参数参考 http://linux.vbird.org/linux_basic/0220filemanager.php。