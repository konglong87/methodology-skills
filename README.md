# Methodology Skills

<p align="center">
  <img src="https://img.shields.io/badge/version-1.11.7-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Claude%20Code-✓-purple.svg" alt="Claude Code">
  <img src="https://img.shields.io/badge/OpenCode-✓-orange.svg" alt="OpenCode">
  <img src="https://img.shields.io/badge/Cursor-✓-cyan.svg" alt="Cursor">
  <img src="https://img.shields.io/badge/Codex-✓-magenta.svg" alt="Codex">
  <img src="https://img.shields.io/badge/Exa%20AI%20Search-✓-brightgreen.svg" alt="Exa AI Search">
</p>

> 让 AI 掌握方法论，更聪明地思考和执行任务

一个包含第一性原理、目标导向、PDCA 循环、领域驱动设计(DDD)、SWOT分析等方法论的 Skills 工具箱。支持 Claude Code、OpenCode、Cursor、Codex。

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

**刚性要求：每个用户请求都必须触发目标追踪**

以最终目标为指引，确保行动不偏离方向。通过目标追踪工具自动创建、调整、验证目标，防止范围蔓延和目标偏离。

**核心特性**:
- ⚡ **持续触发** - 每个用户消息都会触发目标检查
- 🎯 **自动追踪** - 自动创建目标文件，记录原始需求和SMART目标
- 🔄 **动态调整** - 用户修改需求时立即更新目标
- ✅ **强制验证** - 任务完成前必须验证目标达成情况

**适用场景**:
- 执行长期任务（周期 > 1分钟 或 步骤 > 2）
- 项目规划和管理
- 容易偏离目标的复杂任务
- 多任务并行，需要优先级判断

**Iron Law 强制执行规则**:
1. **任务开始时** - 检测到多步骤任务，立即创建目标文件
2. **任务执行中** - 用户调整需求，立即更新目标文件
3. **任务完成时** - AI声称完成，强制验证目标是否达成

**触发方式**: **刚性要求** - 每个用户请求都会自动触发，无需用户明确指定

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
- 📝 **多版本输出** - 自动生成 4 个文章版本，完美兼容微信公众号
  - 完整版（Markdown，5000字）- 适合博客、知识库
  - 精简版（Markdown，1000字）- 适合快速阅读
  - 精简版纯文本（1000字）- ✅ **微信专用**，无Markdown格式
  - 完整版纯文本（5000字）- ✅ **微信专用**，无Markdown格式
- 🎨 **风格定制** - 通过 EXTEND.md 自定义写作风格、目标受众、文章长度
- 🖼️ **图片风格指定** - 支持在主题中指定信息图风格（科技风、可爱风、手绘风等8种风格）
- 🔍 **Exa AI 联网搜索** - 强制优先使用 Exa AI 进行高质量搜索，确保内容时效性和准确性
  - 自动检测 Exa AI MCP 服务器
  - 强制优先级策略，确保最佳搜索结果
  - 详细搜索结果记录到 research.md
- 📏 **字数控制** - 支持自定义字数限制，默认 5000 字，可灵活配置
- 📁 **结构化输出** - 自动保存到 `wechat-articles/{topic}/` 目录

**触发方式**:
```bash
# 默认使用（启用联网搜索，5000字）
/wechat-article-writer "文章主题"

# 自定义字数
/wechat-article-writer "文章主题" --word-count 3000

# 禁用联网搜索
/wechat-article-writer "文章主题" --no-search
```

**示例**:
```bash
# 使用默认字数限制（自动联网搜索最新信息）
/wechat-article-writer "AI工具推荐:提升10倍效率的5个神器"

# 指定 3000 字
/wechat-article-writer "AI工具推荐:提升10倍效率的5个神器" --word-count 3000

# 禁用联网搜索（使用 AI 内置知识库）
/wechat-article-writer "Python基础教程" --no-search

# 指定信息图风格（科技风）
/wechat-article-writer "AI工具推荐:提升10倍效率的5个神器，风格 科技风" --word-count 3000

# 指定信息图风格（手绘风）
/wechat-article-writer "Python入门教程，风格 手绘风" --word-count 4000

# 指定信息图风格（简约风）
/wechat-article-writer "项目管理方法论，风格 简约风"
```

**支持的图片风格**:
可在主题末尾添加 `风格 XXX` 来指定信息图风格：
- 科技风 - 适合AI、编程、技术内容
- 可爱风 - 适合生活、美食、宠物内容
- 手绘风 - 适合教程、学习内容
- 简约风 - 适合商务、职场内容
- 教学风 - 适合教程、指南内容
- 泥塑风 - 适合创意、艺术内容
- 漫画风 - 适合动漫、游戏内容
- Bento风 - 适合模块化、架构内容

> 💡 **提示**: 如果不指定风格，系统会根据内容自动选择最合适的风格

**配置默认设置** (通过 EXTEND.md):
```yaml
word_count_limit: 3000      # 设置默认字数限制
enable_web_search: true     # 启用联网搜索（默认启用）
```

**联网搜索功能**:
支持多种联网搜索方式,系统会自动检测并选择最优方案:
- ✅ **Exa AI Search** (强制优先) - 使用 Exa AI MCP server 进行最高质量联网搜索，获取最新、最准确的信息
- ✅ **Claude Code WebSearch** - Claude Code 内置的 WebSearch 工具（仅在Exa AI不可用时使用）
- ✅ **Cursor/OpenCode/OpenClaw** - 使用各工具内置联网能力
- ✅ **智能降级** - 如无可用的联网工具，优雅跳过，使用 AI 内置知识库

**智能适配**: 系统按严格优先级选择搜索方式：**Exa AI (最高质量，强制优先)** → WebSearch → 工具内置能力 → 跳过搜索，确保所有环境都能正常工作。

**工作流程**:
1. 加载用户偏好（EXTEND.md）
2. 分析主题并生成大纲
3. **联网搜索** - 使用 Exa AI（优先）或其他联网工具搜索最新信息
4. AI 写作完整文章（融合搜索结果，遵循字数限制）
5. **生成多版本文章** - 自动生成 4 个版本：
   - article.md（完整版 Markdown）
   - article-1000.md（精简版 Markdown）
   - article-plain.txt（完整版纯文本，微信专用）
   - article-1000-plain.txt（精简版纯文本，微信专用）
6. 自动生成配套信息图
7. 保存到指定目录

**联网搜索优先级**：
1. **Exa AI MCP** (强制优先，最佳质量) - 高质量 AI 驱动搜索，任何时候都优先使用
2. **Claude Code WebSearch** - 内置搜索工具（仅在Exa AI不可用时使用）
3. **其他工具内置能力** - Cursor/OpenCode 等
4. **优雅降级** - 无联网能力时使用 AI 知识库

**示例输出**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ WeChat Article Complete!

主题: 2026年3月LLM大爆发：三大巨头对决，百万上下文成标配
风格: 专业前沿洞察

输出:
  📄 article.md           (5000字完整文章)
  🖼️ infographic/
     ├─ 01-model-comparison-matrix.png  (LLM对比矩阵)
     └─ 02-release-timeline.png         (发布时间线)
  📋 meta.json           (元数据和SEO信息)

下一步:
  → 审阅 article.md
  → 预览信息图 PNG 文件
  → 运行 /baoyu-post-to-wechat 发布到微信公众号
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**支持平台**: Claude Code、Cursor、OpenClaw、OpenCode、Antigravity 等所有支持 skills 的 AI 工具

### 🎯 信息图生成器 (Infographic Generator)

智能信息图生成工具，支持自然语言描述自动生成专业信息图，配备动态风格选择系统。

**适用场景**: 创建知识科普、数据可视化、流程说明、对比分析等信息图

**核心功能**:
- 🎨 **动态风格选择** - 三层优先级：用户指定 > LLM智能选择 > 可爱风格兜底
- 🏷️ **智能标题生成** - 自动提取有意义的标题和副标题，告别默认模板
- 📐 **横竖双版输出** - 默认同时生成横版(1920x1080)和竖版(1080x1920)两个版本
  - 横版：适合桌面、演示、博客
  - 竖版：适合手机、小红书、社交媒体
- ⚡ **一键生成** - 无需中途确认，全程自动化输出
- 🖼️ **8种视觉风格** - 科技风、可爱风、手绘风、简约风、教学风、笔记风、漫画风、Bento风
- 🌐 **多语言支持** - 支持中英文风格指定

**触发方式**: `/infographic-generator "描述内容"` 或直接描述信息图需求

**风格指定方式**:
```
# 方式1：明确指定风格（最高优先级）
"生成Python信息图，使用手绘风格"
"创建数据分析图表，简约风"

# 方式2：LLM智能选择
"生成AI工具推荐信息图"  → 自动选择科技风
"制作美食教程信息图"    → 自动选择教学风

# 方式3：可爱风格兜底
"生成一个信息图"        → 无法识别时使用可爱风
```

**支持的8种风格**:
| 风格 | 适用场景 |
|------|----------|
| 科技风 (tech) | AI、编程、数据分析、科技产品 |
| 可爱风 (cute) | 生活、美食、宠物、日常分享 |
| 手绘风 (notebook) | 学习笔记、复习、知识总结 |
| 简约风 (minimal) | 商务、职场、管理、专业报告 |
| 教学风 (tutorial) | 教程、指南、培训、入门教学 |
| 泥塑风 (clay) | 创意、艺术、设计、手工制作 |
| 漫画风 (comics) | 动漫、游戏、二次元、娱乐 |
| Bento风 (bento) | 模块化、架构、系统设计 |

**示例**:
```bash
# 用户指定风格
"生成Python编程语言的信息图，使用科技风，包含语法简洁、应用广泛、生态丰富3个特点"

# LLM智能选择
"生成AI工具推荐信息图，包含ChatGPT、Midjourney、Notion AI三个工具"

# 美食内容（自动选择教学风）
"生成美食制作教程信息图，包含准备食材、烹饪步骤、装盘技巧3个要点"
```

**支持平台**: Claude Code、Cursor、OpenClaw、OpenCode、Antigravity 等所有支持 skills 的 AI 工具

### 🎯 算命系统

融合紫微斗数、生辰八字、盲派、南北派四大派系的综合命理推算系统，提供专业的命理分析报告。

**适用场景**: 算命、八字算命、紫微斗数、命理分析、算一卦、看命、批八字、排盘

**核心功能**:
- 🔮 **四大派系融合** - 紫微斗数、生辰八字、盲派、南北派
- 💫 **5轮验证机制** - 确保结论可靠性，LLM反复review推理过程
- 🌍 **时代背景贯穿** - 大运流年分析包含时代背景
- 🎨 **一键生成图片** - 自动生成PNG信息图（横版+竖版），无需用户干预
- 📅 **中文日期支持** - 支持农历中文数字日期（如：农历十月初六）

**v2.3.0 新特性**:
- ✅ 自动生成PNG信息图（横版1920x1080 + 竖版1080x1920）
- ✅ 支持中文数字日期解析（农历十月初六、正月初一等）
- ✅ 完全自动化流程，一键生成JSON+Markdown+PNG
- 🔍 **智能输入提取** - 支持自然语言任意顺序输入，40个主要城市智能识别
- 📊 **完整分析报告** - 8000-12000字详细命理分析 + PNG信息图（横版+竖版）
- 🎯 **严格必填验证** - 所有信息必填，无默认值，确保数据准确性

**5轮验证机制**:
1. **第1轮验证** - 计算器基础验证（标准算法计算）
2. **第2轮验证** - LLM独立验证（AI工具独立分析验证）
3. **第3轮验证** - LLM交叉验证（AI工具交叉检查，确保结果一致）
4. **第4轮验证** - 典籍依据核查（所有结论必须有典籍支撑）
5. **第5轮验证** - 最终确认（确保推理过程严谨，不是瞎编乱造）

**四大派系**:
- **紫微斗数**: 十四主星、四化飞星、十二宫位
- **生辰八字**: 干支五行、用神喜忌、大运流年
- **盲派**: 调候+流通+格局三大核心
- **南北派**: 独特用神法、命宫归宫、纳音取象

**用户输入要求（全部必填）**:
| 字段 | 必填 | 说明 |
|------|------|------|
| 姓名 | 是 | 用于报告称呼 |
| 性别 | 是 | 男/女，影响大运顺逆 |
| 出生年份 | 是 | XXXX年格式 |
| 出生月份 | 是 | X月格式 |
| 出生日期 | 是 | X日格式，支持农历或阳历 |
| 出生时辰 | 是 | X点 或 上午X点、下午X点、晚上X点 |
| 出生地点 | 是 | 如：北京、上海、广州等 |

**示例输入**:
```
张三 男 2002年10月6日 下午2点 北京
李四 女 2002年农历十月初六 上午9点 上海
王五 男 1990年8月15日 晚上8点 广州
```

**输出内容**:
1. 基础信息 - 姓名、性别、出生日期、真太阳时
2. 紫微斗数分析 - 命宫主星、四化飞星、十二宫位、大运走势
3. 八字命理分析 - 四柱干支、五行分布、日主强弱、大运流年
4. 盲派分析 - 调候、流通、格局
5. 南北派分析 - 独特用神法、命宫归宫、纳音取象
6. 综合交叉验证 - 四大派系结论交叉验证
7. 时代背景分析 - 出生时期、大运流年的时代背景
8. 人生建议 - 职业方向、性格分析（需要LLM分析）
9. 免责声明 - 仅供参考，娱乐而已

**触发方式**:
当用户提及以下关键词时自动触发：
- 算命
- 八字算命
- 紫微斗数
- 命理分析
- 算一卦
- 看命
- 批八字
- 排盘

**示例**:
```
姓名：张三
性别：男
出生日期：1990年8月15日（阳历）
出生时辰：14时
出生地：北京
```

或

```
姓名：李四
性别：女
出生日期：1995年农历正月初三
出生时辰：上午10点
出生地：上海
```

**技术特性**:
- 基于《穷通宝鉴》《滴天髓》《三命通会》《子平真诠》《千里命稿》《五行精纪》等传统命理典籍
- 基于《紫微斗数全书》《紫微斗数精成》《斗数全书》《飞星紫微斗数全书》等典籍
- 命理学本质是统计学，准确率约70%
- 仅供参考，娱乐而已
- 三分天注定，七分靠打拼
- 一名二运三风水，不要相信宿命论
- 只要心善、努力和乐观，就是好命

**支持平台**: Claude Code、Cursor、OpenClaw、OpenCode、Antigravity 等所有支持 skills 的 AI 工具

---

## 平台支持对比

### Claude Code（推荐 - 完整体验）

**✅ 完整 Hook 支持**：
- SessionStart Hook 自动注入目标追踪系统
- 自定义标签：`<恐龙专属指令>`
- 动态读取 SKILL.md 最新内容
- 无需用户干预，自动触发

**示例**：
```xml
<system-reminder>
<恐龙专属指令>
🎯 目标追踪系统已激活

**Goal-Oriented 思维（强制执行）:**
[完整的 SKILL.md 内容自动加载]
</恐龙专属指令>
</system-reminder>
```

**触发方式**：**全自动** - 会话启动时自动注入

---

### OpenCode / Cursor（降级体验）

**⚠️ 仅支持静态 Skill 文件**：
- ❌ 无 Hook 系统，无法自动注入上下文
- ❌ 无法使用自定义标签和动态内容
- ✅ 核心功能可用：description 触发仍然有效
- ✅ 需要手动安装（运行安装脚本）

**触发方式**：**依赖 description** - AI 根据 description 字段识别

**用户体验差异**：
```
用户消息："实现一个网站"
AI 判断：检测到 description "MUST use for ANY user request"
AI 行为：加载 goal-oriented skill 并执行
```

**限制说明**：
- 无法像 Claude Code 那样在 system-reminder 中显示自定义标签
- 无法动态注入完整的 SKILL.md 内容到 system-reminder
- 但核心的目标追踪功能完全可用

---

**💡 推荐使用 Claude Code 以获得最佳体验**

---

## 安装

> **⚠️ 重要说明**：
> - **Claude Code 用户**：推荐使用"快速开始"方式，自动配置 Hook
> - **OpenCode/Cursor 用户**：请使用下方对应平台的安装脚本，手动安装 Skill 文件
> - 所有平台的核心功能完全一致，仅 Hook 自动注入功能有差异

### 快速开始（推荐）

```bash
# 1. 安装插件
claude plugin marketplace add konglong87/methodology-skills
claude plugin install methodology-skills@methodology-skills

# 2. 配置 Exa AI 搜索（推荐，获取最佳联网搜索体验）
claude mcp add exa-search "https://api.exa.ai/mcp?key=YOUR_EXA_API_KEY" -t http

# 获取 Exa AI API Key: https://exa.ai
```

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

### 配置 Exa AI 联网搜索（推荐）

Exa AI 提供高质量的 AI 驱动搜索引擎，能够获取最新、最准确的信息，显著提升文章质量。

```bash
# 1. 获取 Exa AI API Key
# 访问 https://exa.ai 注册账号并获取免费 API Key

# 2. 添加 Exa AI MCP Server 到 Claude Code
claude mcp add exa-search "https://api.exa.ai/mcp?key=YOUR_EXA_API_KEY" -t http

# 3. 验证配置
claude mcp list
```

**Exa AI 优势**：
- 🎯 **高精度搜索** - AI 驱动的语义搜索，更准确的结果
- 🚀 **实时更新** - 获取最新信息，确保内容时效性
- 📊 **结构化结果** - 返回清洁、可用的文本内容
- 💡 **免费额度** - 提供免费使用额度，足够日常使用

**不配置 Exa AI 的替代方案**：
- Claude Code 会使用内置 WebSearch 工具
- Cursor/OpenCode 使用各自的联网能力
- 功能依然可用，只是搜索质量略低于 Exa AI

### Cursor

Cursor 支持通过插件市场或手动安装两种方式。

#### 方式一：插件市场安装（推荐）

在 Cursor Agent chat 中安装：

```text
/add-plugin methodology-skills
```

或搜索 "methodology-skills" 安装插件。

#### 方式二：手动安装

Cursor 使用 `.cursor/rules` 目录存放全局规则，SKILL.md 格式完全兼容。

**一键安装所有方法论**：
```bash
# 创建安装脚本
cat > /tmp/install-methodology-skills-cursor.sh << 'EOF'
#!/bin/bash
SKILLS=(
  "first-principles"
  "goal-oriented"
  "pdca-cycle"
  "mvp-first"
  "ddd-strategic-design"
  "ddd-tactical-design"
  "swot-analysis"
  "prompt-enhancer"
  "skill-manager"
  "wechat-article-writer"
  "infographic-generator"
  "fortune-teller"
)

BASE_URL="https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills"

mkdir -p ~/.cursor/rules

for skill in "${SKILLS[@]}"; do
  echo "Installing $skill..."
  curl -fsSL "$BASE_URL/$skill/SKILL.md" -o ~/.cursor/rules/$skill.md
done

echo "✅ All methodology skills installed!"
EOF

# 执行安装
chmod +x /tmp/install-methodology-skills-cursor.sh
/tmp/install-methodology-skills-cursor.sh
```

**单独安装**：
```bash
# 安装目标导向（刚性要求版本）
curl -fsSL https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/goal-oriented/SKILL.md \
  -o ~/.cursor/rules/goal-oriented.md

# 安装第一性原理
curl -fsSL https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/first-principles/SKILL.md \
  -o ~/.cursor/rules/first-principles.md

# 安装 MVP First
curl -fsSL https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/mvp-first/SKILL.md \
  -o ~/.cursor/rules/mvp-first.md
```

**验证安装**：
```bash
ls -la ~/.cursor/rules/
```

### Codex

Codex 使用 native skill discovery 机制，通过克隆仓库并创建符号链接即可启用。

**一键安装**：
```bash
# 1. 克隆仓库
git clone https://github.com/konglong87/methodology-skills.git ~/.codex/methodology-skills

# 2. 创建 skills 符号链接
mkdir -p ~/.agents/skills
ln -s ~/.codex/methodology-skills/skills ~/.agents/skills/methodology-skills

# Windows (PowerShell)
# New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.agents\skills"
# cmd /c mklink /J "$env:USERPROFILE\.agents\skills\methodology-skills" "$env:USERPROFILE\.codex\methodology-skills\skills"

# 3. 重启 Codex
```

**验证安装**：
```bash
ls -la ~/.agents/skills/methodology-skills
```

**更新**：
```bash
cd ~/.codex/methodology-skills && git pull
```

**详细文档**: [`.codex/INSTALL.md`](.codex/INSTALL.md)

### OpenCode

OpenCode 支持全局 skills 安装，将 SKILL.md 文件放置到 `~/.opencode/skills/` 目录即可。

**一键安装所有方法论**：
```bash
# 创建安装脚本
cat > /tmp/install-methodology-skills.sh << 'EOF'
#!/bin/bash
SKILLS=(
  "first-principles"
  "goal-oriented"
  "pdca-cycle"
  "mvp-first"
  "ddd-strategic-design"
  "ddd-tactical-design"
  "swot-analysis"
  "prompt-enhancer"
  "skill-manager"
  "wechat-article-writer"
  "infographic-generator"
  "fortune-teller"
)

BASE_URL="https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills"

for skill in "${SKILLS[@]}"; do
  echo "Installing $skill..."
  mkdir -p ~/.opencode/skills/$skill
  curl -fsSL "$BASE_URL/$skill/SKILL.md" -o ~/.opencode/skills/$skill/SKILL.md
done

echo "✅ All methodology skills installed!"
EOF

# 执行安装
chmod +x /tmp/install-methodology-skills.sh
/tmp/install-methodology-skills.sh
```

**单独安装**：
```bash
# 安装目标导向（刚性要求版本）
mkdir -p ~/.opencode/skills/goal-oriented
curl -fsSL https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/goal-oriented/SKILL.md \
  -o ~/.opencode/skills/goal-oriented/SKILL.md

# 安装第一性原理
mkdir -p ~/.opencode/skills/first-principles
curl -fsSL https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/first-principles/SKILL.md \
  -o ~/.opencode/skills/first-principles/SKILL.md

# 安装 MVP First
mkdir -p ~/.opencode/skills/mvp-first
curl -fsSL https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/mvp-first/SKILL.md \
  -o ~/.opencode/skills/mvp-first/SKILL.md
```

**验证安装**：
```bash
ls -la ~/.opencode/skills/
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

## 更新日志

### v1.11.7 (2026-03-19)

**🎯 新增 Cursor 和 Codex 平台支持**

**核心改进**:
- ✅ **Cursor 插件支持** - 通过插件市场或手动安装
  - 支持 `.cursor/rules/` 目录安装
  - 创建 `.cursor-plugin/plugin.json` 配置文件
  - 一键安装脚本支持所有 12 个方法论 skills
- ✅ **Codex Native Skill Discovery** - 通过符号链接启用
  - 克隆仓库 + 创建符号链接即可使用
  - 创建 `.codex/INSTALL.md` 详细安装指导
  - 支持 Windows PowerShell 安装
- ✅ **OpenCode 安装指导优化** - 参考 superpowers 项目
  - 创建 `.opencode/INSTALL.md` 完整文档
  - 支持 native skill discovery 机制
  - 明确的更新和故障排除指南
- ✅ **README.md 安装指导重构** - 清晰的分层结构
  - Cursor → Codex → OpenCode 三平台完整支持
  - 每个平台都有一键安装和单独安装两种方式
  - 新增 Codex 平台徽章

**平台支持矩阵**:
| 平台 | 安装方式 | Hook 支持 | 核心功能 |
|------|---------|----------|---------|
| Claude Code | 插件市场 | ✅ 完整 | ✅ 完整 |
| Cursor | 插件市场/手动 | ❌ 无 | ✅ 完整 |
| Codex | 符号链接 | ❌ 无 | ✅ 完整 |
| OpenCode | 手动安装 | ❌ 无 | ✅ 完整 |

**文件变更**:
- 新增 `.codex/INSTALL.md` - Codex 安装指导
- 新增 `.cursor-plugin/plugin.json` - Cursor 插件配置
- 新增 `.opencode/INSTALL.md` - OpenCode 安装指导
- 更新 `README.md` - 重构安装指导章节
- 更新版本号: 1.11.6 → 1.11.7

### v1.11.6 (2026-03-18)

**🎯 Goal-Oriented 重大升级 - 刚性要求与持续触发**

**核心改进**:
- ✅ **刚性要求** - 每个用户请求都必须触发目标追踪
- ✅ **持续触发机制** - 无论是否已创建目标，每个用户消息都会触发检查
- ✅ **自定义标签** - `<恐龙专属指令>` 替代默认标签
- ✅ **明确触发条件** - 适配 OpenCode 和 Cursor 平台

**Iron Law 完整规则**:
```markdown
### ⚡ 核心原则：持续触发
每个用户消息都必须触发 goal-oriented 检查

### 任务开始时（强制创建目标）
- 检测标准：多步骤任务（> 2步 或 > 1分钟）
- 当前无 pending 目标
- 强制动作：goal-tracker.py create

### 任务执行中（强制调整目标）
- 已存在 pending 目标
- 用户补充需求细节 或 修改需求
- 强制动作：goal-tracker.py adjust

### 任务完成时（强制验证目标）
- AI 认为"完成了"、"做好了"
- 强制动作：goal-tracker.py verify
```

**适配平台**:
- ✅ Claude Code - SessionStart Hook 自动注入
- ✅ OpenCode - 全局 SKILL.md 安装
- ✅ Cursor - 全局 rules 安装

**示例行为**:
```
用户: 实现一个物资整理网站
AI: ✅ 触发 goal-oriented
    ✅ 创建目标: memory/goals/2026-03-18_1551_物资整理网站.md

用户: 重新实现一个物资整理网站
AI: ✅ 触发 goal-oriented（持续触发）
    ✅ 检查现有目标状态
    ✅ 执行 adjust 或询问用户
```

### v1.9.0 (2026-03-17)

**FortuneTeller 算命系统 v2.3.0 一键生成版**：

- ✅ **自动生成PNG信息图** - 自动调用infographic-generator生成命盘可视化
  - 横版PNG（1920x1080）：适合博客、报告
  - 竖版PNG（1080x1920）：适合手机分享、小红书
  - 一键生成，无需用户中途干预
- ✅ **中文数字日期解析** - 支持农历中文数字日期输入
  - 支持格式：`农历十月初六`、`正月初一`、`腊月廿三` 等
  - 自动转换为标准数字格式进行计算
- ✅ **完全自动化流程** - 用户只需一句话输入
  - 自动生成：JSON数据 + Markdown框架 + AI提示词 + PNG信息图
- ✅ **文件输出优化** - 所有输出文件统一保存在output/目录
- ✅ **兼容性保证** - 不影响微信文章等其他skills的正常使用

**示例输入**:
```
张三久 男 2002年农历十月初六 凌晨4点 河北
```

**输出文件**:
```
output/
├── 张三久_命盘数据.json          # JSON命盘数据（36KB）
├── 张三久_分析框架.md             # Markdown分析框架
├── 张三久_命盘信息图_横版.png     # PNG横版（1920x1080，727KB）
└── 张三久_命盘信息图_竖版.png     # PNG竖版（1080x1920，450KB）
```

### v1.8.0 (2026-03-16)

**FortuneTeller 算命系统 v2.2.0 重大改进**：

- ✅ **文件输出规范** - 严格的test/output/backup三目录分离
  - test/：测试输出，自动添加时间戳
  - output/：正式输出，永久保留
  - backup/：备份目录，定期清理

- ✅ **提示词模板优化** - 提升分析质量和深度
  - 增加十神关系深度分析（分布、含义、配合、对人生影响）
  - 增加五行流通分析（流通链条、流通路径、流通评价）
  - 增加格局喜忌分析（喜用神、忌神分析）
  - 典籍引用至少10处，推理过程至少20处

- ✅ **流年预测细节增强** - 更详细的事件预测
  - 事件概率评估（高/中/低）
  - 时间节点预测（春、夏、秋、冬四季）
  - 四维应对策略（把握机遇、规避风险、调整方向、心态调整）

- ✅ **所有必填项无默认值** - 确保数据准确性
  - 姓名、性别、出生年月日、时辰、地点全部必填
  - 缺少任何信息都会清晰提示
  - 不再使用默认值，避免数据不准确

- ✅ **智能提取输入** - 支持自然语言任意顺序
  - 不依赖固定顺序，真正自然语言输入
  - 40个主要城市优先识别
  - 友好的错误提示，清晰列出缺失字段

**示例**：
```
# 随机顺序输入也能正确识别
张三 上午9点 北京 2002年 10月 6日 男
→ 姓名：张三，性别：男，出生日期：2002年10月6日，时辰：9点，地点：北京
```

### v1.7.0 (2026-03-15)

**新增 FortuneTeller 算命系统**：
- 融合紫微斗数、生辰八字、盲派、南北派四大派系
- 三层验证机制（计算器 + LLM独立验证 + LLM交叉验证）
- 完整报告生成（JSON + Markdown + AI提示词）
- 大运深度分析（每步300字+）
- 流年事件预测
- 五行推理事业建议

**新增信息图生成器 v1.0.0**：
- 支持8种视觉风格（科技风、可爱风、手绘风、简约风、教学风、泥塑风、漫画风、Bento风）
- 智能标题生成（基于内容自动生成3个候选标题）
- 横竖双版输出（1920x1080 + 1080x1920）
- Remotion高质量渲染

### v1.6.0 (2026-03-14)

**新增微信公众号文章生成器**：
- 集成Exa AI强制优先联网搜索
- 支持热点话题、教程、科普等多种类型
- 自动生成封面图、摘要、正文
- 符合公众号排版规范

### v1.5.0 (2026-03-13)

**新增 MVP First skill**：
- 帮助避免过度工程化
- 分层验证：Layer 0（假门）→ Layer 1（基础）→ Layer 2+（增强）
- 数据驱动决策

---

**完整更新日志**: 见 [CHANGELOG.md](CHANGELOG.md)

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