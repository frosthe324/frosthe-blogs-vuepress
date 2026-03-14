# 技术博客攥写通用规范

本项目是一个 vuepress 驱动的博客项目，适用于所有 AI Agent（Claude Code、Codex、Cursor 等）。

---

## 文本生成/修改规范

- 始终使用简体中文
- 技术术语可保持英文原文，在中英文字符之间插入空格以保持格式美观

---

## 博客文章生成/修改规范

- 生成或修改博客文章时，确保 `Frontmatter` 中至少包含 title, author, date, description, excerpt, category 和 tag 特性 
- 当需要使用括号、冒号时，采用半角字符 `(`, `)`, `:`
- 当需要在英文单词后面接括号 () 进行说明时，在英文单词及括号 () 之间保持一个空格 (前括号位于句头和后扩号位于句尾除外)
- 当需要使用破折号时，使用半角 dash 字符 - ，并在两侧保持一个空格
- 当需要使用引号时，使用半角 "" 字符对包裹被引用语句，并在前引号之前和后引号之后各保持一个空格 (前引号位于句头和后引号位于句尾除外)
- 生成 Markdown 表格时，将各列按最大宽度的单元格对齐，以便于人类阅读

### Frontmatter 参考

- date: 应按照 `yyyy-MM-dd` 的格式来指定日期
- description: 页面的描述，它将会覆盖站点配置中的 `description` 配置项
- excerpt: 文章的简短摘要，作为描述文本显示在预览卡片中
- head: 类型 HeadConfig[], 页面 `<head>` 标签内添加的额外标签，示例:
```markdown
---
head:
  - - meta
    - name: foo
      content: yaml 数组语法
  - [meta, { name: bar, content: 方括号语法 }]
---
```
- layout: 页面的布局。布局是由主题提供的，如果不指定该 Frontmatter ，则会使用默认布局。
- permalink: 页面的永久链接。它将会覆盖根据文件路径来决定的默认路由路径。当被设置为 `null` 时，将会禁用页面的永久链接。
- permalinkPattern: 为页面生成永久链接的 Pattern。它将会覆盖站点配置中的 permalinkPattern 配置项。如果 Frontmatter 中设置了 permalink ，那么这个字段则不会生效。
  - `:year`: 创建日期的 `年` 部分
  - `:month`: 创建日期的 `月` 部分
  - `:day`: 创建日期的 `日` 部分
  - `:slug`: 页面文件名的 `Slug`
  - `:raw`: 原始路由路径
- routeMeta: 附加到页面路由的自定义数据。
- title: 页面的标题。如果不在 Frontmatter 中设置 title ，那么页面中第一个一级标题（即 # title）的内容会被当作标题使用。

---

## Debug Mode

当用户发送 `/debug-context` 时，列出：

1. 本次会话加载的 AGENTS.md 路径
2. 本次会话加载的所有 CLAUDE.md 路径
3. 加载的 memory 文件及关键内容摘要
4. 系统注入的上下文（git status, IDE selection 等）
5. 会话中主动读取过的所有文件路径