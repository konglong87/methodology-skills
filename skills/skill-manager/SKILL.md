---
name: skill-manager
description: "Use when user asks to 'manage skills', 'list skills', 'search skills', 'recommend skills', 'organize skills', 'categorize skills', 'find skills', 'index skills', 'sync skills', or needs to work with multiple Claude Code skills in the repository. This skill provides a comprehensive system for indexing, searching, and organizing skills by category and tags."
---

# Skill Manager

## Overview

Skill Manager 是一个专门用于管理和组织 Claude Code 技能的工具系统。它提供了完整的技能索引、搜索、分类和推荐功能,帮助用户高效地发现和使用各种技能。

**核心功能**:
- **技能索引**: 自动扫描和索引所有技能,生成全局索引文件
- **智能分类**: 基于规则和 AI 自动分类技能到不同类别
- **全文搜索**: 支持按名称、描述、标签和分类搜索技能
- **智能推荐**: 根据用户查询智能推荐相关技能
- **统计分析**: 提供技能数量、分类分布、标签使用等统计数据
- **同步管理**: 自动检测新增、修改和删除的技能,保持索引最新

**数据结构**:
- 每个技能包含名称、描述、分类、标签、路径、状态等元数据
- 全局索引存储在 `index.json` 中,包含所有技能的信息和统计数据
- 支持禁用/启用技能,不影响索引结构

## When to Use

**适用场景**:
- 需要查看仓库中有哪些可用的技能
- 搜索特定功能或领域的技能
- 为特定任务推荐合适的技能
- 管理和组织大量技能
- 查看技能的分类和标签信息
- 统计和分析技能的使用情况
- 需要了解技能的完整元数据

**不适用场景**:
- 单个技能的开发和调试(直接使用技能本身)
- 技能内部逻辑的修改和测试
- 不涉及技能管理的常规编程任务

## The Process

```dot
digraph skill_manager {
    rankdir=LR;

    "初始化索引" [shape=box, style=filled, fillcolor="#c8e6c9"];
    "扫描技能" [shape=box, style=filled, fillcolor="#bbdefb"];
    "分类技能" [shape=box, style=filled, fillcolor="#fff9c4"];
    "生成索引" [shape=box, style=filled, fillcolor="#f8bbd0"];
    "搜索/推荐" [shape=box, style=filled, fillcolor="#e0e0e0"];

    "初始化索引" -> "扫描技能";
    "扫描技能" -> "分类技能";
    "分类技能" -> "生成索引";
    "生成索引" -> "搜索/推荐" [label="索引已创建"];

    "搜索/推荐" -> "分类技能" [label="更新分类", style=dashed];
}
```

### 步骤详解

**步骤 1: 初始化索引**
- 运行 `init` 命令初始化技能索引
- 扫描仓库中的所有技能目录
- 生成全局索引文件 `index.json`

**步骤 2: 扫描技能**
- 检测每个技能目录的 SKILL.md 文件
- 提取技能名称、描述、禁用状态等基本信息
- 支持增量更新,只处理变化的技能

**步骤 3: 分类技能**
- 使用预定义规则进行基础分类
- 基于关键词匹配技能到合适类别
- 为技能添加相关标签
- 支持自定义分类(通过手动编辑 metadata.json)

**步骤 4: 生成索引**
- 整合所有技能的元数据
- 生成分类索引(按类别组织技能列表)
- 计算统计信息(总数、分类计数、标签计数)
- 保存到 `index.json`

**步骤 5: 搜索/推荐**
- 基于索引进行快速搜索
- 支持按名称、描述、标签、分类查询
- 计算匹配度分数,排序结果
- 提供推荐理由和匹配类型

## Command Reference

### init - 初始化技能索引

```bash
node scripts/init.js [options]
```

**选项**:
- `--force`: 强制重新分类所有技能
- `--category <category>`: 只处理指定分类的技能
- `--skills-dir <path>`: 自定义技能目录路径
- `--index-path <path>`: 自定义索引文件路径
- `--metadata-path <path>`: 自定义元数据配置路径

**示例**:
```bash
# 初始化索引
node scripts/init.js

# 强制重新分类所有技能
node scripts/init.js --force

# 只处理"方法论"分类的技能
node scripts/init.js --category 方法论

# 使用自定义路径
node scripts/init.js --skills-dir /path/to/skills --index-path /path/to/index.json
```

### list - 列出技能

```bash
node scripts/list.js [options]
```

**选项**:
- `--category <category>`: 只列出指定分类的技能
- `--disabled`: 包含禁用的技能
- `--all`: 列出所有技能(包括禁用)
- `--index-path <path>`: 自定义索引文件路径

**示例**:
```bash
# 列出所有启用的技能
node scripts/list.js

# 列出"方法论"分类的技能
node scripts/list.js --category 方法论

# 列出所有技能(包括禁用)
node scripts/list.js --all

# 列出禁用的技能
node scripts/list.js --disabled
```

### search - 搜索技能

```bash
node scripts/search.js <query> [options]
```

**选项**:
- `--category <category>`: 按分类过滤
- `--tag <tag>`: 按标签过滤
- `--limit <n>`: 最大结果数(默认: 10)
- `--index-path <path>`: 自定义索引文件路径

**示例**:
```bash
# 搜索包含"数据库"的技能
node scripts/search.js 数据库

# 在"方法论"分类中搜索
node scripts/search.js 思考 --category 方法论

# 搜索有"优化"标签的技能
node scripts/search.js 性能 --tag 优化

# 限制结果数量
node scripts/search.js 测试 --limit 5
```

### recommend - 推荐技能

```bash
node scripts/recommend.js <query> [options]
```

**选项**:
- `--limit <n>`: 最大推荐数量(默认: 5)
- `--index-path <path>`: 自定义索引文件路径

**示例**:
```bash
# 推荐适合"项目管理"的技能
node scripts/recommend.js 项目管理

# 限制推荐数量
node scripts/recommend.js 文档 --limit 3
```

### sync - 同步技能

```bash
node scripts/sync.js [options]
```

**选项**:
- `--index-path <path>`: 自定义索引文件路径

**示例**:
```bash
# 同步技能索引
node scripts/sync.js

# 使用自定义索引路径
node scripts/sync.js --index-path /path/to/index.json
```

### stats - 显示统计信息

```bash
node scripts/stats.js [options]
```

**选项**:
- `--index-path <path>`: 自定义索引文件路径

**示例**:
```bash
# 显示统计信息
node scripts/stats.js

# 使用自定义索引路径
node scripts/stats.js --index-path /path/to/index.json
```

## Usage Examples

### 示例 1: 首次初始化和管理技能

**场景**: 刚创建一个新的技能仓库,需要初始化索引并查看所有技能。

```bash
# 1. 初始化技能索引
cd skills/skill-manager
node scripts/init.js

# 输出示例:
# 🔧 Initializing skill index...
#   Skills directory: /Users/user/skills
#   Index path: /Users/user/skills/skill-manager/index.json
#   ✓ Loaded metadata config
#   ✓ Found 15 skills
#   ✓ Loaded existing index (0 skills)
#   ✓ Saved updated index
# ✅ Initialization complete!
# Added 15 skills:
#   ✓ first-principles (方法论)
#   ✓ goal-oriented (方法论)
#   ...

# 2. 查看所有技能
node scripts/list.js

# 输出示例:
# 📚 All Skills (15 total)
#
# 📁 方法论 (6 skills)
# ─────────────────────────────────────────────────────────
#   ✓ first-principles
#     第一性原理思维,从基础元素重新构建解决方案
#     [创新, 思考, 根本原因]
#   ✓ goal-oriented
#     目标导向执行,防止需求蔓延
#     ...
#
# 📁 数据处理 (3 skills)
# ...

# 3. 查看统计信息
node scripts/stats.js

# 输出示例:
# 📊 Skill Statistics
# ─────────────────────────────────────────────────────────
# Total Skills: 15
#   Enabled: 14
#   Disabled: 1
#
# By Category:
#   方法论: 6
#   内容创作: 4
#   数据处理: 3
#   其他: 2
#
# Top Tags:
#   自动化: 5
#   文档: 4
#   分析: 3
```

### 示例 2: 搜索和推荐技能

**场景**: 用户需要一个"数据库优化"相关的技能,不确定哪个技能最合适。

```bash
# 1. 搜索相关技能
node scripts/search.js 数据库 优化

# 输出示例:
# 🔍 Search results for "数据库 优化" (3 found):
#
# 1. ✓ db-optimizer (数据处理) [数据库, 性能, 优化]
#    Score: 9.5
#    Reason: 名称包含"数据库"和"优化"
#    Description: 数据库性能优化工具,自动分析慢查询...
#    Path: /skills/db-optimizer
#
# 2. ✓ query-analyzer (数据处理) [SQL, 数据库, 分析]
#    Score: 7.2
#    Reason: 描述包含"数据库",标签包含"分析"
#    Description: SQL 查询分析器,提供查询优化建议...
#    Path: /skills/query-analyzer
#
# 3. ✓ performance-tuner (开发工具) [性能, 监控]
#    Score: 6.0
#    Reason: 描述包含"优化"
#    Description: 应用性能监控和调优工具...
#    Path: /skills/performance-tuner

# 2. 获取更智能的推荐
node scripts/recommend.js "我需要优化数据库查询性能"

# 输出示例:
# 💡 Recommended skills for "我需要优化数据库查询性能":
#
# 1. db-optimizer (Score: 9.5)
#    专门用于数据库性能优化,包含慢查询分析、索引推荐等功能
#
# 2. query-analyzer (Score: 7.8)
#    SQL 查询分析器,可以提供查询优化建议和执行计划分析
#
# 3. performance-monitor (Score: 6.5)
#    综合性能监控工具,可以跟踪数据库性能指标
```

### 示例 3: 管理特定分类的技能

**场景**: 用户只关心"方法论"分类的技能。

```bash
# 1. 列出方法论技能
node scripts/list.js --category 方法论

# 输出示例:
# 📁 方法论 (6 skills)
# ─────────────────────────────────────────────────────────
#   ✓ first-principles
#     第一性原理思维,从基础元素重新构建解决方案
#     [创新, 思考, 根本原因]
#   ✓ goal-oriented
#     目标导向执行,防止需求蔓延
#     [项目管理, 执行, 规划]
#   ✓ pdca-cycle
#     PDCA 循环,持续改进和迭代优化
#     [质量, 持续改进, 流程]
#   ...

# 2. 在方法论分类中搜索
node scripts/search.js 思考 --category 方法论

# 3. 只更新方法论技能的索引
node scripts/init.js --category 方法论 --force
```

### 示例 4: 处理禁用的技能

**场景**: 某些技能暂时禁用,需要查看和管理。

```bash
# 1. 列出所有技能(包括禁用)
node scripts/list.js --all

# 输出示例:
# 📚 All Skills (15 total)
#
# 📁 方法论 (6 skills)
# ─────────────────────────────────────────────────────────
#   ✓ first-principles
#     ...
#   ❌ old-methodology
#     旧版本的方法论工具,已禁用
#
# ...

# 2. 只列出禁用的技能
node scripts/list.js --disabled

# 3. 查看统计信息(包含禁用技能)
node scripts/stats.js

# 输出显示:
# Total Skills: 15
#   Enabled: 14
#   Disabled: 1
```

## Data Storage Details

### 索引文件结构

索引文件 `index.json` 存储在 `skills/skill-manager/index.json`,包含以下数据:

```json
{
  "version": "1.0.0",
  "lastUpdated": "2026-03-13T10:00:00Z",
  "categories": {
    "方法论": ["first-principles", "goal-oriented", "pdca-cycle"],
    "内容创作": ["infographic-generator", "article-writer"],
    "数据处理": ["csv-analyzer", "json-transformer"],
    "开发工具": ["code-review", "api-tester"],
    "自动化": ["workflow-automator", "task-runner"],
    "多媒体": ["image-processor", "video-editor"],
    "其他": ["misc-helper"]
  },
  "skills": {
    "first-principles": {
      "name": "first-principles",
      "description": "第一性原理思维,从基础元素重新构建解决方案",
      "category": "方法论",
      "tags": ["创新", "思考", "根本原因"],
      "path": "/skills/first-principles",
      "metadataPath": "/skills/first-principles/metadata.json",
      "autoGenerated": true,
      "generatedAt": "2026-03-13T10:00:00Z",
      "customized": false,
      "disabled": false
    },
    ...
  },
  "stats": {
    "totalSkills": 15,
    "enabledSkills": 14,
    "disabledSkills": 1,
    "categoryCounts": {
      "方法论": 6,
      "内容创作": 4,
      "数据处理": 3,
      "开发工具": 1,
      "自动化": 1,
      "多媒体": 0,
      "其他": 0
    },
    "tagCounts": {
      "创新": 5,
      "思考": 4,
      "自动化": 3,
      "文档": 2
    }
  }
}
```

### 技能元数据文件

每个技能可以有一个可选的 `metadata.json` 文件,存储自定义分类和标签:

```json
{
  "category": "方法论",
  "tags": ["创新", "思考", "根本原因", "问题解决"],
  "customized": true,
  "notes": "这是第一性原理的核心技能"
}
```

如果存在 `metadata.json`,索引系统会使用其中的分类和标签,而不是自动生成的。

### 预定义配置文件

`metadata.json` (在 `skills/skill-manager/` 目录) 定义分类系统和预定义规则:

```json
{
  "categories": [
    "方法论",
    "内容创作",
    "开发工具",
    "数据处理",
    "自动化",
    "多媒体",
    "其他"
  ],
  "rules": [
    {
      "keywords": ["第一性原理", "思维", "思考", "根本", "本质", "假设", "推理"],
      "category": "方法论",
      "tags": ["创新", "思考", "根本原因"]
    },
    {
      "keywords": ["目标", "执行", "规划", "计划", "项目", "任务", "milestone"],
      "category": "方法论",
      "tags": ["项目管理", "执行", "规划"]
    },
    ...
  ]
}
```

## Classification System

### 分类机制

Skill Manager 使用两层分类机制:

**1. 预定义规则分类** (rule-based)
- 基于关键词匹配
- 快速且准确
- 适用于常见技能类型
- 可通过 `metadata.json` 扩展规则

**2. AI 辅助分类** (llm-based)
- 使用 Claude API 进行智能分类
- 处理复杂的、规则无法覆盖的情况
- 提供分类置信度评分
- 可配置为使用或禁用

### 分类优先级

1. **手动元数据**: 如果技能目录存在 `metadata.json`,优先使用其中的分类和标签
2. **预定义规则**: 如果没有手动元数据,尝试匹配预定义规则
3. **AI 分类**: 如果规则不匹配,使用 AI 进行分类
4. **默认分类**: 如果 AI 分类失败或禁用,使用"其他"分类

### 标签系统

标签提供了更细粒度的技能组织:

- **自动生成**: 基于预定义规则为技能添加标签
- **手动添加**: 通过编辑 `metadata.json` 自定义标签
- **多标签支持**: 每个技能可以有多个标签
- **标签统计**: 索引系统自动统计每个标签的使用次数

### 禁用技能机制

- 技能可以通过在 SKILL.md 中设置 `disabled: true` 来禁用
- 禁用的技能仍然在索引中,但标记为 `disabled: true`
- 搜索和列表命令默认排除禁用技能
- 使用 `--all` 或 `--disabled` 选项可以包含禁用技能

## Workflow Guide

### 典型工作流程

**场景 1: 初次设置**

1. 运行 `init` 命令初始化索引
2. 检查生成的索引和分类
3. 手动调整分类(如果需要)
4. 运行 `list` 查看所有技能
5. 运行 `stats` 查看统计信息

**场景 2: 日常使用**

1. 运行 `sync` 同步最新变更
2. 使用 `search` 查找需要的技能
3. 使用 `recommend` 获取智能推荐
4. 使用 `list --category` 浏览特定分类

**场景 3: 添加新技能**

1. 创建新技能目录和 SKILL.md
2. 运行 `init` 更新索引
3. 检查自动分类是否正确
4. 如需要,创建 `metadata.json` 自定义分类

**场景 4: 维护和优化**

1. 定期运行 `sync` 保持索引最新
2. 使用 `stats` 监控技能分布
3. 根据需要调整预定义规则
4. 审查禁用技能,决定是否重新启用

## Common Pitfalls

### 误区 1: 忘记运行初始化

**表现**: 直接使用 `list` 或 `search` 命令,但索引文件不存在

**正确做法**: 首次使用前必须运行 `init` 命令初始化索引

### 误区 2: 忽略自定义分类

**表现**: 自动分类不准确,但没有手动调整

**正确做法**: 对于分类不准确的技能,创建 `metadata.json` 自定义分类

### 误区 3: 过度依赖 AI 分类

**表现**: 对所有技能都使用 AI 分类,成本高且速度慢

**正确做法**: 优先使用预定义规则,只在必要时使用 AI 分类

### 误区 4: 不定期同步

**表现**: 添加新技能后,索引没有更新,无法搜索到

**正确做法**: 添加、删除或修改技能后,运行 `sync` 或 `init` 更新索引

## References

- [Claude Code Plugin Documentation](https://claude.com/docs)
- [YAML Frontmatter Specification](https://jekyllrb.com/docs/front-matter/)
- [Skill Development Best Practices](https://example.com/skills-guide)
- [Indexing and Search Algorithms](https://example.com/search-algorithms)