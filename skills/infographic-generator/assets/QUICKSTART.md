# 快速开始指南（代码使用方式）

> ⚠️ **重要说明**：
> - 本技能生成的是信息图的**配置数据**（JSON格式），而不是最终的PNG图片
> - 配置数据包含完整的布局、样式、颜色、图标等信息
> - 要得到PNG图片，需要使用代码方式（本指南）或寻求前端开发者的帮助

> 💡 **提示**：如果你不会写代码，或者想快速生成信息图配置数据，推荐使用[自然语言方式](./README.md#方式一自然语言使用推荐无需写代码)，只需向AI描述你的需求即可。

本指南将帮助你在5分钟内使用代码从配置数据生成第一个PNG信息图。这种方式适合开发者，可以完全自定义渲染过程。

## 前置条件

在开始之前，请确保你的系统已安装必要的依赖。详细说明请查看 [README.md](./README.md#前置条件)。

**快速检查**：
```bash
# 检查Node.js版本（应 >= 14.0.0）
node --version

# 检查npm版本
npm --version
```

如果遇到安装问题，请查看README.md中的[常见问题](./README.md#常见问题)部分。

## 步骤1：安装依赖

```bash
# 进入assets目录
cd skills/infographic-generator/assets

# 安装依赖
npm install
```

## 步骤2：运行示例

```bash
# 运行示例渲染脚本
npm run example
```

这将生成一个名为`python-infographic.png`的文件。

## 步骤3：查看结果

打开生成的`python-infographic.png`文件，你将看到一个精美的Python编程语言信息图！

## 自定义内容

### 修改内容

编辑`example-render.js`文件中的`content`对象：

```javascript
const content = {
  title: '你的标题',
  subtitle: '你的副标题',
  items: [
    {
      icon: '📝',
      title: '你的要点1',
      description: '你的描述1'
    },
    {
      icon: '🚀',
      title: '你的要点2',
      description: '你的描述2'
    }
  ],
  summary: [
    '你的总结1',
    '你的总结2'
  ]
};
```

### 修改样式

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

### 使用不同模板

```javascript
// 使用小红书爆款模板
const xiaohongshuTemplate = loadTemplate('./templates/xiaohongshu/template.json');
```

## 下一步

- 查看[TUTORIAL.md](./TUTORIAL.md)了解详细教程
- 查看[README.md](./README.md)了解Assets资源
- 查看[renderer-config.json](./renderer-config.json)了解渲染配置

## 常见问题

### Q: 安装canvas失败？

A: 确保你的系统已安装必要的构建工具：

**macOS**:
```bash
xcode-select --install
```

**Ubuntu/Debian**:
```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

**Windows**:
安装Windows SDK和Visual Studio Build Tools。

### Q: 如何调整图片尺寸？

A: 修改模板配置中的output部分：

```javascript
const customTemplate = JSON.parse(JSON.stringify(template));
customTemplate.output.width = 1200;
customTemplate.output.height = 1600;
```

### Q: 如何批量生成？

A: 查看[TUTORIAL.md](./TUTORIAL.md)中的批量生成章节。

## 获取帮助

如果遇到问题，请查看：
- [详细教程](./TUTORIAL.md)
- [Assets说明](./README.md)
- [渲染配置](./renderer-config.json)
