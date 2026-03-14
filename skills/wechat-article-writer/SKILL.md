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

Automated WeChat Official Account article creation skill that generates high-quality articles with AI-powered content creation and infographic generation. The skill follows a structured workflow from content analysis to final output, ensuring professional-quality articles suitable for public account publishing.

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

The AI tool will automatically:
1. Load preferences from EXTEND.md (if configured)
2. Analyze the topic and present a plan for confirmation
3. Generate outline and article content (within word count limit)
4. Review and refine the article for quality
5. **Generate 2 PNG infographic images** (auto-generated using infographic-generator skill)
6. Save all outputs to the appropriate directory structure
7. Provide a summary with next steps

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

When user invokes `/wechat-article-writer`, the AI tool should:

### Phase 1: Setup & Analysis

- [ ] **Step 0: Load Preferences** - Read `skills/wechat-article-writer/EXTEND.md` if exists, apply default preferences
- [ ] **Step 1: Content Analysis** - Analyze topic, determine article type, target audience, and key points
- [ ] **Step 2: Smart Confirm** - Present analysis results to user for confirmation before generation

### Phase 2: Content Generation (Using AI Tool's Built-in Capabilities)

- [ ] **Step 3: Generate Outline** - Use AI tool to create structured outline with sections and key content points
- [ ] **Step 4: Generate Article** - Use AI tool to write full article content following outline and preferences
- [ ] **Step 5: Review & Refine** - Review article for accuracy, topic relevance, and quality; refine if needed
- [ ] **Step 6: Generate Infographic Descriptions** - Use AI tool to create visual content descriptions
- [ ] **Step 7: Generate PNG Images** - Use infographic-generator skill to generate actual PNG images

### Phase 3: Output & Summary

- [ ] **Step 8: Save Outputs** - Save all generated content to `wechat-articles/{topic-slug}/` directory
- [ ] **Step 9: Output Summary** - Present final results with file locations and next steps

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

Save to: `wechat-articles/{topic-slug}/article.md`

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
├── source.md          # User's original input
├── analysis.md        # Content analysis report
├── outline.md         # Article outline
├── article.md         # Final article (refined)
├── infographic/       # Infographic outputs
│   ├── 01-*.png       # Generated PNG image 1
│   ├── 02-*.png       # Generated PNG image 2
│   └── prompts/       # Description files (backup)
│       ├── 01-*.md
│       └── 02-*.md
└── meta.json          # Metadata (tags, SEO info)
```

**Save process**:
1. Create output directory
2. Save all generated content
3. Organize infographic assets
4. Generate metadata file with article stats

### Step 9: Output Summary

Present comprehensive results to user:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ WeChat Article Complete!

Topic: {topic}
Style: {style}
Voice: {voice}

Output:
  📄 article.md           (article content)
  🖼️ infographic/
     ├─ 01-*.png         (PNG image 1)
     └─ 02-*.png         (PNG image 2)
  📋 meta.json           (metadata)

Files:
  ✓ {path}/article.md
  ✓ {path}/infographic/01-*.png
  ✓ {path}/infographic/02-*.png

Next Steps:
  → Review article.md
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
├── article.md                 # Final article content (Markdown, refined)
├── infographic/               # Generated infographics
│   ├── 01-*.png               # PNG image 1 (auto-generated)
│   ├── 02-*.png               # PNG image 2 (auto-generated)
│   └── prompts/               # Image description files (backup)
│       ├── 01-*.md            # Description for image 1
│       └── 02-*.md            # Description for image 2
└── meta.json                  # Article metadata (tags, SEO, statistics)
```

**Key Deliverables**:
- ✅ **article.md**: Complete article ready for publishing
- ✅ **PNG images**: 2 high-quality infographics (auto-generated)
- ✅ **meta.json**: SEO metadata for publishing

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