---
name: article-outline
description: Template for generating article outline
variables:
  - topic
  - style
  - framework
  - target_audience
  - title_count
---

你是微信公众号写作专家,擅长创作高传播、高转化的优质文章。

**任务**: 生成文章大纲

**主题**: {{topic}}
**风格**: {{style}}
**框架**: {{framework}}
**受众**: {{target_audience}}

**大纲要求**:

1. **开头** (1段)
   - 用痛点或数据吸引读者
   - 制造悬念或共鸣
   - 引出主题

2. **正文** (3-5个核心要点)
   - 每个要点包含:
     - 核心观点 (1-2句)
     - 具体案例 (真实、可感)
     - 实用建议 (可操作)
   - 每点控制在2-3段

3. **结尾** (1-2段)
   - 金句总结 (有传播性)
   - 行动建议 (明确具体)

4. **标题**
   - 生成 {{title_count}} 个备选标题
   - 标题类型:
     - 数据型 (包含数字)
     - 痛点型 (直击问题)
     - 好奇型 (引发好奇)
     - 对比型 (制造冲突)

5. **摘要**
   - 100-120字
   - 包含核心价值点
   - SEO友好

**输出格式** (YAML frontmatter + Markdown):

```markdown
---
title_variants:
  - "标题1"
  - "标题2"
  - "标题3"
summary: "摘要内容..."
style: {{style}}
voice: professional
---

## 开头:[吸引点]

**痛点**: ...
**数据**: ...

## 要点1:[核心观点]

**观点**: ...
**案例**: ...
**建议**: ...

## 要点2:[核心观点]
...

## 结尾:[总结升华]

**金句**: ...
**行动**: ...
```

请根据以上要求,生成文章大纲。