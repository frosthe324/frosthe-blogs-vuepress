---
title: PS5 纯软件推流到 B 站的完整指南
author: Frost He
excerpt: 通过 DNS 劫持和 Docker 容器实现 PS5 纯软件推流到 B 站直播平台，无需昂贵的视频采集卡
date: 2025-03-07
category:
- Streaming
tag:
- ps5
- bilibili
- streaming
- dns
---

# PS5 纯软件推流到 B 站的完整指南

## 引言

PlayStation 5 拥有强大的游戏性能，但内置直播功能仅支持 YouTube 和 Twitch，无法直接连接到 B 站。传统解决方案是购买昂贵的视频采集卡，成本高且设置复杂。

本文介绍一种纯软件解决方案，通过 DNS 劫持技术和 Docker 容器，实现 PS5 直接推流到 B 站，无需任何硬件采集卡。

## 准备工作

### 硬件要求

1. **PS5 主机**：已连接局域网，系统为最新版本
2. **电脑主机**：运行 Docker，建议配置：
   - CPU：双核及以上
   - 内存：4GB 及以上
   - 网络：有线连接

### 软件要求

1. **Docker 环境**：已安装并启动
2. **DNS 管理工具**：如 AdGuard Home、Pi-hole 等
3. **账号**：PSN 账号、Twitch 账号、B 站直播权限

## 技术原理

### DNS 劫持原理

当 PS5 尝试连接 Twitch 直播服务器时，通过 DNS 重写将请求重定向到我们的服务器：

```
PS5 → DNS 查询 → 我们的 Docker 容器 → 转发到 B 站
```

### 工作流程

1. **认证阶段**：PS5 访问 `api.twitch.tv` 和 `ingest.twitch.tv` 进行身份验证
2. **推流阶段**：PS5 尝试连接 `*.contribute.live-video.net:1935`，通过 DNS 重写指向我们的 Docker 容器
3. **数据转换**：Docker 容器接收推流数据并转发到 B 站直播服务器

## 实施步骤

### 步骤 1：PS5 设置与 Twitch 账号连接

1. PS5 设置 → 用户和账户 → 关联的账户
2. 选择 Twitch 并登录账号
3. 确认连接成功

### 步骤 2：Docker 容器部署

```bash
# 拉取镜像
docker pull bao3/playstation

# 运行容器（替换 IP 地址和推流地址）
docker run -d \
  --name ps-streaming \
  -p 1935:1935 \
  -e BILIBILI_PUSH_URL="你的 B 站推流地址" \
  bao3/playstation
```

### 步骤 3：获取 B 站推流地址

1. 本机打开 B 站直播工具 (直播姬)
2. 左上角，常规模式 → 第三方推流模式
3. 复制服务器地址和推流码，组合成完整 URL：
   ```
   rtmp://192.168.1.123:1935/livehime
   ```

### 步骤 4：DNS 重写配置

以 AdGuard Home 为例：

1. 登录管理界面
2. 过滤器 → DNS 重写
3. 添加规则：
   ```
   域名：*.contribute.live-video.net
   IP 地址：192.168.50.60（你的 Docker 主机 IP）
   ```

### 步骤 5：网络配置

1. PS5 设置 → 网络 → 设置网络连接
2. 选择自定义设置
3. DNS 设置选择手动，输入你的 DNS 服务器 IP

### 步骤 6：开始直播

1. PS5 启动游戏
2. 按 PS 键选择广播
3. 选择 Twitch 平台
4. 设置直播标题并开始直播

## 总结与注意事项

1. **网络质量**：上传速度至少 5Mbps，推荐 10Mbps 以上
2. **硬件选择**：Docker 主机使用有线网络
3. **测试先行**：正式直播前充分测试


## 相关资源

- [Docker 官方文档](https://docs.docker.com/)
- [AdGuard Home 文档](https://adguard.com/en/adguard-home/overview.html)
- [B 站直播帮助中心](https://link.bilibili.com/help-center/#/nav?id=15)
- [Docker Hub - bao3/playstation](https://hub.docker.com/r/bao3/playstation)
- [Twitch 服务器状态](https://status.twitch.tv/)

---

*本文仅供技术交流和学习使用，请遵守相关平台的使用条款和法律法规。*