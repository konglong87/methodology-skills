# Methodology Skills - 设计文档

**日期**: 2026-03-11
**作者**: 恐龙创新部
**状态**: 已批准

---

## 概述

创建一个独立的方法论 Skills 仓库，包含第一性原理、目标导向、PDCA 循环三个核心方法论。采用轻量参考型设计，支持半自动触发，渐进式添加新方法论，并鼓励社区贡献。

---

## 设计决策

### 1. 项目定位

**决策**: 独立仓库（A 方案）

**理由**:
- 独立维护、版本管理清晰
- 易于扩展新方法论
- 类似 superpowers 的成功模式

**实现**:
- 创建全新的 `methodology-skills` 仓库
- 所有方法论 Skills 统一管理

---

### 2. 触发模式

**决策**: 半自动触发 + 通用思维辅助（A 方案）

**理由**:
- 参考 superpowers 的成功模式
- AI 根据场景自动识别 + 用户显式调用
- 方法论适用于多种场景，不应限制在特定领域

**触发描述设计**:

**第一性原理**:
```
Use when facing complex problems requiring innovative solutions, when conventional approaches fail, when breaking down assumptions, or when user asks to 'think from first principles', 'get to the root', 'fundamentally rethink', 'what's the essence', 'strip away assumptions'.
```

**目标导向**:
```
Use when executing long-term tasks, project planning, when tasks are prone to scope creep, when losing sight of objectives, or when user asks to 'stay focused on the goal', 'keep the end in mind', 'goal-oriented approach', 'don't lose track'.
```

**PDCA 循环**:
```
Use when executing iterative tasks, continuous improvement, quality assurance, process optimization, or when user asks to 'apply PDCA', 'iterate and improve', 'continuous improvement cycle', 'plan-do-check-act'.
```

---

### 3. Skills 关系设计

**决策**: 独立 Skills，组合使用（A 方案）

**理由**:
- 参考 superpowers：每个 skill 都是独立目录 + SKILL.md
- 模块化：用户可以只安装需要的方法论
- 易于维护：每个方法论独立版本管理
- 组合使用：提供组合使用指南文档

**实现**:
```
skills/
├── first-principles/SKILL.md
├── goal-oriented/SKILL.md
└── pdca-cycle/SKILL.md
```

---

### 4. 内容深度

**决策**: 轻量参考型（B 方案）

**理由**:
- 参考 brainstorming skill 的简洁风格
- 核心 100-200 行，快速理解要点
- Token 友好，高效实用

**定制化通过内容实现**:
- 第一性原理：增加"思维框架"表格
- 目标导向：增加"目标拆解工具"清单
- PDCA：增加"循环检查清单"

---

### 5. 扩展策略

**决策**: 渐进式添加 + 社区贡献友好（A + C 混合方案）

**理由**:
- 快速上线，不拖延
- 架构清晰，方便贡献
- 核心质量有保障
- 社区生态可持续

**实现**:
- 阶段一：实现三个核心方法论
- 阶段二：完善文档和贡献模板
- 阶段三：开放社区贡献

---

### 6. 实现方法

**决策**: 标准化实现（A 方案）

**理由**:
- 与 superpowers 一致，降低学习成本
- 单文件 skill，维护简单
- 定制化通过内容实现，不增加文件复杂度

---

## 项目结构

```
methodology-skills/
├── .claude-plugin/
│   └── marketplace.json              # Marketplace 配置
├── plugin.json                        # 插件元数据
├── README.md                          # 主文档
├── CONTRIBUTING.md                    # 贡献指南
├── LICENSE                            # MIT
├── skills/
│   ├── first-principles/
│   │   └── SKILL.md
│   ├── goal-oriented/
│   │   └── SKILL.md
│   └── pdca-cycle/
│       └── SKILL.md
└── docs/
    ├── combining-methodologies.md
    └── templates/
        └── skill-template.md
```

---

## 核心配置

### marketplace.json

```json
{
  "name": "methodology-skills",
  "description": "方法论工具箱：第一性原理、目标导向、PDCA循环等思维方法论 Skills，帮助 AI 更聪明地思考和执行任务",
  "owner": {
    "name": "恐龙创新部",
    "url": "https://github.com/konglong87"
  },
  "plugins": [
    {
      "name": "methodology-skills",
      "description": "方法论工具箱 - 第一性原理、目标导向、PDCA循环等思维方法论",
      "version": "1.0.0",
      "source": "./",
      "author": {
        "name": "恐龙创新部",
        "url": "https://github.com/konglong87"
      }
    }
  ]
}
```

### plugin.json

```json
{
  "name": "methodology-skills",
  "version": "1.0.0",
  "description": "方法论工具箱：第一性原理、目标导向、PDCA循环等思维方法论 Skills",
  "author": {
    "name": "恐龙创新部",
    "url": "https://github.com/konglong87"
  },
  "homepage": "https://github.com/konglong87/methodology-skills",
  "repository": "https://github.com/konglong87/methodology-skills",
  "license": "MIT",
  "keywords": [
    "methodology",
    "first-principles",
    "goal-oriented",
    "pdca",
    "thinking-framework",
    "problem-solving",
    "productivity",
    "claude-code",
    "skill"
  ]
}
```

---

## SKILL.md 结构设计

### 统一基础模板

每个 SKILL.md 包含：
1. YAML frontmatter (name, description)
2. Overview (核心概念)
3. When to Use (适用场景)
4. The Process (流程图 + 步骤详解)
5. Examples (实战案例)
6. Common Pitfalls (常见误区)
7. References (延伸阅读)

### 定制化部分

**第一性原理** - 增加 `Thinking Framework` 部分:
```markdown
## Thinking Framework

| 层级 | 问题 | 示例 |
|------|------|------|
| 表象 | 现在的问题是什么？ | ... |
| 假设 | 我们认为的"必须如此"是什么？ | ... |
| 本质 | 最基础的构成要素是什么？ | ... |
| 重建 | 如何从本质重新构建？ | ... |
```

**目标导向** - 增加 `Goal Decomposition Tool` 部分:
```markdown
## Goal Decomposition Tool

- [ ] 目标陈述
- [ ] 成功标准（SMART）
- [ ] 关键里程碑
- [ ] 潜在干扰因素
- [ ] 偏离预警信号
```

**PDCA** - 增加 `Cycle Checklist` 部分:
```markdown
## Cycle Checklist

- **Plan 阶段**:
  - [ ] 明确目标和指标
  - [ ] 分析现状和差距
  - [ ] 制定行动计划

- **Do 阶段**:
  - [ ] 小范围试点
  - [ ] 收集执行数据
  - [ ] 记录问题和观察

- **Check 阶段**:
  - [ ] 对比预期与实际
  - [ ] 分析偏差原因
  - [ ] 提取经验教训

- **Act 阶段**:
  - [ ] 标准化成功做法
  - [ ] 改进不足之处
  - [ ] 规划下一循环
```

---

## 文档设计

### README.md 核心内容

- 徽章（版本、许可证、平台支持）
- 包含的方法论简介
- 安装指南（Claude Code、OpenCode、Cursor）
- 使用示例（三个方法论各一个）
- 组合使用简介
- 贡献指南链接

### CONTRIBUTING.md 核心内容

- 贡献新方法论的步骤
- 使用模板创建 Skill
- 必填内容清单
- 可选定制化建议
- 提交 PR 规范

### docs/combining-methodologies.md 核心内容

- 四种常见组合模式
- 每种组合的适用场景和工作流
- 详细示例
- 选择建议表格
- 注意事项

---

## 实施计划

将使用 writing-plans skill 创建详细的实施计划，包括：

1. 创建项目结构
2. 编写配置文件
3. 编写三个核心 SKILL.md
4. 编写文档
5. 测试验证
6. 发布到 GitHub

---

## 成功标准

- [ ] 所有配置文件正确
- [ ] 三个 SKILL.md 内容完整且实用
- [ ] 可通过 marketplace 成功安装
- [ ] AI 能正确识别触发场景
- [ ] 文档清晰，社区可贡献
- [ ] 至少 3 个组合使用示例验证

---

## 风险与缓解

**风险 1**: AI 过度触发方法论
- **缓解**: description 精准定义触发条件，避免过于宽泛

**风险 2**: 内容过于抽象，实用性不足
- **缓解**: 每个方法论包含 1-2 个具体案例

**风险 3**: 社区贡献质量不一
- **缓解**: 提供详细模板和贡献指南，PR review 把关

---

## 后续迭代

**v1.1**:
- 增加 SMART 原则 Skill
- 增加 5W1H Skill

**v1.2**:
- 增加 SWOT 分析 Skill
- 增加组合使用示例库

**v2.0**:
- 支持自定义方法论模板
- 方法论效果评估工具