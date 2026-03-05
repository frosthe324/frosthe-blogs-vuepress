---
title: 向 Let's Encrypt CA 申请通配符证书
description: 申请通配符数字证书是 Let's Encrypt 近期推出的功能，只有支持 ACME v2 协议的客户代理软件才能申请通配符证书
excerpt: 申请通配符数字证书是 Let's Encrypt 近期推出的功能，只有支持 ACME v2 协议的客户代理软件才能申请通配符证书
author: Frost He
date: 2018-07-24
lang: zh-CN
category:
- Cryptography
tag:
- security
- https
---

本文索引:
- [前言](#%E5%89%8D%E8%A8%80)
- [申请通配符证书](#%E7%94%B3%E8%AF%B7%E9%80%9A%E9%85%8D%E7%AC%A6%E8%AF%81%E4%B9%A6)
- [更新通配符证书](#%E6%9B%B4%E6%96%B0%E9%80%9A%E9%85%8D%E7%AC%A6%E8%AF%81%E4%B9%A6)
- [自动更新通配符证书](#%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0%E9%80%9A%E9%85%8D%E7%AC%A6%E8%AF%81%E4%B9%A6)
- [使用 acme.sh 替代 certbot ACME 客户端(TBD)](#%E4%BD%BF%E7%94%A8-acmesh-%E6%9B%BF%E4%BB%A3-certbot-acme-%E5%AE%A2%E6%88%B7%E7%AB%AFtbd)

## 前言
近期，`Let's Encrypt` 开放了通配符数字证书申请。通配符数字证书实现了单个证书绑定多个子域名。为了实现通配符证书，`Let’s Encrypt` 对 ACME 协议的实现进行了升级，只有 v2 协议才支持通配符证书。用户可自行查看客户代理软件是否支持 ACME v2 版本。官方主推的 `Certbot` 也需要升级到 0.22.0 版本之后才支持通配符证书。

通配符证书目前**仅支持 `dns-01` 方式**的 `Challenge`:
- dns-01: 申请人被要求将一串随机字符串以 `TXT` 记录添加至目标域名。

不同的 DNS 提供商可能提供了对应的「插件」，可能需要单独安装，`certbot` 第三方 DNS 插件可在[此页面](https://certbot.eff.org/docs/using.html?highlight=wildcard#third-party-plugins)查看。如果你注册的域名提供商(例如阿里云)没有提供官方的 DNS 插件，那么只能手动完成验证。

___
## 申请通配符证书
以下以 `*.frosthe.net` 为例，使用 `manual` 插件回应 `Challenge`。
```
$ certbot certonly -d *.frosthe.net --manual --preferred-chanllenge dns --server https://acme-v02.api.letsencrypt.org/directory
```
该命令表明:
- 仅为 `*.frosthe.net` 获取通配符证书，无需安装
- 使用 `manual` 插件
- 使用 `dns` 方式回应 `Challenge`
- 告知 `certbot` 采用 `Let's Encrypt` ACME v2 协议的 API 服务器

接下来，命令行显示窗会询问申请人当前主机的 ip 地址将被记录，是否接收，输入 y:
```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
NOTE: The IP of this machine will be publicly logged as having requested this
certificate. If you're running certbot in manual mode on a machine that is not
your server, please ensure you're okay with that.

Are you OK with your IP being logged?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: y
```
下一步 `certbot` 将要求申请人手动添加一条 `TXT` 的解析:
```bash
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please deploy a DNS TXT record under the name
_acme-challenge.frosthe.net with the following value:

h9MFbboNRKqN4_8iDlu4dpIBd9UrXKqRrmP62ZHGhJ8

Before continuing, verify the record is deployed.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Press Enter to Continue

```
现在，登录 `frosthe.net` 域名注册商的后台管理界面，按照上述要求添加一条如下图的解析记录:
![添加 TXT 解析记录](./txt-res-record.pnt)
确认无误后，回车，得到如下信息:
```bash
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/frosthe.net/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/frosthe.net/privkey.pem
   Your cert will expire on 2019-03-30. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```
操作完成，可至对应的目录获取证书以作用后。

___
## 更新通配符证书
`certbot renew` 试图加载当前管理的所有证书的配置信息更新证书，`certbot renew` 更新阿里云托管的域名还存在一些问题没有解决。目前更新证书使用同样的 `certbot certonly` 子命令完成，必须手动完成 `challenge`:
```bash
$ certbot certonly -d *.frosthe.net --manual --preferred-challenge dns --server https://acme-v02.api.letsencrypt.org/directory

Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator manual, Installer None
Cert is due for renewal, auto-renewing...
Renewing an existing certificate
Performing the following challenges:
dns-01 challenge for frosthe.net

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
NOTE: The IP of this machine will be publicly logged as having requested this
certificate. If you're running certbot in manual mode on a machine that is not
your server, please ensure you're okay with that.

Are you OK with your IP being logged?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: y

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please deploy a DNS TXT record under the name
_acme-challenge.frosthe.net with the following value:

dhlr5daZbfwlgkjTSVHTPQXY2bWEr3VuBUHKegAofj4

Before continuing, verify the record is deployed.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Press Enter to Continue
Waiting for verification...
Cleaning up challenges

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/frosthe.net/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/frosthe.net/privkey.pem
   Your cert will expire on 2019-06-29. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le


```
___
## 自动更新通配符证书
由于通配符证书仅支持 dns 方式的验证，而这种方式要求申请人在其域名管理后台添加新的 `TXT` 记录，除了某些官方列出的域名提供商以外，其他域名托管商(例如阿里云)的申请人需要外挂脚本来自动化这一过程，参考 [Pre and Post Validation Hooks](https://certbot.eff.org/docs/using.html?highlight=wildcard#pre-and-post-validation-hooks)。

## 使用 acme.sh 替代 certbot ACME 客户端(TBD)