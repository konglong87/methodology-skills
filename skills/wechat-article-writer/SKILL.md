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

### Step 3: Generate Outline

Create structured outline with:
- 3-5 main sections
- Each section has 2-4 subsections
- Include title variants (3 options)
- Include article summary (1-2 sentences)

Save to: `wechat-articles/{topic-slug}/outline.md`

### Step 4: Generate Article

Write the full article following:
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