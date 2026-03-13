# EXTEND.md Configuration Schema

## Location Priority

1. `.baoyu-skills/wechat-article-writer/EXTEND.md` (project-level)
2. `$HOME/.config/baoyu-skills/wechat-article-writer/EXTEND.md` (XDG)
3. `$HOME/.baoyu-skills/wechat-article-writer/EXTEND.md` (user-level)

## Required Fields

None - all fields have defaults

## Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `default_style` | string | `"knowledge"` | Article style: knowledge, emotional, tutorial, review |
| `default_voice` | string | `"professional"` | Writing voice: professional, casual, friendly |
| `target_audience` | string | `""` | Target audience description |
| `infographic_style` | string | `"notion"` | Infographic style: notion, warm, minimal, bold |
| `need_title_variants` | number | `3` | Number of title variants to generate |
| `need_summary` | boolean | `true` | Auto-generate summary |
| `claude_api_key` | string | - | Claude API key (can also use env var) |

## Example

```yaml
default_style: knowledge
default_voice: professional
target_audience: 开发者,产品经理
infographic_style: notion
need_title_variants: 3
need_summary: true
```