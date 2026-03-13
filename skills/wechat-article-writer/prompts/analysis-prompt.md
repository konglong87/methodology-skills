---
name: analysis-prompt
description: Prompt for analyzing topic
variables:
  - topic: "AI 时代如何写出优质技术文章"
  - style: "notion"
  - title_count: "3"
  - target_audience: "技术开发者和产品经理"
  - analysis_steps:
    - step: "Identify the article type (tutorial/comparison/review/case study) and justify"
    - step: "Extract 3-5 key technical concepts that should be visualized"
    - step: "Suggest 2-3 visual elements (diagrams, charts, tables)"
---
### Task
Analyze the topic and generate a structured analysis for WeChat article.

**Input**: `AI 时代如何写出优质技术文章`

**Output**:
- **文章类型**: Tutorial / Comparison / Review
- **核心观点** (1-3 个)
- **目标受众**: 技术开发者 / 产品经理
- **视觉建议**: 哪些内容适合用图表、表格或思维导图

**Example**:
> Input: "React vs Vue: 3 个核心区别"
> Output:
> **类型**: 对比文章
> **观点**: 1. React 更适合大型应用，Vue 更适合快速开发 2. React 使用 JSX，Vue 使用模板语法 3. React 生态更丰富
> **视觉**: 建议用 **双列对比表** (Left: React | Right: Vue)
 逐行对比性能、学习曲线、组件化等。