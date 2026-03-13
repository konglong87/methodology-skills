# WeChat Article Writer - Scripts

This directory contains **optional helper scripts** for advanced users who want to run the skill standalone with their own Claude API key.

## ⚠️ Important Notice

**Most users do NOT need these scripts!**

The primary way to use `wechat-article-writer` is through AI tools (Claude Code, Cursor, OpenClaw, etc.) which execute the skill using their built-in capabilities. No API key or technical setup required.

These scripts are provided for:
- Advanced users who want to run the skill standalone
- Users who have their own Claude API keys and prefer direct API calls
- Developers who want to customize the implementation

## Prerequisites

1. **Claude API Key**: Set `CLAUDE_API_KEY` or `ANTHROPIC_API_KEY` environment variable
2. **Bun Runtime**: Install Bun from https://bun.sh
3. **Dependencies**: Run `bun install` in this directory

## Available Scripts

### Main Script (Full Workflow)

```bash
bun run scripts/main.ts "你的主题" [--style knowledge] [--voice professional]
```

Options:
- `--style <style>`: Article style (knowledge, emotional, tutorial, review)
- `--voice <voice>`: Writing voice (professional, casual, friendly)

### Individual Steps

```bash
# Generate outline only
bun run scripts/generate-outline.ts

# Generate content from outline
bun run scripts/generate-content.ts

# Generate infographics
bun run scripts/generate-infographic.ts
```

## Configuration

Create `skills/wechat-article-writer/EXTEND.md` with YAML frontmatter:

```yaml
---
default_style: knowledge
default_voice: professional
target_audience: "技术开发者"
infographic_style: notion
need_title_variants: 3
need_summary: true
claude_api_key: "sk-ant-..." # Optional: can also use env var
---

# Custom Writing Preferences

Add your custom preferences here...
```

## Error Handling

If no API key is found, the scripts will exit with an error message. For the primary skill usage (via AI tools), no API key is needed.