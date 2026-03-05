---
title: Docker 初探 (2) - Containers
date: 2018-01-29 23:09:17
description: 本文基于 Docker GetStarted 官方文档，简要介绍了 Docker 的 Container 概念，如何创建，运行，部署及分享 image
categories:
- Docker
tag: 
- ops
- docker
---

参考资料:
- [Containers](https://docs.docker.com/get-started/part2/)

# 以 Docker 的方式定义一个应用
`Container` 位于架构层次的最底层，其上是 `Service`，服务定义了 `Container` 如何在生成环境互作用。`Service` 之上是 `Stack`，其定义了所有服务之间的互作用。

在过去，如果希望便携一个 `python` 应用，那么第一件事就是要在主机上安装 `python` 运行时，这便限制了该主机的功能很难用作它途，如果想要部署一个 `.net core` 应用，那么 `python` 的运行时毫无意义。

在 `Docker` 生态中，`python` 以 `image` 的形式定义，并且可由任何其他 `image` 引用，从而确保所有的 `image` 都是可插拔的，并且不会干扰本地主机的环境。

## 使用 Dockerfile 定义一个 image
用于定义 `image` 的被称为 `Dockerfile`，该文件描述了哪些环境需要被加载到 container 中，类似访问网络资源的接口和硬盘驱动都在此环境中被虚拟化，并与系统的其他部分完全隔离。因此，我们需要将端口映射到 container 外部，并且确切定义要将哪些文件**「复制到」**该环境中，完成这些配置之后，便可期待该 `Dockerfile` 定义的应用可以在任何地方运行了。

1. 创建一个新目录，并导航到其中作为工作目录
``` bash
$ mkdir my-first-docker-image
$ cd my-first-docker-image
```
2. 新建一个名为 `Dockerfile` 的文件:
``` bash
$ touch Dockerfile
$ nano Dockerfile
```
3. 复制以下内容至该文件:
``` bash
# Use an official Python runtime as a parent image
FROM python:2.7-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME World

# Run app.py when the container launches
CMD ["python", "app.py"]
```
该 `Dockerfile` 引用的 `app.py` 及 `requirements.txt` 尚未创建，执行命令以创建它们:
```bash
$ touch requirements.txt
$ touch app.py
```
> 注意，两者位于与 `Dockerfile` 相同的目录

由此，应用所需的文件都已就绪，当上述 `Dockerfile` 生成一个 image 时，`Dockerfile` 中的 `Add` 指令会将当前目录下的所有文件拷贝至子目录 `/app`，并且 app.py 将可通过 HTTP 协议访问因为 `EXPOSE` 指令暴露了 80 端口。

填充 `requirements.txt`
```bash
$ nano requirements.txt

Flask
Redis
```
填充 `app.py`
```bash
$ nano app.py

from flask import Flask
from redis import Redis, RedisError
import os
import socket

# Connect to Redis
redis = Redis(host="redis", db=0, socket_connect_timeout=2, socket_timeout=2)

app = Flask(__name__)

@app.route("/")
def hello():
    try:
        visits = redis.incr("counter")
    except RedisError:
        visits = "<i>cannot connect to Redis, counter disabled</i>"

    html = "<h3>Hello {name}!</h3>" \
           "<b>Hostname:</b> {hostname}<br/>" \
           "<b>Visits:</b> {visits}"
    return html.format(name=os.getenv("NAME", "world"), hostname=socket.gethostname(), visits=visits)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
```
以上两段代码值得注意的是
- `pip install -r requirements.txt`
- `app.py` 中使用了环境变量 `NAME`
- `socket.gethostname()` 的调用

至此，本地主机不需要安装任何声明在 `requirements.txt` 文件中的 `python` 库，但该程序仍然不完整，因为我们仅仅安装了 `Redius` 的 `python` 库，但 `Redius` 进程本身并没有在本地主机安装运行。

> 从 container 中查询主机名称将返回 container ID，它的值相当于进程的 ID。

# 生成应用
1. 在生成应用之前，首先确保工作目录在新建目录的顶层:
```bash
$ ls

Dockerfile		app.py			requirements.txt
```
2. 执行生成指令，这将会产生一个 `Docker image`，使用 `-t` 选项给它一个标签。
```bash
$ docker build -t friendlyhello .
```
> 注意 `.` 表示生成基于的目录位置，表示当前目录

生成过程中 `Docker` 引擎会根据 `Dockerfile` 声明的引用库去下载需要的文件，这可能需要一些时间。生成完成后，如何查看生成的位置呢？执行 `docker image ls` 指令即可看到新生成的 `image`。

``` bash
$ docker image ls

REPOSITORY          TAG                 IMAGE ID            CREATED              SIZE
friendlyhello       latest              2f701134298d        About a minute ago   145MB

```

> 在本地生成的 `image` 会放至 `Docker` 的本地 `Registry`，`Docker` 以 `Registry` 的形式进行本地与远程 `image` 库的同步。

# 运行应用
使用 `-p` 选项将本地主机的 8000 端口映射到 `container` 的 80 端口
``` bash
$ docker run -p 4000:80 friendlyhello
```
执行以上命令之后，可以看到一条 python 消息称应用侦听 `http://0.0.0.0:80`，该消息来自于 container 内部，其并不知道外部如何对其映射。

现在在浏览器中输入 {your-host-ip}:4000 将会得到预期的结果。同样，也可以使用命令行工具 `curl` 来获取相同的结果:
``` bash
$ curl http://{your-host-ip}:4000
```
端口映射 `4000:80` 很好的对应了在 `Dockerfile` 中声明的 `EXPOSE` 和使用 `docker run -p` 指定的端口。

现在，使用 `-d` 选项让该应用以 `detached` 模式在后台运行：
```bash
$ docker run -d -p 4000:80 friendlyhello

b3076b38a52b82c9c39fa0e99bd51a0f49912869a141ca2f3c677deb3e481bab
```
该命令返回一个 Container ID

执行 `docker container ls` 将会看到正在运行的应用，该 Container ID 与之前返回的 ID 一致。
```bash
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                  NAMES
b3076b38a52b        friendlyhello       "python app.py"     7 seconds ago       Up 6 seconds        0.0.0.0:4000->80/tcp   admiring_vaugh   
```

使用相同的 Container ID 执行 `docker container stop` 来结束进程:

# 分享 image
`image` 的集合称作 `repository`，类似于一个 `Github` 仓库，而一个 `Registry` 是 `repositories` 的集合，一个 `registry` 的帐号可以创建多个 `repository`，`docker` 默认使用 `Docker` 的公共 `Registry`。有关 Registry 的详情参考 [Docker Trusted Registry](https://docs.docker.com/datacenter/dtr/2.2/guides/)。

## 使用 Docker ID 登录
[cloud.docker.com](https://cloud.docker.com/) 提供了托管 image 的云服务，注册一个帐号来使用公开的 `Registry`。docker CLI 同样集成了 docker cloud 的登录功能，执行以下代码:
``` bash
$ docker login
```
## 为 image 设置标签
将本地 `image` 与远程 `registry` 的 `repository` 同步的符号格式为 `username/repository:tag`，`tag` 是可选的，但建议为 `image` 设置标签，因为它是 `registry` 为 `Docker image` 添加版本号的机制。为 `repository` 和 `tag` 定义有意义的名称，例如 `get-started:part2`，这会将该 `image` 推送到 `get-started` 仓库并将其标签设置为 `part2`。

使用 `docker tag {local-image} {your-docker-id}/{your-repository}:{your-tag}` 来为 image 设置标签，例如:
``` bash
$ docker tag friendlyhello pango/get-started:part2
```
再次执行 `docker image ls` 查看:
```bash
REPOSITORY               TAG                 IMAGE ID            CREATED             SIZE
friendlyhello            latest              d9e555c53008        3 minutes ago       195MB
pango/get-started        part2               d9e555c53008        3 minutes ago       195MB
python                   2.7-slim            1c7128a655f6        5 days ago          183MB
```
## 发布 image
将标签化的 image 上传至 repository:
``` bash
$ docker push {your-docker-id}/{your-repository}:{your-tag}
```
上传完成后，使用 Docker ID 登录 [Docker Hub](https://hub.docker.com/) 将会看到刚刚上传的 image。

## 拉取并运行 image
现在，可以执行以下代码在任何地方运行应用:
```bash
$ docker run -p 4000:80 username/repository:tag
```
如果该 `image` 无法在本地获取，`Docker` 会从远程 `repository` 将其拉取至本地。