---
title: 模型微调
author: Frost He
excerpt: 模型微调的笔记及实现路径
date: 2025-05-27
category:
- GenAI
tag:
- ai
- llms
---

## SFT(Supervised Fine-Tuning) - 有监督微调

通过提供人工标注的数据，进一步训练预训练模型，让模型能够更加精准地处理特定领域的任务。

> 无监督微调、自监督微调，但微调通常指有监督微调

## 微调框架

- [Axolotl⭐9k](https://github.com/axolotl-ai-cloud/axolotl): Axolotl 是一款旨在简化各种人工智能模型微调的工具，支持多种配置和架构
- [LLaMA-Factory⭐45.6k](https://github.com/hiyouga/LLaMA-Factory): 使用零代码命令行与 Web UI 轻松训练百余种大模型，并提供高效的训练和评估工具
- [Firefly⭐6.3k](https://github.com/yangjianxin1/Firefly)
- [xTuner](https://github.com/InternLM/xtuner)
- [Swift](https://github.com/modelscope/ms-swift/tree/main)
- [Unsloth](https://github.com/unslothai/unsloth)
- [transformers.Trainer](https://huggingface.co/docs/transformers/zh/main_classes/trainer)

![微调框架对比表](./framework.jpg "微调框架对比表")


微调算法:

- 全参数微调
- 部分参数微调
  - 最著名算法: LoRA

LoRA(Low-Rank Adaptation of Large Language Models) 算法

基座模型:

- Deepseek-R1-Distill-Qwen-1.5B