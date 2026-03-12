# 信息图生成器使用教程（代码使用方式）

> ⚠️ **重要说明**：
> - 本技能生成的是信息图的**配置数据**（JSON格式），而不是最终的PNG图片
> - 配置数据包含完整的布局、样式、颜色、图标等信息
> - 要得到PNG图片，需要使用代码方式（本教程）或寻求前端开发者的帮助

> 💡 **提示**：如果你不会写代码，或者想快速生成信息图配置数据，推荐使用[自然语言方式](./README.md#方式一自然语言使用推荐无需写代码)，只需向AI描述你的需求即可。

本教程将详细说明如何使用代码方式从配置数据最终得到PNG格式的图片。这种方式适合开发者，可以完全自定义渲染过程。

## 目录

1. [快速开始](#快速开始)
2. [详细步骤](#详细步骤)
3. [使用模板](#使用模板)
4. [自定义样式](#自定义样式)
5. [批量生成](#批量生成)
6. [常见问题](#常见问题)

## 快速开始

### 前提条件

在开始之前，请确保你的系统已安装必要的依赖。详细说明请查看 [README.md](./README.md#前置条件)。

**基本要求**：
- Node.js环境（建议v14或更高版本）
- npm包管理器
- 基本的JavaScript知识

**快速检查**：
```bash
# 检查Node.js版本（应 >= 14.0.0）
node --version

# 检查npm版本
npm --version
```

如果遇到安装问题，请查看README.md中的[常见问题](./README.md#常见问题)部分。

### 安装依赖

```bash
# 创建项目目录
mkdir infographic-project
cd infographic-project

# 初始化项目
npm init -y

# 安装canvas包
npm install canvas
```

### 最简单的示例

```javascript
const { renderInfographic, loadTemplate } = require('./assets/example-render.js');
const fs = require('fs');

async function quickStart() {
  // 1. 加载模板
  const template = loadTemplate('./assets/templates/knowledge/template.json');

  // 2. 准备内容
  const content = {
    title: 'Python编程语言',
    subtitle: '简洁优雅，功能强大',
    meta_info: '1991年创建 | Guido van Rossum',
    items: [
      {
        icon: '📝',
        title: '语法简洁',
        description: '清晰易读，适合初学者'
      },
      {
        icon: '🚀',
        title: '应用广泛',
        description: '数据分析、AI、Web开发'
      },
      {
        icon: '📦',
        title: '生态丰富',
        description: 'NumPy、Pandas、TensorFlow'
      },
      {
        icon: '🌐',
        title: '跨平台',
        description: 'Windows、Mac、Linux'
      }
    ],
    summary: [
      '适合初学者的入门语言',
      '广泛应用于多个领域',
      '拥有丰富的第三方库'
    ]
  };

  // 3. 选择样式
  const style = template.style.default;

  // 4. 渲染信息图
  const canvas = await renderInfographic(template, content, style);

  // 5. 保存为PNG
  const outputPath = 'python-infographic.png';
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);

  console.log(`信息图已生成: ${outputPath}`);
}

quickStart().catch(console.error);
```

运行这个脚本：

```bash
node quick-start.js
```

你将得到一个名为`python-infographic.png`的高质量信息图！

## 详细步骤

### 步骤1：准备内容

首先，你需要准备要展示的内容。内容可以是任何文本，例如：

```javascript
const textContent = `
Python是一种高级编程语言，由Guido van Rossum于1991年创建。
Python语法简洁清晰，易于学习。
Python广泛应用于数据分析、人工智能、Web开发等领域。
Python拥有丰富的第三方库，如NumPy、Pandas、TensorFlow等。
`;
```

### 步骤2：使用技能生成结构化数据

将文本内容提供给信息图生成器技能，它会生成结构化的JSON数据：

```json
{
  "type": "infographic",
  "content_type": "text_to_visual",
  "template": "knowledge_intro",
  "visual_style": "minimalist",
  "title": "Python编程语言",
  "subtitle": "简洁优雅，功能强大",
  "sections": [...]
}
```

### 步骤3：加载模板

```javascript
const { loadTemplate } = require('./assets/example-render.js');

// 加载知识科普模板
const template = loadTemplate('./assets/templates/knowledge/template.json');

// 或者加载小红书爆款模板
const xiaohongshuTemplate = loadTemplate('./assets/templates/xiaohongshu/template.json');
```

### 步骤4：准备渲染数据

根据模板要求准备渲染数据：

```javascript
const content = {
  title: 'Python编程语言',
  subtitle: '简洁优雅，功能强大',
  meta_info: '1991年创建 | Guido van Rossum',
  items: [
    {
      icon: '📝',
      title: '语法简洁',
      description: '清晰易读，适合初学者'
    }
    // ... 更多项目
  ],
  summary: [
    '适合初学者的入门语言',
    '广泛应用于多个领域',
    '拥有丰富的第三方库'
  ]
};
```

### 步骤5：选择样式

```javascript
// 使用默认样式
const style = template.style.default;

// 或者自定义样式
const customStyle = {
  primary_color: '#3776AB',
  secondary_color: '#FFD43B',
  background_color: '#FFFFFF',
  text_color: '#333333',
  gray_color: '#666666'
};
```

### 步骤6：渲染信息图

```javascript
const { renderInfographic } = require('./assets/example-render.js');

// 渲染信息图
const canvas = await renderInfographic(template, content, style);
```

### 步骤7：保存为PNG

```javascript
const fs = require('fs');

// 保存为PNG
const outputPath = 'output.png';
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);

console.log(`信息图已生成: ${outputPath}`);
```

## 使用模板

### 知识科普模板

知识科普模板适合用于知识科普、概念介绍、技术讲解等场景。

**模板结构**：
- 标题区：大标题 + 副标题 + 元信息
- 内容区：3-5个知识点，带图标
- 总结区：关键要点回顾

**使用示例**：

```javascript
const template = loadTemplate('./assets/templates/knowledge/template.json');

const content = {
  title: 'Python编程语言',
  subtitle: '简洁优雅，功能强大',
  meta_info: '1991年创建 | Guido van Rossum',
  items: [
    {
      icon: '📝',
      title: '语法简洁',
      description: '清晰易读，适合初学者'
    },
    {
      icon: '🚀',
      title: '应用广泛',
      description: '数据分析、AI、Web开发'
    }
  ],
  summary: [
    '适合初学者的入门语言',
    '广泛应用于多个领域'
  ]
};
```

### 小红书爆款模板

小红书爆款模板适合用于社交媒体分享、知识营销、爆款内容等场景。

**模板结构**：
- 标题区：吸睛标题 + 一句话总结
- 核心区：3-5个核心观点（带图标）
- 数据区：数据支撑和案例
- 行动区：具体可执行建议
- 互动区：二维码、收藏提示等

**使用示例**：

```javascript
const template = loadTemplate('./assets/templates/xiaohongshu/template.json');

const content = {
  title: '5个高效学习方法',
  subtitle: '学霸都在用的学习技巧',
  core_points: [
    {
      icon: '📚',
      title: '番茄工作法',
      description: '25分钟专注+5分钟休息，提高学习效率'
    },
    {
      icon: '🎯',
      title: '目标拆解',
      description: '大目标拆解为小任务，更容易完成'
    }
  ],
  data_points: [
    {
      value: '25%',
      label: '效率提升'
    },
    {
      value: '3倍',
      label: '记忆增强'
    }
  ],
  actions: [
    '今天就开始尝试番茄工作法',
    '制定本周学习计划'
  ],
  interaction: {
    qr_code: 'your_qr_code_here',
    prompts: ['收藏', '点赞', '关注']
  }
};
```

## 自定义样式

### 修改配色

```javascript
const customStyle = {
  primary_color: '#3776AB',      // 主色
  secondary_color: '#FFD43B',    // 辅色
  background_color: '#FFFFFF',   // 背景色
  text_color: '#333333',         // 文本色
  gray_color: '#666666'          // 灰色
};

const canvas = await renderInfographic(template, content, customStyle);
```

### 使用预设风格

小红书模板提供了8种预设风格：

```javascript
const styles = template.style.styles;

// 选择风格
const selectedStyle = styles.find(s => s.name === 'macaron');

const canvas = await renderInfographic(template, content, selectedStyle);
```

### 自定义字体大小

```javascript
// 修改模板配置中的字体大小
const customTemplate = JSON.parse(JSON.stringify(template));
customTemplate.layout.sections[0].content.main_title.font_size = 56;

const canvas = await renderInfographic(customTemplate, content, style);
```

## 批量生成

### 批量生成多个信息图

```javascript
const items = [
  {
    title: 'Python编程语言',
    subtitle: '简洁优雅，功能强大',
    items: [...]
  },
  {
    title: 'JavaScript编程语言',
    subtitle: 'Web开发首选',
    items: [...]
  },
  {
    title: 'Java编程语言',
    subtitle: '企业级应用',
    items: [...]
  }
];

const batchConfig = {
  unified_style: true,
  auto_numbering: true,
  naming_pattern: "{template_name}_{index}.png"
};

for (let i = 0; i < items.length; i++) {
  const canvas = await renderInfographic(template, items[i], style);
  const filename = batchConfig.naming_pattern
    .replace('{template_name}', template.template_name)
    .replace('{index}', i + 1);
  fs.writeFileSync(filename, canvas.toBuffer('image/png'));
  console.log(`已生成: ${filename}`);
}
```

### 批量生成系列内容

```javascript
async function generateSeries(title, items) {
  const template = loadTemplate('./assets/templates/knowledge/template.json');
  const style = template.style.default;

  for (let i = 0; i < items.length; i++) {
    const content = {
      title: `${title} - 第${i + 1}部分`,
      subtitle: items[i].subtitle,
      items: items[i].items,
      summary: items[i].summary
    };

    const canvas = await renderInfographic(template, content, style);
    const filename = `${title}_part${i + 1}.png`;
    fs.writeFileSync(filename, canvas.toBuffer('image/png'));
    console.log(`已生成: ${filename}`);
  }
}

// 使用示例
const seriesData = [
  {
    subtitle: '基础入门',
    items: [...],
    summary: [...]
  },
  {
    subtitle: '进阶技巧',
    items: [...],
    summary: [...]
  },
  {
    subtitle: '高级应用',
    items: [...],
    summary: [...]
  }
];

generateSeries('Python学习指南', seriesData);
```

## 常见问题

### Q1: 如何调整信息图的尺寸？

A: 修改模板配置中的output部分：

```javascript
const customTemplate = JSON.parse(JSON.stringify(template));
customTemplate.output.width = 1200;
customTemplate.output.height = 1600;

const canvas = await renderInfographic(customTemplate, content, style);
```

### Q2: 如何添加自定义图标？

A: 在content的items中使用emoji或Unicode字符：

```javascript
const content = {
  items: [
    {
      icon: '📝',  // emoji
      title: '语法简洁',
      description: '清晰易读，适合初学者'
    },
    {
      icon: '⚡',  // emoji
      title: '高效开发',
      description: '代码简洁，开发快速'
    }
  ]
};
```

### Q3: 如何提高图片质量？

A: 调整DPI设置：

```javascript
const customTemplate = JSON.parse(JSON.stringify(template));
customTemplate.output.dpi = 300;  // 高质量
// customTemplate.output.dpi = 600;  // 超高质量

const canvas = await renderInfographic(customTemplate, content, style);
```

### Q4: 如何批量生成不同风格的信息图？

A: 使用不同的样式配置：

```javascript
const styles = template.style.styles;

for (const style of styles) {
  const canvas = await renderInfographic(template, content, style);
  const filename = `infographic_${style.name}.png`;
  fs.writeFileSync(filename, canvas.toBuffer('image/png'));
  console.log(`已生成: ${filename}`);
}
```

### Q5: 如何自定义模板布局？

A: 创建新的模板配置文件：

```json
{
  "template_id": "my_custom_template",
  "template_name": "我的自定义模板",
  "layout": {
    "type": "vertical",
    "sections": [
      {
        "id": "title_area",
        "type": "title",
        "height": "15%"
      },
      {
        "id": "content_area",
        "type": "content",
        "height": "70%"
      },
      {
        "id": "footer_area",
        "type": "footer",
        "height": "15%"
      }
    ]
  },
  "style": {
    "default": {
      "primary_color": "#333333",
      "secondary_color": "#666666",
      "background_color": "#FFFFFF"
    }
  },
  "output": {
    "format": "PNG",
    "width": 1080,
    "height": 1920,
    "dpi": 300
  }
}
```

然后实现对应的渲染逻辑。

## 总结

使用信息图生成器技能生成PNG图片的完整流程：

1. **准备内容**：整理要展示的文本内容
2. **生成结构化数据**：使用技能生成JSON格式的结构化数据
3. **加载模板**：选择合适的模板（知识科普、小红书爆款等）
4. **准备渲染数据**：根据模板要求准备内容数据
5. **选择样式**：使用默认样式或自定义样式
6. **渲染信息图**：使用渲染函数生成Canvas对象
7. **保存为PNG**：将Canvas对象保存为PNG图片文件

通过这个流程，你可以轻松地将文本内容转换为精美的PNG信息图！

## 下一步

- 查看[SKILL.md](../SKILL.md)了解更多技能细节
- 查看[README.md](./README.md)了解Assets资源
- 查看[renderer-config.json](./renderer-config.json)了解渲染配置
- 查看[example-render.js](./example-render.js)学习渲染实现
