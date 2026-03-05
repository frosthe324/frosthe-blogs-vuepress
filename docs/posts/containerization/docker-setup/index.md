---
title: Docker 初探 (1) - 搭建 Docker 环境
date: 2018-01-28 23:09:17
description: 本文基于 Docker GetStarted 官方文档，简要介绍了如何在 Ubuntu 16.04 下搭建 Docker 环境
categories:
- Docker
tag: 
- ops
- docker
---

参考资料:
- [Get Docker CE for Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- [Post-installation steps for Linux](https://docs.docker.com/install/linux/linux-postinstall/)

Docker 继承自 Linux 系统的**「容器化(Containerization)」**，是一个为开发人员和系统管理员用于开发，部署和运行应用程序的容器系统，容器化的特点有:
- 灵活性: 任何复杂的应用都可以被容器化
- 轻量: 容器共享主机的内核
- 可互换: 可在运行过程中部署更新
- 便携性: 本地编译，云端部署，在任何地方都可以运行
- 伸缩性: 增加容器副本相当容易且自动化
- 可堆叠: 可在运行过程中纵向扩展

`Docker` 官方目前提供两个版本：Community Edition (CE) 和 Enterprise Edition (EE)。企业版是收费的。

# 搭建 Docker 环境
## Image 和 Container
`Image` 是一个包含了运行应用程序所需所有东西的包——源代码，运行时，库，环境变量和配置文件
`Container` 是 `Image` 的运行时实例，是 `Image` 在内存中的体现。

## Containers 和虚拟机
Container 运行在 Linux 系统本地并与其他 Container 共享主机内核，它以**「离散的进程」**形式存在，不会占用比一般进程更多的资源。而虚拟机则运行整个客户机操作系统，并以虚拟化的方式访问主机资源，因此虚拟机会占用更多不必要的资源。

# 在 Ubuntu Xenial 16.04(LTS) 系统上安装 Docker CE
首先移除任何 Docker 旧版本:
``` bash
$ sudo apt-get remove docker docker-engine docker.io
```
## 从 Repository 安装
### 搭建 Repository
1. 从 `apt` 更新包:
``` bash
$ sudo apt-get update
```
2. 允许 `apt` 使用 `https` 来安装包
``` bash
$ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
```
3. 添加 Docker 官方 GPG key:
``` bash
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```
4. 验证 key 的最后 8 位字符:
`9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88`
```bash
$ sudo apt-key fingerprint 0EBFCD88

pub   4096R/0EBFCD88 2017-02-22
      Key fingerprint = 9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid                  Docker Release (CE deb) <docker@docker.com>
sub   4096R/F273FCD8 2017-02-22
```
5. 使用以下命令搭建稳定版的 repository:
``` bash
$ sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```
> `lsb_release` 返回 Ubuntu 发行版的名称，如 xenial。`stable` 为每季度发行一次的稳定版，`edge` 为每月发行一次的尝鲜版。

### 安装 Docker CE
1. 更新包的索引:
``` bash
$ sudo apt-get update
```
2. 安装最新版的 Docker CE:
``` bash
$ sudo apt-get install docker-ce
```
> 安装完成后，`Docker` 守护进程将自动启动
3. 通过运行一个 `hello world` 程序来验证 `Docker CE` 已经正确安装
``` bash
$ sudo docker run hello-world
```
该命令会从网络下载一个测试 `image`，并以新的容器实例执行。执行以下命令查看已下载的 `image`:
``` bash
$ sudo docker image ls
```
4. 检查正在运行的 container 实例: 
``` bash
$ sudo docker container ls --all
```
该指令检查包含正在运行和过往运行的 `container` 实例记录，如果有 `container` 正在运行，则不需要 `--all` 选项。

### 卸载 Docker CE
1. 卸载 Docker CE 包:
```bash
$ sudo apt-get purge docker-ce
```
2. image, container, volumns 或其他自定义的配置文件将不会自动删除，如果想要完全删除，则执行:
```bash
$ sudo rm -rf /var/lib/docker
```

# 以 non-root 用户管理 Docker
`docker` 守护进程绑定一个 Unix 套接字而非普通的 TCP 端口，默认情况下，Unix 套接字被 `root` 用户所有，其他用户只能通过 `sudo` 进行访问。`docker` 进程始终以 `root` 用户运行。

Docker CE 在安装完成后，会创建一个新的 `docker` 群组，但不会加入任何现有用户到该群组下，如果不想每次执行 `docker` 命令时加上 `sudo`，可以将指定用户加入到群组下。当 `docker` 进程启动时，`docker` 群组对 `docker` 使用的 Unix 套接字具有读写权限。

> 由于 `docker` 群组与 root 权限一致，有关 `docker` 的安全问题请参考 [Docker Security](https://docs.docker.com/engine/security/security/)

1. 将当前用户添加至 `docker` 群组:
``` bash
$ sudo usermod -aG docker $USER
```
2. 登出用户再登录以使群组重新评估
再次执行 `docker run hello-world` 不再要求 `root` 权限，如果在将用户添加到 `docker` 群组之前已经执行过 `docker` 的任何命令，那么 `~/.docker` 文件夹的权限会以 `root` 创建，为了解决这个问题，要么移除 `~/.docker`(它将会自行创建)，要么更改其拥有者和权限:
``` bash
$ sudo chown "$USER":"$USER" /home/"$USER"/.docker -R
$ sudo chmod g+rwx "/home/$USER/.docker" -R
```

# 将 docker 配置为开启启动
有许多 Linux 发行版使用 `systemd` 来管理自启动服务，要使 `docker` 开机启动，执行:
``` bash
$ sudo systemctl enable docker
```
禁用开机启动:
``` bash
$ sudo systemctl disable docker
```