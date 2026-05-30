---
name: wechat-article-writer
description: "微信公众号文章写作和排版助手。输入主题+内容大纲→自动生成结构完整、排版精美的公众号文章（WeChat兼容HTML+行内样式），同时可配套调用infographic-generator生成4主题配图。触发词：'公众号文章','写公众号','公众号排版','微信文章','推文'。"
---

# 微信公众号文章排版器

## 概述

微信公众号文章一体化写作和排版工具。两种使用方式：

### 方式一：一站式生成（推荐）

```bash
node wechat-full.js article.md -o output/
```

自动完成：
1. 解析 Markdown 文章结构
2. 生成配图页面 → 自动截图为 4 主题 PNG
3. 图片自动插入到文章对应位置（头图→标题下方、脉络图→中间、引导图→文末）
4. 输出三份文件：图文混排预览 + 纯文本排版 + 图片插入指南

### 方式二：仅排版

```bash
node wechat-md2html.js article.md -o article.html
```

产出：WeChat 兼容的行内样式 HTML，可直接复制粘贴到公众号编辑器

## 微信公众号的硬规则

微信公众号编辑器对 HTML 有严格限制。以下是必须遵守的：

| 规则 | 说明 |
|---|---|
| **行内样式** | 所有样式必须写在 `style=""` 属性中，禁止 `<style>` 块和外部 CSS |
| **禁止脚本** | 不能有 `<script>`，不能有事件处理器（onclick 等） |
| **禁止 iframe** | 不能嵌入外部页面 |
| **字体限制** | 只能用系统字体：`-apple-system, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif` |
| **字号范围** | `14px` ~ `20px` 正文最舒适；标题 `18px` ~ `28px` |
| **颜色范围** | 正文 `#3e3e3e` ~ `#2a2a2a`；不在纯黑 `#000` 也不用纯灰 `#888` |
| **行间距** | `1.6` ~ `1.8` 公众号阅读最舒适 |
| **段落间距** | `1em` ~ `1.5em` 上下 margin |
| **两端对齐** | `text-align: justify` 公众号默认，中英文混排必加 |
| **图片** | `<img>` 宽度 `100%`，居中，先上传到微信素材库再插入 |

## 4 种文章主题

| 主题 | 字号 | 配色 | 适合内容 |
|---|---|---|---|
| **技术深度** | 15px | 深色背景感 + 紫色强调 | 编程、架构、技术分析 |
| **产品宣发** | 17px | 纯白 + 蓝色强调 | 产品发布、品牌故事 |
| **人文长文** | 18px | 暖色调 | 深度思考、叙事、人物 |
| **生活美学** | 15px | 极简去色 | 生活方式推荐、设计美学 |

用户未指定时，根据内容类型自动匹配。

## Workflow

### Phase 1 — 内容生成

收到用户主题和内容大纲后：

1. **理解内容类型** — 技术文/产品文/人文文/生活文 → 自动选主题
2. **规划文章结构** — 确定各 section 的标题层级和内容密度
3. **生成文章正文** — 完整的文章内容，包括标题、段落、引用、列表、总结等

### Phase 2 — 排版渲染

调用 `node wechat-render.js` 将结构化文章数据转换为 WeChat 兼容的 HTML：

```json
{
  "title": "文章标题",
  "author": "作者",
  "theme": "tech|product|warm|zen",
  "sections": [
    {"type": "h2", "text": "章节标题"},
    {"type": "p", "text": "段落文字..."},
    {"type": "blockquote", "text": "引用文字..."},
    {"type": "ul", "items": ["要点1", "要点2"]},
    {"type": "highlight", "text": "重点强调"},
    {"type": "separator"},
    {"type": "summary", "title": "总结", "items": ["要点1", "要点2"]}
  ]
}
```

输出为完整的 WeChat 兼容 HTML（所有样式已内联）。

### Phase 3 — 配套配图（可选）

生成配图调用 `infographic-generator` skill：
- 从文章内容自动提取关键标题和要点
- 生成 4 种风格的配图截图
- 用户挑选喜欢的插入文章

## 使用示例

```
用户: 帮我写一篇公众号文章，主题是「多智能体编排模式入门」
      内容大纲：1.什么是多智能体编排 2.核心角色 3.模式类型 4.应用案例 5.总结
```

产出：
- `output/article.html` — 可直接复制粘贴到公众号编辑器的排好版的文章
- `output/screenshots/` — 4 套配套配图

## 文件说明

| 文件 | 用途 |
|---|---|
| `SKILL.md` | 本文件 — 工作流定义 |
| `wechat-render.js` | Markdown/JSON → WeChat 兼容 HTML 渲染器 |
| `wechat-themes.json` | 4 种文章排版主题定义 |
| `test_content/` | 测试用文章内容存放目录 |

## 公众号排版最佳实践

### 字号和间距

```
标题 h2: 22px, bold, margin-bottom: 0.8em
标题 h3: 18px, bold, margin-bottom: 0.6em
正文 p:  15-17px, line-height: 1.8, margin: 0.8em 0
引用:    14-15px, line-height: 1.6, 左侧彩色边框
列表:    15-16px, line-height: 1.8
```

### 颜色搭配

```
正文: #3e3e3e（85% 黑，柔和护眼）
强调: #e96900（暖橙，用于关键词加粗）
链接: #1e6bb8（蓝色，可点击感）
引用: #6b6b6b（灰色，区分层级）
```

### 内容结构

```
开篇（Hook）→ 问题（Pain）→ 方案（Solution）→ 展开（Details）→ 总结（CTA）
```

### 配图规范

- 封面图：900×500（2.35:1），公众号素材库上传
- 正文图：宽度 640-900px，居中
- 每个章节最好有一张配图
- 图片 alt 文字有助于 SEO 和阅读体验

## 技术说明

- WeChat 不支持 CSS 变量、不支持 flexbox 部分属性、不支持 grid
- 布局靠 `margin/padding/text-align` 而非 flexbox
- 颜色用 6 位 hex 不用简写（`#333333` 而非 `#333`）
- 图片必须上传到微信素材库后插入，`file://` 和本地路径图片粘贴后会丢失