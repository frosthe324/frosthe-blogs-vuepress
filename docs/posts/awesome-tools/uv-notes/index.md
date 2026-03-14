---
title: uv 使用笔记
description: 
excerpt: uv 是对 Python 开发环境、包和项目的管理工具，它允许用户基于项目构建虚拟环境及工具链
author: Frost He
date: 2025-10-30
lang: zh-CN
category:
- Awesome Tools
tag:
- uv
---

官方文档: [Getting started](https://docs.astral.sh/uv/getting-started/)

## Python 版本常用命令

- `uv python install`: 安装指定 Python 版本
- `uv python list`: 查看可用 (已安装) 的 Python 版本
- `uv python find`: 
- `uv python pin`: 为当前项目指定一个特定 Python 版本
- `uv python uninstall`: 卸载指定 Python 版本

## 项目相关命令

- `uv init`: 基于当前工作目录创建一个 Python 项目，这会创建一系列文件，包括 `.gitignore`, `pyproject.toml` 以及一个 `.python-version` 文件
- `uv add`: 为当前项目添加一个 Python 包依赖
- `uv remove`: 从当前项目移除一个 Python 包依赖
- `uv sync`: 将当前项目的依赖与 Python 环境保持同步。该命令类似于 `npm install`，会下载所有项目声明的依赖包。
- `uv lock`: 为当前项目的依赖项创建一个 lock 锁定文件，以便签入源代码，保持依赖项版本一致
- `uv run`: 在当前项目环境运行一个命令/脚本
- `uv tree`: 查看当前项目的依赖树结构
- `uv build`:
- `uv publish`:

## 全局工具命令

- `uvx` / `uv tool run`: 从临时环境运行一个工具
- `uv tool install`: 为当前用户安装一个工具包
- `uv tool uninstall`: 卸载一个工具包
- `uv tool list`: 查看已安装的工具包
- `uv tool update-shell`:

## 其他命令

- `uv cache clean`: 清除缓存条目
- `uv cache prune`: 清除过期的缓存条目
- `uv cache dir`: 显示 uv 缓存目录路径
- `uv tool dir`: 显示 uv 工具目录路径
- `uv python dir`: 显示 uv 管理的 Python 版本目录路径
- `uv self update`: 升级 uv 自身到最新版本