---
title: 模型能力控制 / 定制化方案调研
author: Frost He
excerpt: 基于现有基座模型对 LLM 实现控制的方案调研
date: 2025-05-27
category:
- GenAI
tag:
- ai
- llms
---

# 模型能力控制 / 定制化方案调研

## 基座/预训练模型 (Base models)

Step 1:

从互联网爬取大量 (PB 级) 文本进行深度学习预训练。

## 微调模型 (Assistant models)

Step 2:

通过 Labelling Instructions，人工对 Q&A 模式进行整理和清洗，量级降到 100k，对模型进行微调。收集不准确/错误的回答，标注、修正后形成新的 Q&A，以数据集的形式进入下一轮微调迭代。

## 基于人类反馈的强化学习 RLHF (Reinforcement Learning from Human Feedback) - 

Step 3:

在微调模型的基础上，人类可通过对比生成内容为模型提供反馈，以在后续生成的答案中进行修正。


- DPO(Direct Preference Optimization): 通过人类的对比选择直接优化生成模型，使其产生更符合用户需求的结果；调整幅度大
- PPO(Proximal Policy Optimization): 通过奖励信号(如点赞、点踩)来渐进式调整模型的行为策略；调整幅度小

参考[监督微调](./docs/fine-tuning/README.md)

## RAG(Retrieval-Augmented Generation) - 检索增强生成

以向量检索为核心的 RAG 架构已成为解决大模型获取最新外部知识，同时解决其生成幻觉问题时的主流技术框架，并且已在相当多的应用场景中落地实践。

> 详细文档移步 [RAG](rag/)