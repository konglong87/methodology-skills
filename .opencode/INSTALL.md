# Installing Methodology Skills for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed
- Git installed

## Installation Steps

### 1. Clone Methodology Skills

```bash
git clone https://github.com/konglong87/methodology-skills.git ~/.config/opencode/methodology-skills
```

### 2. Register the Plugin

Create a symlink so OpenCode discovers the plugin:

```bash
mkdir -p ~/.config/opencode/plugins
rm -f ~/.config/opencode/plugins/methodology-skills.js
ln -s ~/.config/opencode/methodology-skills/.opencode/plugins/methodology-skills.js ~/.config/opencode/plugins/methodology-skills.js
```

### 3. Symlink Skills

Create a symlink so OpenCode's native skill tool discovers methodology skills:

```bash
mkdir -p ~/.config/opencode/skills
rm -rf ~/.config/opencode/skills/methodology-skills
ln -s ~/.config/opencode/methodology-skills/skills ~/.config/opencode/skills/methodology-skills
```

### 4. Restart OpenCode

Restart OpenCode to discover the skills.

Verify by asking: "你有哪些方法论技能？"

## Usage

### Finding Skills

Use OpenCode's native `skill` tool to list available skills:

```
use skill tool to list skills
```

### Loading a Skill

Use OpenCode's native `skill` tool to load a specific skill:

```
use skill tool to load methodology-skills/goal-oriented
```

### Goal-Oriented Skill (Iron Law)

**Important**: The `goal-oriented` skill is a **rigid requirement** that applies to ALL tasks and conversations. It will automatically:

- Create goals at task start
- Adjust goals when requirements change
- Verify goals before task completion

This ensures you never lose sight of objectives.

### Personal Skills

Create your own skills in `~/.config/opencode/skills/`:

```bash
mkdir -p ~/.config/opencode/skills/my-skill
```

Create `~/.config/opencode/skills/my-skill/SKILL.md`:

```markdown
---
name: my-skill
description: Use when [condition] - [what it does]
---

# My Skill

[Your skill content here]
```

### Project Skills

Create project-specific skills in `.opencode/skills/` within your project.

**Skill Priority:** Project skills > Personal skills > Methodology skills

## Available Skills

- **first-principles** - First principles thinking for innovative solutions
- **goal-oriented** - Goal-oriented execution with mandatory tracking (MUST use for ANY request)
- **pdca-cycle** - PDCA continuous improvement methodology
- **mvp-first** - MVP-first approach to avoid over-engineering
- **ddd-strategic-design** - Domain-driven design strategic patterns
- **ddd-tactical-design** - Domain-driven design tactical patterns
- **swot-analysis** - SWOT strategic planning tool
- **prompt-enhancer** - Systematic clarification for vague requests
- **skill-manager** - Skills management and discovery
- **wechat-article-writer** - WeChat official account article generator
- **infographic-generator** - Professional infographic generator
- **fortune-teller** - Comprehensive fortune-telling system

## Updating

```bash
cd ~/.config/opencode/methodology-skills
git pull
```

## Troubleshooting

### Skills not found

1. Check skills symlink: `ls -l ~/.config/opencode/skills/methodology-skills`
2. Verify it points to: `~/.config/opencode/methodology-skills/skills`
3. Use `skill` tool to list what's discovered

### Tool mapping

When skills reference Claude Code tools:
- `TodoWrite` → `todowrite`
- `Task` with subagents → `@mention` syntax
- `Skill` tool → OpenCode's native `skill` tool
- File operations → your native tools

## Getting Help

- Report issues: https://github.com/konglong87/methodology-skills/issues
- Full documentation: https://github.com/konglong87/methodology-skills/blob/main/README.md