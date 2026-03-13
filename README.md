# Methodology Skills

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.1-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Claude%20Code-✓-purple.svg" alt="Claude Code">
  <img src="https://img.shields.io/badge/OpenCode-✓-orange.svg" alt="OpenCode">
  <img src="https://img.shields.io/badge/Cursor-✓-cyan.svg" alt="Cursor">
</p>

> 让 AI 掌握方法论，更聪明地思考和执行任务

一个包含第一性原理、目标导向、PDCA 循环、领域驱动设计(DDD)、SWOT分析等方法论的 Skills 工具箱。支持 Claude Code、OpenCode、Cursor。

---

## 📑 目录

- [包含的方法论](#包含的方法论)
- [安装](#安装)
- [使用示例](#使用示例)
- [组合使用](#组合使用)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## 包含的方法论

### 🎯 第一性原理

从最基础的真理出发，重新构建解决方案。适用于创新突破、打破常规。

**适用场景**: 复杂问题需要创新方案、常规方法失效、需要打破既有假设

**触发方式**: 自动识别场景 或 用户说"用第一性原理分析"

### 🎯 目标导向

以最终目标为指引，确保行动不偏离方向。适用于长期任务、项目规划。

**适用场景**: 执行长期任务、项目规划、容易偏离目标的任务

**触发方式**: 自动识别场景 或 用户说"目标导向地执行"

### 🎯 PDCA 循环

Plan-Do-Check-Act 持续改进循环。适用于迭代优化、质量保障。

**适用场景**: 迭代任务、持续改进、质量保障、流程优化

**触发方式**: 自动识别场景 或 用户说"用 PDCA 循环"

### 🎯 MVP First (最小可验证产品)

用最小成本验证关键假设，避免过度工程化。适用于新功能开发、产品构思、项目规划。

**适用场景**: 用户请求构建复杂系统（多模块/子系统）、新功能开发、产品构思、项目规划

**核心思维**:
- **识别假设** - 找出风险最高的假设
- **分层验证** - Layer 0（假门按钮）→ Layer 1（基础功能）→ Layer 2+（增强功能）
- **数据驱动** - 定义成功标准，用数据而非直觉决策
- **应对压力** - 用数据和逻辑说服，而不是说教

**触发方式**: 自动识别（当用户说"做一个XX系统"、"设计XX架构"、"实现XX功能"等涉及多模块系统时）

**典型场景**:
```
用户：我想做一个评论系统，支持评论、回复、点赞、举报、审核

AI：[触发 mvp-first skill]
识别关键假设：用户真的需要评论功能吗？
建议 MVP 分层：
  Layer 0: 假门按钮（30分钟）- 验证用户是否想要评论
  Layer 1: 基础评论（1天）- 如果验证成功
  Layer 2: 加审核功能 - 发现垃圾评论时再加
  Layer 3: 加点赞功能 - 观察用户是否想要互动
```

### 🎯 DDD 战略设计 (Domain-Driven Design: Strategic Design)

领域驱动设计的战略层面：定义限界上下文、上下文映射、架构决策。适用于系统架构设计、微服务拆分。

**适用场景**: 新项目架构设计、微服务拆分、多团队协作、领域建模

**触发方式**: 自动识别场景 或 用户提到"DDD"、"限界上下文"、"领域建模"等关键词

### 🎯 DDD 战术设计 (Domain-Driven Design: Tactical Design)

领域驱动设计的战术层面：聚合、实体、值对象、领域服务、仓储、领域事件。适用于领域逻辑实现。

**适用场景**: 实现复杂业务逻辑、设计聚合、保证数据一致性、保护业务规则

**触发方式**: 自动识别场景 或 用户提到"聚合设计"、"实体与值对象"、"领域事件"等关键词

### 🎯 SWOT分析

SWOT分析是一种战略规划工具，通过系统性分析内部优势/劣势、外部机会/威胁，帮助做出更明智的决策。

**适用场景**: 战略规划、技术选型、竞品分析、项目立项、决策支持

**触发方式**: 自动识别场景 或 用户提到"SWOT"、"优劣势分析"、"战略分析"等关键词

### 🎯 提示词增强器 (Prompt Enhancer)

当用户请求模糊时，系统化澄清需求的框架。识别缺失信息、抵抗压力、避免假设，确保理解需求后再行动。

**适用场景**: 单句请求无上下文、缺少关键维度（谁/什么/为什么）、无成功标准、紧急+模糊、用户期望 AI 自动理解一切

**触发方式**: 自动识别模糊请求 或 用户说"澄清需求"、"明确目标"等关键词

### 🎯 Skill Manager (Skills 管理工具)

Skills 管理和渐进式加载系统，帮助管理和发现 Claude Code skills。

**适用场景**: 管理 skills、搜索相关 skills、智能推荐、按分类浏览、索引同步

**核心功能**:
- 🏷️ **自动分类** - 规则匹配 + LLM 智能分类
- 🔍 **智能搜索** - 按名称、描述、标签搜索
- 💡 **智能推荐** - 根据查询或上下文推荐相关 skills
- 📊 **统计分析** - 查看各分类 skills 数量和标签分布
- 🔄 **同步管理** - 检测新增/删除的 skills

**触发方式**: 用户说"管理 skills"、"搜索 skills"、"推荐 skills"、"列出 skills"等

**命令**:
```bash
node dist/scripts/init.js              # 初始化索引
node dist/scripts/search.js "DDD"      # 搜索 DDD 相关 skills
node dist/scripts/recommend.js "思维"  # 推荐思维相关的 skills
node dist/scripts/list.js --category "方法论"  # 列出方法论分类下的 skills
node dist/scripts/stats.js             # 查看统计信息
node dist/scripts/sync.js              # 同步索引
```

### 🎯 微信公众号文章生成器 (WeChat Article Writer)

自动化微信公众号文章创作工具，使用 AI 内置能力生成高质量文章，并自动生成配套的信息图。

**适用场景**: 创建微信公众号文章、技术教程、行业分析、知识分享

**核心功能**:
- ✍️ **AI 内容创作** - 使用 AI 工具内置能力自动生成文章内容
- 📊 **信息图生成** - 自动生成 2 张 PNG 信息图（使用 infographic-generator skill）
- 🎨 **风格定制** - 通过 EXTEND.md 自定义写作风格、目标受众、文章长度
- 📁 **结构化输出** - 自动保存到 `wechat-articles/{topic}/` 目录

**触发方式**: `/wechat-article-writer "文章主题"`

**示例**:
```bash
/wechat-article-writer "AI工具推荐:提升10倍效率的5个神器"
```

**工作流程**:
1. 加载用户偏好（EXTEND.md）
2. 分析主题并生成大纲
3. AI 写作完整文章
4. 自动生成配套信息图
5. 保存到指定目录

**支持平台**: Claude Code、Cursor、OpenClaw、OpenCode、Antigravity 等所有支持 skills 的 AI 工具

---

## 安装

### Claude Code / Cline

```bash
# 方式一：添加 marketplace 后安装
claude plugin marketplace add konglong87/methodology-skills
claude plugin install methodology-skills@methodology-skills

# 方式二：手动安装
git clone https://github.com/konglong87/methodology-skills.git ~/.claude/plugins/methodology-skills

# 验证安装
claude plugin list
```

### OpenCode

```bash
# 全局安装 - 第一性原理
mkdir -p ~/.opencode/skills/first-principles
curl -o ~/.opencode/skills/first-principles/SKILL.md \
  https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/first-principles/SKILL.md

# 全局安装 - 目标导向
mkdir -p ~/.opencode/skills/goal-oriented
curl -o ~/.opencode/skills/goal-oriented/SKILL.md \
  https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/goal-oriented/SKILL.md

# 全局安装 - PDCA 循环
mkdir -p ~/.opencode/skills/pdca-cycle
curl -o ~/.opencode/skills/pdca-cycle/SKILL.md \
  https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/pdca-cycle/SKILL.md

# 全局安装 - MVP First
mkdir -p ~/.opencode/skills/mvp-first
curl -o ~/.opencode/skills/mvp-first/SKILL.md \
  https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/mvp-first/SKILL.md

# 全局安装 - DDD 战略设计
mkdir -p ~/.opencode/skills/ddd-strategic-design
curl -o ~/.opencode/skills/ddd-strategic-design/SKILL.md \
  https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/ddd-strategic-design/SKILL.md

# 全局安装 - DDD 战术设计
mkdir -p ~/.opencode/skills/ddd-tactical-design
curl -o ~/.opencode/skills/ddd-tactical-design/SKILL.md \
  https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/ddd-tactical-design/SKILL.md

# 全局安装 - SWOT分析
mkdir -p ~/.opencode/skills/swot-analysis
curl -o ~/.opencode/skills/swot-analysis/SKILL.md \
  https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/swot-analysis/SKILL.md

# 全局安装 - 提示词增强器
mkdir -p ~/.opencode/skills/prompt-enhancer
curl -o ~/.opencode/skills/prompt-enhancer/SKILL.md \
  https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/prompt-enhancer/SKILL.md
```

### Cursor

```bash
# Cursor 使用相同的 SKILL.md 格式
mkdir -p ~/.cursor/rules
curl -o ~/.cursor/rules/first-principles.md \
  https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/first-principles/SKILL.md

# 重复以上步骤安装其他方法论...
```

---

## 使用示例

### 示例 1：使用第一性原理优化数据库查询

```
用户：这个查询太慢了，用第一性原理分析如何优化

AI：[触发 first-principles skill]
让我从本质出发分析查询慢的根本原因...

[按照 skill 中的思维框架拆解]
1. 表象：查询耗时 10 秒
2. 假设：我们假设索引已经足够、数据量是瓶颈
3. 本质：实际瓶颈是磁盘 I/O，而非 CPU 或内存
4. 重建：从 I/O 优化角度重新设计方案...

结果：查询时间降至 0.8 秒
```

### 示例 2：使用目标导向执行重构任务

```
用户：重构用户认证模块，目标导向地执行

AI：[触发 goal-oriented skill]
让我明确目标和关键路径...

[使用目标拆解工具]
✓ 目标：提升认证模块可维护性和安全性
✓ 成功标准：测试覆盖率 > 90%，无安全漏洞
✓ 关键里程碑：
  - M1: 完成代码审计（Day 3）
  - M2: 核心重构（Day 7）
  - M3: 测试上线（Day 10）
✓ 潜在干扰：新需求插入、依赖变更

执行过程监控中...
发现 Week 2 偏离：团队在优化非核心功能
立即调整：回归核心目标，移除非核心优化
```

### 示例 3：使用 PDCA 改进 CI/CD 流程

```
用户：用 PDCA 循环优化 CI/CD 流程

AI：[触发 pdca-cycle skill]
开始 PDCA 循环...

Plan:
- 目标：减少构建时间 50%
- 当前：平均 20 分钟
- 方案：并行化测试、缓存依赖

Do:
- 在 feature 分支试点实施
- 收集构建时间数据

Check:
- 构建时间降至 11 分钟
- 失败率未增加
- 部分测试仍串行

Act:
- 标准化并行化配置
- 下一轮优化剩余串行测试

[进入下一个 PDCA 循环]
```

---

## 组合使用

方法论可以组合使用，发挥更大威力。详见 [组合使用指南](docs/combining-methodologies.md)

### 常见组合

| 组合 | 适用场景 |
|------|----------|
| MVP First + 目标导向 | 新产品快速验证与迭代 |
| MVP First + PDCA | 产品迭代优化 |
| 第一性原理 + MVP First | 创新产品设计（打破假设+快速验证） |
| 第一性原理 + PDCA | 从根本优化现有流程 |
| 目标导向 + PDCA | 长期项目持续交付 |
| 第一性原理 + 目标导向 | 创新项目设计 |
| 三法合一 | 复杂系统从零构建 |

**组合示例**：

```
用户：优化 CI/CD 构建速度，用第一性原理 + PDCA

AI：
[第一阶段：第一性原理]
找到根本原因：磁盘 I/O 是瓶颈（占 70% 时间）

[第二阶段：PDCA 循环]
Plan: 引入缓存层、并行下载
Do: 在 feature 分支试点
Check: I/O 时间从 10 分钟降至 4 分钟
Act: 标准化配置，下一轮优化测试并行度
```

```
用户：我想做一个推荐系统，用 MVP First + 目标导向

AI：
[MVP First：识别假设]
风险最高的假设：用户真的需要推荐吗？

[Layer 0：假门验证]
在热门内容中插入1条"编辑推荐"，观察点击率
成本：1小时
验证：编辑推荐点击率 > 随机内容2倍 → 用户需要推荐

[目标导向：设定目标]
目标：上线推荐系统，提升用户粘性
成功标准：推荐内容点击率 > 15%，用户停留时间 +20%
里程碑：
  M1: Layer 0 验证（Day 1）✓
  M2: 简单推荐算法（Day 7）
  M3: A/B测试上线（Day 14）
```

---

## 贡献指南

欢迎贡献新的方法论！详见 [CONTRIBUTING.md](CONTRIBUTING.md)

**快速贡献流程**：
1. Fork 本仓库
2. 复制 `docs/templates/skill-template.md` 到 `skills/你的方法论/`
3. 填写 SKILL.md 内容
4. 提交 PR

---

## License

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## Credits

由 [恐龙创新部](https://github.com/konglong87) 出品

---

## 📬 联系方式

- **Issues**: [GitHub Issues](https://github.com/konglong87/methodology-skills/issues)
- **Discussions**: [GitHub Discussions](https://github.com/konglong87/methodology-skills/discussions)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/konglong87">恐龙创新部</a>
</p>