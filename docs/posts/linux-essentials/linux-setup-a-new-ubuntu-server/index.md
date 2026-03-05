---
title: 搭建 Ubuntu 16.04 LTS
date: 2016-05-11 22:45:32
description: 近年来云计算服务器越来越流行，在适当的时机准备一台拥有公网 ip 的云服务器以备不时之需
categories: 
- Linux Basic
tag:
- linux
---

最近租用了一台预装 `ubuntu` 操作系统(这里选择 `ubuntu` 是因为笔者对其预装的工具集比较熟悉)的服务器之后，还要为这台服务器做一些额外的配置以使其能够在互联网环境中正常运行。很多云服务提供商都提供了适配不同需求的预装环境，但为了对服务器的搭建过程有一个直观的感觉和更多的控制权，决定亲手过一遍这个过程。

> 本篇文章涉及的所有指令细节可参考[Linux 基础 - 用户管理](/linux/linux-account-and-group)

通常，配置一台裸机至少要完成以下几个步骤
- 新建群组
- 新建用户，并为其分配群组
- 配置 `ssh`
- 配置服务器安全策略


# 准备工作

在开始配置之前，我们需要知道该服务器的以下信息：

- 服务器的公网 ip 地址
- 确认 22 端口打开
- root 用户的初始密码

在 windows 系统下启动 PuTTy，使用 `root` 用户远程登录到该服务器

# 主机命名 hostname(可选的)
如果不想修改云服务提供商默认分配的主机名，可跳过此步。

执行命令 `hostname` 显示当前主机名
``` bash
$ hostname
VM-0-4
```
执行以下命令进行修改，修改完成后，再次执行命令以查看效果：
``` bash 
$sudo hostname <your-new-hostname>
$ hostname
your-new-hostname
```

# 新建群组 - groupadd
执行如下命令新建一个带有 `<gid>` 的群组 
``` bash
$sudo groupadd <your-new-group-name> -g <gid>
```

# 新建用户 - useradd

``` bash
$sudo useradd -u 2500 -m -c "FrostHe" -s -g sudo -G pango pango
```
该命令创建一个名为 `pango` 的用户，`uid` 为 2500，要求为该用户创建 Home 目录，使用预设值设置 `shell` 环境，加入初始群组 `sudo`，同时加入次要群组 `pango`。由于先前已经创建了群组，在创建该用户时就不会再创建与之同名的新的群组，而是将该用户加入到该群组下。

现在，新建用户 pango 还没有密码，设置密码之前是无法登录 shell 的，执行 `passwd` <username> 来为新用户指定密码：
``` bash
$sudo passwd pango
Enter new Unix Password:
Retype new Unix Password:
```
> `passwd` 指令在不接参数时表示修改当前登录用户的密码

现在，退出 PuTTy 客户端，以新建用户名和密码登录，如果登录成功，则表明新用户创建无误。

# 配置服务器安全策略
将云服务器的 22 端口暴露于互联网并允许 root 用户及一般用户以密码进行登录是不推荐的，特别是 root 帐号，一旦被攻击者破解那么服务器上的资源可任由其修改。为了使服务器免于这些危险，我们需要让这台服务器：
- 禁用 root 帐号密码登录，仅启用公钥认证
- 开启防火墙并限定端口
- 设置 ip 登录策略及

## 禁用密码登录并启用 ssh 公钥登录

以新建用户登录系统，修改 `sshd_config` 文件：
``` bash
$sudo nano /etc/ssh/sshd_config
PermitRootLogin no
PublicAuthentication yes
PasswordAuthentication no
```
该配置对 ssh 客户端远程登录作出限制：启用公钥认证并禁用密码认证，同时禁止 `root` 远程登录。

> 若要修改生效， `sshd` 进程需要重新读取该配置，但这会让已经通过密码登录的会话中断，并且在 public key 部署前没有任何机会重新进行远程连接，所以这一步放到最后来做。

接下来在新用户 Home 目录下的 `.ssh/authorized_keys` 文件中复制 openssh 格式的公钥值。

> 在 `/etc/ssh/sshd_config` 中有一行 `AuthorizedKeyFiles`，该行的默认值为 `.ssh/authorized_keys`，该项配置是 `sshd` 进程提取 `public key` 的依据，如果对该值进行了修改，那么这里新建的文件也必须要与之对应。

现在执行 `sudo service sshd reload` 以使配置生效。此时重新打开一个 PuTTy 客户端，使用新用户密码登录，将收到错误对话框：
{% asset_img putty_authentication_error.png 尝试使用用户名密码通过 PuTTy 远程登录时报错 %}
在 Putty 中设置对应的私钥路径，重试即可登录成功：
{% asset_img putty_configuration_ppk.png PuTTy private key 配置 %}

至此，一个基本的云服务器配置就完成了，有的云服务提供商推出了「**安全组**」功能，即从云端配置端口进出通道。更多安全配置查阅 [为 Linux 系统配置 CSF](/linux/linux-configure-csf)。