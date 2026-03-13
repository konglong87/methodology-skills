# 基础使用示例

本文档提供infographic-generator的基础使用示例，帮助快速上手。

## 快速开始

### 示例1：生成知识科普信息图

**需求**：为Python编程语言生成信息图

**输入**：
```
生成Python编程语言的信息图，包含4个核心特点：
1. 语法简洁 - 易学易用，代码可读性强
2. 应用广泛 - Web、AI、数据分析等领域
3. 生态丰富 - 海量第三方库和框架
4. 跨平台 - 支持Windows、Mac、Linux
```

**命令**：
```bash
node skill-render.js "生成Python编程语言的信息图，包含4个核心特点：语法简洁、应用广泛、生态丰富、跨平台"
```

**输出**：
```
✅ 信息图已生成！

📁 文件位置：
- PNG图片：infographic/python-infographic.png
- 配置文件：infographic/python-infographic.json

💡 使用建议：
- 适合用于技术博客、知识分享
- 推荐尺寸：1920x1080（横版）
```

---

### 示例2：生成小红书爆款信息图

**需求**：为AI工具推荐生成小红书风格信息图

**输入**：
```
生成小红书爆款信息图，主题是"5个AI工具提升工作效率10倍"，马卡龙风格
每个工具包含：名称、用途、效率提升数据
工具列表：
1. ChatGPT - 文案创作 - 效率提升300%
2. Midjourney - 图片生成 - 效率提升500%
3. Notion AI - 文档整理 - 效率提升200%
4. GitHub Copilot - 代码编写 - 效率提升400%
5. Runway - 视频制作 - 效率提升600%
```

**命令**：
```bash
node skill-render.js "生成小红书爆款信息图，主题是5个AI工具提升工作效率10倍，马卡龙风格"
```

**输出**：
```
✅ 小红书信息图已生成！

📁 文件位置：
- PNG图片：infographic/ai-tools-xiaohongshu.png
- 配置文件：infographic/ai-tools-xiaohongshu.json

💡 小红书发布建议：
- 最佳发布时间：晚上8-10点
- 推荐标签：#AI工具 #效率提升 #职场必备
- 建议添加互动引导："收藏点赞，分享更多干货！"
```

---

### 示例3：生成科研图表

**需求**：为论文生成算法性能对比图表

**输入**：
```
制作论文用的算法性能对比图表，科研风格
对比3种排序算法的性能：
- 快速排序：12.5ms
- 归并排序：15.2ms
- 堆排序：18.3ms
测试条件：n=10000，100次取平均，Intel i7-12700K
```

**命令**：
```bash
node skill-render.js "制作算法性能对比图表，科研风格，对比快速排序、归并排序、堆排序的执行时间"
```

**输出**：
```
✅ 科研图表已生成！

📁 文件位置：
- PNG图片：infographic/algorithm-comparison.png
- 配置文件：infographic/algorithm-comparison.json

💡 学术使用建议：
- 分辨率：300dpi（适合论文发表）
- 格式：PNG或TIFF
- 引用：请在论文中标注数据来源
```

---

### 示例4：生成流程说明信息图

**需求**：为Git工作流程生成信息图

**输入**：
```
创建Git工作流程信息图，包含5个步骤：
1. 克隆仓库 - 使用git clone克隆远程仓库
2. 创建分支 - 创建新的功能分支进行开发
3. 提交代码 - 完成开发后提交到本地仓库
4. 推送分支 - 推送分支到远程仓库
5. 创建PR - 创建Pull Request进行代码审查
每个步骤要有关键点提示
```

**命令**：
```bash
node skill-render.js "创建Git工作流程信息图，包含克隆仓库、创建分支、提交代码、推送分支、创建PR 5个步骤"
```

**输出**：
```
✅ 流程说明信息图已生成！

📁 文件位置：
- PNG图片：infographic/git-workflow.png
- 配置文件：infographic/git-workflow.json

💡 使用建议：
- 适合用于团队培训、文档说明
- 推荐用于新人入职指引
```

---

### 示例5：生成对比分析信息图

**需求**：对比Python和JavaScript编程语言

**输入**：
```
对比Python和JavaScript编程语言
从以下4个维度对比：
- 应用领域
- 学习难度
- 运行速度
- 生态系统

Python：AI/数据分析、简单、较慢、科学计算生态丰富
JavaScript：Web开发、中等、快、Web开发生态丰富
```

**命令**：
```bash
node skill-render.js "对比Python和JavaScript编程语言，从应用领域、学习难度、运行速度、生态系统4个维度分析"
```

**输出**：
```
✅ 对比分析信息图已生成！

📁 文件位置：
- PNG图片：infographic/python-vs-javascript.png
- 配置文件：infographic/python-vs-javascript.json

💡 使用建议：
- 适合用于技术选型决策
- 推荐用于技术分享
```

---

## 指定模板和风格

### 手动选择模板

```bash
# 指定知识科普模板
node skill-render.js "生成Python信息图" --template knowledge

# 指定对比分析模板
node skill-render.js "对比Python和JavaScript" --template comparison

# 指定小红书爆款模板
node skill-render.js "生成AI工具推荐" --template xiaohongshu

# 指定科研图表模板
node skill-render.js "生成性能对比图表" --template scientific
```

### 手动选择风格

```bash
# 极简风格
node skill-render.js "生成Python信息图" --style minimal

# 马卡龙风格
node skill-render.js "生成小红书内容" --style macaroon

# 赛博朋克风格
node skill-render.js "生成AI趋势分析" --style cyberpunk

# 商务风格
node skill-render.js "生成市场分析" --style business
```

### 同时指定模板和风格

```bash
node skill-render.js "生成Python信息图" --template knowledge --style minimal
```

---

## 指定尺寸

### 使用预设尺寸

```bash
# 横版（16:9）
node skill-render.js "生成信息图" --aspect landscape
# 输出：1920x1080

# 竖版（9:16）
node skill-render.js "生成小红书内容" --aspect portrait
# 输出：1080x1920

# 方形（1:1）
node skill-render.js "生成社交媒体内容" --aspect square
# 输出：1080x1080
```

### 自定义尺寸

```bash
# 指定宽度和高度
node skill-render.js "生成信息图" --width 2560 --height 1440

# 指定宽高比
node skill-render.js "生成信息图" --aspect 3:4
node skill-render.js "生成信息图" --aspect 21:9
```

---

## 获取JSON配置

### 保存配置文件

默认情况下，skill会同时生成PNG和JSON配置文件。

**查看配置文件**：
```bash
cat infographic/python-infographic.json
```

**配置文件示例**：
```json
{
  "version": "1.0",
  "metadata": {
    "title": "Python编程语言",
    "template": "knowledge",
    "style": "minimal",
    "created_at": "2024-01-01T00:00:00Z",
    "dimensions": {
      "width": 1920,
      "height": 1080
    }
  },
  "content": {
    "title": {
      "text": "Python编程语言",
      "subtitle": "简洁优雅的编程语言"
    },
    "sections": [
      {
        "id": "point-1",
        "type": "key-point",
        "title": "语法简洁",
        "content": "易学易用，代码可读性强",
        "icon": "check-circle"
      }
    ]
  }
}
```

### 使用现有配置文件重新渲染

```bash
# 修改JSON配置文件后重新渲染
node skill-render.js --config infographic/python-infographic.json --output output/python-v2.png
```

### 只生成配置文件

```bash
# 不生成PNG，只生成JSON配置
node skill-render.js "生成信息图" --config-only --output config.json
```

---

## 输出位置管理

### 默认输出位置

```
infographic/{topic-slug}/
├── {topic-slug}.png
└── {topic-slug}.json
```

### 自定义输出路径

```bash
# 指定输出路径
node skill-render.js "生成信息图" --output output/my-infographic.png

# 指定输出目录
node skill-render.js "生成信息图" --output-dir ./output
```

---

## 常见使用场景

### 场景1：技术博客配图

**需求**：为技术博客文章生成配图

```bash
node skill-render.js "生成Docker容器化技术介绍信息图，包含镜像、容器、仓库3个核心概念" --template knowledge --style minimal
```

**输出**：横版信息图（1920x1080），适合博客文章

---

### 场景2：小红书内容创作

**需求**：创建小红书爆款内容

```bash
node skill-render.js "生成10个ChatGPT使用技巧，小红书爆款风格，马卡龙配色" --template xiaohongshu --style macaroon --aspect portrait
```

**输出**：竖版信息图（1080x1920），适合小红书平台

---

### 场景3：学术论文配图

**需求**：为论文生成数据对比图表

```bash
node skill-render.js "生成实验结果对比图，对比3种算法的准确率，科研风格" --template scientific --style minimal --width 1200 --height 800
```

**输出**：符合学术规范的图表，适合论文发表

---

### 场景4：产品文档配图

**需求**：为产品文档生成流程说明

```bash
node skill-render.js "生成用户注册流程图，包含5个步骤：填写信息、验证邮箱、设置密码、完善资料、注册成功" --template process --style flat
```

**输出**：清晰的流程说明图，适合产品文档

---

### 场景5：市场分析报告

**需求**：生成市场对比分析图

```bash
node skill-render.js "对比竞品A、竞品B、我们的产品，从功能、价格、用户体验3个维度分析" --template comparison --style business
```

**输出**：专业的对比分析图，适合商业报告

---

## 下一步

- 查看[模板详细说明](../TEMPLATES.md)了解每个模板的特点
- 查看[高级用法](../docs/ADVANCED_USAGE.md)学习批量生成、API调用等高级功能
- 查看[技术细节](../docs/TECHNICAL_DETAILS.md)了解JSON schema和渲染引擎