---
name: wechat-article-writer
description: Generates WeChat Official Account articles with AI content creation and infographic generation. Use when user asks to "write WeChat article", "公众号文章", or wants automated article creation.
version: 1.0.0
---

# WeChat Article Writer

## ⚠️ 重要配置说明

**默认使用AI工具内置能力创作，无需配置API Key！**

本skill适用于Claude Code、Cursor、OpenClaw、OpenCode、Antigravity等所有支持skills的AI工具平台。默认使用AI工具的内置能力进行内容创作，用户无需配置任何API Key即可使用。只有当用户明确需要使用外部API（如特定图像生成服务）时，才需要配置相应的API Key。

**优先级：**
1. 优先使用AI工具内置能力完成内容创作
2. 仅在特定需求下使用外部API（如高质量图像生成）
3. 简化用户操作，零配置即可开始创作

**支持平台：**
- Claude Code
- Cursor
- OpenClaw
- OpenCode
- Antigravity
- 其他支持skills的AI工具

## Overview

Automated WeChat Official Account article creation skill that generates high-quality articles with AI-powered content creation and infographic generation. The skill uses a **multi-agent collaboration system** with specialized agents for titles, structure, and content, plus a three-layer review process to ensure professional-quality articles suitable for public account publishing.

**Key Features:**
- **Multi-Agent System**: Specialized agents for titles (100+ techniques), structure design, and content writing
- **Three-Layer Review**: Theme consistency, design & language, AI removal & colloquial optimization
- **Multi-Version Output**: 4 variants (full/condensed × markdown/plain text)

See `AGENTS.md` for detailed agent specifications and workflow.

## When to Use

**Suitable scenarios:**
- Creating WeChat Official Account articles from scratch
- Writing technical tutorials, industry analysis, or knowledge sharing articles
- Generating articles with infographics and visual content
- Producing SEO-optimized articles with structured formatting

**Not suitable for:**
- Short social media posts (use xhs-generator instead)
- Academic papers requiring strict citations
- News reporting requiring real-time verification
- Extremely specialized domain knowledge requiring expert review

## Usage

**Direct invocation in AI tool:**

```
/wechat-article-writer "AI工具推荐:提升10倍效率的5个神器"
```

**With custom word count:**

```
/wechat-article-writer "AI工具推荐:提升10倍效率的5个神器" --word-count 3000
```

**Disable web search:**

```
/wechat-article-writer "AI工具推荐:提升10倍效率的5个神器" --no-search
```

The AI tool will automatically:
1. Load preferences from EXTEND.md (if configured)
2. Analyze the topic and present a plan for confirmation
3. **Search the web** for latest information (if supported and enabled)
4. **Generate 3 engaging titles** using Title Specialist Agent (100+ techniques)
5. **Design article structure** using Structure Specialist Agent
6. **Write article content** using Content Specialist Agent
7. **Three-layer Review**:
   - Review 1: Theme consistency check
   - Review 2: Design & language check
   - Review 3: AI removal & colloquial optimization
8. **Generate 4 article variants** (full/condensed × markdown/plain text)
9. **Generate 2 PNG infographic images** (auto-generated using infographic-generator skill)
10. Save all outputs to the appropriate directory structure
11. Provide a summary with next steps

**Result**: A complete, publish-ready article package with text + images!

**Customization via EXTEND.md:**

Users can create `skills/wechat-article-writer/EXTEND.md` to customize:
- Default writing style (knowledge, emotional, tutorial, review)
- Voice (professional, casual, friendly)
- Target audience
- Infographic style preferences
- Article length and structure preferences

## Workflow

**This skill is executed by AI tools (Claude Code, Cursor, OpenClaw, etc.) using their built-in capabilities.**

**Multi-Agent System:** This skill uses a multi-agent collaboration system for article generation. See `AGENTS.md` for detailed agent specifications.

When user invokes `/wechat-article-writer`, the AI tool should:

### Phase 1: Setup & Analysis

- [ ] **Step 0: Load Preferences** - Read `skills/wechat-article-writer/EXTEND.md` if exists, apply default preferences
- [ ] **Step 1: Content Analysis** - Analyze topic, determine article type, target audience, and key points
- [ ] **Step 1.5: Web Research (Optional)** - If AI tool supports web search, search for latest information on the topic
- [ ] **Step 2: Smart Confirm** - Present analysis results to user for confirmation before generation

### Phase 2: Multi-Agent Article Generation

- [ ] **Step 3: Generate Titles** - Use Title Specialist Agent to generate 3 engaging titles with 100+ techniques
- [ ] **Step 4: Design Structure** - Use Structure Specialist Agent to design article framework and outline
- [ ] **Step 5: Generate Content** - Use Content Specialist Agent to write article based on structure and titles
- [ ] **Step 6: Review 1 - Theme Consistency** - Check if content aligns with central theme
- [ ] **Step 7: Review 2 - Design & Language** - Check for typos, grammar, and design issues
- [ ] **Step 8: Review 3 - AI Removal & Colloquial Optimization** - Remove AI traces and make content natural

**⚠️ 重要:子代理调用实现**

本系统使用Agent工具调用专业子代理,确保真正的专业分工和质量提升。

**子代理配置文件位置:**
- 标题专家: `skills/wechat-article-writer/agents/title-specialist.md`
- 结构专家: `skills/wechat-article-writer/agents/structure-specialist.md`
- 内容专家: `skills/wechat-article-writer/agents/content-specialist.md`
- Review专家: `skills/wechat-article-writer/agents/review-specialist.md`

**调用原则:**
1. 每个子代理有独立的角色定位和专业知识
2. 输入完整上下文,不依赖会话历史
3. 输出结构化结果,便于后续处理
4. 失败时有降级策略

### Phase 3: Multi-Version Generation

- [ ] **Step 9: Generate 4 Article Versions** - Generate multiple versions for different use cases:
  - Full Markdown version (5000 words)
  - Condensed Markdown version (1000 words)
  - Full Plain Text version (WeChat compatible)
  - Condensed Plain Text version (WeChat compatible, 1000 words)
- [ ] **Step 10: Generate Infographic Descriptions** - Create detailed descriptions for 2 infographics
- [ ] **Step 11: Generate PNG Images** - Use infographic-generator skill to generate actual PNG images

### Phase 4: Output & Summary

- [ ] **Step 12: Save Outputs** - Save all generated content to `wechat-articles/{topic-slug}/` directory
- [ ] **Step 13: Output Summary** - Present final results with file locations and next steps

## Detailed Execution Guide

**For AI tools executing this skill:**

### Step 0: Load Preferences

Read `skills/wechat-article-writer/EXTEND.md` if it exists. Apply these default preferences if not configured:

```yaml
---
default_style: knowledge
default_voice: professional
target_audience: "大众读者"
infographic_style: notion
word_count_limit: 5000
enable_web_search: true
need_title_variants: 3
need_summary: true
---
```

### Step 1: Content Analysis

Analyze the user's topic and determine:

1. **Article Type**: knowledge | emotional | tutorial | review
2. **Target Audience**: Who will read this article?
3. **Content Framework**: Choose appropriate structure:
   - Problem-Solution-Example (for tutorials)
   - What-Why-How (for knowledge articles)
   - Story-Insight-Action (for emotional articles)
   - Overview-Analysis-Conclusion (for reviews)
4. **Key Points**: 3-5 main points to cover

### Step 1.5: Web Research (Optional)

**Intelligent web research with priority-based search selection:**

Execute web search to gather latest information using the best available method:

1. **Web Search Priority** (automatically select the best available method):

   **Priority 1: Exa AI MCP (强制优先 - 最佳质量)**
   - 检查Exa AI MCP服务器配置: `claude mcp list | grep exa`
   - 如果可用 → **强制使用** `mcp__exa__web_search_exa` 工具
   - 优势：
     - 🎯 高精度AI驱动的搜索引擎
     - 🚀 实时信息检索，质量最高
     - 📊 清晰的结构化结果
     - 💡 强大的语义理解能力
   - 实现：`await mcp__exa__web_search_exa({ query: searchQuery, numResults: 8 })`
   - ⚠️ **重要规则**：即使其他搜索工具可用，只要检测到Exa AI，必须优先使用

   **Priority 2: Claude Code WebSearch Tool**
   - 检查 `WebSearch` 工具在环境中是否可用
   - 如果可用**且**Exa AI不可用 → 使用内置WebSearch工具
   - 实现：`await WebSearch({ query: searchQuery })`
   - 注意：**仅在Exa AI不可用时**使用此选项

   **Priority 3: Cursor/OpenCode/OpenClaw Built-in Capabilities**
   - 这些工具集成了网络搜索功能
   - 使用其原生搜索能力
   - 在上述工具都不可用时使用

   **Priority 4: Graceful Fallback**
   - 如果没有检测到网络搜索能力 → 使用AI知识库
   - 无错误，无缝体验

2. **Execute search** (if capability detected AND `enable_web_search` is true):

   **When to search:**
   - ✅ Web search capability available (from priority check)
   - ✅ `enable_web_search` is true (default) or user hasn't disabled it
   - ✅ User hasn't used `--no-search` flag

   **How to search:**
   - Generate 2-3 relevant search queries based on topic
   - Execute searches using the highest priority available method:
     - Exa AI: `mcp__exa__web_search_exa({ query: query, numResults: 8 })`
     - WebSearch: `WebSearch({ query: query })`
   - Collect latest information, data, statistics, and examples

3. **Handle results:**
   - **Success**: Organize findings into research summary
     - Key findings and insights
     - Recent developments or trends
     - Relevant statistics or data
     - Notable examples or case studies
     - Source URLs for reference
     - Save to `wechat-articles/{topic-slug}/research.md`

   - **Failure/No capability**: Skip gracefully
     - Continue to Step 2 as normal
     - Use existing knowledge base
     - No error messages to user - seamless fallback

**Implementation example for Claude Code with Exa AI:**
```javascript
// Pseudo-code for intelligent search selection
if (enable_web_search && !no_search_flag) {
  try {
    // Priority 1: Try Exa AI MCP (best quality)
    if (hasExaAIMCP()) {
      const results = await mcp__exa__web_search_exa({
        query: searchQueries,
        numResults: 8
      });
      saveResearch(results);
    }
    // Priority 2: Fall back to WebSearch tool
    else if (typeof WebSearch !== 'undefined') {
      const results = await WebSearch({ query: searchQueries });
      saveResearch(results);
    }
    // Priority 3: Use built-in capabilities (Cursor/OpenCode)
    else if (hasBuiltInSearch()) {
      const results = await builtInSearch(searchQueries);
      saveResearch(results);
    }
    // Priority 4: Graceful fallback
    else {
      // Continue without web research
    }
  } catch (error) {
    // Search failed, continue without research
  }
}
```

**User control:**
- Command line: `/wechat-article-writer "topic" --no-search`
- Configuration: Set `enable_web_search: false` in EXTEND.md

**Exa AI Setup (Recommended for best quality):**
```bash
# Configure Exa AI MCP server
claude mcp add exa-search "https://api.exa.ai/mcp?key=YOUR_EXA_API_KEY" -t http

# Get your API key at https://exa.ai
# Free tier available with generous usage limits
```

### Step 2: Smart Confirm

Present analysis to user:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 内容分析
  主题: {topic}
  类型: {type} | 风格: {style}
  框架: {framework}
  受众: {audience}
  字数限制: {word_count_limit}字
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 联网搜索
  状态: {已启用/已禁用/不支持}
  结果: {已获取X条最新信息/跳过}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 推荐方案
  风格: {style}
  信息图: {infographic_style} (2张)
  标题: {title_count}个备选
  摘要: 自动生成
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

是否继续？(Y/n)
```

Wait for user confirmation before proceeding.

### Step 3: Generate Titles (Using Title Specialist Agent)

**调用标题专家子代理生成标题**

作为主代理,你需要调用标题专家来生成专业标题。以下是具体执行步骤:

#### 3.1 准备输入参数

从前面的步骤中提取以下信息:
- **主题**: 从用户输入的主题
- **目标受众**: 从Step 1分析得到的目标受众
- **文章风格**: 从用户偏好或默认配置
- **字数要求**: 15-25字

#### 3.2 调用标题专家

使用Agent工具调用标题专家,按照以下prompt格式:

```
你现在是【标题专家】,专门为微信公众号文章创作高转化率的标题。

请阅读你的角色配置文件: skills/wechat-article-writer/agents/title-specialist.md

输入参数:
- 主题: {从用户输入提取的主题}
- 目标受众: {目标受众}
- 文章风格: {风格}
- 字数要求: 15-25字

请严格按照 title-specialist.md 中的规范输出,包括:
1. 生成3个标题,每个标题标注使用的技巧和理由
2. 推荐1个最佳标题并说明推荐理由
```

#### 3.3 处理输出

**解析标题输出:**

标题专家会返回Markdown格式的输出,包含:

```markdown
**标题1**: {标题内容}
- **技巧**: {技巧名称}
- **理由**: {为什么有效}

**标题2**: ...

**标题3**: ...

**推荐**: 标题{N}
**推荐理由**: {为什么推荐}
```

**处理步骤:**
1. 提取3个标题的内容
2. 记录每个标题对应的技巧和理由
3. 找到"推荐"部分,记录推荐标题的内容
4. 验证标题长度是否为15-25字

**保存输出:**
- 将标题专家的完整输出保存到: `wechat-articles/{topic-slug}/titles.md`
- 记录推荐标题的内容,用于下一步骤

#### 3.4 质量检查

- [ ] 生成了3个标题
- [ ] 每个标题标注了技巧和理由
- [ ] 有明确的推荐标题
- [ ] 标题长度符合要求(15-25字)

#### 3.5 错误处理

**如果标题专家失败:**
- 使用降级方案: 生成默认标题 `{主题} - 完整指南`
- 记录失败原因
- 继续下一步骤

**如果输出格式不完整:**
- 提取可用的标题信息
- 手动选择第一个标题作为推荐
- 标注"部分输出"

### Step 4: Design Structure (Using Structure Specialist Agent)

**调用结构专家子代理设计结构**

作为主代理,你需要调用结构专家来设计文章结构。以下是具体执行步骤:

#### 4.1 准备输入参数

- **主题**: 从用户输入的主题
- **选定标题**: 从Step 3得到的推荐标题
- **目标受众**: 从Step 1分析得到的目标受众
- **文章风格**: 从用户偏好或默认配置
- **字数要求**: 默认5000字或用户指定

#### 4.2 调用结构专家

使用Agent工具调用结构专家,按照以下prompt格式:

```
你现在是【结构专家】,专门为微信公众号文章设计清晰的逻辑框架和段落架构。

请阅读你的角色配置文件: skills/wechat-article-writer/agents/structure-specialist.md

输入参数:
- 主题: {主题}
- 选定标题: {从Step 3得到的推荐标题}
- 目标受众: {目标受众}
- 文章风格: {风格}
- 字数要求: {字数}字

请严格按照 structure-specialist.md 中的规范输出,包括:
1. 选择合适的文章类型并说明理由
2. 提炼中心思想(一句话概括)
3. 设计完整的文章结构大纲(开头、主体、结尾)
4. 分配各部分字数
```

#### 4.3 处理输出

**解析结构输出:**

结构专家会返回Markdown格式的输出,包含:

```markdown
**文章类型**: {类型名称}
**选择理由**: {为什么选择这个类型}

**中心思想**: {一句话概括}

**文章结构大纲**:

**开头部分**
- 主要内容: {...}
- 目标: {...}
- 字数: {N}字

**主体部分**
- 段落1: {...}
- 段落2: {...}
...

**结尾部分**
- 主要内容: {...}
- 字数: {N}字
```

**处理步骤:**
1. 提取文章类型和选择理由
2. 提取中心思想(一句话)
3. 提取完整的结构大纲
4. 验证各部分字数分配是否合理

**保存输出:**
- 将结构专家的完整输出保存到: `wechat-articles/{topic-slug}/structure.md`
- 记录中心思想,用于后续Review验证

#### 4.4 质量检查

- [ ] 选择了合适的文章类型
- [ ] 提炼了清晰的中心思想
- [ ] 设计了完整的结构大纲
- [ ] 字数分配合理

#### 4.5 错误处理

**如果结构专家失败:**
- 使用降级方案: 采用"总分总"结构
- 生成默认大纲: 开头(15%) + 主体(70%) + 结尾(15%)
- 记录失败原因

**如果中心思想不明确:**
- 根据主题和标题手动提炼中心思想
- 标注"手动提炼"
  model: 'sonnet'
});

// 解析输出
const structure = parseStructureOutput(structureResult);
saveToFile(`wechat-articles/${topicSlug}/structure.md`, structureResult);

// 提取中心思想用于后续Review
const centralTheme = structure.centralTheme;
```

**输出位置**: `wechat-articles/{topic-slug}/structure.md`

**质量检查:**
- [ ] 选择了合适的文章类型
- [ ] 提炼了清晰的中心思想
- [ ] 设计了完整的结构大纲
- [ ] 字数分配合理

### Step 5: Generate Content (Using Content Specialist Agent)

**调用内容专家子代理撰写内容**

作为主代理,你需要调用内容专家来撰写文章内容。以下是具体执行步骤:

#### 5.1 准备输入参数

- **主题**: 从用户输入的主题
- **选定标题**: 从Step 3得到的推荐标题
- **文章结构**: 从Step 4得到的结构大纲(完整Markdown)
- **目标受众**: 从Step 1分析得到的目标受众
- **文章风格**: 从用户偏好或默认配置

#### 5.2 调用内容专家

使用Agent工具调用内容专家,按照以下prompt格式:

```
你现在是【内容专家】,专门根据结构大纲和标题撰写高质量文章内容。

请阅读你的角色配置文件: skills/wechat-article-writer/agents/content-specialist.md

输入参数:
- 主题: {主题}
- 选定标题: {从Step 3得到的推荐标题}
- 文章结构: {从Step 4得到的完整结构大纲}
- 目标受众: {目标受众}
- 文章风格: {风格}

请严格按照 content-specialist.md 中的规范输出,确保:
1. 完全遵循结构大纲
2. 内容支撑标题承诺
3. 段落简短(2-4句),易于阅读
4. 有具体案例和数据支撑
5. 符合微信公众号写作规范
```

#### 5.3 处理输出

**保存内容:**
- 将内容专家的完整输出保存到: `wechat-articles/{topic-slug}/content-initial.md`
- 记录内容长度和段落数

#### 5.4 质量检查

- [ ] 内容符合结构大纲
- [ ] 围绕中心思想展开
- [ ] 有具体案例和数据
- [ ] 段落简短易读(2-4句)
- [ ] 符合字数要求

#### 5.5 错误处理

**如果内容专家失败:**
- 使用降级方案: 根据结构大纲生成简化内容
- 记录失败原因
- 标注"简化版本"

**如果内容偏离结构:**
- 记录偏离部分
- 在后续Review中修正

### Step 6: Review 1 - Theme Consistency (Using Review Specialist Agent)

**调用Review专家执行中心思想一致性检查**

作为主代理,你需要调用Review专家执行第一层质量检查。以下是具体执行步骤:

#### 6.1 准备输入参数

- **中心思想**: 从Step 4结构大纲中提取的中心思想
- **文章内容**: 从Step 5生成的初始内容

#### 6.2 调用Review专家

使用Agent工具调用Review专家,按照以下prompt格式:

```
你现在是【Review专家】,专门执行文章质量检查。

请阅读你的角色配置文件: skills/wechat-article-writer/agents/review-specialist.md

现在执行【Review 1: 中心思想一致性检查】

输入参数:
- 中心思想: {从Step 4提取的中心思想}
- 文章内容: {从Step 5生成的文章内容}

请按照 review-specialist.md 中 Review 1 的规范输出:
1. 评估结果(通过/需修改)和置信度(0-100)
2. 问题列表(如有偏离主题的内容,标注位置)
3. 具体修改建议
4. 验证标准

如果需要修改,请明确指出问题位置和修改方向。
```

#### 6.3 处理输出

**解析Review输出:**

Review专家会返回包含评估结果的输出:

```markdown
**评估结果**: {通过/需修改}
**置信度**: {0-100}

**问题列表**:
- 问题1: {描述} (位置: 第N段)
- 问题2: ...

**修改建议**: {...}
```

**保存输出:**
- 将Review 1的完整输出保存到: `wechat-articles/{topic-slug}/review-1.md`

#### 6.4 Review循环机制

**如果评估结果为"需修改":**

1. **检查重试次数:**
   - 维护重试计数器(初始为0)
   - 如果重试次数 < 3,继续修改
   - 如果重试次数 ≥ 3,标记"部分通过",继续Step 7

2. **调用内容专家修改内容:**

   使用Agent工具调用内容专家:

   ```
   你现在是【内容专家】,需要根据Review 1的反馈优化内容。

   请阅读你的角色配置: skills/wechat-article-writer/agents/content-specialist.md

   输入参数:
   - 初始内容: {当前文章内容}
   - Review 1结果: {Review 1的完整输出}

   请根据Review 1的问题列表和修改建议优化内容,然后输出优化后的完整文章。

   当前重试次数: {N}/3
   优化策略: {根据重试次数选择: 第1次直接修改/第2次分析根源/第3次全面重写}
   ```

3. **更新重试计数器:** 重试次数 + 1

4. **重新执行Review 1:** 返回Step 6.2

**如果评估结果为"通过":**
- 继续Step 7

#### 6.5 错误处理

**如果Review专家失败:**
- 使用降级方案: 标注"未经Review 1检查"
- 继续Step 7

**如果Review超时(>60秒):**
- 记录超时
- 标注"Review 1超时"
- 继续Step 7

#### 6.6 质量阈值优化(可选)

**引入质量阈值,避免过度Review:**

- 如果置信度 ≥ 80分,即使"需修改"也可选择通过
- 记录"高分通过"和修改建议
- 继续Step 7

这样可以减少不必要的重试,提升性能

### Step 7: Review 2 - Design & Language (Using Review Specialist Agent)

**调用Review专家执行设计与语言检查**

作为主代理,你需要调用Review专家执行第二层质量检查。以下是具体执行步骤:

#### 7.1 准备输入参数

- **文章内容**: 当前最新的文章内容(可能已通过Review 1修改)

#### 7.2 调用Review专家

使用Agent工具调用Review专家,按照以下prompt格式:

```
你现在是【Review专家】,专门执行文章质量检查。

请阅读你的角色配置文件: skills/wechat-article-writer/agents/review-specialist.md

现在执行【Review 2: 设计与语言检查】

输入参数:
- 文章内容: {当前文章内容}

请按照 review-specialist.md 中 Review 2 的规范输出:
1. 评估结果(通过/需修改)和置信度(0-100)
2. 问题列表(错别字、语法错误、语义不通等,标注位置)
3. 具体修改建议
4. 验证标准
```

#### 7.3 处理输出

**保存输出:**
- 将Review 2的完整输出保存到: `wechat-articles/{topic-slug}/review-2.md`

#### 7.4 Review循环机制

**如果评估结果为"需修改":**

执行与Review 1相同的循环逻辑:
1. 检查重试次数(最多3次)
2. 调用内容专家根据Review 2反馈修改
3. 更新重试计数器
4. 重新执行Review 7.2

**如果评估结果为"通过":**
- 继续Step 8

#### 7.5 错误处理

**如果Review专家失败:**
- 标注"未经Review 2检查"
- 继续Step 8

**如果Review超时(>60秒):**
- 记录超时
- 标注"Review 2超时"
- 继续Step 8

#### 7.6 质量阈值优化(可选)

- 如果置信度 ≥ 80分,即使"需修改"也可选择通过
- 记录"高分通过"和修改建议
- 继续Step 8

### Step 8: Review 3 - AI Removal & Colloquial Optimization (Using Review Specialist Agent)

**调用Review专家执行去AI化与口语化优化**

作为主代理,你需要调用Review专家执行第三层质量检查。以下是具体执行步骤:

#### 8.1 准备输入参数

- **文章内容**: 当前最新的文章内容(可能已通过Review 1和Review 2修改)
- **目标受众**: 从Step 1分析得到的目标受众

#### 8.2 调用Review专家

使用Agent工具调用Review专家,按照以下prompt格式:

```
你现在是【Review专家】,专门执行文章质量检查。

请阅读你的角色配置文件: skills/wechat-article-writer/agents/review-specialist.md

现在执行【Review 3: 去AI化与口语化优化】

输入参数:
- 文章内容: {当前文章内容}
- 目标受众: {目标受众}

请按照 review-specialist.md 中 Review 3 的规范输出:
1. 评估结果(通过/需修改)和置信度(0-100)
2. AI痕迹列表(过度结构化、空洞表达等,标注位置)
3. 口语化建议(具体给出优化前后对比)
4. 验证标准
```

#### 8.3 处理输出

**保存输出:**
- 将Review 3的完整输出保存到: `wechat-articles/{topic-slug}/review-3.md`

#### 8.4 Review循环机制

**如果评估结果为"需修改":**

执行与Review 1相同的循环逻辑:
1. 检查重试次数(最多3次)
2. 调用内容专家根据Review 3反馈修改
3. 更新重试计数器
4. 重新执行Step 8.2

**如果评估结果为"通过":**
- 准备生成最终优化版本

#### 8.5 生成最终优化版本

**Review全部通过后,调用内容专家生成最终版本:**

使用Agent工具调用内容专家:

```
你现在是【内容专家】,需要根据三层Review的反馈生成最终优化版本。

请阅读你的角色配置: skills/wechat-article-writer/agents/content-specialist.md

输入参数:
- 初始内容: {当前文章内容}
- Review 1结果: {Review 1的输出}
- Review 2结果: {Review 2的输出}
- Review 3结果: {Review 3的输出}

请整合所有三层Review的修改建议,输出最终的优化文章内容。

要求:
1. 整合所有有效的修改建议
2. 确保不引入新问题
3. 保持文章完整性和连贯性
```

**保存最终内容:**
- 将最终优化版本作为后续多版本生成的基础

#### 8.6 错误处理

**如果Review专家失败:**
- 标注"未经Review 3检查"
- 使用当前内容继续Step 9

**如果Review超时(>60秒):**
- 记录超时
- 标注"Review 3超时"
- 继续Step 9

#### 8.7 质量阈值优化(可选)

- 如果置信度 ≥ 80分,即使"需修改"也可选择通过
- 记录"高分通过"和修改建议
- 继续Step 9

---

**Review循环机制总结:**

每层Review最多重试3次:
- **第1次修改**: 根据问题列表直接修改
- **第2次修改**: 分析问题根源,针对性修改
- **第3次修改**: 全面审查,系统性修改

如果3次后仍未完全通过,标记为"部分通过",记录未解决问题,继续下一步。这样可以避免死循环,同时保证质量。

**性能优化建议:**
- 引入质量阈值(≥80分即可通过)
- 设置超时限制(每层Review最多60秒)
- 并行执行Review 1和Review 2(可选)

---

### Step 9: Generate Article Versions
- The outline structure
- User's voice preferences (professional/casual/friendly)
- **Word count limit**: Stay within the specified word count limit (default 5000 words)
- **Research integration**: If web research was conducted, incorporate relevant findings into the article
- WeChat formatting best practices:
  - Use emoji in section headers (📌 💡 🎯 📊 ✅)
  - Keep paragraphs short (2-4 sentences)
  - Use **bold** for emphasis
  - Include practical examples

**Word count management**:
- Monitor word count during generation
- If approaching limit, prioritize essential content
- Ensure conclusion section is included even if abbreviated
- Note: Word count refers to Chinese characters, not English words

**Using research materials** (if Step 1.5 was executed):
- Integrate latest data and statistics from research
- Reference recent developments or trends discovered
- Cite specific examples or case studies found
- Ensure information is accurate and up-to-date

Save to: `wechat-articles/{topic-slug}/article.md`

### Step 4.5: Generate Article Variants (WeChat Compatibility)

**Why**: WeChat Official Account articles do not support Markdown formatting. Generate multiple versions for different use cases.

**Generate 3 additional versions**:

#### 1. 1000-Word Condensed Version (Markdown)

**Purpose**: Quick-read version for users who want the key insights without reading the full article.

**Process**:
- Extract the most important 3-4 points from the full article
- Maintain the core message and value proposition
- Keep Markdown formatting for blog/platform publication
- Word count: ~1000 Chinese characters (±10%)

**Content guidelines**:
- Focus on the most impactful insights
- Remove detailed examples and explanations
- Keep section headers and structure
- Maintain readability and flow

Save to: `wechat-articles/{topic-slug}/article-1000.md`

#### 2. 1000-Word Condensed Version (Plain Text)

**Purpose**: Direct copy-paste to WeChat editor without formatting issues.

**Process**:
- Use the same content as the 1000-word Markdown version
- **Remove all Markdown formatting**:
  - Remove `#` headers → Use plain text with line breaks
  - Remove `**bold**` → Just plain text
  - Remove `*italic*` → Just plain text
  - Remove `-` list markers → Use plain text
  - Remove `[text](url)` links → Just keep text
  - Remove code blocks → Use plain text
- Keep emojis in section headers (微信支持emoji)
- Word count: ~1000 Chinese characters (±10%)

**Format example**:
```
标题：文章标题

引言段落...

📌 核心要点一
内容描述...

📌 核心要点二
内容描述...

📌 核心要点三
内容描述...

总结...
```

Save to: `wechat-articles/{topic-slug}/article-1000-plain.txt`

#### 3. Full-Length Plain Text Version

**Purpose**: Complete article content without Markdown, ready for WeChat publication.

**Process**:
- Use the full article content from Step 4
- **Remove all Markdown formatting**:
  - Remove `#` headers → Use plain text with line breaks
  - Remove `**bold**` → Just plain text
  - Remove `*italic*` → Just plain text
  - Remove `-` list markers → Use plain text
  - Remove `[text](url)` links → Just keep text or add as plain text reference
  - Remove code blocks → Use plain text
  - Remove `> ` blockquotes → Just plain text
- Keep emojis in section headers (微信支持emoji)
- Maintain all content and examples
- Word count: Same as full Markdown version

**Format example**:
```
标题：文章标题

副标题或引言...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 第一部分标题

内容段落...

💡 核心观点
详细说明...

📊 数据支持
具体数据...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 第二部分标题

内容段落...

（以此类推）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
总结

总结内容...
```

Save to: `wechat-articles/{topic-slug}/article-plain.txt`

**Quality Check**:
- [ ] All three versions generated
- [ ] Markdown properly removed from plain text versions
- [ ] Word counts match targets (1000±100 for condensed, full length for complete)
- [ ] Emojis preserved in headers
- [ ] Content remains coherent without Markdown formatting
- [ ] Ready for direct copy-paste to WeChat editor

### Step 5: Review & Refine

**Critical quality control step** - Review the generated article for:

#### Review Checklist

**✅ Content Accuracy**
- [ ] Facts and data are correct
- [ ] Code examples are valid and runnable
- [ ] Technical concepts are explained accurately
- [ ] No misleading or incorrect information

**✅ Topic Relevance**
- [ ] Article stays on topic throughout
- [ ] All sections directly support the main theme
- [ ] No unnecessary tangents or off-topic content
- [ ] Examples and cases align with the topic

**✅ Structure & Flow**
- [ ] Logical progression from beginning to end
- [ ] Clear transitions between sections
- [ ] Consistent voice and tone
- [ ] Balanced depth across sections

**✅ Quality Standards**
- [ ] Clear and easy to understand
- [ ] Practical and actionable
- [ ] Engaging and readable
- [ ] Proper formatting and emoji usage

#### Review Process

1. **Self-Review**: AI tool reviews its own generated content
2. **Issue Identification**: Note any problems found
3. **Refinement**: Fix identified issues
4. **Final Check**: Verify all checklist items pass

#### Refinement Guidelines

If issues are found:
- **Content errors**: Correct inaccurate information
- **Off-topic content**: Remove or redirect to the main theme
- **Unclear explanations**: Rewrite for clarity
- **Missing elements**: Add necessary examples or context
- **Poor flow**: Reorganize or add transitions

**Important**: Do not proceed to infographic generation until the article passes all review criteria.

Save refined version to: `wechat-articles/{topic-slug}/article.md` (overwrite if needed)

### Step 6: Generate Infographic Descriptions

Create detailed descriptions for 2 infographics that best visualize the article content.

**What to describe**:
1. **Infographic 1**: Core concept diagram or framework visualization
   - Identify the most important concept from the article
   - Design a visual representation (comparison, flow, or structure)
   - Specify visual style, colors, and layout

2. **Infographic 2**: Process or method diagram
   - Choose a practical process or method from the article
   - Design step-by-step visualization
   - Include key points and examples

**Description format** (save as Markdown files):
```markdown
# Infographic Title

## Type
[concept-comparison | process-flow | data-visualization]

## Visual Style
- Theme: [notion | warm | minimal | professional]
- Colors: [color scheme]
- Layout: [vertical | horizontal | grid]

## Content
[Detailed description of what should be visualized]

## Text Elements
- Title: [main title]
- Headers: [section headers]
- Labels: [data labels or annotations]

## Visual Elements
- Icons needed: [list]
- Charts needed: [bar/line/pie/etc.]
- Diagram type: [flowchart/mindmap/etc.]
```

Save descriptions to: `wechat-articles/{topic-slug}/infographic/prompts/01-*.md` and `02-*.md`

### Step 7: Generate PNG Images

**Automatically generate actual PNG images** using the infographic-generator skill.

**Implementation**:

```bash
# For each infographic description
/infographic-generator infographic/prompts/01-*.md --output infographic/01-*.png
/infographic-generator infographic/prompts/02-*.md --output infographic/02-*.png
```

**Process**:
1. **Check skill availability**: Verify if `infographic-generator` skill is available
2. **Invoke skill**: Call the skill for each infographic description
3. **Handle output**: Save generated PNG images to the output directory
4. **Fallback**: If skill not available, save description files and inform user

**Quality Check**:
- Verify PNG files are generated successfully
- Check image quality and content match
- If generation fails, save description for manual generation later

**Output location**:
```
wechat-articles/{topic-slug}/infographic/
├── 01-concept.png         # Generated PNG image 1
├── 02-process.png         # Generated PNG image 2
└── prompts/               # Description files (backup)
    ├── 01-concept.md
    └── 02-process.md
```

**User Communication**:
- ✅ If PNGs generated: "已生成2张信息图PNG图片"
- ⚠️ If skill unavailable: "信息图描述已保存，可使用 /infographic-generator 手动生成PNG"

### Step 8: Save Outputs

Create complete directory structure with all generated content:

```
wechat-articles/{topic-slug}/
├── source.md                  # User's original input
├── analysis.md                # Content analysis report
├── research.md                # Web research findings (if web search was enabled)
├── titles.md                 # 3 titles with techniques and rationales
├── structure.md              # Article structure and outline
├── content-initial.md        # Initial content before reviews
├── review-1.md              # Review 1: Theme consistency
├── review-2.md              # Review 2: Design and language
├── review-3.md              # Review 3: AI removal and colloquial
├── article-full.md          # Full article (Markdown, 5000 words)
├── article-condensed.md      # Condensed version (Markdown, 1000 words)
├── article-full-plain.txt   # Full version (Plain text, WeChat compatible)
├── article-condensed-plain.txt # Condensed version (Plain text, 1000 words)
├── infographic/               # Infographic outputs
│   ├── 01-*.png               # Generated PNG image 1
│   ├── 02-*.png               # Generated PNG image 2
│   └── prompts/               # Description files (backup)
│       ├── 01-*.md
│       └── 02-*.md
└── meta.json                  # Metadata (tags, SEO info)
```

**Save process**:
1. Create output directory
2. Save titles with techniques and rationales
3. Save article structure and outline
4. Save initial content before reviews
5. Save all three review results
6. Save 4 article variants (full/condensed × markdown/plain text)
7. Organize infographic assets
8. Generate metadata file with article stats

### Step 13: Output Summary

Present comprehensive results to user:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ WeChat Article Complete!

Topic: {topic}
Style: {style}
Voice: {voice}

Output:
  📋 titles.md               (3 engaging titles)
  📋 structure.md            (Article structure)
  📄 content-initial.md      (Initial content)
  🔍 review-1.md            (Theme consistency)
  🔍 review-2.md            (Design & language)
  🔍 review-3.md            (AI removal & colloquial)
  📄 article-full.md         (Full version, Markdown, 5000 words)
  📄 article-condensed.md     (Condensed, Markdown, 1000 words)
  📄 article-full-plain.txt  (Full version, Plain text, WeChat compatible)
  📄 article-condensed-plain.txt (Condensed, Plain text, 1000 words)
  🖼️ infographic/
     ├─ 01-*.png             (PNG image 1)
     └─ 02-*.png             (PNG image 2)
  📋 meta.json               (metadata)

Files:
  ✓ {path}/titles.md
  ✓ {path}/structure.md
  ✓ {path}/content-initial.md
  ✓ {path}/review-1.md
  ✓ {path}/review-2.md
  ✓ {path}/review-3.md
  ✓ {path}/article-full.md
  ✓ {path}/article-condensed.md
  ✓ {path}/article-full-plain.txt
  ✓ {path}/article-condensed-plain.txt
  ✓ {path}/infographic/01-*.png
  ✓ {path}/infographic/02-*.png

Next Steps:
  → For WeChat: Use article-full-plain.txt or article-condensed-plain.txt
  → For Blog: Use article-full.md or article-condensed.md
  → Review all generated content
  → Preview infographic images
  → Run /baoyu-post-to-wechat to publish
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Technical Implementation Notes

**This skill is designed to be executed by AI tools directly, not as standalone scripts.**

- AI tools read SKILL.md and execute the workflow using their built-in capabilities
- No API key configuration required - AI tool's built-in capabilities are sufficient
- The `scripts/` directory contains **optional helper scripts** for advanced users only
- External APIs (like Claude API) are only needed for standalone script usage

### For Advanced Users: Standalone Scripts

If you want to run the skill standalone (not through an AI tool):

1. You'll need a Claude API key
2. Install Bun runtime
3. See `scripts/README.md` for detailed instructions

**Most users should ignore the scripts directory and use the skill through their AI tool.**

## Output Structure

All outputs are saved in `wechat-articles/{topic-slug}/` directory:

```
wechat-articles/{topic-slug}/
├── source.md                  # Original user input
├── analysis.md                # Content analysis report
├── outline.md                 # Article outline structure
├── article.md                 # Full article (Markdown, 5000 words)
├── article-1000.md            # Condensed version (Markdown, 1000 words)
├── article-1000-plain.txt     # Condensed version (Plain text, 1000 words)
├── article-plain.txt          # Full version (Plain text, no Markdown)
├── infographic/               # Generated infographics
│   ├── 01-*.png               # PNG image 1 (auto-generated)
│   ├── 02-*.png               # PNG image 2 (auto-generated)
│   └── prompts/               # Image description files (backup)
│       ├── 01-*.md            # Description for image 1
│       └── 02-*.md            # Description for image 2
└── meta.json                  # Article metadata (tags, SEO, statistics)
```

**Key Deliverables**:
- ✅ **titles.md**: 3 engaging titles with techniques and rationales
- ✅ **structure.md**: Article structure and outline
- ✅ **content-initial.md**: Initial content before reviews
- ✅ **review-1.md**: Theme consistency review results
- ✅ **review-2.md**: Design and language review results
- ✅ **review-3.md**: AI removal and colloquial optimization results
- ✅ **article-full.md**: Complete article (Markdown, 5000 words)
- ✅ **article-condensed.md**: Condensed version (Markdown, 1000 words)
- ✅ **article-full-plain.txt**: Full version for WeChat (Plain text, no Markdown)
- ✅ **article-condensed-plain.txt**: Condensed version for WeChat (Plain text, 1000 words)
- ✅ **PNG images**: 2 high-quality infographics (auto-generated)
- ✅ **research.md**: Latest information and data (if web search enabled)
- ✅ **meta.json**: SEO metadata for publishing

**WeChat Publishing Guide**:
- **For WeChat Official Account**: Use `article-full-plain.txt` or `article-condensed-plain.txt`
- **Why**: These files have no Markdown formatting, ready for direct copy-paste
- **Note**: Emojis in headers are preserved (WeChat supports emojis)
- **For other platforms** (blog, knowledge base): Use Markdown versions (article-full.md, article-condensed.md)
- **Review process**: All articles go through three layers of review (theme consistency, design & language, AI removal & colloquial optimization)

## Preferences Configuration

Create `skills/wechat-article-writer/EXTEND.md` to customize default preferences:

```markdown
## Writing Preferences

### Content Style
- **Language**: Chinese (Simplified)
- **Tone**: Professional yet accessible
- **Word count limit**: 5000 (customizable, default 5000)
- **Structure**: Problem → Solution → Examples → Conclusion

### Format Preferences
- **Headings**: H1, H2, H3 hierarchy
- **Lists**: Numbered for procedures, bullet for features
- **Code blocks**: Include for technical topics
- **Tables**: For comparisons and data

### Infographic Style
- **Theme**: Clean, modern, professional
- **Color palette**: Blue/gray/green scheme
- **Elements**: Icons, charts, diagrams
```

## Examples

### Example 1: Technical Tutorial

```bash
/wechat-article-writer "Go语言微服务架构实践:从零到部署"
```

**Output:**
- Topic: Microservices architecture with Go
- Sections: Background, Architecture Design, Implementation, Deployment, Best Practices
- Infographics: Architecture diagram, workflow chart, deployment process

### Example 2: Industry Analysis

```bash
/wechat-article-writer "2024年AI发展趋势与商业应用分析"
```

**Output:**
- Topic: AI industry trends and business applications
- Sections: Market Overview, Key Trends, Business Cases, Future Outlook
- Infographics: Market size chart, trend timeline, application matrix

## Common Pitfalls

1. **Skipping content analysis** - Always analyze the topic before generation to ensure quality
2. **Not customizing preferences** - Default preferences may not match your writing style
3. **Missing infographics** - Visual content significantly increases article engagement
4. **Poor outline structure** - A good outline is essential for coherent article flow
5. **Ignoring SEO** - Include keywords and meta information for search optimization

## References

- WeChat Official Account Publishing Guidelines
- AI Content Generation Best Practices
- Infographic Design Principles
- Technical Writing Standards

## Future Enhancements

- Multi-platform publishing support (WeChat, Zhihu,掘金)
- Automatic SEO optimization
- Template library for common article types
- Collaborative editing features
- Performance analytics integration