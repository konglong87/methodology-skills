# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2026-03-15

### ✨ Added

#### 微信公众号文章多版本输出
- **多版本生成**: 自动生成 4 个文章版本，完美兼容微信公众号
  - `article.md` - 完整版（Markdown，5000字）
  - `article-1000.md` - 精简版（Markdown，1000字）
  - `article-plain.txt` - 完整版纯文本（微信专用）
  - `article-1000-plain.txt` - 精简版纯文本（微信专用）
- **Markdown 自动移除**: 纯文本版本自动移除所有 Markdown 格式
  - 移除标题标记 `#` → 纯文本
  - 移除粗体 `**text**` → 纯文本
  - 移除列表标记 `-` → 纯文本
  - 移除链接 `[text](url)` → 只保留文字
  - 保留 emoji 表情（微信支持）
- **直接复制粘贴**: 纯文本版本可直接复制到微信公众号编辑器，无需调整格式

### 🔧 Changed

- **wechat-article-writer SKILL.md**: 新增 Step 4.5（Generate Article Variants）
- **README.md**: 更新核心功能说明，添加多版本输出文档
- **版本号**: 从 1.4.1 升级到 1.5.0

### 📚 Documentation

- 添加 Step 4.5 详细说明，包括 3 个文章变体的生成流程
- 更新输出目录结构，展示所有 4 个文章版本
- 添加微信发布指南，说明如何使用纯文本版本

### 🎯 Benefits

- **微信完美兼容**: 解决 Markdown 在微信公众号不显示的问题
- **多种字数选择**: 5000字完整版 + 1000字精简版，满足不同场景
- **开箱即用**: 无需手动转换格式，直接复制粘贴
- **保留原有功能**: Markdown 版本依然可用于博客、知识库等平台

## [1.4.1] - 2026-03-14

### 📝 Documentation

#### 文档同步更新
- **README.md**: 添加 Exa AI 配置教程和使用示例
- **plugin.json**: 新增关键词 (exa-ai, web-search, mcp, ai-content-creation)
- **wechat-article-writer SKILL.md**: 重写联网搜索章节，详细说明四层优先级搜索机制
- **CHANGELOG.md**: 创建完整的更新日志文档

#### 配置指南优化
- 添加快速开始章节，包含 Exa AI 配置步骤
- 添加联网搜索优先级说明 (Exa AI → WebSearch → 工具内置 → 降级)
- 添加完整的使用示例输出

### 🔧 Changed

- **版本号**: 从 1.4.0 升级到 1.4.1 (小版本迭代)

## [1.4.0] - 2026-03-14

### ✨ Added

#### Exa AI 联网搜索集成
- **高质量搜索**: 集成 Exa AI MCP server，提供 AI 驱动的高质量联网搜索
- **智能降级**: 自动检测联网能力，按优先级选择最优搜索方案
- **跨平台支持**: Claude Code、Cursor、OpenCode 等所有工具均可使用
- **配置简单**: 一行命令即可配置 `claude mcp add exa-search`

#### 微信公众号文章生成器增强
- **自动联网调研**: 使用 Exa AI 自动搜索最新信息，确保内容时效性
- **真实数据支持**: 文章内容基于真实搜索结果，提升可信度
- **智能信息融合**: AI 自动融合搜索结果到文章中
- **完整工作流**: 从调研 → 写作 → 信息图生成 → 发布的全流程自动化

#### 信息图生成器优化
- **动态风格系统**: 三层优先级（用户指定 > LLM选择 > 兜底风格）
- **8种视觉风格**: 科技风、可爱风、手绘风、简约风、教学风、泥塑风、漫画风、Bento风
- **智能布局**: 自动推荐横屏/竖屏布局
- **多语言支持**: 支持中英文风格指定

### 🔧 Changed

- **README.md**: 添加 Exa AI 配置说明和使用指南
- **plugin.json**: 新增 keywords (wechat-article, infographic, exa-ai, web-search, mcp)
- **版本号**: 从 1.3.1 升级到 1.4.0

### 📚 Documentation

- 添加 Exa AI 配置教程
- 添加联网搜索使用说明
- 添加完整的使用示例
- 添加 MCP 配置文档

### 🎯 Skills Updated

- **wechat-article-writer**: 新增 Exa AI 搜索集成，支持自动联网调研
- **infographic-generator**: 优化风格选择系统，新增动态推荐

## [1.3.1] - 2026-03-13

### Added
- Added wechat-article-writer skill for automated WeChat article creation
- Added infographic-generator skill with 8 visual styles
- Added intelligent style selection system

### Changed
- Updated README with new skills documentation
- Enhanced plugin metadata

## [1.3.0] - 2026-03-11

### Added
- Added MVP First methodology skill
- Added Skill Manager for managing and discovering skills
- Added Prompt Enhancer for clarifying vague requests

### Changed
- Improved skill triggering mechanism
- Enhanced documentation structure

## [1.2.0] - 2026-03-08

### Added
- Added DDD Strategic Design skill
- Added DDD Tactical Design skill
- Added comprehensive DDD examples

### Changed
- Updated documentation with DDD concepts
- Improved skill organization

## [1.1.0] - 2026-03-05

### Added
- Added SWOT Analysis skill
- Added strategic planning tools
- Added decision-making frameworks

### Changed
- Enhanced README with more examples
- Improved skill descriptions

## [1.0.0] - 2026-03-01

### Added
- Initial release
- First Principles skill
- Goal-Oriented skill
- PDCA Cycle skill
- Basic documentation and examples

### Features
- Semi-automatic skill triggering
- Cross-platform support (Claude Code, Cursor, OpenCode)
- Markdown-based skill files
- Comprehensive documentation

---

## Release Notes

### Version 1.4.0 - Major Update

This release brings **intelligent web research capabilities** to the methodology-skills plugin, enabling AI to search and incorporate real-time information into content creation.

**Key Highlights**:

1. **Exa AI Integration** - High-quality AI-powered web search
2. **Enhanced Article Writer** - Automatic research integration
3. **Improved Infographic Generator** - Dynamic style selection

**Breaking Changes**: None - Fully backward compatible

**Migration Guide**: No migration needed. To enable Exa AI search:
```bash
claude mcp add exa-search "https://api.exa.ai/mcp?key=YOUR_API_KEY" -t http
```

---

[Unreleased]: https://github.com/konglong87/methodology-skills/compare/v1.4.0...HEAD
[1.4.0]: https://github.com/konglong87/methodology-skills/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/konglong87/methodology-skills/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/konglong87/methodology-skills/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/konglong87/methodology-skills/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/konglong87/methodology-skills/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/konglong87/methodology-skills/releases/tag/v1.0.0