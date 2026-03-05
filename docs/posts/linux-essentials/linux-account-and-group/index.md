---
title: Linux 基础 - 用户和群组
date: 2016-04-21 22:34:47
description: 本文主要记录了 Linux 系统下与用户何群组相关的指令和操作指南
categories: 
- Linux Basic
tag: 
- linux
---

参考资料：
- http://linux.vbird.org/linux_basic/0410accountmanager.php

本文大纲: 
<!-- TOC -->

- [用户帐号管理](#%E7%94%A8%E6%88%B7%E5%B8%90%E5%8F%B7%E7%AE%A1%E7%90%86)
  - [新建用户帐号 - useradd](#%E6%96%B0%E5%BB%BA%E7%94%A8%E6%88%B7%E5%B8%90%E5%8F%B7---useradd)
  - [设置帐号密码 - passwd](#%E8%AE%BE%E7%BD%AE%E5%B8%90%E5%8F%B7%E5%AF%86%E7%A0%81---passwd)
  - [管理帐号密码策略 - chage](#%E7%AE%A1%E7%90%86%E5%B8%90%E5%8F%B7%E5%AF%86%E7%A0%81%E7%AD%96%E7%95%A5---chage)
  - [修改用户帐号信息 - usermod](#%E4%BF%AE%E6%94%B9%E7%94%A8%E6%88%B7%E5%B8%90%E5%8F%B7%E4%BF%A1%E6%81%AF---usermod)
  - [删除用户帐号 - userdel](#%E5%88%A0%E9%99%A4%E7%94%A8%E6%88%B7%E5%B8%90%E5%8F%B7---userdel)
  - [用户端指令 - id, finger, chfn, chsh](#%E7%94%A8%E6%88%B7%E7%AB%AF%E6%8C%87%E4%BB%A4---id-finger-chfn-chsh)
- [群组管理](#%E7%BE%A4%E7%BB%84%E7%AE%A1%E7%90%86)
  - [新增群组 - groupadd](#%E6%96%B0%E5%A2%9E%E7%BE%A4%E7%BB%84---groupadd)
  - [修改群组 - groupmod](#%E4%BF%AE%E6%94%B9%E7%BE%A4%E7%BB%84---groupmod)
  - [删除群组 - groupdel](#%E5%88%A0%E9%99%A4%E7%BE%A4%E7%BB%84---groupdel)
  - [群组管理员 - gpasswd](#%E7%BE%A4%E7%BB%84%E7%AE%A1%E7%90%86%E5%91%98---gpasswd)
  - [初始群组，次要群组和有效群组](#%E5%88%9D%E5%A7%8B%E7%BE%A4%E7%BB%84%E6%AC%A1%E8%A6%81%E7%BE%A4%E7%BB%84%E5%92%8C%E6%9C%89%E6%95%88%E7%BE%A4%E7%BB%84)

<!-- /TOC -->

Linux 使用文件及配置相应的权限来存储用户帐号和群组信息，在成功创建好用户帐号之后，以下几处文件会发生相应的改变
- /etc/passwd: Linux 管理用户帐号的数据库
- /etc/shadow: Linux 管理用户帐号密码配置的数据库
- /etc/group: Linux 管理群组的数据库
- /etc/gshadow: Linux 管理群组密码配置的数据库

<!-- more -->

# 用户帐号管理

Linux 系统用户管理相关命令主要有：
- `useradd`：新建用户
- `passwd`：设置用户密码
- `chage`: 变更密码策略
- `usermod`：编辑用户
- `userdel`：删除用户

## 新建用户帐号 - useradd
linux 系统以 `useradd` 命令来新建 Unix 用户，该命令带有一系列参数：

``` bash
useradd [-u UID] [-g 初始群组] [-G 次要群组] [-mM] [-c 说明栏] [-d 家目录绝对路径] [- s shell] <new-user-name>

-u ：接 UID ，一组数字，直接指定一个特定的 UID 给这个用户
-g ：为该用户指定初始群组 initial group，该群组的 GID 会被放置到/etc/passwd 的第四个栏位
-G ：为该用户指定次要群组，该选项与参数会修改 /etc/group 内第四栏的值
-M ：不要为用户建立 Home 目录(系统帐号预设值)
-m ：为用户建立 Home 目录(一般帐号预设值)
-c ：用户备注，该值修改 /etc/passwd 文件的第五栏的内容
-d ：指定特定目录成为该用户的 Home 目录，而不采用预设值，需指定绝对路径
-r ：建立一个系统帐号，该帐号的 UID 会有限制(参考/etc/login.defs)
-s ：指定 `shell` ，若不指定则预设为 /bin/bash
-e ：指定该用户的过期日期，格式为『YYYY-MM-DD』此项写入 `/etc/shadow` 第八栏
-f ：指定密码是否立即失效，写入 /etc/shadow 的第七栏位。0 为立刻失效，-1 为永远不失效(密码只会过期而强制于登入时重新设定而已)
```

例如，执行以下命令新建一个用户：
``` bash
$sudo useradd pango
```
该命令创建一个名为 `pango` 的用户，由于没有使用 `-r` 指令，将随机分配一个 1000 以上的数值作为 `uid`，创建一个名为 `pango` 的群组并作初始群组，为该用户创建 Home 目录，使用 /bin/bash 作为工作环境。该命令对系统的以下部分做出修改：
- 在 /etc/passwd 里面新建一行用户值，包含 UID/GID/Home 目录等；
- 在 /etc/shadow 里面将此用户的密码相关参数填入，但是尚设置密码；
- 在 /etc/group 里面加入一个与用户名称一样的群组名称，如果已经存在与该用户名同名的群组名，则不会新建群组
- 在 /home 目录下新建一个与帐号同名的目录作为用户的 Home 目录，且权限为 700

> 注意，在 linux 系统中新增用户帐号和群组时，名称是区分大小写的

`useradd` 指令参考 /etc/defaults/useradd 文件中的配置作为缺省参数的预设值，使用 `useradd -D` 指令查看预设值：
``` bash 
$ useradd -D
GROUP=100                   # 预设的群组，系统内 GID = 100 的群组为 users 群组，但目前很多发行版都采用私有群组制，即为每个新建的用户帐号创建与之同名的群组来隔离权限
HOME=/home                  # 预设的 Home 目录
INACTIVE=-1                 # 密码失效日期，对应 /etc/shadow 第 7 栏
EXPIRE=                     # 用户帐号失效日，对应 /etc/shadow 第 8 栏
SHELL=/bin/sh               # 默认使用的 shell 程序名，如果 server 不希望任何新建的用户帐号登入系统取得 shell，那么将此项改为 /sbin/nologin
SKEL=/etc/skel              # Home 目录初始内容参考目录，即为新建用户创建 Home 目录时需要复制的初始内容，例如，在该目录下新增 www 目录，那么后续每个创建的新用户 Home 目录都会有 www 目录
CREATE_MAIL_SPOOL=no        # 是否主动帮用户建立邮件信箱，如果该项为 yes，则会新建 /var/spool/mail/{username} 目录作为该用户的邮箱
```
使用 `nano` 或 `vim` 查看 /etc/default/useradd 文件可以得到更多的详细信息：
``` bash 
$ nano /etc/default/useradd
```
登录信息参考在 /etc/login.defs 文件中定义，使用 `nano` 查看该文件
``` bash 
$ nano /etc/login.defs
MAIL_DIR /var/spool/mail        # 用户预设邮件信箱放置目录

PASS_MAX_DAYS 99999             # /etc/shadow 内的第 5 栏，多久需变更密码日数 
PASS_MIN_DAYS 0                 # /etc/shadow 内的第 4 栏，多久不可重新设定密码日数 
PASS_MIN_LEN 5                  # 密码最短字符长度，已被 pam 模组取代
PASS_WARN_AGE 7                 # /etc/shadow 内的第 6 栏，过期前会警告的日数

UID_MIN 1000                    # 用户最小的 UID，意即小于 1000 的 UID 为系统保留 
UID_MAX 60000                   # 用户能够用的最大 UID 
SYS_UID_MIN 201                 # 保留给用户自行设定的系统帐号最小值 UID 
SYS_UID_MAX 999                 # 保留给用户自行设定的系统帐号最大值 UID 
GID_MIN 1000                    # 用户自订群组的最小 GID，小于 1000 为系统保留 
GID_MAX 60000                   # 用户自订群组的最大 GID 
SYS_GID_MIN 201                 # 保留给用户自行设定的系统帐号最小值 GID 
SYS_GID_MAX 999                 # 保留给用户自行设定的系统帐号最大值 GID

CREATE_HOME yes                 # 在不加 -M 及 -m 时，是否主动建立用户家目录
UMASK 077                       # 用户 Home 目录建立的 umask ，因此权限会是 700 
USERGROUPS_ENAB yes             # 使用 userdel 删除时，是否删除初始群组 
ENCRYPT_METHOD SHA512           # 密码加密的机制使用的是 sha512 加密算法
```

所以，系统在执行 `useradd` 命令时至少会参考：
- /etc/default/useradd
- /etc/login.defs
- /etc/skel/*

现在查看 /etc/passwd 档案的最后一行：
``` bash
pango:x:1000:1000::/home/pango:/bin/bash
```
该文件是存放所有用户信息的数据库，每一行代表一个用户，每行由 6 个 `:` 分隔成了 7 个栏位：
1. 用户名
2. 密码
3. 用户 UID：0 保留给系统管理员 root 账号；1~999 保留给系统账号，这些账号通常为执行某些系统服务所用，不能通过 `shell` 登录；1000~4294967295，保留给一般账号
4. 用户初始群组 GIP
5. 备注
6. Home 目录，预设值为 /home/{username}
7. 执行 Shell 的程序目录，预设值为 /bin/bash

## 设置帐号密码 - passwd

现在，新建的用户 pango 还没有密码，在设置密码之前是无法登录的，执行 `passwd` <username> 来为新用户指定密码：
``` bash

$ passwd [--stdin] [帐号名称] # 所有人均可使用来改自己的密码 
$ passwd [-l] [-u] [--stdin] [-S] [-n 日数] [-x 日数] [-w 日数] [-i 日数] 帐号 # root 功能
选项与参数：
--stdin ：可以透过来自前一个管线的资料，作为密码输入，对 shell script 有用
-l ：是 Lock 的意思，会将 /etc/shadow 第 2 栏最前面加上 '!' 使密码失效；
-u ：与 -l 相对，是 Unlock 的意思
-S ：列出密码相关参数，亦即 shadow 档案内的大部分信息
-n ：自上一次修改密码后的密码不可修改天数，shadow 的第 4 栏位
-x ：自上一次修改密码后的密码有效天数，shadow 的第 5 栏位
-w ：密码过期前的警告天数，shadow 的第 6 栏位
-i ：密码失效缓冲天数，shadow 的第 7 栏位

$sudo passwd pango
Enter new Unix Password:
Retype new Unix Password:
```

> `passwd` 指令在不接参数时表示修改当前登录用户的密码

密码设置成功后，在 `/etc/shadow` 文件中发生了一些改变，定位到该文件的最后一行：
``` bash
pango:$6$csIys5qj$OslSKU.3SljbHXTXJEPgWvNi1w9CGlBKO3uqJyWueQN1ypA7SuNzJWjesdSvg6KPv0X6tRmkkDBFI2cbSJ.xR/:17600:0:99999:7:::
```
该文件存储了所有用户的密码相关配置，每一行代表一个用户的密码信息，每行由 8 个 `:` 分隔为 9 个栏位：
1. 用户名
2. 经过加密的密码
3. 最近修改密码日期，该值为一个代表 `day` 的数值，从 1970-01-01 日算起
4. 密码不可修改天数：该值指示密码在最近一次修改后多久之后才能再次被修改
5. 密码有效期（天）：该值指示密码再最近一次修改后的有效天数
6. 密码需要变更前的警告天数
7. 密码失效延迟（天）：密码过期后的缓冲时间
8. 账号失效日期（天）：该值指示该用户的总生命周期多长，与密码有效无效无关
9. 系统保留扩展项：

通过标准输入 `--stdin` 来修改密码，例如，帮助 pango 用户将其密码修改为 'abc543CC'

``` bash
$ echo "abc543CC" | passwd --stdin pango
Changing password for user pango.
passwd: all authentication tokens updated successfully.
```
> `--stdin` 选项并不存在于所有 Linux 发行版本的系统中，使用前先 `man passwd` 查看是否支持

## 管理帐号密码策略 - chage
除了使用 `passwd` 指令，还可以使用 `chage` 指令来管理密码策略，其用法大致如下：
``` bash
$ chage [-ldEImMW] 用户帐号名
选项与参数：
-l ：列出该帐号的详细密码参数；
-d ：修改 shadow 第 3 栏位(最近一次更改密码的日期)，格式 YYYY-MM-DD
-E ：修改 shadow 第 8 栏位(帐号失效日)，格式 YYYY-MM-DD
-I ：修改 shadow 第 7 栏位(密码失效日期)
-m ：修改 shadow 第 4 栏位(密码最短保留天数)
-M ：修改 shadow 第 5 栏位(密码多久需要进行变更)
-W ：修改 shadow 第 6 栏位(密码过期前警告日期)
```
`passwd -S` 只是简单显示了密码详情，而 `chage -l` 更多为管理员提供了更强的参考信息，列出 pango 的详细密码参数 ：
``` bash
$ chage -l pango
Last password change : Jul 20, 2015
Password expires : Sep 18, 2015
Password inactive : Sep 28, 2015
Account expires : never
Minimum number of days between password change : 0
Maximum number of days between password change : 60
Number of days of warning before password expires : 7
```
## 修改用户帐号信息 - usermod

当需要修改用户帐号的信息时，我们可以通过前往相应的文件例如，/etc/passwd 和 /etc/shadow 中去修改对应行的值以达到修改用户帐号信息的目的。也可以使用 `usermod` 指令对用户帐号进行修改：
``` bash
$ usermod [-cdegGlsuLU] username 
选项与参数：
-c ：修改用户备注，对应 /etc/passwd 第 5 栏
-d ：修改帐号 Home 目录，对应 /etc/passwd 的第 6 栏；
-e ：修改帐号失效日期，格式是 YYYY-MM-DD，对应 /etc/shadow 内的第 8 栏
-f ：修改密码失效延迟时间，对应 shadow 的第 7 栏。
-g ：修改初始群组，修改 /etc/passwd 的第 4 栏
-G ：修改次要群组组，修改该用户支援的群组，修改应用到 /etc/group
-a ：与 -G 合用，表示 append，追求次要群组而非改变
-l ：修改帐号名称， /etc/passwd 的第 1 栏
-s ：修改 shell 接入程序，后面接 Shell 的实际程序，例如 /bin/bash 或 /bin/csh 等等
-u ：修改 uid 对应 /etc/passwd 第 3 栏
-L ：暂时锁定用户，暂时无法登入。仅修改 /etc/shadow 的密码栏。
-U ：解锁用户，移除 /etc/shadow 密码栏的 '!'
```

## 删除用户帐号 - userdel
当需要删除用户帐号时，执行 `userdel` 命令，该命令会对以下文件造成影响：
- 用户帐号/密码相关值：/etc/passwd，/etc/shadow
- 用户群组相关参数：/etc/group，/etc/gshadow
- 用户个人资料目录：/home/{username}，/var/spool/mail/{username}

该指令用法如下：
``` bash
$ userdel [-r] username 
选项与参数：
-r ：连同用户的 Home 目录也一起删除
```
例如，删除 pango 用户帐号及其 Home 目录：
``` bash 
$sudo userdel -r pango
```
通常，在移除一个帐号时，我们可以手动修改 /etc/passwd 和 /etc/shadow 文件中该用户关联的行数据。如果该帐号只是「**暂时冻结**」，那么将 /etc/shadow 中第 8 栏（帐号失效日）设为 0 就可让该账户无法使用，但所有与该帐号相关的资料都会保留，使用 `userdel` 意味着「**真的确定该用户不会在主机上的使用任何资料了**」。

> 通常，一个用户在使用主机一段时间之后，会在更多其他的目录中产生属于他的文档，因此，在下达 `userdel -r username` 之前，先以 `find / -user username` 指令查出整个系统内属于 username 的档案，删除之后，再删除该用户帐号。

## 用户端指令 - id, finger, chfn, chsh

`useradd`，`usermod`，`userdel` 都是系统管理员才能使用的命令，一般用户无法进行操作，有以下几个指令供一般用户使用：
- id: 该指令可以查询当前用户或其他用户的 UID/GID 值
- finger: 查询用户的口令信息，将有
    - Login: 用户帐号信息
    - Name: 备注信息
    - Directory: Home 目录
    - Shell: shell 对应的程序
    - Never logged in: 登入信息
    - No mail: 查看 /var/spool/mail 中的信箱资料
    - No Plan: 查看 ~{username}/.plan 资料
- chfn: 修改指纹信息，不常用
- chsh: 修改 shell，参数如下：
    - -l，列出所有可用的 shell，即 /etc/shells 中的内容
    - -s，修改为指定的 shell

# 群组管理

群组管理涉及新增，修改和删除，群组的内容与以下两个档案有关：
- /etc/group
- /etc/gshadow

## 新增群组 - groupadd
使用 `groupadd` 来新增群组，该命令使用方法如下：
``` bash
$ groupadd [-g gid] [-r] 群组名称
选项与参数：
-g ：指定群组 GID
-r ：指定该群组为系统群组，与 /etc/login.defs 内的 GID_MIN 有关
```

执行命令查看新建的群组：
``` bash
$ nano /etc/group
...
<your-new-group-name>:x:<gid>:
```
该命令查询 /etc/group 文件，该文件是 `linux` 系统保存所有群组的数据库，每一行代表一个群组，每行的值由 3 个 `:` 分隔为 4 栏不同的值，其具体指：
1. 群组名称
2. 群组密码，以 `x` 表示，引用 /etc/gshadow 的第 2 栏
3. 群组 id
4. 该群组包含的用户名称，每个用户名称由 `,` 分隔 

`x` 表示该群组的密码，其在 /etc/gshadow 文件中对应第 2 栏的值，`gshadow` 文件保存了所有群组的详细配置，但只有拥有 `root` 权限的用户才能查看该文件。由于该群组刚刚创建，没有指定任何用户，故该值为空。

查看 /etc/gshadow 文件可以看到对应的行，其格式如下：
``` bash
<your-new-group-name>:!::usernames
```
这个文件内的格式几乎与 /etc/group 一摸一样，第 2 栏是密码栏，如果密码栏为 '!' 或空，表示该群组不具有群组管理员：
1. 群组名称
2. 密码栏，若为 '!' 表示无合法密码，无群组管理员
3. 群组管理员的帐号
4. 所有加入该群组的帐号，与 /etc/group 内容相同

## 修改群组 - groupmod
与 `usermod` 类似，`groupmod` 指令用于对已有群组的信息进行修改
``` bash
$ groupmod [-g gid] [-n group_name] 群组名
选项与参数：
-g ：修改既有的 GID 值；
-n ：修改既有的群组名称
```
> 一个群组创建之后，为了避免引起不必要的错乱，通常不建议随意修改其 GID

## 删除群组 - groupdel

```bash
groupdel [groupname]
```

使用 `groupdel` 来删除已有的群组，如果有用户帐号已经关联一个群组作为其初始群组，将无法直接删除该群组，否则当用户登入系统后，系统将找不到其对应的群组。想要删除该群组，必须：
- 修改与之关联的用户的初始群组
- 删除该用户，再删除群组

## 群组管理员 - gpasswd

``` bash
$ gpasswd groupname 
$ gpasswd [-A user1,...] [-M user3,...] groupname 
$ gpasswd [-rR] groupname 
选项与参数：
若没有任何参数时，表示给予 groupname 一个密码(/etc/gshadow)
-A ：将 groupname 的主控权交由参数代表的多个用户管理(该群组的管理员)
-M ：将某些帐号加入这个群组当中！
-r ：将 groupname 的密码移除
-R ：让 groupname 的密码栏失效
-a ：将用户加入到 groupname 这个群组中
-d ：将用户移除 groupname 这个群组中
```

## 初始群组，次要群组和有效群组
在执行 `useradd` 命令新建用户时，使用 `-g` 命令指定初始群组，该群组的 GID 被写入到 /etc/passwd 对应的 GID 栏位，而 `-G` 指定的次要群组则将用户名写入 /etc/group 第 4 栏。

当用户登入系统进入 `shell` 环境后，系统总是以该用户所在的初始群组作为有效群组，即，当用户执行类似 `touch` 的指令创建新的文件或文件夹时，其权限会给予用户当前的有效群组。执行 `groups` 可查看当前登录用户所属的所有群组，排在第一位的即表示当前有效群组。

可通过执行 `newgrp` 指令将用户所属的另一个群组切换为当前有效群组，该动作导致用户进入另一个 `shell` 环境，当用户完成操作不再需要该群组支持时，应使用 `exit` 指令退回到之前的 `shell` 环境。
