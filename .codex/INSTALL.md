# Installing Methodology Skills for Codex

Enable methodology skills in Codex via native skill discovery. Just clone and symlink.

## Prerequisites

- Git
- Codex CLI installed

## Installation

1. **Clone the methodology-skills repository:**
   ```bash
   git clone https://github.com/konglong87/methodology-skills.git ~/.codex/methodology-skills
   ```

2. **Create the skills symlink:**
   ```bash
   mkdir -p ~/.agents/skills
   ln -s ~/.codex/methodology-skills/skills ~/.agents/skills/methodology-skills
   ```

   **Windows (PowerShell):**
   ```powershell
   New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.agents\skills"
   cmd /c mklink /J "$env:USERPROFILE\.agents\skills\methodology-skills" "$env:USERPROFILE\.codex\methodology-skills\skills"
   ```

3. **Restart Codex** (quit and relaunch the CLI) to discover the skills.

## Migrating from Manual Installation

If you previously installed methodology-skills manually, you should:

1. **Remove old manual installation**:
   ```bash
   rm -rf ~/.agents/skills/methodology-skills
   ```

2. **Follow the new installation steps above** - the symlink approach is cleaner and easier to update.

3. **Restart Codex.**

## Verify

```bash
ls -la ~/.agents/skills/methodology-skills
```

You should see a symlink (or junction on Windows) pointing to your methodology-skills directory.

## Available Skills

After installation, you'll have access to 12 methodology skills:

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

## Usage

Skills are automatically triggered based on your requests. For example:

```
用户：用第一性原理分析这个数据库查询优化问题
AI: [自动触发 first-principles skill]

用户：重构用户认证模块
AI: [自动触发 goal-oriented skill - 强制追踪]

用户：用 PDCA 优化 CI/CD 流程
AI: [自动触发 pdca-cycle skill]
```

### Goal-Oriented Skill (Iron Law)

**Important**: The `goal-oriented` skill is a **rigid requirement** that applies to ALL tasks and conversations. It will automatically:

- Create goals at task start
- Adjust goals when requirements change
- Verify goals before task completion

This ensures you never lose sight of objectives.

## Updating

```bash
cd ~/.codex/methodology-skills && git pull
```

Skills update instantly through the symlink.

## Uninstalling

```bash
rm ~/.agents/skills/methodology-skills
```

Optionally delete the clone: `rm -rf ~/.codex/methodology-skills`.

## Support

- **Issues**: https://github.com/konglong87/methodology-skills/issues
- **Documentation**: https://github.com/konglong87/methodology-skills/blob/main/README.md