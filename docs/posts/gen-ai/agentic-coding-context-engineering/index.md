---
title: Context Engineering 实践记录
author: Frost He
description: 模型能力已经大幅跃升的今天，围绕 LLM 进行上下文的工程建设往往受到忽视
excerpt: 本文聚焦围绕 LLM 进行上下文的工程建设方法论
date: 2026-03-12
category:
- GenAI
tag:
- ai
- llms
- vibe-coding
---

上一篇文章 [AI 编程工具及 LLM 组合比较](../agentic-coding-tools-reference/index.md) 从 Benchmark 角度对比了各 Agent 与 LLM 组合的表现。但在日常开发中，**上下文工程**往往比跑分更直接地决定体验。

在不考虑外部信息的前提下，可以将上下文做以下分类: 

1. 提示词
   - 系统提示词
   - 用户提示词
2. 会话历史
3. 指令
   - 全局指令
   - 项目指令
4. 记忆
   - 项目记忆
   - 角色记忆

---

## 提示词

系统提示词被视为 Agent Tool 的一部分，通常由 Agent Tool 自行定义，对用户不可见。一些开源工具允许用户对 Agent 设置系统提示词，如 RooCode。

用户提示词即用户在聊天框输入的内容，包括文本信息，图像信息等，和以任何方式引用的其他文件。

---

## 会话历史

会话历史通常是容易被忽略的上下文信息，其包含了当前会话此前由用户和 Agent 输出的所有内容 (包括思考内容)，占据了上下文窗口的一定空间。当用户输入完提示词点击发送后，会话历史也会被一并加入到此轮对话中，否则 LLM 将无从得知此轮对话之前的内容。

---

## 指令

指令是独立于聊天信息窗口以外，以某种形式存储 (通常是 Markdown 文本) 在磁盘上，要求 Agent 在特定条件下加载的上下文信息。这些信息通常是 Agent 始终都应遵守的规则和范式。

### 指令分层及模块化

为了方便维护和阅读，单一职责原则同样适用于指令的组织，主流的 Agent Tool 都支持指令分层及模块化。

### Claude Code: CLAUDE.md 的分层体系

Claude Code 使用纯 Markdown 文件 `CLAUDE.md`，按目录层级自动加载:

| 层级     | 文件                                   | 作用域       |
| -------- | -------------------------------------- | ------------ |
| 用户全局 | `~/.claude/CLAUDE.md`                  | 所有项目     |
| 项目根   | `./CLAUDE.md` 或 `./.claude/CLAUDE.md` | 当前项目     |
| 项目目录 | `src/api/CLAUDE.md`                    | 当前项目     |
| 项目本地 | `./CLAUDE.local.md`                    | 当前项目本地 |

同时，Claude Code 支持 `@` 语法引入外部文件 (如 `@docs/coding-standards.md`) 以实现模块化。例如: 

```markdown
# CLAUDE.md

See @Architecture.md for tech stack, project folder structure and conventions.
```

### Codex CLI: AGENTS.md 逐级注入

Codex 使用 `AGENTS.md`，从 `~/.codex/` 全局到项目根目录再到当前目录逐级注入。支持 `AGENTS.override.md` 覆盖。

| 层级     | 文件                                  | 作用域   |
| -------- | ------------------------------------- | -------- |
| 用户全局 | `~/.codex/AGENTS.md`                  | 所有项目 |
| 项目根   | `./AGENTS.md` 或 `./.codex/AGENTS.md` | 当前项目 |
| 项目目录 | `src/api/AGENTS.override.md`          | 当前项目 |

### RooCode: 按模式组织规则

RooCide 支持**按模式 (Mode) 组织规则目录**，例如 `.roo/rules/` (通用)、`.roo/rules-code/` (Code 模式专属)、`.roo/rules-architect/` (Architect 模式专属)。

---

### 对比

| 特性     | Claude Code           | Codex CLI            | RooCode                  |
| -------- | --------------------- | -------------------- | ------------------------ |
| 格式     | 纯 Markdown           | 纯 Markdown          | 纯 Markdown              |
| 指令文件 | `CLAUDE.md`           | `AGENTS.md`          | `.roo/rules[-mode]/*.md` |
| 激活策略 | 目录层级自动          | 逐级遍历             | 按模式 + 字母序          |
| 模块化   | `@` 语法引入          | 目录层级             | 符号链接                 |
| 全局配置 | `~/.claude/CLAUDE.md` | `~/.codex/AGENTS.md` | `~/.roo/rules/`          |

> 注: 以上工具均可通过符号链接支持渐进揭露 (Progressive Disclosure)

---

## 记忆

在 Agentic Programming Tools 的语境中，记忆是指涵盖架构决策、踩坑经验、领域模型的知识，需要开发者主动组织。它们有两个层级:

- 项目记忆: 跟随项目完整生命周期的记忆，与项目级指令处于同一层级，仅作用于单一项目。
- 角色记忆: 跟随 Agent 角色的记忆，通常与用户定义的 Subagent 绑定，跨项目通用。

以 Claude Code 为例，项目记忆以案例的形式存储，并以一个索引文件 `MEMORY.md` 作为入口，在 Agent 会话上下文中懒加载。

```
project-root/
├── docs/
│   ├── memory/                         # 项目记忆目录
│   │   ├── MEMORY.md                   # 记忆索引文件
│   │   └── [yyyy-MM-dd] {entry}.md     # 具体记忆案例
│   ├── tech-stack.md                   # 技术栈
│   ├── coding-standards.md             # 代码规范
│   └── glossary.md                     # 业务术语
├── .claude/
│   ├── skills/
│   └── CLAUDE.md                       # Claude Code 项目指令，引用其他文档
└── ...                                 # 其它项目文件
```

---

## 总结