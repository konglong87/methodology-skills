# Methodology Skills

<p align="center">
  <img src="https://img.shields.io/badge/version-1.17.1-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Claude%20Code-✓-purple.svg" alt="Claude Code">
  <img src="https://img.shields.io/badge/Cursor-✓-cyan.svg" alt="Cursor">
  <img src="https://img.shields.io/badge/OpenCode-✓-orange.svg" alt="OpenCode">
  <img src="https://img.shields.io/badge/Exa%20AI%20Search-✓-brightgreen.svg" alt="Exa AI Search">
</p>

> 🧠 AI 方法论工具箱 - 让 AI 掌握第一性原理、目标导向、PDCA 循环、DDD 设计等12个方法论技能

一个包含12个核心方法论技能的 Claude Code/Cursor/OpenCode 插件。支持四层级知识沉淀、技能协作、工件传递、智能编排。

---

## 📑 目录

- [核心特性](#核心特性)
- [包含的12个方法论技能](#包含的12个方法论技能)
- [完整工作流程](#完整工作流程)
- [安装](#安装)
- [使用示例](#使用示例)
- [技能组合使用](#技能组合使用)
- [更新日志](#更新日志)
- [许可证](#许可证)

---

## ✨ 核心特性

### 🔄 技能协作机制

技能之间通过工件（Artifact）传递数据和上下文：

```
goal-oriented → 创建目标
    ↓ (工件传递)
prompt-enhancer → 需求细化
    ↓ (工件传递)
planning → 实施规划
    ↓ (工件传递)
execution → 执行技能
    ↓ (工件传递)
experience-manager → 经验沉淀
```

### 📦 工件传递机制

每个技能执行完成后生成标准化工件：

- **存储位置**: `memory/artifacts/{skill-name}/`
- **格式**: JSON
- **内容**: 输入、输出、后续推荐
- **链接**: `latest.json` 指向最新工件

### 🎯 智能技能编排

使用 `/pilot` 自动推荐最佳技能链：

```
用户："设计一个电商平台"

编排器推荐：
1. goal-oriented - 明确目标
2. first-principles - 从本质思考
3. ddd-strategic-design - 战略设计
4. ddd-tactical-design - 战术设计
5. mvp-first - MVP 规划
```

---

## 🧠 包含的12个方法论技能

### 1. 🎯 Goal-Oriented（目标导向） - 刚性要求

**核心原则**: 以终为始，不忘初心

**核心特性**:
- ⚡ **持续触发** - 每个用户消息都会触发目标检查
- 🎯 **自动追踪** - 自动创建目标文件，记录原始需求和SMART目标
- 🔄 **动态调整** - 用户修改需求时立即更新目标
- ✅ **强制验证** - 任务完成前必须验证目标达成情况

**适用场景**: 执行长期任务、项目规划、容易偏离目标的复杂任务

---

### 2. 🎯 Prompt-Enhancer（提示词增强器） - 强制前置

**核心原则**: 需求不清晰，不如不动手

**核心能力**:
- 📋 **需求细化** - 每个关键点问3-4个问题，全面澄清需求
- 💡 **方案探索** - 头脑风暴3-5种方案，充分论证可行性
- ✅ **用户确认** - 用户选择最终方案，避免理解偏差

**产出工件**: `memory/artifacts/prompt-enhancer/result-{timestamp}.json`

---

### 3. 📋 Planning（实施规划） - 强制前置

**核心原则**: 谋定后动，规划先行

**核心能力**:
- 📐 **步骤分解** - MECE原则，细粒度任务分解
- 🔗 **依赖识别** - 识别强依赖、弱依赖、无依赖
- 📊 **资源规划** - 人力、时间、技术、成本全面规划
- ⚠️ **风险评估** - 概率×影响，提前识别风险
- ✅ **plan-review** - 用户确认后才开始执行

**产出工件**: `memory/artifacts/planning/result-{timestamp}.json`

---

### 4. 🧠 Experience Manager（经验管理） - 知识沉淀闭环

**核心原则**: 好则加冕，错则改之

**核心能力**:
- 📚 **四层级沉淀** - 规则、策略、知识、历史全覆盖
- 🔍 **智能检索** - 四层级并行读取，优先级排序
- 🛡️ **错误预防** - 提前预警，避免踩坑
- 📈 **效果追踪** - 持续优化知识库

**四层级沉淀机制**:

| 层级 | 文件 | 维度 | 优先级 | 用途 |
|------|------|------|--------|------|
| **规则层** | CLAUDE.md | 做什么 | 最高 | 项目约定，强约束 |
| **策略层** | AGENT.md | 怎么做 | 高 | AI执行策略，决策规则 |
| **知识层** | MEMORY.md | 学到了什么 | 中 | 技术知识，经验总结 |
| **历史层** | MCP Memory | 过去发生了什么 | 低 | 完整历史，智能检索 |

---

### 5. 🧠 First Principles（第一性原理）

**核心原则**: 打破假设，回归本质

**适用场景**: 创新突破、复杂问题、常规方法失效

---

### 6. 🔄 PDCA Cycle（PDCA循环）

**核心原则**: Plan-Do-Check-Act 持续改进

**适用场景**: 迭代任务、质量保障、流程优化

---

### 7. 🎯 MVP First（最小可验证产品）

**核心原则**: 最小成本验证关键假设

**核心思维**:
- **识别假设** - 找出风险最高的假设
- **分层验证** - Layer 0（假门按钮）→ Layer 1（基础功能）→ Layer 2+（增强功能）
- **数据驱动** - 定义成功标准，用数据而非直觉决策

**适用场景**: 新功能开发、产品构思、避免过度工程化

---

### 8. 🎯 DDD Strategic Design（DDD战略设计）

**核心原则**: 限界上下文、上下文映射、架构决策

**适用场景**: 系统架构设计、微服务拆分、领域建模

---

### 9. 🎯 DDD Tactical Design（DDD战术设计）

**核心原则**: 聚合、实体、值对象、领域服务

**适用场景**: 实现复杂业务逻辑、设计聚合、保证数据一致性

---

### 10. 📊 SWOT Analysis（SWOT分析）

**核心原则**: 优势/劣势/机会/威胁系统性分析

**适用场景**: 战略规划、技术选型、竞品分析、决策支持

---

### 11. 🎨 Infographic Generator（信息图生成器）

**核心原则**: 智能生成专业信息图

**核心功能**:
- 🎨 **动态风格选择** - 三层优先级：用户指定 > LLM智能选择 > 可爱风格兜底
- 🏷️ **智能标题生成** - 自动提取有意义的标题和副标题
- 📐 **横竖双版输出** - 默认同时生成横版(1920x1080)和竖版(1080x1920)
- ⚡ **一键生成** - 无需中途确认，全程自动化输出

**支持的8种风格**: 科技风、可爱风、手绘风、简约风、教学风、泥塑风、漫画风、Bento风

---

### 12. 🚀 Pilot（智能技能编排）

**核心原则**: 自动推荐最佳技能链

**适用场景**: 复杂任务需要多个技能协作、不知道应该使用哪些技能

---

## 🔄 完整工作流程

优化后的完整方法论工作流程：

```
用户消息
    ↓
【goal-oriented】创建目标（强制）
    ↓
【prompt-enhancer】需求细化+方案探索（强制）
    ↓
【planning】实施规划+plan-review（强制）
    ↓
【experience-manager】检索历史经验（强制）
    ↓
【执行技能链】first-principles / mvp-first / ddd / swot
    ↓
【experience-manager】复盘+沉淀（强制）
```

**对比优化前**:
- ✅ 需求充分细化（原来缺失）
- ✅ 方案充分论证（原来缺失）
- ✅ 步骤详细规划（原来缺失）
- ✅ 降低理解偏差
- ✅ 知识沉淀闭环

---

## 安装

### Claude Code（推荐 - 完整体验）

```bash
# 1. 安装插件
claude plugin marketplace add konglong87/methodology-skills
claude plugin install methodology-skills@methodology-skills

# 2. 配置 Exa AI 搜索（推荐）
claude mcp add exa-search "https://api.exa.ai/mcp?key=YOUR_EXA_API_KEY" -t http

# 获取 Exa AI API Key: https://exa.ai
```

**✅ Claude Code 完整优势**:
- SessionStart Hook 自动注入目标追踪系统
- 自定义标签：`<恐龙专属指令>`
- 动态读取 SKILL.md 最新内容
- 无需用户干预，自动触发

---

### Cursor

**一键安装**：

```bash
# 创建安装脚本
curl -fsSL https://raw.githubusercontent.com/konglong87/methodology-skills/main/scripts/install-cursor.sh | bash

# 或手动安装
mkdir -p ~/.cursor/rules
curl -fsSL https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/goal-oriented/SKILL.md -o ~/.cursor/rules/goal-oriented.md
curl -fsSL https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/first-principles/SKILL.md -o ~/.cursor/rules/first-principles.md
```

**验证安装**:
```bash
ls -la ~/.cursor/rules/
```

---

### OpenCode

**一键安装**：

```bash
# 创建安装脚本
curl -fsSL https://raw.githubusercontent.com/konglong87/methodology-skills/main/scripts/install-opencode.sh | bash

# 或手动安装
mkdir -p ~/.opencode/skills/goal-oriented
curl -fsSL https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/goal-oriented/SKILL.md -o ~/.opencode/skills/goal-oriented/SKILL.md
```

**验证安装**:
```bash
ls -la ~/.opencode/skills/
```

---

## 使用示例

### 示例1：完整工作流程

```
用户：帮我设计一个用户认证系统

AI：[自动触发 goal-oriented]
✅ 创建目标：实现用户认证系统，提升安全性
✅ SMART目标：测试覆盖率>90%，无安全漏洞，2周内完成

    ↓ [自动调用 prompt-enhancer]
    
📋 需求细化（每个关键点问3-4问题）：
- 用户场景：谁会用？什么场景？痛点是什么？
- 技术约束：平台？技术栈？数据存储？
- 功能范围：核心功能？扩展功能？优先级？
- 成功标准：验收标准？性能要求？时间约束？

    ↓ [用户确认需求细节]
    
💡 方案探索（头脑风暴3-5种方案）：
- 方案A：微信云开发 - 成本低、维护简单
- 方案B：自建认证系统 - 灵活、可控
- 方案C：OAuth第三方 - 快速集成

    ↓ [用户选择方案A]
    
📐 实施规划（MECE步骤分解）：
Phase 1: 环境准备（Day 1）
  - 步骤1：环境配置
Phase 2: 核心功能（Day 2-6）
  - 步骤2：验证码发送
  - 步骤3：注册流程
  - 步骤4：登录流程
Phase 3: 测试上线（Day 7-10）
  - 步骤5：测试优化

    ↓ [plan-review 用户确认]
    
✅ 开始执行实施计划...

    ↓ [experience-manager 检索历史经验]
    
📚 历史经验参考：
- ⚠️ 错误预防：提前申请短信服务审核
- 🎯 可复用模式：OAuth集成标准流程

    ↓ [执行完成]
    
🧠 经验沉淀：
- 做得好的：三级文档结构、自动化测试
- 需改进的：文档命名规范
- 知识沉淀：OAuth集成最佳实践
```

---

### 示例2：第一性原理优化查询

```
用户：这个查询太慢了，用第一性原理分析

AI：[触发 first-principles]
让我从本质出发分析查询慢的根本原因...

1. 表象：查询耗时 10 秒
2. 假设：我们假设索引已经足够、数据量是瓶颈
3. 本质：实际瓶颈是磁盘 I/O，而非 CPU 或内存
4. 重建：从 I/O 优化角度重新设计方案...

结果：查询时间降至 0.8 秒
```

---

### 示例3：MVP First 验证产品假设

```
用户：我想做一个推荐系统

AI：[触发 mvp-first]
识别关键假设：用户真的需要推荐吗？

Layer 0：假门验证（成本：30分钟）
在热门内容中插入"编辑推荐"，观察点击率

Layer 1：简单推荐（成本：1天）
如果点击率>2倍，开发基础推荐算法

Layer 2：智能推荐（按需）
根据用户反馈，逐步增加智能功能

数据驱动决策：
- 成功标准：点击率>15%，停留时间+20%
- 2周后数据：点击率18%，停留时间+25%
- 决策：继续优化，不添加新功能
```

---

## 技能组合使用

方法论可以组合使用，发挥更大威力：

| 组合 | 适用场景 | 价值 |
|------|----------|------|
| MVP First + Goal-Oriented | 新产品快速验证与迭代 | 避免过度工程化 + 防止偏离目标 |
| First Principles + PDCA | 从根本优化现有流程 | 打破假设 + 持续改进 |
| Goal-Oriented + Planning | 长期项目持续交付 | 目标明确 + 步骤清晰 |
| DDD Strategic + DDD Tactical | 复杂系统领域建模 | 战略设计 + 战术实现 |

**组合示例**:

```
用户：优化 CI/CD 构建速度，用第一性原理 + PDCA

AI：
[First Principles]
找到根本原因：磁盘 I/O 是瓶颈（占70%时间）

[PDCA循环]
Plan: 引入缓存层、并行下载
Do: 在feature分支试点
Check: I/O时间从10分钟降至4分钟
Act: 标准化配置，下一轮优化测试并行度
```

---

## 更新日志

### v1.17.1 (2026-04-14)

**🎯 Planning Skill 重大升级 - 完整技能协作体系**

**核心改进**:
- ✅ **版本号统一** - Planning v2.0.0，与 Goal-Oriented 和 Prompt-Enhancer 保持一致
- ✅ **description优化** - 明确前置技能，强调核心能力
- ✅ **工件传递机制** - 完整的输入/输出工件路径和格式说明
- ✅ **goal-oriented协作** - 明确触发来源和触发流程图
- ✅ **next_skills修正** - 避免循环依赖，改为 experience-manager
- ✅ **AskUserQuestion示例** - plan-review流程明确工具调用
- ✅ **完整工具调用案例** - 从读取工件到生成工件的完整流程

**文件变更**:
- 更新 `skills/planning/SKILL.md` - 870行 → 1387行（+517行）
- 新增工件传递机制、goal-oriented协作说明、AskUserQuestion示例、完整工具调用案例

**技能体系完整性**:
- ✅ goal-oriented → prompt-enhancer → planning → execution → experience-manager
- ✅ 完整的工件传递机制
- ✅ 强制前置技能链
- ✅ 知识沉淀闭环

---

### v1.17.0 (2026-03-26)

**🎯 重大重构：专注方法论核心，分离非方法论技能**

**迁移详情**:
- ❌ 移除 - 微信公众号文章生成器 → 迁移至 play_play
- ❌ 移除 - 算命系统 → 迁移至 play_play  
- ❌ 移除 - bionic-memory → 迁移至 play_play
- ✅ 保留 - 专注方法论核心12个技能

**核心改进**:
- ✅ 项目定位清晰化 - 专注方法论核心技能
- ✅ 技能迁移 - 非方法论技能分离
- ✅ 文档优化 - README精简，更新关键词

---

### v1.16.0 (2026-03-25)

**🎯 Prompt-Enhancer v2.0 + Planning v1.0**

**核心改进**:
- ✅ Prompt-Enhancer v2.0 - 强制前置，需求细化，方案探索
- ✅ Planning v1.0 - 实施规划，步骤分解，plan-review
- ✅ 完整工作流程 - goal-oriented → prompt-enhancer → planning → execution → experience-manager

---

**完整更新日志**: 见 [CHANGELOG.md](CHANGELOG.md)

---

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 📬 联系方式

- **Issues**: [GitHub Issues](https://github.com/konglong87/methodology-skills/issues)
- **Discussions**: [GitHub Discussions](https://github.com/konglong87/methodology-skills/discussions)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/konglong87">恐龙创新部</a>
</p>