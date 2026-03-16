# FortuneTeller 增强版

> 版本：v2.1.0
> 更新时间：2026-03-16
> 作者：恐龙🐲

## 简介

FortuneTeller 是一个综合命理推算系统，融合紫微斗数、生辰八字、盲派、南北派四大派系，进行交叉验证的综合命理推算。

**增强版特点：**
- 🎯 一句话输入，一步到位
- 🔍 三层验证机制，确保准确性
- 📊 JSON + Markdown 双输出
- 📝 8000-12000字完整报告
- 🤖 AI工具自动完成，无需用户干预

## 快速开始

### 用户输入示例

```
帮我算命，张三 男 2025年3月15日 下午2点 北京
```

**必需信息：**
- 姓名：张三
- 性别：男
- 出生日期：2025年3月15日

**可选信息：**
- 出生时辰：下午2点（默认12点）
- 出生地点：北京（默认北京）

### 输出内容

1. **JSON数据**：`output/张三_命盘数据.json`
   - 四柱八字
   - 五行分析
   - 十神配置
   - 大运流年
   - 验证结果

2. **Markdown框架**：`output/张三_分析框架.md`
   - 命盘概览
   - 分析框架
   - 待AI分析标记

3. **AI提示词**：输出到控制台
   - 完整的分析要求
   - 命盘数据
   - 输出格式说明

4. **最终报告**：由AI工具生成（8000-12000字）
   - 命盘概览
   - 三层验证过程
   - 命理深度分析
   - 大运流年分析
   - 人生指引

## 三层验证机制

### 第1层：计算器基础验证

- 方法：标准算法
- 内容：起运时间、大运排列、流年对应
- 优势：快速、准确、可重复

### 第2层：LLM独立验证

- 方法：AI分析推理
- 内容：计算逻辑检查、特殊情况处理、合理性判断
- 优势：智能、灵活、深入

### 第3层：LLM交叉验证

- 方法：AI交叉检查
- 内容：结果一致性、多派系对比、最终确认
- 优势：多重保障、提高准确性

## 技术架构

```
用户自然语言输入
    ↓
AI工具识别意图 → 触发 fortune-teller skill
    ↓
simple-fortune.js (入口，默认增强模式)
    ↓
enhanced-report-generator.js (核心协调器)
    ↓
├─ validation-engine.js (验证引擎)
│  └─ bazi-calculator.js (八字计算器)
├─ prompts/enhanced/*.md (提示词模板)
└─ 输出：report.json + report.md
    ↓
AI工具读取数据和提示词
    ↓
AI工具自动继续分析
    ↓
输出最终报告（8000-12000字）
```

## 文件结构

```
skills/fortune-teller/
├── lib/
│   ├── validation-engine.js       # 验证引擎
│   ├── bazi-calculator.js         # 八字计算器
│   ├── input-handler.js           # 输入处理
│   ├── ziwei-calculator.js        # 紫微斗数
│   ├── mengpai-calculator.js      # 盲派
│   └── nanbeipai-calculator.js    # 南北派
├── prompts/
│   ├── enhanced/                  # 增强版提示词
│   │   ├── detailed-analysis.md   # 详细分析
│   │   ├── career-advice.md       # 事业建议
│   │   ├── wuxing-reasoning.md    # 五行推理
│   │   ├── dayun-deep-dive.md     # 大运深度分析
│   │   └── liunian-events.md      # 流年事件预测
│   ├── ziwei-analysis.md          # 紫微分析
│   ├── bazi-analysis.md           # 八字分析
│   ├── mengpai-analysis.md        # 盲派分析
│   └── nanbeipai-analysis.md      # 南北派分析
├── enhanced-report-generator.js   # 增强报告生成器
├── simple-fortune.js              # 命令行入口
├── test-enhanced.js               # 测试文件
├── SKILL.md                       # Skill说明
└── README.md                      # 本文件
```

## 开发指南

### 本地测试

```bash
# 进入目录
cd skills/fortune-teller

# 运行测试
node simple-fortune.js "张三 男 2025年3月15日 下午2点 北京"

# 查看输出
ls -lh output/张三_*
cat output/张三_命盘数据.json
cat output/张三_分析框架.md

# 运行单元测试
node test-enhanced.js
```

### 自定义提示词

编辑 `prompts/enhanced/` 目录下的模板文件：

- `detailed-analysis.md` - 详细分析提示词
- `career-advice.md` - 事业建议提示词
- `dayun-deep-dive.md` - 大运深度分析提示词
- `liunian-events.md` - 流年事件预测提示词

## 更新日志

### v2.1.0 (2026-03-16)
- ✅ 新增三层验证机制
- ✅ 新增增强报告生成器
- ✅ 新增大运深度分析
- ✅ 新增流年事件预测
- ✅ 新增五行推理事业建议
- ✅ 一句话输入，一步到位输出

### v2.0.0 (2026-03-15)
- ✅ 设计文档完成
- ✅ 计算引擎层完成
- ✅ 提示词模板层完成

### v1.0.0 (之前版本)
- ✅ 基础八字计算
- ✅ 紫微斗数推算
- ✅ 盲派推算
- ✅ 南北派推算
- ✅ 简化版报告生成

## 贡献指南

欢迎贡献代码和建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: 添加某某功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

作者：恐龙🐲
问题反馈：请在 GitHub Issues 中提出

---

**算命仅供娱乐参考，请勿迷信！**