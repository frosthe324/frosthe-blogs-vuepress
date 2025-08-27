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

## SFT(Supervised Fine-Tuning) - 有监督微调

参考[监督微调](./docs/fine-tuning/README.md)

## RLHF(Reinforcement Learning from Human Feedback) - 强化学习

- DPO(Direct Preference Optimization): 通过人类的对比选择直接优化生成模型，使其产生更符合用户需求的结果；调整幅度大
- PPO(Proximal Policy Optimization): 通过奖励信号(如点赞、点踩)来渐进式调整模型的行为策略；调整幅度小

## RAG(Retrieval-Augmented Generation) - 检索增强生成

以向量检索为核心的 RAG 架构已成为解决大模型获取最新外部知识，同时解决其生成幻觉问题时的主流技术框架，并且已在相当多的应用场景中落地实践。

> 详细文档移步 [RAG](rag/)