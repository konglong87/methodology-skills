# Methodology Skills

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.1-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Claude%20Code-✓-purple.svg" alt="Claude Code">
  <img src="https://img.shields.io/badge/OpenCode-✓-orange.svg" alt="OpenCode">
  <img src="https://img.shields.io/badge/Cursor-✓-cyan.svg" alt="Cursor">
</p>

> 让 AI 掌握方法论，更聪明地思考和执行任务

一个包含第一性原理、目标导向、PDCA 循环等方法论的 Skills 工具箱。支持 Claude Code、OpenCode、Cursor。

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

以最终目标为指引，确保行动不偏离方向。适用于长期任务、项目规划。

**适用场景**: 执行长期任务、项目规划、容易偏离目标的任务

**触发方式**: 自动识别场景 或 用户说"目标导向地执行"

### 🎯 PDCA 循环

Plan-Do-Check-Act 持续改进循环。适用于迭代优化、质量保障。

**适用场景**: 迭代任务、持续改进、质量保障、流程优化

**触发方式**: 自动识别场景 或 用户说"用 PDCA 循环"

---

## 安装

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

### OpenCode

```bash
# 全局安装 - 第一性原理
mkdir -p ~/.opencode/skills/first-principles
curl -o ~/.opencode/skills/first-principles/SKILL.md \
  https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/first-principles/SKILL.md

# 全局安装 - 目标导向
mkdir -p ~/.opencode/skills/goal-oriented
curl -o ~/.opencode/skills/goal-oriented/SKILL.md \
  https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/goal-oriented/SKILL.md

# 全局安装 - PDCA 循环
mkdir -p ~/.opencode/skills/pdca-cycle
curl -o ~/.opencode/skills/pdca-cycle/SKILL.md \
  https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/pdca-cycle/SKILL.md
```

### Cursor

```bash
# Cursor 使用相同的 SKILL.md 格式
mkdir -p ~/.cursor/rules
curl -o ~/.cursor/rules/first-principles.md \
  https://raw.githubusercontent.com/konglong87/methodology-skills/main/skills/first-principles/SKILL.md

# 重复以上步骤安装其他方法论...
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