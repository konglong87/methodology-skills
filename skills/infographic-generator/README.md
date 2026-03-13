# Infographic Generator

**一句话生成信息图PNG图片**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)

## 🎯 特性

- ✅ **一句话生成** - 自然语言描述 → PNG图片
- ✅ **6大模板** - Knowledge, Xiaohongshu, Process, Comparison, Data, Scientific
- ✅ **AI驱动** - 集成Claude API，深度理解需求
- ✅ **双引擎渲染** - Canvas + HTML/Puppeteer fallback
- ✅ **离线可用** - 支持本地模板（无需API密钥）
- ✅ **Node全版本兼容** - 支持Node 14-25

## 🚀 快速开始

### 安装

```bash
cd infographic-generator
npm install
```

### 使用

#### 方式1：一句话生成（推荐）

```bash
node skill-render.js "生成Python编程语言的信息图"
```

#### 方式2：指定模板

```bash
node skill-render.js "生成小红书爆款内容" --template xiaohongshu
```

#### 方式3：使用Claude API（需API密钥）

```bash
export ANTHROPIC_API_KEY=your-api-key
node skill-render.js "生成Python信息图，包含语法简洁、应用广泛、生态丰富、跨平台4个特点"
```

## 📚 模板说明

| 模板 | 适用场景 |
|------|---------|
| **knowledge** | 知识科普、技术介绍 |
| **xiaohongshu** | 小红书内容、社交媒体 |
| **process** | 流程说明、步骤指南 |
| **comparison** | 产品对比、方案评估 |
| **data** | 数据报告、统计结果 |
| **scientific** | 学术论文、科研图表 |

详细说明请查看 [docs/TEMPLATES.md](TEMPLATES.md)

## 🎨 使用示例

### 知识科普

```bash
node skill-render.js "生成Python编程语言信息图，包含语法简洁、应用广泛、生态丰富、跨平台4个核心特点"
```

### 小红书爆款

```bash
node skill-render.js "生成小红书爆款：5个AI工具提升工作效率10倍，包含ChatGPT、Midjourney、Notion AI等工具介绍" --template xiaohongshu
```

### 工作流程

```bash
node skill-render.js "生成Git工作流程图，包含克隆仓库、创建分支、提交代码、推送分支、创建PR 5个步骤" --template process
```

## 📖 文档

- [用户指南](./SKILL.md) - 完整使用指南
- [API集成](./API_INTEGRATION.md) - Claude API使用说明
- [模板说明](TEMPLATES.md) - 6大模板详细文档
- [技术细节](./docs/TECHNICAL_DETAILS.md) - JSON Schema、渲染引擎
- [高级用法](./docs/ADVANCED_USAGE.md) - 批量生成、自定义模板

## ⚙️ 配置

### 环境变量（可选）

创建 `.env` 文件：

```bash
# Claude API密钥（可选，用于AI增强）
ANTHROPIC_API_KEY=your-api-key-here
```

### 不使用API

不设置API密钥时，自动使用本地模板生成（功能受限但免费）。

## 🔧 故障排查

### Canvas渲染问题

**症状**：生成的PNG显示全黑

**原因**：Canvas在某些Node版本（如v25）上不兼容

**解决**：已内置HTML/Puppeteer fallback机制，自动切换渲染引擎

### Puppeteer安装问题

```bash
# 如果Puppeteer安装失败，手动安装
cd assets && npm install puppeteer
```

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](../LICENSE)

## 🙏 致谢

- Canvas渲染引擎
- Puppeteer无头浏览器
- Claude API

---

**恐龙🐲 制作** | 2026-03-13