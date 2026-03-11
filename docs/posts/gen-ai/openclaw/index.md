---
title: OpenClaw 调研
author: Frost He
excerpt: OpenClaw（原 Clawdbot / Moltbot）是本地运行、通过 IM 作为交互界面、可调用外部大模型的开源个人 AI Agent。本文整理其爆火原因、核心功能、架构、安装门槛与安全风险，并对比 ZeroClaw 等轻量替代方案。
date: 2026-03-11
category:
- GenAI
tag:
- ai
- agent
- openclaw
---

## OpenClaw 调研

### 1. 项目简介

[OpenClaw](https://github.com/openclaw/openclaw)（原名 Clawdbot / Moltbot）是由 Peter Steinberger（PSPDFKit 创始人）开发的 **免费开源个人 AI Agent**。它在本地运行，通过 WhatsApp、Telegram、Signal、Discord、飞书等聊天工具作为交互界面，调用外部大模型（Claude、DeepSeek、GPT 等）来执行任务。核心理念：**Bring Your Own API Key**，无订阅费用，完全开源。

吉祥物是一只太空龙虾 **Molty**，社区把部署 OpenClaw 称为"养龙虾"（raising lobsters）。[官网](https://openclaw.ai/)

### 2. 火爆程度

- 2026 年 1 月上线后，成为 **GitHub 历史上增长最快的开源项目**
- 截至 2026 年 3 月 2 日：**247,000 stars**，47,700 forks，超过了 React
- 在美国多家门店引发 Mac mini 短缺（用于本地部署）
- 国内催生了"[代装经济](https://www.lanjinger.com/d/1772766680151033575)"：上门安装 300-800 元（主流 500 元），淘宝累计售出超 3000 单，企业安装单次高达万元（[36氪报道](https://36kr.com/p/3709913932624007)）

### 3. 核心功能

- 执行 shell 命令、读写文件、浏览网页、发送邮件、管理日历
- **持久化记忆**：跨会话保留长期上下文、偏好和历史
- **Skills 生态**：内置 49 个 + 官方 93 个 + 社区 1715+ 个，总计 **1800+ Skills**

### 4. 技术架构

- 基于 **Node.js（≥22）**，内存占用 ~1.2 GB，1200+ npm 依赖
- 通过聊天平台（WhatsApp/Telegram/Signal/Discord/飞书）作为 UI
- 支持 Claude、DeepSeek、GPT-5.4、Gemini 3.1 Flash 等多种 LLM
- 最新版本：**v2026.3.7-beta.1**（新增 ContextEngine 插件接口）

### 5. 安装方式

- **一键安装**：`npm i -g openclaw`（国内用[淘宝镜像](https://registry.npmmirror.com)）或 PowerShell 脚本
- **源码构建**：`pnpm install && pnpm build`，详见[菜鸟教程](https://www.runoob.com/ai-agent/openclaw-clawdbot-tutorial.html)、[GitHub 中文教程](https://github.com/xianyu110/awesome-openclaw-tutorial)
- **云服务器一键部署**：阿里云、腾讯云均支持，月费约 30-50 元 + API 调用费

### 6. 安全风险

OpenClaw 引发了 **2026 年首个重大 AI 安全危机**（[Malwarebytes 分析](https://www.malwarebytes.com/blog/news/2026/02/openclaw-what-is-it-and-can-you-use-it-safely)）：

- Hudson Rock 发现 infostealer 可窃取完整 OpenClaw 配置，盗取 AI Agent"身份"
- 2026 年 2 月 **ClawHavoc 供应链投毒**：1184 个恶意 Skill 被植入，影响 13.5 万台设备
- 必须：绑定 `127.0.0.1`、启用强制认证、审计已安装 Skill、保持最新版本

### 7. 为何安装门槛高达 500 元？

官方定位面向**开发者和高级用户**。对非技术人员来说，每一步都是障碍：

| 步骤             | 普通人的困难                                               |
| ---------------- | ---------------------------------------------------------- |
| 安装 Node.js ≥22 | 不知道什么是 Node.js，不会用命令行                         |
| npm 安装         | 终端报错看不懂，国内源切换不会操作                         |
| 注册 API Key     | 需注册 OpenAI/Anthropic 开发者账号，涉及外币支付           |
| 配置代理         | 非技术人员最大的拦路虎                                     |
| 接入飞书/微信    | 需创建机器人、配置 Webhook 等开发操作                      |
| 安全认证配置     | v2026.3.7 强制要求 `gateway.auth.mode`，不配置直接启动失败 |

> "普通人与其去花500块钱装这个，还不如把目前既有的模型能力用好更重要。" —— 连续创业者朱峰

### 8. 中国大陆网络特定的坑

- **npm/GitHub 访问慢或超时**：需使用[淘宝镜像源](https://registry.npmmirror.com)，[汉化版](https://zhuanlan.zhihu.com/p/2003990399765717256)有独立包名 Bug（2026.2.4-zh.2 已修复）
- **AI 模型 API 不可访问**（最核心问题）：OpenAI/Anthropic/Gemini 在国内均无法直连。方案：境外 VPS（推荐 AWS 东京/新加坡）、国内服务器+代理、或使用 [SiliconCloud（硅基流动）](https://siliconflow.cn)等国内可直连模型
- **核心包下载不完整**：网络中断导致依赖缺失
- **版本升级 Breaking Changes**：v2026.3.2 工具默认关闭（需 `tools.profile full`），v2026.3.7 强制认证

详见[国内使用完整指南](https://tbbbk.com/openclaw-china-mainland-setup-guide/)、[Windows 国内优化避坑版](https://www.cnblogs.com/hibobo/p/19685803)、[腾讯云避坑指南](https://cloud.tencent.com/developer/article/2634682)。

### 9. NAS Docker 部署可行性

在群晖等 NAS 上通过 Docker 部署技术上**可行**，但**不是最优选择**：

- **优势**：24 小时开机、低功耗，天然适合常驻 AI Agent
- **劣势**：入门级 NAS 的 CPU/RAM 偏弱（OpenClaw 最低需 2GB RAM）；群晖 Docker 的 Host 模式易端口冲突，Bridge 模式网关发现失效，需用 [Macvlan 方案](https://blog.oool.cc/archives/synology-docker-openclaw-macvlan-tutorial)分配独立 IP；排查问题困难
- **更好选择**：普通 PC/笔记本性能更强且 Docker 环境更标准；或直接用云厂商一键部署

参考：[社区预构建镜像](https://github.com/phioranex/openclaw-docker)、[SynoForum 实战讨论](https://www.synoforum.com/threads/self-hosting-a-moltbot.15730/)

### 10. 国内应用场景分析

#### 核心局限

| 局限                | 说明                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| IM 原生支持不足     | 仅原生支持 WhatsApp/Telegram/Discord，微信/飞书/钉钉需[社区插件](https://zhuanlan.zhihu.com/p/2013706717012186762)或第三方对接 |
| Token 消耗高        | 日常用 GPT-4/Opus 日均成本 **50+ 元**                                                                                          |
| 国外 Skill 水土不服 | 大量 Skill 依赖 Google Calendar、Gmail、Notion 等被墙服务                                                                      |
| 国内平台 API 封闭   | 微信无开放个人 API、支付宝/淘宝生态封闭                                                                                        |

#### 好用的场景

- **飞书办公自动化**（推荐度：高）：已有[官方插件](https://www.feishu.cn/content/article/7613711414611463386)，可读群聊/写文档/约日程/建多维表格；邮件分类、周报生成、会议纪要
- **编程辅助 / 文件批处理**（推荐度：高）：批量重命名、格式转换、数据清洗、shell 命令执行
- **智能家居**（推荐度：中）：集成 Home Assistant，自然语言控制设备
- **企业遗留系统集成**（推荐度：高，需开发能力）：中国企业约 60% 的 IT 系统无 API 文档，OpenClaw"绕过 API、直接操作系统"切中痛点

#### 不好用的场景

微信自动化（无个人 API，封号风险）、国外服务联动（Google/Notion/Slack 废掉）、支付/电商自动化（生态封闭）

更多案例见[知乎 30 个落地案例](https://zhuanlan.zhihu.com/p/2013175927966836224)、[36氪深度报道](https://36kr.com/p/3712327060943241)。

### 11. 权限控制与沙箱机制

**默认状态危险**：OpenClaw 开箱即可执行任意命令、读写任意文件、访问任意网络。

#### 多层安全模型

| 层级        | 机制                     | 控制粒度                                             |
| ----------- | ------------------------ | ---------------------------------------------------- |
| Docker 沙箱 | 容器中运行 Agent 工具    | 文件系统/网络/进程隔离，只读根 FS + 无网络 + 非 root |
| 工具策略    | `tools.allow / deny`     | 每个 Agent 独立配置可用工具（如禁用 exec、browser）  |
| 目录沙箱    | Agent workspace 限定路径 | Agent 只能访问指定目录树                             |
| 文件级权限  | 读/写分离规则            | 全局可读但限制写入路径                               |
| 认证        | `gateway.auth.mode`      | v2026.3.7 起强制 token/password 认证                 |

#### 已知漏洞（截至 2026.3）

CVE-2026-25253（WebSocket 劫持，CVSS 8.8）、[沙箱 TOCTOU 逃逸](https://labs.snyk.io/resources/bypass-openclaw-security-sandbox/)、插件沙箱绕过、ACP 逃逸、wrapper-depth 审批绕过——均已在最新版修复。[Per-agent 文件路径 ACL](https://github.com/openclaw/openclaw/issues/12202) 尚未实现（仅 Feature Request）。

#### 结论

**能控制，但有缺陷**。Docker 沙箱 + 目录限制 + 工具白名单可提供合理隔离，但安全模型仍在成熟中，需遵循最小权限原则。详见[官方安全文档](https://docs.openclaw.ai/gateway/security)、[安全配置最佳实践](https://www.ququ123.top/en/2026/02/openclaw-security/)、[安全内参排查指南](https://www.secrss.com/articles/88371)。

### 12. ZeroClaw：轻量替代方案

[ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw) 是用 **Rust** 编写的超轻量 AI Agent 运行时，定位为 OpenClaw 的极简替代。

#### 与 OpenClaw 对比

| 指标       | OpenClaw                  | ZeroClaw                 |
| ---------- | ------------------------- | ------------------------ |
| 语言       | TypeScript (Node.js)      | Rust                     |
| 二进制大小 | ~800 MB                   | **~3.4 MB**              |
| 内存占用   | ~1.2 GB                   | **~5 MB**                |
| 冷启动     | ~8 秒                     | **<10 毫秒**             |
| 运行时依赖 | Node.js ≥22 + 1200 npm 包 | **无（单一静态二进制）** |

#### 树莓派 4B 可行性

**完美适配**。Pi 4B 有 1-8GB RAM，ZeroClaw 仅需 ~5MB。官方提供 `aarch64` 预编译二进制，复制即可运行。支持 16+ 通信渠道（含 Telegram、Discord、飞书），22+ AI 提供商。

社区实测（[博客](https://sony-mathew.com/blog/running-zeroclaw-on-raspberry-pi)）：Telegram → ZeroClaw → Ollama 流程跑通。**推荐**：Pi 只跑 ZeroClaw Agent，模型走远程 API（SiliconCloud/DeepSeek）。更多参考：[3.4MB 二进制让 Pi 变身 AI Agent](https://pbxscience.com/how-zeroclaw-a-3-4-mb-rust-binary-is-turning-a-10-raspberry-pi-into-a-fully-autonomous/)、[ZeroClaw + Ollama 安装指南](https://sonusahani.com/blogs/zeroclaw-ollama-openclaw-fork-setup)。

#### 安全优势

Rust 内存安全 + 编译时类型检查；内置三级安全制（ReadOnly → Supervised → Full）；配对码验证、命令白名单、API 密钥加密。相比 OpenClaw 频繁的 CVE 漏洞，底层更可靠。

#### 国内局限

飞书支持不如 OpenClaw 生态；Skill 生态几乎为零；社区规模小（~7,600 stars）；中文文档少。

#### 仿冒警告

唯一官方仓库：[github.com/zeroclaw-labs/zeroclaw](https://github.com/zeroclaw-labs/zeroclaw)。**不要信任** `zeroclaw.org` 或 `zeroclaw.net`。

### 13. 轻量方案横评

| 项目         | 语言       | 内存    | 特点                     | 适合场景         |
| ------------ | ---------- | ------- | ------------------------ | ---------------- |
| **OpenClaw** | TypeScript | ~1.2 GB | 生态最丰富，1800+ Skills | 高性能服务器     |
| **ZeroClaw** | Rust       | ~5 MB   | 极致轻量，安全性强       | 树莓派、边缘设备 |
| **PicoClaw** | Go         | ~30 MB  | 并发优化                 | 中等硬件         |
| **NanoClaw** | Python     | ~100 MB | 容器级隔离               | Docker 环境      |
| **Nanobot**  | Python     | ~50 MB  | 代码极简，国内 IM 友好   | 开发者           |

详见 [LINUX DO 横评](https://linux.do/t/topic/1707537)、[PicoClaw vs ZeroClaw vs OpenClaw 对比](https://medium.com/@phamduckhanh2411/picoclaw-vs-zeroclaw-vs-openclaw-which-lightweight-ai-agent-should-you-run-6fa87d4bce31)。

### 14. 国产替代方案

| 产品                                                                       | 特点                                    | 适合谁       |
| -------------------------------------------------------------------------- | --------------------------------------- | ------------ |
| **飞书 + OpenClaw 官方插件**                                               | 官方支持，国内绝大多数用户首选          | 飞书用户     |
| **[MindX（心智）](https://www.53ai.com/news/Openclaw/2026030306512.html)** | 支持飞书/微信/钉钉/QQ，Token 消耗降 90% | 普通人       |
| **LobsterAI（有道龙虾）**                                                  | 内置 16 种技能，更懂中国办公环境        | 非技术用户   |
| **CoPaw（阿里）**                                                          | "三条命令部署"，原生适配钉钉/飞书/QQ    | 企业用户     |
| **MaxClaw / Kimi Claw**                                                    | 零门槛云端托管                          | 不想折腾的人 |
| **Nanobot**                                                                | Python 生态，支持飞书/QQ/钉钉           | 开发者       |

腾讯云还提供线下免费装机服务和保姆级教程，适合完全不想折腾的普通用户。

### 15. 成本分析

| 项目                     | 费用                              |
| ------------------------ | --------------------------------- |
| OpenClaw / ZeroClaw 软件 | 免费开源                          |
| 云服务器                 | ~30-50 元/月                      |
| API 调用（国外模型）     | 日均 50+ 元（GPT-4/Opus）         |
| API 调用（国内模型）     | 大幅便宜（SiliconCloud/DeepSeek） |
| 代装服务                 | 300-800 元（可自行安装省下）      |
| 大厂一键部署             | 免费或极低成本                    |
