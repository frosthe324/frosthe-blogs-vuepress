---
title: 大语言模型多合一信息入口
author: Frost He
excerpt: 将当前 GenAI 领域的各个工具和模型分门别类进行索引，用于快速查找
date: 2025-08-20
category:
- GenAI
tag:
- ai
- llms
---

# 大语言模型多合一信息入口

基于对当前 AI 行业各个细分概念做的分类入口，每个 Section 视情况适当展开。

## 信息汇总或聚合网站

- [LLM Leaderboard](https://llm-stats.com/): 提供全面的 AI 模型排行榜，包括推理能力 (GPQA、MMLU 等)、多模态能力、定价、上下文窗口等维度，数据每日更新，支持交互式比较。
- [DMXAPI 中国多模态大模型 API 聚合平台](https://www.dmxapi.cn): (国内) 统一的入口方便实时查看各个大模型服务提供商的 API 价格。
- [Artificial Analysis](https://artificialanalysis.ai/leaderboards/models): 收集并比较 100 多款模型在智能程度、性能、速度、上下文窗口等方面的表现，适合详尽地多维度评估模型。
- [Vellum LLM Leaderboard](https://www.vellum.ai/llm-leaderboard?utm_source=chatgpt&utm_medium=geo): 聚焦商业与开源 LLM 模型，比较其能力、价格和上下文窗口，基于 2025 年技术报告数据。

## 大模型社区

- [HuggingFace](https://huggingface.co/): 全球最大的大模型开源社区。提供模型、数据集和空间托管，社区化协作，原生为公有云服务。
- [HuggingFace Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard#/?official=true): 比较市场上的各类大模型
- [HuggingFace Spaces](https://huggingface.co/spaces): LLM 社区免费 Host 前端页面的 Hub 产品。
- [ModelScope](https://modelscope.cn/home): 国内大模型开源社区，大部分都为国内开源大模型，可作为 HuggingFace 由于网络原因的替代
- [Ollama](https://ollama.com): 开源大模型的运行时环境工具，类似于 Docker 概念
- [XInference](https://github.com/xorbitsai/inference): 开源聚合 LLM 推理服务，可集成几乎所有 LLM 及多模态模型并暴露统一的 API，支持 Docker 部署

___

## 主流或热门模型能力

### 推理

- [Deepseek R1](https://www.deepseek.com/)
- [OpenAI/o1](https://openai.com/o1/)，闭源、国内网络不可用

### 生图

- [OpenAI ChatGPT o1](https://openai.com/o1/)
- [BAGEL](https://bagel-ai.org)

### 生视频

- [Google Veo3](https://veo3.ai/)
- [Runway](https://runwayml.com/)
- [OpenAI Sora](https://openai.com/index/sora-system-card/)
- [Wan-AI](https://huggingface.co/Wan-AI)

### 指令遵循

- [OpenAI/GPT4.5](https://openai.com/index/introducing-gpt-4-5/)，闭源、国内网络不可用

### 编码

- [Anthropic Claude Code](https://www.anthropic.com/claude-code): 闭源、国内网络不可用
- [OpenAI Codex](https://openai.com/codex/)
- [Google Gemini CLI](https://github.com/google-gemini/gemini-cli)
- [Opencode](https://github.com/sst/opencode): CLI 界面, CC, gemini, codex 的开源替代

### World Model

- [Google DeepMind Genie](https://deepmind.google/discover/blog/genie-2-a-large-scale-foundation-world-model/)

___
## 开源模型

- [DeepSeek](https://www.deepseek.com/)
  - [DeepSeek-R1@Ollama](https://ollama.com/library/deepseek-r1)
  - [DeepSeek@HuggingFace](https://huggingface.co/deepseek-ai/DeepSeek-R1)
- [QWQ-32B](https://qwenlm.github.io/zh/blog/qwq-32b/): 阿里开源的强化学习 32B 推理模型
  - [QWQ@Ollama](https://ollama.com/library/qwq)
  - [QWQ-32B@HuggingFace](https://huggingface.co/Qwen/QwQ-32B)
  - [QWQ-32B@ModelScope](https://modelscope.cn/models/Qwen/QwQ-32B)
- [Llama](https://www.llama.com/): 由 Meta 公司开源的大模型家族
  - [Llama3.3@Ollama](https://ollama.com/library/llama3.3)
  - [Llama 大模型家族](https://huggingface.co/meta-llama)
- [Phi-4-multimodal-instruct](https://techcommunity.microsoft.com/blog/aiplatformblog/introducing-phi-4-microsoft%E2%80%99s-newest-small-language-model-specializing-in-comple/4357090): 由微软开源的 Phi-4 大模型家族
  - [phi-4 多模态大模型](https://huggingface.co/microsoft/Phi-4-multimodal-instruct)
  - [phi-4 大模型家族](https://huggingface.co/collections/microsoft/phi-4-677e9380e514feb5577a40e4)
  - [phi-4-14b@ollama](https://ollama.com/library/phi4)
- [Claude](https://www.anthropic.com/claude): Anthropic 的商用大语言模型，目前国内无法通过正常渠道访问。
  - Claude 3.5 生成的代码以简洁性、可读性和注释完整性著称，尤其在软件工程中表现突出。
  - 支持 200K tokens 上下文窗口，适合处理多步骤任务（如跨文件代码重构、复杂业务流程分解）。
  - 在工具调用（如 API 集成）和智能体任务（如自动化代码评审）中表现卓越，支持端到端软件开发流程
- [MiniMax](https://chat.minimaxi.com/)
  - [minimax-01⭐2.4k](https://github.com/MiniMax-AI/MiniMax-01): 擅长处理上下文，4M token，API 价格非常便宜
- [硅基流动](https://siliconflow.cn/zh-cn/): 提供各种开源大模型的 API 服务，包括嵌入和重排序模型

### 词嵌入模型 Embedding

- [nomic-ai🔗](https://huggingface.co/nomic-ai)
  - [nomic-embed-text@Huggingface](https://huggingface.co/nomic-ai/nomic-embed-text-v2-moe)
  - [nomic-embed-text@Ollama](https://ollama.com/library/nomic-embed-text)
- [BAAI/bge-large-zh-v1.5](): 由 BAAI(北智研究院) 推出的系列模型

### 重排序模型 Reranking

- [Cohere Reranking](https://cohere.com/rerank)
- [BAAI/bge-reranker-v2-m3](): 由 BAAI(北智研究院) 推出的系列模型

___
## 工具及开源项目

### 一站式解决方案

- [Dify⭐76.3k](https://github.com/langgenius/dify) 作为本地化部署框架。有关Dify 的知识点和使用注意事项，移步 [Dify 文档🔗](./dify/docs/README.md)。
- [Dify Plus⭐1.7k](https://github.com/YFGaia/dify-plus): Dify-Plus 是 Dify 的企业级增强版，集成了基于 gin-vue-admin 的管理中心，并针对企业场景进行了功能优化。 🚀 Dify-Plus = 管理中心 + Dify 二开 。

### 提示词

- [LangGPT⭐8.9k](https://github.com/langgptai/LangGPT): 开源提示词方法论
- [Prompt Engineering Guide ](https://www.promptingguide.ai/): 提示词工程文档

### RAG 及知识库

- [RAGFlow⭐45.2k](https://github.com/infiniflow/ragflow): 主打基于 RAG 编排的精简工作流解决方案，底层 API 可单独部署
  - [技术文档🔗](https://ragflow.io/docs/dev/): Get started
  - [演示地址](https://demo.ragflow.io)
  - [DeepDoc🔗](https://github.com/infiniflow/ragflow/blob/main/deepdoc/README_zh.md): 项目基于深度文档理解，能够从各类复杂格式的非结构化数据中提取真知灼见
- [FastGPT⭐22.8k](https://github.com/labring/FastGPT): FastGPT 是一个基于 LLM 大语言模型的知识库问答系统，提供开箱即用的数据处理、模型调用等能力。同时可以通过 Flow 可视化进行工作流编排，从而实现复杂的问答场景！
- [MaxKB](https://maxkb.cn/): MaxKB = Max Knowledge Base，是一款基于大语言模型和 RAG 的开源知识库问答系统，广泛应用于智能客服、企业内部知识库、学术研究与教育等场景。
  - [MaxKB⭐14.8k](https://github.com/1Panel-dev/MaxKB)

### 多智能体

- [MetaGPT⭐50.8k](https://github.com/geekan/MetaGPT): 由国内团队开源的多智能体框架，面向软件开发全流程的多智能体协作框架，模拟软件公司中的角色分工（如产品经理、架构师、工程师）和标准化流程（SOP），实现从需求到代码的全自动化生成
  - [在线文档](https://docs.deepwisdom.ai/main/zh/guide/get_started/quickstart.html)
- [AutoGen⭐42k](https://github.com/microsoft/autogen): 由微软团队开源的通用型多智能体对话框架，支持灵活的任务编排和跨领域协作
  - [官方门户网站](https://microsoft.github.io/autogen/stable/)
  - 提供 Python/.NET SDK
  - 提供 AutoGen Studio 的 UI 界面，无需写代码即可配置多智能体
- [Suna⭐5.7k](https://github.com/kortix-ai/suna): Kortix AI 发布的开源通用智能体，Apache-2.0 协议，主打 "人人可用的数字员工"
  - Playwright 驱动的浏览器自动化、FastAPI 后端、多模型插件（包括 Anthropic 和 LiteLLM）、API 与命令行一体化执行
- [OpenManus](https://github.com/mannaandpoem/OpenManus): 依据多智能体框架模仿 Manus 出的开源版本
- [Flowith](https://flowith.io/blank): 类似 Manus 的多智能体产品？

支撑技术项目:

- [browser_use⭐49.7k](https://github.com/browser-use/browser-use): AI 智能体访问浏览器的工具，据说 Manus
- [Streamlit⭐38k](https://github.com/streamlit/streamlit): Python 中一个以声明式语言快速构建 Web 应用的库
  - [Streamlit Community Cloud](https://streamlit.io/cloud): 免费 Host Streamlit web 应用的云服务。
- [Gradio⭐36k](https://github.com/gradio-app/gradio): 另一个 Python 构建 Web 页面的库