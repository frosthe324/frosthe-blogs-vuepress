---
title: 智慧家庭 - 外网远程访问家庭服务器中的 Home Assistant 实例
description: 本文介绍了如何通过外网穿透实现远程访问家庭服务器的 HomeAssistant 实例，或其他 Web 服务
excerpt: 本文介绍了如何通过外网穿透实现远程访问家庭服务器的 HomeAssistant 实例，或其他 Web 服务
author: Frost He
date: 2018-05-30
lang: zh-CN
category:
- Smart Home
tag:
- linux
- raspberry-pi
- smart-home
- home-assistant
reward_settings:
-   enable: true
---

## 配置从外网访问 HA
安装好 **HA** 之后，我们发现访问 Web UI 的 `url` 不需要任何用户认证，如果你打算将其暴露到互联网并通过外网访问自己的 **HA**，这等同于裸奔，任何互联网用户都能够控制你家的 **HA**。
### 为 HA 网页 UI 设置密码
**HA** 支持为其设置访问密码的功能，可通过 http 节点下进行配置，首先在 `config` 文件夹下找到 `secrets.yaml`，编辑该文件:
```bash
$ sudo nano /etc/home-assistant/config/secrets.yaml

# Use this file to store secrets like usernames and passwords.
# Learn more at https://home-assistant.io/docs/configuration/secrets/
http_password: {your_password_here}
```

同时，在 `configuration.yaml` 中的 `http` 节点下指定该项的引用:
```bash
$ sudo nano /etc/home-assistant/config/configuration.yaml

http:
  # Secrets are defined in the file secrets.yaml
  api_password: !secret http_password
  ip_ban_enabled: true
  login_attempts_threshold: 5
```
`ip_ban_enabled` 和 `login_attempts_threshold` 分别表示启用密码试错机制。然后重启 **HA** 服务:
```bash
$ docker container restart home-assistant
```
### 为 Home Assistant 配置 Nginx 代理
将 Web UI 设置于 `Nginx` 之后有诸多好处，其中一项便是为其配置 **Http SSL**，关于 Nginx 的细节本文不赘述，此处假定 `ha.example.com` 为 Web UI 的虚拟主机名称:
```
$ sudo nano /etc/nginx/sites-available/ha.example.com

map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
        listen 8123;
        listen [::]:8123;
        server_name ha.example.com;

        location / {
                proxy_set_header Host $host;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection $connection_upgrade;
                proxy_pass http://localhost:8123;
        }
}
```
保存，创建该站点配置文件的符号链接，重启 `Nginx`:
```
$ sudo cp -s /etc/nginx/sites-available/ha.example.com /etc/nginx/sites-enabled/ha.example.com
$ sudo systemctl reload nginx
```

### 为 HomeAssistant 应用 HTTPS
即便使用了 API 密码，在不安全的通信连接中该信息仍然可能泄漏，要为站点应用 **HTTPS**，首先需要一个从世界知名 CA 获取的 **SSL 数字证书**，关于如何申请证书请参考「[通过 Let's Encrypt 申请 SSL 数字证书](http://localhost:4000/security-cert-from-letsencrypt/)」。假设已经为 `ha.example.com` 申请了 **SSL 数字证书**，并且相关文件位于 `/etc/nginx/ssl/` 下，编辑站点的 `Nginx` 配置文件，具体参考「[NGINX with subdomain](https://www.home-assistant.io/docs/ecosystem/nginx_subdomain/)」。
```bash
server {
    listen       443 ssl;
    server_name  ha.example.com;
    
    ssl on;
    ssl_certificate /etc/nginx/ssl/ha.example.com/ha.example.com-bundle.crt;
    ssl_certificate_key /etc/nginx/ssl/ha.example.com/ha.example.com.key;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:8123;
        proxy_set_header Host $host;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /api/websocket {
        proxy_pass http://localhost:8123/api/websocket;
        proxy_set_header Host $host;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

    }
}
```
