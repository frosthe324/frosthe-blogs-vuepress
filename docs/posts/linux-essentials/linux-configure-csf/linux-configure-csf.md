---
title: 为 Linux 系统配置 CSF
description: 本文介绍了基于 Linux 系统配置 csf 防火墙的注意事项
excerpt: 本文介绍了基于 Linux 系统配置 csf 防火墙的注意事项
author: Frost He
date: 2016-05-10
lang: zh-CN
category:
- Linux Basic
tag:
- linux
- security
---

本文大纲: 
<!-- TOC -->

- [功能](#%E5%8A%9F%E8%83%BD)
  - [认证失败检测守护进程](#%E8%AE%A4%E8%AF%81%E5%A4%B1%E8%B4%A5%E6%A3%80%E6%B5%8B%E5%AE%88%E6%8A%A4%E8%BF%9B%E7%A8%8B)
  - [进程追踪](#%E8%BF%9B%E7%A8%8B%E8%BF%BD%E8%B8%AA)
  - [目录监控](#%E7%9B%AE%E5%BD%95%E7%9B%91%E6%8E%A7)
  - [消息服务](#%E6%B6%88%E6%81%AF%E6%9C%8D%E5%8A%A1)
  - [端口涌流保护](#%E7%AB%AF%E5%8F%A3%E6%B6%8C%E6%B5%81%E4%BF%9D%E6%8A%A4)
  - [Port Knocking](#port-knocking)
  - [连接限制保护](#%E8%BF%9E%E6%8E%A5%E9%99%90%E5%88%B6%E4%BF%9D%E6%8A%A4)
  - [Port/IP 地址重定向](#portip-%E5%9C%B0%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91)
  - [UI 集成](#ui-%E9%9B%86%E6%88%90)
  - [IP 屏蔽列表](#ip-%E5%B1%8F%E8%94%BD%E5%88%97%E8%A1%A8)
- [安装 ConfigServer Firewall](#%E5%AE%89%E8%A3%85-configserver-firewall)
  - [下载](#%E4%B8%8B%E8%BD%BD)
  - [解压缩](#%E8%A7%A3%E5%8E%8B%E7%BC%A9)
  - [安装](#%E5%AE%89%E8%A3%85)
- [基本配置](#%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE)
  - [配置端口](#%E9%85%8D%E7%BD%AE%E7%AB%AF%E5%8F%A3)
    - [任何主机](#%E4%BB%BB%E4%BD%95%E4%B8%BB%E6%9C%BA)
    - [Apache](#apache)
    - [FTP 服务器](#ftp-%E6%9C%8D%E5%8A%A1%E5%99%A8)
    - [邮件服务器](#%E9%82%AE%E4%BB%B6%E6%9C%8D%E5%8A%A1%E5%99%A8)
    - [MySQL 服务器](#mysql-%E6%9C%8D%E5%8A%A1%E5%99%A8)
  - [进阶配置](#%E8%BF%9B%E9%98%B6%E9%85%8D%E7%BD%AE)
  - [应用更改](#%E5%BA%94%E7%94%A8%E6%9B%B4%E6%94%B9)
- [屏蔽与允许 ip 地址](#%E5%B1%8F%E8%94%BD%E4%B8%8E%E5%85%81%E8%AE%B8-ip-%E5%9C%B0%E5%9D%80)
  - [屏蔽 ip 地址](#%E5%B1%8F%E8%94%BD-ip-%E5%9C%B0%E5%9D%80)
  - [允许 ip 地址](#%E5%85%81%E8%AE%B8-ip-%E5%9C%B0%E5%9D%80)
  - [忽略 ip 地址](#%E5%BF%BD%E7%95%A5-ip-%E5%9C%B0%E5%9D%80)

<!-- /TOC -->

Config Server Firewall(CSF) 基于一般的防火墙功能(数据包过滤)进行了扩展，支持大多数 Linux 发行版本，其支持列表可在其[官网](https://www.configserver.com/cp/csf.html)找到。以下以 ubuntu 系统为例介绍 CSF 的使用。

<!-- more -->

> 对 CSF 的几乎所有指令操作都需要管理员权限，本篇文章仅涵盖 ipv4 的防火墙设置 - iptables。ipv6 对应的是 ip6tables。

# 功能

## 认证失败检测守护进程

CSF 每隔一段时间就会检查系统登录日志，对那些登录失败的请求尝试进行监控，在达到预设的失败次数后，CSF 将对发起这些请求的 ip 地址做预设的处理，失败次数和处理动作都是可自定义的。

以下程序对该功能兼容：
- Courier imap, Dovecot, uw-imap, Kerio
- openSSH
- cPanel, WHM, Webmail (cPanel servers only)
- Pure-ftpd, vsftpd, Proftpd
- Password protected web pages (htpasswd)
- Mod_security failures (v1 and v2)
- Suhosin failures
- Exim SMTP AUTH
同时，可以自定义匹配 Regex 的登录文件来，对登录失败尝试的用户进行屏蔽。

## 进程追踪
CSF 可检测异常行为的进程或异常开启端口的行为，在捕获到这些行为时可配置发送邮件给服务器管理员。

## 目录监控
CSF 可监控 `/temp` 和其他相关的目录扫描恶意脚本，并在发现风险时发送邮件给服务器管理员。

## 消息服务
启用该功能可让 CSF 在屏蔽客户端时传送一些有用的信息，但这样做可能会为黑客提供一些线索信息，继而增加服务器的风险。

## 端口涌流保护
该设置提供端口涌流保护，比如 DDoS 攻击，可以为每个端口指定特定时间内允许最大的连接数。启用该功能可以极大降低黑客的野蛮攻击导致服务器宕机。找到一个适合的参数需要一些尝试，太过严格的流量限制会降低正常用户的体验。

## Port Knocking
参考 [Port Knocking](http://www.portknocking.org/)。

## 连接限制保护
该功能可限制由单一 ip 地址对特定端口建立的连接数，这也是防止 DDoS 攻击的手段之一。

## Port/IP 地址重定向
可配置 CSF 将对特定 IP/Port 的连接重定向到另一个 IP/Port。注意，重定向之后，请求发起的客户端将变为服务器的 ip 地址，该功能与 NAT 不同。

## UI 集成
除了命令行工具之外，CSF 对 cPanel 和 Webmin 提供了 UI 集成。

## IP 屏蔽列表
CSF 可使用该功能从预设的源下载屏蔽的 ip 地址列表。

# 安装 ConfigServer Firewall

## 下载
从官网下载安装包到当前工作目录：
``` bash
wget http://download.configserver.com/csf.tgz
```

## 解压缩
下载下来的是一个压缩包，安装之前需要解压缩
``` bash
tar -xzf csf.tgz
```

## 安装
在进行安装之前，首先禁用其他防火墙脚本，例如 UFW，执行以下指令禁用 UFW：
``` bash
$sudo ufw disable
```
导航到刚刚解压出来的文件夹 `csf`，执行安装脚本：
``` bash
cd csf
$sudo sh install.sh
...
Installation Completed
```
安装完成后，查看指定的 iptables 是否可用：
``` bash
$sudo perl /usr/local/csf/bin/csftest.pl

Testing ip_tables/iptable_filter...OK
Testing ipt_LOG...OK
Testing ipt_multiport/xt_multiport...OK
Testing ipt_REJECT...OK
Testing ipt_state/xt_state...OK
Testing ipt_limit/xt_limit...OK
Testing ipt_recent...OK
Testing xt_connlimit...OK
Testing ipt_owner/xt_owner...OK
Testing iptable_nat/ipt_REDIRECT...OK
Testing iptable_nat/ipt_DNAT...OK

RESULT: csf should function on this server
```
出现以上报告内容则表明 CSF 已可在服务器上正常运行。

> 此时，通过远程登录连接到服务器的 ip 地址会被自动加入到白名单中，同时 SSH 占用的端口(即便是自定义的端口)也会放行，CSF 默认使用测试模式，该模式下所有的 iptables 规则将在 5 分钟后自动被移除。一旦确认所有配置已经就绪，应该由测试模式切换为工作模式。

# 基本配置
通过编辑 /etc/csf/csf.conf 文件来配置 CSF，保存更改后，执行 `csf -r` 来使配置重新生效。
``` bash
$sudo nano /etc/csf/csf.conf
```
## 配置端口
配置文件中默认开启的端口如下：
``` bash
TCP_IN = "20,21,22,25,53,80,110,143,443,465,587,993,995"

TCP_OUT = "20,21,22,25,53,80,110,113,443"

UDP_IN = "20,21,53"

UDP_OUT = "20,21,53,113,123"
```
这些端口代表的默认服务如下：
- Port 20: FTP 数据传输
- Port 21: FTP 控制
- Port 22: 安全 shell (SSH)
- Port 25: [简单邮件传输协议](https://zh.wikipedia.org/wiki/%E7%AE%80%E5%8D%95%E9%82%AE%E4%BB%B6%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE) (SMTP)
- Port 53: [域名系统](https://zh.wikipedia.org/wiki/%E5%9F%9F%E5%90%8D%E7%B3%BB%E7%BB%9F) (DNS)
- Port 80: [超文本传输协议](https://zh.wikipedia.org/wiki/%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE) (HTTP)
- Port 110: [邮局协议 v3](https://zh.wikipedia.org/wiki/%E9%83%B5%E5%B1%80%E5%8D%94%E5%AE%9A) (POP3)
- Port 113: [身份协议](https://en.wikipedia.org/wiki/Ident_protocol)
- Port 123: [网络时间协议](https://zh.wikipedia.org/wiki/%E7%B6%B2%E8%B7%AF%E6%99%82%E9%96%93%E5%8D%94%E5%AE%9A) (NTP)
- Port 143: [因特网信息访问协议](https://zh.wikipedia.org/wiki/%E5%9B%A0%E7%89%B9%E7%BD%91%E4%BF%A1%E6%81%AF%E8%AE%BF%E9%97%AE%E5%8D%8F%E8%AE%AE) (IMAP)
- Port 443: [超文本安全传输协议](https://zh.wikipedia.org/wiki/%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%AE%89%E5%85%A8%E5%8D%8F%E8%AE%AE) (HTTPS)
- Port 465: URL Rendesvous Directory for SSM (Cisco)
- Port 587: [简单邮件传输协议](https://zh.wikipedia.org/wiki/%E7%AE%80%E5%8D%95%E9%82%AE%E4%BB%B6%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE) (SMTP)
- Port 993: 因特网安全信息访问协议 (IMAPS)
- Port 995: 安全邮局协议 v3 (POP3S)

以下是针对常见场景开启的服务端口：

### 任何主机
``` bash
TCP_IN: 22,53
TCP_OUT: 22,53,80,113,443
UPD_IN: 53
UPD_OUT: 53,113,123
```
### Apache
``` bash
TCP_IN: 80,443
```
### FTP 服务器
``` bash
TCP_IN: 20,21
TCP_OUT: 20,21
UPD_IN: 20,21
UPD_OUT:20,21
```
### 邮件服务器
``` bash
TCP_IN: 25,110,143,587,993,995
TCP_OUT: 25,110
```
### MySQL 服务器
``` bash
TCP_IN: 3306
TCP_OUT: 3306
```

## 进阶配置
CSF 提供了大量的可配置项，最常用的列表如下：
- ICMP_IN: 设置为 1 时将允许外部主机 ping，设为 0 则禁止任何请求
- ICMP_IN_LIMIT: 特定时间内允许同一 ip 地址的 ping 的请求数，通常不用修改，默认值为 1/s
- DENY_IP_LIMIT: 设置屏蔽 ip 地址的最大数量，保留太多数量会降低服务器性能
- DENY_TEMP_IP_LIMIT: 与 DENY_IP_LIMIT 类似，但仅作用于临时屏蔽的 ip 地址
- PACKET_FILTER: 过滤无效的，不需要的和非法的数据包
- SYNFLOOD, SUNFLOOD_RATE 和 SYNFLOOD_BURST: 这三项提供了针对 SYN flood 攻击的保护，但会降低每个连接的初始化速度，仅当明确服务器正遭受攻击时启用该项
- CONNLIMIT: 限制指定端口的并发连接数
    - 如: 22;5;443;20 - 该值允许在 22 端口上最大 5 个并发连接数，在 443 端口上最大 20 个并发连接数
- PORTFLOOD: 限制指定端口上单位时间内的最大连接数
    - 如: 22;tcp;5;250 - 该值限制如果 22 端口上已有 5 个 tcp 连接，那么第 6 个来临的 tcp 连接将等待 250 秒，之后屏蔽解除，5 个新的 tcp 连接放行

其他设置在大多数情况都无需改动，如果确实需要自定义这些配置，阅读 `/etc/csf/csf.conf` 各项配置上的注释来了解其用途。

## 应用更改
在应用更改前将第一项配置 TESTING = "1" 改为 TESTING = "0" 以使 csf 切换为工作模式。再以管理员权限执行 `sudo csf -r` 使更改生效。

# 屏蔽与允许 ip 地址

防火墙最基础的功能是屏蔽，允许及忽略特定的 ip 地址，csf 可通过编辑 csf.deny, csf.allow 和 csf.ignore 文件来实现。

## 屏蔽 ip 地址

使用编辑器打开 csf.deny
``` bash
$sudo nano /etc/csf/csf.deny
```
每一行代表一条屏蔽项，可以是单一的 ip 地址，也可以是一个网段，例如：
``` bash
1.2.3.4
2.3.0.0/16
```

## 允许 ip 地址
如果希望指定的 ip 地址或网段避开屏蔽和过滤扫描，可将它们加入到白名单列表，一旦将它们加入白名单，即便它们在 csf.deny 中已经存在，也会让它们绕过防火墙。

编辑 csf.allow 文件来加入白名单：
``` bash
$sudo nano /etc/csf/csf.allow
```

## 忽略 ip 地址

忽略名单与白名单的区别在于，忽略名单仅仅不进行过滤检查，但依然可能被加入黑名单中。
``` bash
$sudo nano /etc/csf/csf.ignore
```

最后，执行 `sudo csf -r` 重载 csf 以使配置生效。