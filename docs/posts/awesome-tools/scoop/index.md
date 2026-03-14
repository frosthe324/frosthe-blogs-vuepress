---
title: Windows 工具链管理器: Scoop
description:
excerpt: 用户态安装、目录可控、对开发工具链更友好。本文记录 Scoop 的优势与 Chocolatey 的对比。
author: Frost He
date: 2026-02-19
lang: zh-CN
category:
- Awesome Tools
tag:
- scoop
- chocolatey
- windows
- package-manager
---

Scoop 是一个 Windows 包管理器, 更偏向管理开发工具链。

## 适用场景

- 你想要用户态安装, 尽量不需要管理员权限
- 你想要安装目录可控, 方便迁移与清理
- 你主要安装的是 CLI 工具 (git, node, python, ripgrep 等)

如果你更偏系统软件 (驱动, 服务, 深度系统集成的 GUI), Chocolatey 或传统安装器通常更合适。

## Chocolatey vs Scoop

| 维度     | Chocolatey                 | Scoop                         |
| -------- | -------------------------- | ---------------------------- |
| 安装模型 | 更偏系统级安装器 (MSI/EXE) | 更偏用户态解压 + shims        |
| 权限     | 经常需要管理员权限         | 多数场景不需要管理员权限       |
| 安装位置 | 常见写入系统目录           | 默认用户目录, 可控            |
| 适用场景 | 系统软件 / 企业分发 / GUI  | 开发工具链 / CLI / 可移植软件 |

## shims 是什么

Scoop 安装软件时, 通常会把文件解压到自己的 apps 目录, 然后在 `~\scoop\shims` 里生成一组 shim (也常被叫做 shims)。

shim 可以理解为一个很薄的启动器:

- 你在命令行里输入 `git`
- 实际命中的是 `~\scoop\shims\git.exe` (或 `git.cmd`)
- shim 再把调用转发到真实的可执行文件路径

这样做的好处是:

- PATH 里只需要放一个 `~\scoop\shims`, 不需要把每个软件的安装目录都塞进 PATH
- 软件升级或切换版本时, 真实路径变化, shim 仍然可以保持稳定
- 排查命令来源更直接: 先看命中的是不是 shim

常用排查命令:

```powershell
where git
where python
where node
```

如果输出里出现 `scoop\shims`, 说明当前命令优先走的是 Scoop。

## 从 Chocolatey 迁移到 Scoop (最小步骤)

### 1) 导出 Chocolatey 已安装清单

```powershell
choco list --local-only
```

### 2) 在 Scoop 里装同类工具

迁移时建议先装 Scoop 版本, 验证没问题再卸载 Chocolatey 版本, 避免断档。

### 3) 验证命令指向

```powershell
where git
where python
where node
```

## 常见坑

- 同名命令冲突: `python` / `git` / `node` 可能同时存在多个来源, 重点检查 PATH 顺序
- 需要服务/驱动的工具: 这类更适合继续用 Chocolatey 或传统安装器
- 企业代理/证书: 下载失败通常是网络策略问题, 不是 Scoop 本身
