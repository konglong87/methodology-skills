# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## first
  我叫恐龙🐲

## Repository Overview

This is a Claude Code plugin repository that provides methodology skills for AI-assisted thinking and problem-solving. The repository contains three core methodology skills:

- **first-principles**: First principles thinking for innovative solutions and breaking down assumptions
- **goal-oriented**: Goal-oriented execution for long-term tasks and preventing scope creep
- **pdca-cycle**: PDCA (Plan-Do-Check-Act) cycle for continuous improvement and iterative optimization

## Architecture

### Plugin Structure

```
methodology-skills/
├── .claude-plugin/
│   └── marketplace.json          # Plugin marketplace configuration
├── plugin.json                    # Plugin metadata
├── skills/
│   ├── first-principles/
│   │   └── SKILL.md              # First principles methodology
│   ├── goal-oriented/
│   │   └── SKILL.md              # Goal-oriented methodology
│   └── pdca-cycle/
│       └── SKILL.md              # PDCA cycle methodology
└── docs/
    ├── combining-methodologies.md # Guide for using methodologies together
    └── templates/
        └── skill-template.md      # Template for adding new methodologies
```

### Skill Design Principles

1. **Independent Skills**: Each skill is self-contained in its own directory with a SKILL.md file
2. **Semi-automatic Triggering**: Skills use description-based triggering in YAML frontmatter
3. **Lightweight Reference**: Each SKILL.md is 150-200 lines for token efficiency
4. **Consistent Structure**: All skills follow the same template (Overview → When to Use → Process → Examples → Pitfalls → References)

### Skill File Structure

Each SKILL.md contains:

1. **YAML frontmatter** with `name` and `description` for triggering
2. **Overview**: Core concepts (1-2 paragraphs)
3. **When to Use**: Applicable and non-applicable scenarios
4. **The Process**: Graphviz dot diagram + detailed steps
5. **Customized sections**: Thinking frameworks, checklists, or tools (varies by methodology)
6. **Examples**: 1-2 real-world scenarios
7. **Common Pitfalls**: Mistakes to avoid
8. **References**: Books, articles, resources

## Development Workflow

### Adding or Modifying Skills

1. **Create new skill**: Copy `docs/templates/skill-template.md` to `skills/[methodology-name]/SKILL.md`
2. **Follow the template**: Fill in all required sections (Overview, When to Use, Process, Examples, Pitfalls, References)
3. **Validate structure**: Ensure YAML frontmatter is correct and graphviz dot diagram renders properly
4. **Test triggering**: Verify the description accurately captures when the skill should be invoked

### Quality Standards

- **Line count**: 150-200 lines per SKILL.md for token efficiency
- **Graphviz diagrams**: Use `rankdir=TB` (top-to-bottom) or `rankdir=LR` (left-to-right)
- **Color coding**: Use consistent colors (#c8e6c9, #bbdefb, #fff9c4, #f8bbd0) for process stages
- **Language**: Chinese (Simplified) for user-facing content, English for code/diagrams

### Validation Commands

Validate JSON configuration files:
```bash
cat .claude-plugin/marketplace.json | python3 -m json.tool
cat plugin.json | python3 -m json.tool
```

Check skill file structure:
```bash
ls -la skills/*/SKILL.md
wc -l skills/*/SKILL.md
```

## Git Commit Strategy

Follow the implementation plan's commit pattern:
- Each logical unit (configuration file, skill, documentation) gets its own commit
- Use conventional commit messages: `feat:`, `docs:`, `chore:`
- Reference the design document when making architectural decisions

## Important Files

- `docs/plans/2026-03-11-methodology-skills-design.md`: Design decisions and rationale
- `docs/plans/2026-03-11-methodology-skills-implementation.md`: Step-by-step implementation guide
- `docs/templates/skill-template.md`: Template for new methodology contributions

## Target Audience

Skills are designed for Chinese-speaking users. All user-facing content should be in Simplified Chinese.

## Methodology Combination

Skills can be combined for more powerful workflows. Common patterns:
- First-principles + PDCA: Fundamental process optimization
- Goal-oriented + PDCA: Long-term project continuous delivery
- First-principles + Goal-oriented: Innovative project design
- All three: Complex system from scratch

Refer to `docs/combining-methodologies.md` (when created) for detailed combination patterns.