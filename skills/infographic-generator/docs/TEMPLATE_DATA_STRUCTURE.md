# 信息图模板数据结构规范

## 概述

本文档详细说明了每个 Remotion 模板所需的数据结构。**请严格按照此规范创建 JSON 配置文件**。

---

## 📋 模板清单

### 1. Knowledge 模板（知识科普）

**适用场景**：
- ✅ 知识要点列表（3-6个要点）
- ✅ 多个对象对比（>2个对象）
- ✅ 特征介绍
- ✅ 功能说明

**数据结构**：
```typescript
{
  template: "knowledge",
  content: {
    title: string,           // 主标题
    subtitle: string,        // 副标题
    meta_info: string,       // 元信息
    items: [                 // ✅ 必需：要点数组（3-6个）
      {
        icon: string,        // 图标 emoji
        title: string,       // 要点标题
        description: string  // 要点描述
      }
    ],
    summary: string[]        // 总结数组
  }
}
```

**完整示例**：
```json
{
  "template": "knowledge",
  "content": {
    "title": "Python编程语言特点",
    "subtitle": "Python的核心优势",
    "meta_info": "创建于2026/3/14 | 编程语言",
    "items": [
      {
        "icon": "📝",
        "title": "语法简洁",
        "description": "易学易用，代码可读性强"
      },
      {
        "icon": "🚀",
        "title": "应用广泛",
        "description": "Web、AI、数据分析等领域"
      },
      {
        "icon": "📦",
        "title": "生态丰富",
        "description": "海量第三方库和框架"
      }
    ],
    "summary": [
      "Python是初学者的最佳选择",
      "掌握Python对职业发展很有帮助"
    ]
  }
}
```

---

### 2. Comparison 模板（左右对比）

**适用场景**：
- ✅ **仅支持两个对象的对比**
- ✅ A vs B 格式
- ❌ **不支持三个或更多对象的对比**

**数据结构**：
```typescript
{
  template: "comparison",
  content: {
    title: string,           // 主标题
    subtitle: string,        // 副标题

    // 左侧对象
    left_title: string,      // ✅ 必需：左侧标题
    left_icon: string,       // ✅ 必需：左侧图标
    left_bg: string,         // 可选：左侧背景色
    left_primary: string,    // 可选：左侧主色调
    left_items: [            // ✅ 必需：左侧要点数组
      {
        icon: string,
        label: string,
        value: string
      }
    ],

    // 右侧对象
    right_title: string,     // ✅ 必需：右侧标题
    right_icon: string,      // ✅ 必需：右侧图标
    right_bg: string,        // 可选：右侧背景色
    right_primary: string,   // 可选：右侧主色调
    right_items: [           // ✅ 必需：右侧要点数组
      {
        icon: string,
        label: string,
        value: string
      }
    ],

    conclusion: string,      // 结论
    recommendation: string   // 推荐
  }
}
```

**完整示例**：
```json
{
  "template": "comparison",
  "content": {
    "title": "React vs Vue 对比",
    "subtitle": "前端框架选型指南",

    "left_title": "React",
    "left_icon": "⚛️",
    "left_bg": "#E8F5E9",
    "left_primary": "#4DB33D",
    "left_items": [
      {
        "icon": "📘",
        "label": "学习曲线",
        "value": "较陡峭，需要JSX基础"
      },
      {
        "icon": "🏢",
        "label": "企业支持",
        "value": "Facebook官方维护"
      },
      {
        "icon": "🌍",
        "label": "生态规模",
        "value": "最大，npm包最多"
      }
    ],

    "right_title": "Vue",
    "right_icon": "💚",
    "right_bg": "#E3F2FD",
    "right_primary": "#00758F",
    "right_items": [
      {
        "icon": "📘",
        "label": "学习曲线",
        "value": "平缓，模板语法友好"
      },
      {
        "icon": "🏢",
        "label": "企业支持",
        "value": "社区驱动，独立团队"
      },
      {
        "icon": "🌍",
        "label": "生态规模",
        "value": "中等，官方工具齐全"
      }
    ],

    "conclusion": "React生态更大，Vue更易上手",
    "recommendation": "大型项目选React，中小项目选Vue"
  }
}
```

**⚠️ 重要提示**：
- 如果需要对比 **3个或更多对象**，请使用 **Knowledge 模板**
- Comparison 模板只能处理 A vs B 的对比格式

---

### 3. Xiaohongshu 模板（小红书）

**适用场景**：
- ✅ 小红书内容
- ✅ 竖屏格式（1080x1920）

**数据结构**：与 Knowledge 模板相同，使用 `items` 数组

---

### 4. Process 模板（流程说明）

**当前状态**：⚠️ **已废弃，请使用 Knowledge 模板代替**

**原因**：Process 模板期望的数据结构较为复杂，且功能与 Knowledge 模板重复

**替代方案**：使用 Knowledge 模板的 `items` 数组展示流程步骤

---

## 🎨 风格配置（所有模板通用）

```typescript
{
  style: {
    background_color: string,        // 背景色
    primary_color: string,           // 主色
    secondary_color: string,         // 辅色
    accent_color: string,            // 强调色
    text_color: string,              // 文字色
    border_color: string,            // 边框色
    background_pattern: string,      // 背景图案
    gradient: string,                // 渐变
    decorative_elements: string[],   // 装饰元素
    card_style: string,              // 卡片样式
    font_style: string               // 字体样式
  },
  style_name: string,                // 风格名称
  output_config: {
    width: number,                   // 宽度
    height: number,                  // 高度
    orientation: string              // 方向：horizontal | vertical
  }
}
```

**风格预设**：
- 科技风：`tech`
- 可爱风：`cute`
- 简约风：`minimal`
- 教学风：`tutorial`
- 笔记风：`notebook`
- 泥塑风：`clay`
- 漫画风：`comics`
- Bento风：`bento`

---

## ⚠️ 常见错误

### 1. 模板选择错误

**❌ 错误**：使用 Comparison 模板对比3个对象
```json
{
  "template": "comparison",
  "content": {
    "comparison_data": {
      "headers": ["A", "B", "C"],  // ❌ Comparison不支持
      "rows": [...]
    }
  }
}
```

**✅ 正确**：使用 Knowledge 模板
```json
{
  "template": "knowledge",
  "content": {
    "items": [
      { "icon": "🛡️", "title": "对象A", "description": "..." },
      { "icon": "⚡", "title": "对象B", "description": "..." },
      { "icon": "🚀", "title": "对象C", "description": "..." }
    ]
  }
}
```

---

### 2. 数据结构不匹配

**❌ 错误**：Comparison 模板缺少必需字段
```json
{
  "template": "comparison",
  "content": {
    "title": "对比标题",
    // ❌ 缺少 left_title, left_items, right_title, right_items
  }
}
```

**✅ 正确**：提供完整的必需字段
```json
{
  "template": "comparison",
  "content": {
    "title": "对比标题",
    "left_title": "左侧标题",
    "left_icon": "🛡️",
    "left_items": [...],
    "right_title": "右侧标题",
    "right_icon": "⚡",
    "right_items": [...]
  }
}
```

---

### 3. 字段名称错误

**❌ 错误**：使用错误的字段名
```json
{
  "template": "knowledge",
  "content": {
    "points": [...]  // ❌ 错误：应该是 items
  }
}
```

**✅ 正确**：使用正确的字段名
```json
{
  "template": "knowledge",
  "content": {
    "items": [...]  // ✅ 正确
  }
}
```

---

## 📚 最佳实践

### 1. 选择正确的模板

| 需求场景 | 推荐模板 | 原因 |
|---------|---------|------|
| 列举要点（3-6个） | Knowledge | 灵活，通用性强 |
| 对比两个对象 | Comparison | 专业的左右对比布局 |
| 对比三个或更多对象 | Knowledge | Comparison不支持 |
| 展示流程步骤 | Knowledge | 使用 items 数组 |
| 小红书内容 | Xiaohongshu | 竖屏格式优化 |

---

### 2. 创建配置的步骤

1. **确定模板类型**：根据需求选择合适的模板
2. **复制模板示例**：从本文档复制完整示例
3. **替换内容**：修改 title、items 等字段
4. **验证结构**：确保所有必需字段都已填写
5. **测试渲染**：使用 `--use-config` 测试生成

---

### 3. 调试技巧

**检查文件大小**：
```bash
ls -lh output.png
```
- 文件大小 < 100KB → 可能内容为空
- 文件大小 > 500KB → 内容正常

**查看配置验证**：
```bash
node skill-render.js config.json --use-config 2>&1 | grep "❌"
```

---

## 🔗 相关资源

- [JSON Schema 验证文件](./schemas/) - 自动验证配置结构
- [示例配置文件](../examples/) - 完整的示例配置
- [模板选择指南](./TEMPLATE_SELECTION.md) - 详细的模板选择建议

---

**最后更新**：2026-03-14
**维护者**：恐龙创新部