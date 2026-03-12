# Infographic Generator Assets

> ⚠️ **重要说明**：
> - 本技能生成的是信息图的**配置数据**（JSON格式），而不是最终的PNG图片
> - 配置数据包含完整的布局、样式、颜色、图标等信息
> - 要得到PNG图片，需要将配置数据提供给前端开发者或使用在线渲染工具
> - 本技能提供四种使用方式，适合不同需求的用户

本目录包含信息图生成器技能所需的各种资源文件。

## 前置条件

本技能提供四种使用方式，前置条件不同：

### 方式一：技能渲染（最新，最简单）🆕

**前置条件**：需要安装Node.js环境

- ✅ 最简单：只需一条命令
- ✅ 统一技能接口
- ✅ 无需手动创建配置文件
- ✅ 直接生成PNG图片
- ✅ 支持批量生成
- ✅ 提供编程接口

详细指南：[技能渲染指南](../SKILL_RENDER_GUIDE.md)

### 方式二：AI驱动渲染（推荐，最佳体验）

**前置条件**：需要安装Node.js环境

- ✅ 简单：只需一条命令
- ✅ 无需手动创建配置文件
- ✅ 直接生成PNG图片

详细指南：[AI驱动渲染指南](./AI_RENDER_GUIDE.md)

### 方式二：自然语言使用（推荐，无需写代码）

**前置条件**：无特殊要求

- ✅ 无需安装任何软件
- ✅ 无需配置开发环境
- ✅ 只需使用自然语言向AI描述你的需求
- ✅ 技能会生成JSON格式的配置数据
- ✅ 将配置数据提供给前端开发者或使用在线工具生成PNG

详细示例请查看：[自然语言使用示例](./NATURAL_LANGUAGE_EXAMPLES.md)

### 方式四：代码使用（适合开发者）

**前置条件**：需要安装以下依赖

在使用代码方式生成PNG图片之前，需要确保你的系统已安装以下依赖：

### 1. Node.js环境

- **版本要求**：Node.js v14.0.0 或更高版本
- **安装方式**：
  - **macOS**：使用 Homebrew 安装
    ```bash
    brew install node
    ```
  - **Ubuntu/Debian**：使用 apt 安装
    ```bash
    sudo apt-get update
    sudo apt-get install nodejs npm
    ```
  - **Windows**：从 [Node.js官网](https://nodejs.org/) 下载安装包

**验证安装**：
```bash
node --version
npm --version
```

### 2. 系统构建工具

Canvas包需要系统级的构建工具，请根据你的操作系统安装：

#### macOS

安装Xcode命令行工具：
```bash
xcode-select --install
```

#### Ubuntu/Debian

安装必要的构建工具和库：
```bash
sudo apt-get update
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev   libjpeg-dev libgif-dev librsvg2-dev
```

#### Windows

安装以下组件：
- Windows SDK
- Visual Studio Build Tools

从 [Microsoft官网](https://visualstudio.microsoft.com/downloads/) 下载并安装。

### 3. npm包管理器

npm通常随Node.js一起安装，如果需要单独安装：

```bash
# 使用npm安装npm
npm install -g npm

# 或者使用nvm安装Node.js和npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
```

### 4. 验证环境

运行以下命令验证所有依赖已正确安装：

```bash
# 检查Node.js版本（应 >= 14.0.0）
node --version

# 检查npm版本
npm --version

# 测试编译环境（可选）
node -e "console.log('Node.js is working!')"
```

### 常见问题

**Q: Canvas安装失败怎么办？**

A: 确保已安装系统构建工具：
- macOS: 运行 `xcode-select --install`
- Ubuntu: 运行上面的apt-get命令
- Windows: 安装Visual Studio Build Tools

**Q: Node.js版本太低怎么办？**

A: 使用nvm（Node Version Manager）安装新版本：
```bash
# 安装nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载shell配置
source ~/.bashrc

# 安装最新LTS版本的Node.js
nvm install --lts

# 使用新版本
nvm use --lts
```

**Q: 如何升级npm？**

A: 运行以下命令：
```bash
npm install -g npm@latest
```

## 快速开始

本技能提供三种使用方式，你可以根据自己的技能选择：

### 方式一：自动化渲染（推荐，最佳体验）

结合自然语言和自动化，无需写代码，自动生成PNG图片：

1. **准备内容**：整理你想要展示的文本内容
2. **使用技能**：用自然语言向AI描述你的需求，获取JSON配置
3. **保存配置**：将JSON配置保存为文件
4. **自动渲染**：运行`npm run render config.json`自动生成PNG

**优势**：
- ✅ 无需写代码
- ✅ 只需自然语言描述
- ✅ 自动生成PNG图片
- ✅ 支持批量生成

详细指南：[自动化渲染指南](./AUTO_RENDER_GUIDE.md)

### 方式二：自然语言使用（无需写代码）

如果你不会写代码，或者想快速生成信息图配置数据，可以直接使用本技能：

> ⚠️ **注意**：这种方式生成的是**配置数据**（JSON格式），不是最终的PNG图片。要得到PNG图片，需要将配置数据提供给前端开发者或使用在线渲染工具。

1. **准备内容**：整理你想要展示的文本内容
2. **使用技能**：向AI描述你的需求，例如：
   ```
   请帮我生成一个关于Python编程语言的信息图，使用知识科普模板，
   包含4个核心特点：语法简洁、应用广泛、生态丰富、跨平台，
   使用极简风格。
   ```
3. **获取配置数据**：技能会生成JSON格式的配置数据
4. **生成PNG**：将配置数据提供给前端开发者，或使用在线渲染工具生成PNG

**优势**：
- ✅ 无需写代码
- ✅ 只需自然语言描述
- ✅ 快速生成配置数据
- ✅ 灵活调整内容

**局限性**：
- ⚠️ 生成的是配置数据，不是最终的PNG图片
- ⚠️ 需要前端开发者或在线工具才能生成PNG图片
- ⚠️ 无法直接在本地生成PNG图片

### 方式三：代码使用（适合开发者）

如果你会写代码，想要完全自定义渲染过程并直接生成PNG图片，可以使用代码方式：

> ✅ **优势**：这种方式可以直接在本地生成PNG图片，无需依赖其他工具或开发者。

1. **安装依赖**：按照下面的前置条件安装Node.js和Canvas
2. **运行示例**：`npm run example`
3. **自定义内容**：修改example-render.js中的内容
4. **生成PNG**：运行脚本生成PNG图片

**优势**：
- ✅ 完全自定义
- ✅ 批量生成
- ✅ 集成到现有项目
- ✅ 高度灵活
- ✅ 直接生成PNG图片，无需其他工具

### 文档导航

**自然语言使用（无需写代码）**：
- 💡 [自然语言使用示例](./NATURAL_LANGUAGE_EXAMPLES.md) - 丰富的自然语言使用示例
- 🤖 [自动化渲染指南](./AUTO_RENDER_GUIDE.md) - 从JSON配置自动生成PNG图片

**代码使用（适合开发者）**：
- 📖 [快速开始指南](./QUICKSTART.md) - 5分钟快速上手
- 📚 [详细教程](./TUTORIAL.md) - 完整使用教程

**参考资源**：
- 📘 [SKILL.md](../SKILL.md) - 技能详细说明和使用示例

## 目录结构

```
assets/
├── templates/           # 模板文件
│   ├── knowledge/      # 知识科普模板
│   ├── comparison/     # 对比分析模板
│   ├── process/        # 流程说明模板
│   ├── data/          # 数据展示模板
│   └── xiaohongshu/   # 小红书爆款模板
├── icons/             # 图标资源
│   ├── emoji/        # Emoji图标
│   ├── outline/      # 线框图标
│   └── filled/       # 实心图标
├── colors/            # 配色方案
│   ├── minimal/      # 极简风配色
│   ├── macaron/      # 马卡龙风配色
│   ├── cyberpunk/    # 赛博朋克配色
│   ├── morandi/      # 莫兰迪风配色
│   ├── guochao/      # 国潮风配色
│   ├── business/     # 商务风配色
│   ├── handdrawn/    # 手绘风配色
│   └── flat/         # 扁平化配色
└── fonts/            # 字体资源
    ├── cn/          # 中文字体
    └── en/          # 英文字体
```

## 使用说明

这些资源文件用于配合前端渲染工具生成最终的PNG图片。

### 模板使用

- 每个模板包含JSON配置和预览图
- 模板定义了信息图的基本布局结构
- 支持自定义样式和内容填充

### 图标使用

- Emoji图标：适合知识科普和社交媒体
- 线框图标：适合商务和技术文档
- 实心图标：适合数据展示和对比分析

### 配色方案

- 每个配色方案包含主色、辅色、背景色等
- 支持自定义颜色配置
- 提供多种风格选择

### 字体资源

- 提供中英文字体选择
- 支持不同字重和风格
- 确保跨平台兼容性

## 渲染工具

推荐使用以下前端渲染工具：

- Canvas API：适合PNG生成
- SVG-to-Image：适合SVG转PNG
- Mermaid.js：适合流程图和架构图
- PlantUML：适合UML图表
- html2canvas：适合HTML转PNG

## 贡献指南

欢迎贡献新的模板、图标和配色方案！

1. 遵循现有目录结构
2. 提供清晰的文档说明
3. 包含使用示例
4. 确保跨平台兼容性
