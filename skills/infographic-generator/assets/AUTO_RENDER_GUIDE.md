# 自动化渲染指南

本指南说明如何使用自动化渲染功能，从JSON配置文件自动生成PNG图片。

## 概述

自动化渲染功能允许你：

1. 使用自然语言向AI描述需求
2. 获取JSON格式的配置数据
3. 将配置数据保存为JSON文件
4. 自动加载配置并渲染PNG图片

这种方式结合了自然语言使用的便捷性和代码使用的自动化能力。

## 快速开始

### 1. 准备环境

确保已安装Node.js和Canvas：

```bash
# 检查Node.js版本（应 >= 14.0.0）
node --version

# 检查npm版本
npm --version
```

### 2. 安装依赖

```bash
cd skills/infographic-generator/assets
npm install
```

### 3. 使用自动化渲染

#### 方式一：使用示例配置

```bash
npm run auto-render
```

这将使用`example-config.json`配置文件生成PNG图片。

#### 方式二：使用自定义配置

```bash
npm run render config/my-infographic.json
```

#### 方式三：指定输出路径

```bash
npm run render config/my-infographic.json output/my-image.png
```

## 配置文件格式

JSON配置文件包含以下主要部分：

```json
{
  "template": "模板名称",
  "output": "输出文件名.png",
  "content": {
    "title": "主标题",
    "subtitle": "副标题",
    "meta_info": "元信息",
    "items": [
      {
        "icon": "图标",
        "title": "标题",
        "description": "描述"
      }
    ],
    "summary": ["总结要点1", "总结要点2"]
  },
  "style": {
    "background_color": "背景色",
    "primary_color": "主色",
    "secondary_color": "辅色",
    "text_color": "文本色",
    "gray_color": "灰色"
  }
}
```

## 完整工作流程

### 步骤1：使用自然语言生成配置

向AI描述你的需求：

```
请帮我生成一个关于Python编程语言的信息图，使用知识科普模板，
包含4个核心特点：语法简洁、应用广泛、生态丰富、跨平台，
使用极简风格。
```

### 步骤2：获取JSON配置

AI会生成JSON格式的配置数据，例如：

```json
{
  "template": "knowledge",
  "output": "python-infographic.png",
  "content": {
    "title": "Python编程语言",
    "subtitle": "简洁优雅的编程语言",
    "meta_info": "发布于1991年 | 创始人：Guido van Rossum",
    "items": [
      {
        "icon": "🐍",
        "title": "语法简洁",
        "description": "Python的语法简洁明了，易于学习和使用，适合初学者入门编程。"
      },
      {
        "icon": "🌐",
        "title": "应用广泛",
        "description": "Python在Web开发、数据分析、人工智能、自动化等领域都有广泛应用。"
      },
      {
        "icon": "📚",
        "title": "生态丰富",
        "description": "Python拥有庞大的标准库和第三方库，几乎可以找到任何需要的工具。"
      },
      {
        "icon": "💻",
        "title": "跨平台",
        "description": "Python可以在Windows、macOS、Linux等多个操作系统上运行。"
      }
    ],
    "summary": [
      "Python是世界上最流行的编程语言之一",
      "适合从初学者到专业开发者的各个层次",
      "在人工智能和数据分析领域占据主导地位"
    ]
  },
  "style": {
    "background_color": "#F8F9FA",
    "primary_color": "#306998",
    "secondary_color": "#FFD43B",
    "text_color": "#212529",
    "gray_color": "#6C757D"
  }
}
```

### 步骤3：保存配置文件

将JSON配置保存为文件，例如`config/my-infographic.json`：

```bash
mkdir -p config
# 将JSON配置保存到 config/my-infographic.json
```

### 步骤4：自动渲染

使用自动化渲染脚本生成PNG图片：

```bash
npm run render config/my-infographic.json
```

或者指定输出路径：

```bash
npm run render config/my-infographic.json output/my-image.png
```

### 步骤5：查看结果

打开生成的PNG图片，你将看到精美的信息图！

## 批量渲染

### 创建多个配置文件

```bash
config/
├── python-infographic.json
├── javascript-infographic.json
├── java-infographic.json
└── go-infographic.json
```

### 批量渲染脚本

创建`batch-render.sh`：

```bash
#!/bin/bash

# 批量渲染脚本
for config in config/*.json; do
  echo "正在渲染: $config"
  npm run render "$config"
done

echo "批量渲染完成！"
```

### 运行批量渲染

```bash
chmod +x batch-render.sh
./batch-render.sh
```

## 高级用法

### 自定义模板

使用自定义模板：

```json
{
  "template": "knowledge",
  "output": "custom-infographic.png",
  "content": { ... },
  "style": { ... }
}
```

### 自定义样式

完全自定义配色方案：

```json
{
  "style": {
    "background_color": "#FFFFFF",
    "primary_color": "#FF6B6B",
    "secondary_color": "#4ECDC4",
    "text_color": "#2C3E50",
    "gray_color": "#95A5A6"
  }
}
```

### 集成到项目

在Node.js项目中使用：

```javascript
const { autoRender } = require('./auto-render.js');

// 自动渲染
await autoRender('config/my-infographic.json', 'output/my-image.png');
```

## 常见问题

### Q: 如何获取JSON配置？

A: 使用自然语言向AI描述你的需求，AI会生成JSON格式的配置数据。详细示例请查看[自然语言使用示例](./NATURAL_LANGUAGE_EXAMPLES.md)。

### Q: 支持哪些模板？

A: 目前支持两种模板：
- **知识科普模板**（knowledge）：适合知识科普、概念介绍、技术讲解等
- **小红书爆款模板**（xiaohongshu）：适合社交媒体分享、知识营销等

### Q: 如何自定义模板？

A: 可以在`templates/`目录下创建自定义模板，然后在配置文件中引用。详细说明请查看[详细教程](./TUTORIAL.md)。

### Q: 渲染失败怎么办？

A: 检查以下几点：
1. 确保已安装Node.js和Canvas
2. 确保JSON配置文件格式正确
3. 确保模板文件存在
4. 查看错误信息，根据提示修正问题

### Q: 如何批量生成多个信息图？

A: 创建多个JSON配置文件，然后使用批量渲染脚本或循环调用渲染命令。详细说明请查看上面的"批量渲染"部分。

## 总结

自动化渲染功能的优势：

✅ **自然语言生成**：使用自然语言描述需求，获取JSON配置
✅ **自动化渲染**：一键从JSON配置生成PNG图片
✅ **批量处理**：支持批量生成多个信息图
✅ **灵活定制**：支持自定义模板、样式、内容
✅ **易于集成**：可以集成到现有项目或工作流

## 相关文档

- [自然语言使用示例](./NATURAL_LANGUAGE_EXAMPLES.md) - 丰富的自然语言使用示例
- [快速开始指南](./QUICKSTART.md) - 5分钟快速上手
- [详细教程](./TUTORIAL.md) - 完整使用教程
- [README](./README.md) - 资源说明和前置条件
