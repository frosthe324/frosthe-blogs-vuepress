---
title: Docker 初探 (3) - Services
date: 2018-01-30 23:09:17
description: 本文基于 Docker GetStarted 官方文档，介绍了 Docker Compose 和 Docker Service 的概念以及如何使用
categories:
- Docker
tag: 
- ops
- docker
---

参考资料: [Services](https://docs.docker.com/get-started/part3/)

# Docker Compose
`Docker Compose` 是用以定义与运行多容器 `Docker` 应用的工具，使用 YAML 文件配置应用的服务，之后，执行一句简单的命令行来创建和启动定义好的应用。`Compose` 在 `Docker for Mac` 和 `Docker for Windows` 上都已经预装了，但 `Linux` 系统需要手动安装。

## 安装 Docker Compose
1. 执行命令下载 Docker Compose 的最新版
```bash
$ sudo curl -L https://github.com/docker/compose/releases/download/1.21.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
```
> 将版本号改为 [Compose repository release page on GitHub](https://github.com/docker/compose/releases) 上最新版的版本号。

2. 为 `docker-compose` 可执行程序添加执行权限。
``` bash
$ sudo chmod +x /usr/local/bin/docker-compose
```

3. 测试安装是否成功:
``` bash
$ docker-compose --version
docker-compose version 1.21.2, build a133471
```
有关 `Docker Compose` 的更多详情参考 [Docker Compose](https://docs.docker.com/compose/overview/)

# 关于 Service
在分布式系统中，各个部件被称作 `Services`。例如，一个视频分享网站，它很可能包含一个把应用数据存到数据库中的服务，用户上传一个视频后，在后台转码视频的专有服务以及一个响应前台的服务。一个 `service` 仅仅运行一个 `image`，但它指导了改 `image` 应该如何运行 - 应该使用哪个端口，需要运行多少个 `container` 实例以支撑服务的容量。`container` 实例数量的增减用以伸缩该服务。

# docker-compose.yml 文件
`docker-compose.yml` 文件是一个定义 `container` 应该如何运作的 `YAML` 文件。新建该文件放置于任何想要的位置，并为其填充内容: 
```bash
$ touch docker-compose.yml

version: "3"
services:
  web:
    # replace username/repo:tag with your name and image details
    image: frosthe/get-started:part2
    deploy:
      replicas: 5
      resources:
        limits:
          cpus: "0.1"
          memory: 50M
      restart_policy:
        condition: on-failure
    ports:
      - "80:80"
    networks:
      - webnet
networks:
  webnet:
```
该文件告知 `Docker` 执行以下事情:
- 拉取 frosthe/get-started:part2 的 `image`
- 定义了一个名为 `web` 的服务，该服务运行该 `image` 的 5 份实例，且限制每个实例最多占用 10% 的 CPU 和 50M 的内存
- 立即重启 `container` 如果任何一个启动失败
- 映射主机的 80 端口到 `web` 服务的 80 端口
- 告知名为 `web` 的服务的所有 `container` 实例通过一个名为 `webnet` 的负载均衡网络共享 80 端口(其内部机制为 `container` 轮流将它们自己发布到 `web` 服务的 80 端口)
- 定义 `webnet` 网络，默认配置为一个叠加的负载均衡网络

# 启动新的负载均衡应用
首先初始化一个 `swarm`: 
```bash
$ docker swarm init

Swarm initialized: current node (iqaw9hws38ctvpghyxaycrj4t) is now a manager.
```
> 有关 `swarm` 的介绍，参考 [Docker 初探 (4) - Swarms](/deployment/note-docker-swarms)，如果不运行该指令，将会报 "this node is not a swarm manager" 的错误信息

现在，运行该程序，给它一个名称:
```bash
$ docker stack deploy -c docker-compose.yml getstartedlab

Creating network getstartedlab_webnet
Creating service getstartedlab_web
```
执行 `docker service ls` 查看是否成功运行:
``` bash
$ docker service ls

ID                  NAME                MODE                REPLICAS            IMAGE                       PORTS
o3jo325ds62i        getstartedlab_web   replicated          5/5                 frosthe/get-started:part2   *:80->80/tcp
```
可以看到名为 `web` 的服务已经运行，在一个服务中单独运行的 `container` 称为一个 `task`，`task` 会被分配递增的数字 ID，直到定义的副本数量的最大值，列出该服务的所有 `task`:
```
$ docker service ps ls

ID                  NAME                  IMAGE                       NODE                DESIRED STATE       CURRENT STATE           ERROR               PORTS
g7dr8ecu5a6d        getstartedlab_web.1   frosthe/get-started:part2   Aiur                Running             Running 2 minutes ago
1gu635hjck46        getstartedlab_web.2   frosthe/get-started:part2   Aiur                Running             Running 2 minutes ago
rny0soxz5rh6        getstartedlab_web.3   frosthe/get-started:part2   Aiur                Running             Running 2 minutes ago
zfvdxi8e6jpt        getstartedlab_web.4   frosthe/get-started:part2   Aiur                Running             Running 2 minutes ago
qudnod8hs9xw        getstartedlab_web.5   frosthe/get-started:part2   Aiur                Running             Running 2 minutes ago
```
如果使用命令列出当前系统中的 container，这些 task 也会被包含其中，但不会由其从属的 service 作筛选:
```
$ docker container ls

CONTAINER ID        IMAGE                       COMMAND             CREATED             STATUS              PORTS               NAMES
6642f46afaa4        frosthe/get-started:part2   "python app.py"     4 minutes ago       Up 4 minutes        80/tcp              getstartedlab_web.4.zfvdxi8e6jpte0qcobidxvuq6
00ffa6c89b09        frosthe/get-started:part2   "python app.py"     4 minutes ago       Up 4 minutes        80/tcp              getstartedlab_web.5.qudnod8hs9xwyhe07o2xomm25
bc1563fa67f8        frosthe/get-started:part2   "python app.py"     4 minutes ago       Up 4 minutes        80/tcp              getstartedlab_web.3.rny0soxz5rh641082ybs1h6vj
526e37ad6994        frosthe/get-started:part2   "python app.py"     4 minutes ago       Up 4 minutes        80/tcp              getstartedlab_web.1.g7dr8ecu5a6dh5ua5lqo0cbjw
ee599ab17416        frosthe/get-started:part2   "python app.py"     4 minutes ago       Up 4 minutes        80/tcp              getstartedlab_web.2.1gu635hjck46xt8leib3md9nb
```
现在，通过 ip 地址访问该应用，连续刷新浏览器，会看到每次刷新后 `Hostname` 一项都改变。之前提到过，`Hostname` 返回的是 `container` 的 ID，所以这里会看到 `Hostname` 的值为 5 个副本 ID 值轮流变化。

# 扩展该应用
可以在 `docker-compose.yml` 文件中修改 `replicas` 的值来扩展计算量，然后再次执行 `docker stack deploy` 命令:
```bash
$ docker stack deploy -c docker-compose.yml getstartedlab
```
`Docker` 支持实时更新，不需要关闭 `stack` 或停止任何 `container`。

# 停止应用及 swarm
- 停止 app:
```bash
$ docker stack rm getstartedlab

Removing service getstartedlab_web
Removing network getstartedlab_webnet
```
- 停止 swarm:
```bash
$ docker swarm leave --force

Node left the swarm.
```