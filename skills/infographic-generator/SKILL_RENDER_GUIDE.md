# 技能渲染指南

本指南说明如何使用技能渲染功能，通过自然语言直接生成PNG图片。

## 概述

技能渲染功能将AI驱动渲染功能封装到skill中，提供统一的技能接口，让您可以更方便地使用自然语言生成PNG图片。

## 使用方法

### 基本用法

```bash
node skill-render.js "请帮我生成一个关于Python编程语言的信息图"
```

### 指定输出路径

```bash
node skill-render.js "请帮我生成一个关于Python编程语言的信息图" --output output/python.png
```

### 不保存配置文件

```bash
node skill-render.js "请帮我生成一个关于Python编程语言的信息图" --no-save-config
```

### 指定配置文件路径

```bash
node skill-render.js "请帮我生成一个关于Python编程语言的信息图" --config config/python.json
```

## 示例

### 示例1：知识科普信息图

```bash
node skill-render.js "请帮我生成一个关于Python编程语言的信息图，使用知识科普模板，包含4个核心特点：语法简洁、应用广泛、生态丰富、跨平台，使用极简风格"
```

### 示例2：SWOT分析信息图

```bash
node skill-render.js "请帮我生成一个关于人工智能的SWOT分析信息图"
```

### 示例3：流程图信息图

```bash
node skill-render.js "请帮我生成一个关于软件开发流程的流程图信息图"
```

## 输出

技能渲染会生成以下文件：

1. **PNG图片**：渲染好的信息图
2. **JSON配置**：自动生成的配置文件（默认为temp-config.json）

## 功能特点

- ✅ **统一接口**：提供统一的技能接口
- ✅ **自然语言输入**：使用自然语言描述需求
- ✅ **自动生成配置**：AI自动生成JSON配置
- ✅ **自动渲染**：自动渲染PNG图片
- ✅ **保存配置**：自动保存JSON配置文件
- ✅ **灵活输出**：支持指定输出路径
- ✅ **批量渲染**：支持批量生成多个信息图

## 工作流程

1. **接收自然语言输入**：解析自然语言描述
2. **生成JSON配置**：AI生成JSON配置
3. **保存配置文件**：保存JSON配置到文件（可选）
4. **渲染信息图**：渲染信息图
5. **保存PNG**：保存PNG图片

## 编程接口

### skillRender

```javascript
const { skillRender } = require('./skill-render.js');

// 基本用法
const result = await skillRender("请帮我生成一个关于Python编程语言的信息图");

// 指定输出路径
const result = await skillRender(
  "请帮我生成一个关于Python编程语言的信息图",
  { outputPath: 'output/python.png' }
);

// 不保存配置文件
const result = await skillRender(
  "请帮我生成一个关于Python编程语言的信息图",
  { saveConfig: false }
);

// 指定配置文件路径
const result = await skillRender(
  "请帮我生成一个关于Python编程语言的信息图",
  { configPath: 'config/python.json' }
);
```

### batchSkillRender

```javascript
const { batchSkillRender } = require('./skill-render.js');

// 批量生成
const results = await batchSkillRender([
  "请帮我生成一个关于Python编程语言的信息图",
  "请帮我生成一个关于JavaScript编程语言的信息图",
  "请帮我生成一个关于Java编程语言的信息图"
]);

// 指定输出路径
const results = await batchSkillRender([
  "请帮我生成一个关于Python编程语言的信息图",
  "请帮我生成一个关于JavaScript编程语言的信息图"
], {
  outputPath: 'output/language.png',
  configPath: 'config/language.json'
});
```

## 高级用法

### 修改生成的配置

1. 运行技能渲染生成配置文件
2. 手动修改生成的配置文件
3. 使用auto-render.js重新渲染：

```bash
node auto-render.js temp-config.json
```

### 批量生成

创建一个脚本批量生成多个信息图：

```javascript
const { batchSkillRender } = require('./skill-render.js');

async function main() {
  const results = await batchSkillRender([
    "请帮我生成一个关于Python编程语言的信息图",
    "请帮我生成一个关于JavaScript编程语言的信息图",
    "请帮我生成一个关于Java编程语言的信息图"
  ]);

  console.log('批量生成完成！');
  console.log(`成功: ${results.filter(r => r.success).length}/${results.length}`);
}

main().catch(console.error);
```

## 常见问题

### Q: 如何获取更好的生成结果？

A: 提供更详细和清晰的自然语言描述，包括：
- 主题：明确说明要生成什么主题的信息图
- 模板：指定使用的模板（如知识科普、SWOT分析等）
- 风格：指定使用的风格（如极简、默认等）
- 内容：提供要包含的内容要点

### Q: 如何自定义生成的配置？

A: 可以修改生成的配置文件，然后使用auto-render.js重新渲染。

### Q: 支持哪些模板？

A: 目前支持以下模板：
- `knowledge`：知识科普模板（默认）
- `swot`：SWOT分析模板
- `process`：流程图模板

### Q: 支持哪些风格？

A: 目前支持以下风格：
- `极简`：极简风格
- 默认风格

### Q: 如何不保存配置文件？

A: 使用`--no-save-config`选项：

```bash
node skill-render.js "请帮我生成一个关于Python编程语言的信息图" --no-save-config
```

## 总结

技能渲染功能让您可以使用自然语言直接生成PNG图片，无需手动创建配置文件。只需提供清晰的自然语言描述，技能会自动生成JSON配置并渲染PNG图片。

与其他渲染方式的对比：

| 特性 | skill-render.js | ai-render.js | auto-render.js |
|------|-----------------|--------------|----------------|
| **输入方式** | 自然语言 | 自然语言 | JSON配置文件 |
| **接口** | 统一技能接口 | 独立脚本 | 独立脚本 |
| **配置保存** | 可选 | 自动 | 手动 |
| **批量渲染** | 支持 | 不支持 | 不支持 |
| **编程接口** | 支持 | 支持 | 支持 |

如果您有任何问题或建议，请随时反馈！
