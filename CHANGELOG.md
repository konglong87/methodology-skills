# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.11.9] - 2026-03-20

### 🔧 Maintenance

**强制刷新插件缓存以加载 goal-oriented skill**

修复了 goal-oriented skill 未被正确加载的问题：

**问题描述**：
- goal-oriented skill 虽然包含 SKILL.md 文件，但未被 Claude 识别
- 系统提示显示 "Error reading goal-oriented skill"
- 插件缓存版本（1.11.7）与实际版本（1.11.8）不一致
- 缓存中的 goal-oriented 目录缺少 SKILL.md 文件

**根本原因**：
- Claude Code 使用缓存的旧版本插件（1.11.7）
- 旧缓存不包含 goal-oriented 的 SKILL.md 文件
- 版本号未更新导致缓存未刷新

**修复方案**：
- 版本号从 1.11.8 更新到 1.11.9，强制 Claude Code 刷新插件缓存
- 更新位置：
  - `plugin.json`
  - `.claude-plugin/marketplace.json`
  - `README.md` 版本徽章
  - `CHANGELOG.md` 变更记录

**影响范围**：
- `plugin.json` - version: 1.11.9
- `.claude-plugin/marketplace.json` - version: 1.11.9
- `README.md` - 版本徽章更新

**验证方法**：
- 重启 Claude Code 或重新加载插件
- 检查 goal-oriented skill 是否出现在可用技能列表中
- 测试目标追踪功能是否正常工作

## [1.11.8] - 2026-03-20

### 🐛 Bug Fixes

**Fortune-Teller 排盘准确性修复**

修复了 fortune-teller skill 中两个关键 bug，导致八字排盘不准确的问题：

#### 时柱计算错误修复

**问题描述**：
- 农历2002年十月初六凌晨4点（寅时），时柱错误显示为"庚子"而不是"壬寅"
- 所有时辰的时柱计算都不准确

**根本原因**：
- `bazi-calculator.js` 使用 `lunar.Solar.fromDate(birthDate)` 创建 Date 对象
- Date 对象不包含时间信息，导致 `lunar-javascript` 库无法正确计算时柱
- 时柱总是默认为"庚子"（子时）

**修复方案**：
```javascript
// 修复前
const solarDate = lunar.Solar.fromDate(birthDate);

// 修复后 - 使用 fromYmdHms 明确包含时间参数
const solarDate = lunar.Solar.fromYmdHms(
  birthDate.getFullYear(),
  birthDate.getMonth() + 1,
  birthDate.getDate(),
  hour,
  0,
  0
);
```

**影响范围**：`skills/fortune-teller/lib/bazi-calculator.js`

#### 闰月处理缺陷修复

**问题描述**：
- 无法正确识别和转换闰月日期
- 阳历转农历时，闰月信息丢失（硬编码 `isLeapMonth: false`）
- 农历转阳历时，闰月标记不起作用

**根本原因**：
1. `input-handler.js` 的 `solarToLunar` 方法硬编码 `isLeapMonth: false`
2. 不了解 `lunar-javascript` 库的正确闰月表示方法（负数月份）
3. 主流程中未传递 `isLeapMonth` 参数

**修复方案**：

1. **阳历转农历**（`input-handler.js:22-37`）：
```javascript
// 识别 lunar-javascript 的闰月表示（负数月份）
const month = lunarDate.getMonth();
const isLeapMonth = month < 0;
return {
  year: lunarDate.getYear(),
  month: isLeapMonth ? Math.abs(month) : month,
  day: lunarDate.getDay(),
  isLeapMonth: isLeapMonth  // 不再硬编码 false
};
```

2. **农历转阳历**（`input-handler.js:8-20`）：
```javascript
// 使用负数月份表示闰月（lunar-javascript 库的正确用法）
const month = isLeapMonth ? -lunarMonth : lunarMonth;
const lunarDate = lunar.Lunar.fromYmd(lunarYear, month, lunarDay);
```

3. **主流程参数传递**（`index.js:260-268`）：
```javascript
// 传递闰月标记
const isLeapMonth = birthDate.isLeapMonth || false;
solarDate = this.inputHandler.lunarToSolar(
  birthDate.year,
  birthDate.month,
  birthDate.day,
  isLeapMonth
);
```

**影响范围**：
- `skills/fortune-teller/lib/input-handler.js`
- `skills/fortune-teller/index.js`

**关键发现**：
- `lunar-javascript` 库使用**负数月份**表示闰月（如闰四月 = -4）
- `Lunar.fromYmd(year, month, day, isLeapMonth)` 的第4个参数无效
- 正确方法：`Lunar.fromYmd(year, -month, day)` 用负数表示闰月

### ✅ Testing

**测试验证**：

创建了完整的测试套件验证修复：

1. **时柱测试**（`test/bazi-calculator-direct-test.js`）：
   - 验证时柱计算准确性
   - 验证五行统计正确性

2. **闰月测试**（`test/leap-month-final-verification.js`）：
   - 测试2001-2028年所有闰月年份
   - 验证农历↔阳历双向转换一致性
   - 验证端到端八字排盘准确性

3. **综合测试**（`test/comprehensive-test-2026-03-20.js`）：
   - 覆盖闰月和非闰月场景
   - 覆盖所有12时辰

**测试结果**：
- ✅ 原始问题验证：农历2002年十月初六凌晨4点 → 八字：壬午 辛亥 壬午 壬寅（时柱已修复）
- ✅ 闰月识别：2001-2028年所有闰月正确识别和转换
- ✅ 双向转换一致性：农历↔阳历完全可逆
- ✅ 所有测试通过（13/13）

### 📝 Documentation

**更新文件**：
- `plugin.json` - 版本号 1.11.7 → 1.11.8
- `.claude-plugin/marketplace.json` - 版本号 1.11.7 → 1.11.8
- `README.md` - 版本徽章更新
- `CHANGELOG.md` - 新增 v1.11.8 版本记录

### 🔧 Technical Details

**修改文件**：
1. `skills/fortune-teller/lib/bazi-calculator.js` - 时柱计算修复
2. `skills/fortune-teller/lib/input-handler.js` - 闰月识别和转换修复
3. `skills/fortune-teller/index.js` - 闰月参数传递修复

**新增测试**：
- `test/lunar-conversion-test-2026-03-20.js` - 农历转换测试
- `test/time-handling-test-2026-03-20.js` - 时辰处理测试
- `test/fix-validation-test-2026-03-20.js` - 修复验证测试
- `test/bazi-calculator-direct-test.js` - 直接模块测试
- `test/comprehensive-test-2026-03-20.js` - 综合测试
- `test/leap-month-bug-test.js` - 闰月bug测试
- `test/leap-month-e2e-test.js` - 闰月端到端测试
- `test/leap-month-final-verification.js` - 最终验证测试

## [1.11.6] - 2026-03-18

### 🎯 Goal-Oriented 重大升级 - 刚性要求与持续触发

#### ✨ Added

**核心特性**:
- **刚性要求（Rigid Requirement）** - 每个用户请求都必须触发目标追踪
- **持续触发机制** - 无论是否已创建目标，每个用户消息都会触发 goal-oriented 检查
- **自定义标签** - `<恐龙专属指令>` 替代默认的 `<EXTREMELY_IMPORTANT>` 标签
- **完整的 Iron Law 规则** - 明确规定任务开始、执行中、完成时的强制动作

**Iron Law 完整规则**:

1. **核心原则：持续触发**
   - 每个用户消息都必须触发 goal-oriented 检查
   - 根据当前状态执行相应动作：无目标→创建，有目标→调整/验证

2. **任务开始时（强制创建目标）**
   - 检测标准：多步骤任务（> 2步 或 > 1分钟）
   - 当前无 pending 目标
   - 强制动作：`goal-tracker.py create`
   - 无需询问用户，立即执行

3. **任务执行中（强制调整目标）**
   - 已存在 pending 目标
   - 用户补充需求细节或修改需求
   - 强制动作：`goal-tracker.py adjust`
   - 用户说"重新实现"时，智能判断是否创建新目标

4. **任务完成时（强制验证目标）**
   - AI 认为"完成了"、"做好了"、"实现了"
   - 强制动作：`goal-tracker.py verify`
   - 验证失败必须继续执行，不得声称"基本完成"

#### 🔧 Changed

**SKILL.md 更新**:
- `description`: 改为 `"MUST use for ANY user request. This is a rigid requirement..."`
- 适用场景：`执行长期任务（周期 > 1分钟 或者 步骤>2）`
- 新增"核心原则：持续触发"章节
- 明确"已存在 pending 目标"的处理规则

**SessionStart Hook 更新**:
- 自定义标签：`<恐龙专属指令>`
- 自定义标题：`🎯 目标追踪系统已激活`
- 动态读取 SKILL.md 内容，无需修改 hooks 代码

**README.md 更新**:
- 版本号：v1.9.0 → v1.11.6
- 目标导向章节：完整说明刚性要求和 Iron Law
- 安装指南：新增 OpenCode 和 Cursor 一键安装脚本

**CHANGELOG.md 更新**:
- 新增 v1.11.6 版本记录

#### 🐛 Fixed

**问题修复**:
- 修复"后续消息不再触发 goal-oriented"的问题
- 修复"用户重新开始任务时不触发"的问题
- 修复"AI 问问题后才执行 goal-tracker"的问题（应该立即执行）

**根本原因分析**:
- 原因 1：description 与 Iron Law 不匹配
- 原因 2：缺少"持续触发"规则
- 原因 3：缺少"已存在目标"的处理规则

**解决方案**:
- 明确"刚性要求"：每个用户请求都必须触发
- 新增"核心原则：持续触发"
- 明确"已存在 pending 目标"时的处理流程

#### 📚 Documentation

**新增文档**:
- Iron Law 完整规则说明
- 持续触发机制说明
- OpenCode 和 Cursor 一键安装脚本

**更新文档**:
- README.md 目标导向章节
- 安装指南（OpenCode/Cursor）

#### 🔗 Platform Support

**适配平台**:
- ✅ Claude Code - SessionStart Hook 自动注入
- ✅ OpenCode - 全局 SKILL.md 安装（一键脚本）
- ✅ Cursor - 全局 rules 安装（一键脚本）

## [1.9.0] - 2026-03-17

### ✨ Added

#### FortuneTeller 算命系统 v2.3.0 - 一键生成版

**自动生成PNG信息图**:
- 自动调用 infographic-generator skill 生成命盘可视化
- 横版PNG（1920x1080）：适合博客、报告
- 竖版PNG（1080x1920）：适合手机分享、小红书
- 一键生成，无需用户中途干预

**中文数字日期解析**:
- 支持农历中文数字日期输入
- 支持格式：`农历十月初六`、`正月初一`、`腊月廿三` 等
- 自动转换为标准数字格式进行计算

**完全自动化流程**:
- 用户只需一句话输入（如："张三 男 2002年农历十月初六 凌晨4点 河北"）
- 自动生成所有文件：JSON数据 + Markdown框架 + AI提示词 + PNG信息图
- 全程无需用户干预

**文件输出优化**:
- 所有输出文件统一保存在 `output/` 目录
- 文件命名规范：
  - `[姓名]_命盘数据.json` - JSON命盘数据
  - `[姓名]_分析框架.md` - Markdown分析框架
  - `[姓名]_命盘信息图_横版.png` - 横版PNG
  - `[姓名]_命盘信息图_竖版.png` - 竖版PNG

**兼容性保证**:
- 不修改 infographic-generator skill 的任何接口
- 采用"先生成后复制"策略，确保微信文章等其他功能不受影响
- infographic-generator 在默认位置生成，然后复制到 fortune-teller 的 output 目录

### 🔧 Changed

**版本号更新**:
- methodology-skills: v1.8.0 → v1.9.0
- fortune-teller: v2.2.0 → v2.3.0

**文档更新**:
- README.md: 版本徽章更新到 v1.9.0
- CHANGELOG.md: 添加 v1.9.0 详细更新记录
- SKILL.md: 更新版本说明到 v2.3.0

### 🎯 Benefits

- **用户体验提升**: 一键生成文字+图片，无需分步操作
- **输入灵活性**: 支持中文数字日期，更符合农历习惯
- **输出完整性**: 自动生成多种格式，满足不同场景需求
- **兼容性保障**: 不影响其他 skills 的正常使用

### 📝 Technical Details

- 更新 `simple-fortune.js` 的 `generateInfographic()` 方法，实现自动PNG生成
- 更新 `simple-fortune.js` 的 `parseInput()` 方法，支持中文数字日期解析
- 添加中文数字映射表（月份：正/一/二/.../腊，日期：初一/初二/.../三十）
- 使用文件复制策略，确保输出目录统一

## [1.8.0] - 2026-03-16

### ✨ Added

#### FortuneTeller 算命系统 v2.2.0 - 重大改进版

**文件输出规范**:
- 严格的test/output/backup三目录分离
- `test/` 目录：测试输出，文件自动添加时间戳命名（如：test_张三_2026-03-16T07-52-54_命盘数据.json）
- `output/` 目录：正式输出，永久保留（如：张三_命盘数据.json）
- `backup/` 目录：备份目录，定期清理旧文件
- 自动创建目录（如果不存在）
- 支持 `--test` 参数切换测试模式

**智能输入提取**:
- 支持自然语言任意顺序输入，不依赖固定顺序
- 40个主要城市优先识别（北京、上海、广州、深圳、天津、重庆、成都、杭州、南京、武汉、西安、苏州、长沙、郑州、青岛、厦门、宁波、福州、济南、大连、沈阳、哈尔滨、长春、石家庄、太原、合肥、南昌、昆明、贵阳、南宁、海口、兰州、银川、西宁、乌鲁木齐、呼和浩特、拉萨、香港、澳门、台北）
- 智能区分姓名和地点
- 友好的错误提示，清晰列出缺失字段

**提示词模板优化**:
- `detailed-analysis.md`：增加十神关系深度分析、五行流通分析、格局喜忌分析
- `dayun-deep-dive.md`：增加事件概率评估（高/中/低）、转折点预测
- `liunian-events.md`：增加时间节点预测（春、夏、秋、冬四季）、四维应对策略
- 质量标准：典籍引用至少10处，推理过程至少20处

**流年预测细节增强**:
- 事件概率评估（高/中/低）
- 时间节点预测（春季寅卯辰月、夏季巳午未月、秋季申酉戌月、冬季亥子丑月）
- 四维应对策略（把握机遇、规避风险、调整方向、心态调整）

### 🔧 Changed

**所有必填项无默认值**:
- 姓名、性别、出生年份、月份、日期、时辰、地点全部必填
- 缺少任何信息都会清晰提示并退出
- 不再使用默认值（之前：时间默认12点，地点默认北京）
- 确保数据准确性，避免误导用户

**版本号更新**:
- methodology-skills: v1.7.2 → v1.8.0
- fortune-teller: v2.1.0 → v2.2.0

**文档更新**:
- README.md：更新版本徽章、算命系统功能介绍、用户输入要求、添加更新日志章节
- CHANGELOG.md：添加v1.8.0详细更新记录

### 🐛 Fixed

- 修复输入顺序导致姓名和地点识别错误的问题
- 修复缺失必填信息时使用默认值的问题
- 优化错误提示信息，更清晰地指出缺失字段

### 🎯 Benefits

- **数据准确性提升**：所有信息必填，无默认值，确保命理分析基于准确的出生信息
- **用户体验改善**：智能输入提取，支持自然语言任意顺序，更友好
- **分析质量提升**：提示词模板优化，推理更严谨，典籍支撑更充分
- **预测细节增强**：流年预测包含概率评估、时间节点、应对策略，更实用
- **文件管理规范**：test/output/backup三目录分离，清晰明了

### 📝 Technical Details

- 添加常见城市列表（40个主要城市）
- 改进输入解析逻辑，支持任意顺序
- 更新 `simple-fortune.js` 的 `parseInput()` 方法
- 更新 `simple-fortune.js` 的 `showUsage()` 方法
- 更新 `SKILL.md` 的用户输入要求说明

## [1.7.1] - 2026-03-15

### ✨ Added

#### 算命系统
- **四大派系融合**: 新增 fortune-teller skill，融合紫微斗数、生辰八字、盲派、南北派四大派系
  - 紫微斗数: 十四主星、四化飞星、十二宫位分析
  - 生辰八字: 干支五行、用神喜忌、大运流年推算
  - 盲派: 调候+流通+格局三大核心分析
  - 南北派: 独特用神法、命宫归宫、纳音取象
- **5轮验证机制**: 确保命理结论的可靠性
- **时代背景贯穿**: 大运流年分析包含时代背景（1960-2035）
- **交叉验证**: 四大派系结论相互印证
- **真太阳时计算**: 根据出生地经度精确计算
- **完整分析报告**: 9个章节的详细命理分析
  - 基础信息
  - 紫微斗数分析
  - 八字命理分析
  - 盲派分析
  - 南北派分析
  - 综合交叉验证
  - 时代背景分析
  - 人生建议（需要LLM分析）
  - 免责声明

### 🔧 Changed

- **plugin.json**:
  - 版本号从 1.7.0 升级到 1.7.1
  - 更新 description，添加算命系统说明
  - 新增 keywords: fortune-teller, 算命, 八字算命, 紫微斗数, 命理分析, 生辰八字, 盲派命理, 南北派, 四柱八字, 命盘, 命宫, 五行分析, 大运流年, 用神喜忌
- **.claude-plugin/marketplace.json**:
  - 版本号从 1.7.0 升级到 1.7.1
  - 更新 description，添加算命系统说明
- **README.md**:
  - 版本徽章从 1.6.0 更新到 1.7.1
  - 添加完整的算命系统介绍章节
  - 包含核心功能、四大派系、用户输入要求、输出内容、触发方式、示例、技术特性等详细说明

### 🎯 Benefits

- **综合命理分析**: 融合四大派系，提供更全面的命理分析
- **交叉验证**: 多派系结论相互印证，提高可靠性
- **时代背景**: 结合历史背景分析大运流年，更贴近现实
- **完整报告**: 9个章节的详细分析，包含人生建议
- **精确计算**: 支持真太阳时计算，提高时辰准确性
- **免责声明**: 明确说明仅供娱乐，避免宿命论

### 📚 Documentation

- 新增 fortune-teller skill 完整文档
- 添加四大派系详细说明
- 添加用户输入要求和示例
- 添加输出内容结构说明
- 添加技术特性和准确率说明

## [1.6.0] - 2026-03-15

### ✨ Added

#### 信息图生成器重大功能增强
- **智能标题生成**: 修复标题默认为"信息图"的bug，智能提取有意义的标题和副标题
  - `generateSmartTitle()`: 根据内容自动生成合适的标题
  - `generateSmartSubtitle()`: 智能生成副标题，识别成长路径、方法论、技巧等类型
  - 效果对比：`"信息图"` → `"AI成长路径: 从新手到专家的4步进阶路线"`
- **横竖双版输出**: 默认同时生成横版和竖版两个版本
  - `{name}-landscape.png` (横版 1920x1080) - 适合桌面展示
  - `{name}-portrait.png` (竖版 1080x1920) - 适合手机、小红书
  - 不同平台使用不同版本，最大化适配性

#### 微信公众号文章生成器优化
- **Exa AI 强制优先**: 提升联网搜索优先级策略
  - Exa AI MCP 从"推荐"升级为"强制优先"
  - 添加重要规则：只要检测到Exa AI必须优先使用
  - Claude WebSearch 仅在 Exa AI 不可用时使用
  - 确保最高质量的搜索结果
- **搜索结果详细记录**: 增强 `research.md` 输出
  - 搜索主题与来源详细记录
  - 搜索工具优先级说明
  - 搜索状态追踪和结果分析

### 🔧 Changed

- **infographic-generator/skill-render.js**:
  - 重构渲染流程，支持同时生成横竖版
  - 文件命名规则优化：`-landscape` 和 `-portrait` 后缀
  - 去除中途确认操作，实现真正的一键生成
- **infographic-generator/assets/ai-render.js**:
  - 新增智能标题和副标题生成函数
  - 修复内容要点提取逻辑
  - 改进主题识别和匹配算法
- **wechat-article-writer/SKILL.md**:
  - 更新联网搜索优先级策略文档
  - 添加 Exa AI 强制优先说明
- **README.md**:
  - 更新联网搜索优先级说明
  - 强调 Exa AI 的优先地位
  - 更新版本徽章到 1.6.0
- **文档标准化**:
  - 统一搜索结果记录格式
  - 增强 research.md 结构化输出

### 🐛 Fixed

- **标题生成bug**: 修复信息图标题默认为"信息图"且副标题为"信息图的核心要点"的问题
- **文件路径处理**: 修复竖版生成时文件路径错误的问题
- **内容解析**: 改进用户输入的内容解析逻辑，准确性大幅提升

### ⚡ Performance

- **渲染效率优化**: 并行处理横竖版生成，整体耗时基本不变
- **智能缓存**: 改进配置生成缓存机制

### 📚 Documentation

- 更新所有关于联网搜索优先级的文档
- 添加双版输出使用指南
- 完善智能标题生成说明
- 更新版本发布说明

### 🎯 Benefits

#### 信息图生成器优化效果
- **用户体验提升**: 从需要中途确认到真正的一键生成
- **标题智能**: 自动生成有意义的标题，告别默认模板
- **双版适配**: 同时获得横竖版，适应不同发布平台
- **内容更准确**: 更好的内容解析和要点提取

#### 文章生成器优化效果
- **搜索质量**: Exa AI 的 AI 驱动搜索质量远超传统搜索
- **结果可信**: 强制优先使用最优质的搜索结果
- **文档完整**: 详细的搜索记录便于追溯和分析

## [1.5.0] - 2026-03-15

### ✨ Added

#### 微信公众号文章多版本输出
- **多版本生成**: 自动生成 4 个文章版本，完美兼容微信公众号
  - `article.md` - 完整版（Markdown，5000字）
  - `article-1000.md` - 精简版（Markdown，1000字）
  - `article-plain.txt` - 完整版纯文本（微信专用）
  - `article-1000-plain.txt` - 精简版纯文本（微信专用）
- **Markdown 自动移除**: 纯文本版本自动移除所有 Markdown 格式
  - 移除标题标记 `#` → 纯文本
  - 移除粗体 `**text**` → 纯文本
  - 移除列表标记 `-` → 纯文本
  - 移除链接 `[text](url)` → 只保留文字
  - 保留 emoji 表情（微信支持）
- **直接复制粘贴**: 纯文本版本可直接复制到微信公众号编辑器，无需调整格式

### 🔧 Changed

- **wechat-article-writer SKILL.md**: 新增 Step 4.5（Generate Article Variants）
- **README.md**: 更新核心功能说明，添加多版本输出文档
- **版本号**: 从 1.4.1 升级到 1.5.0

### 📚 Documentation

- 添加 Step 4.5 详细说明，包括 3 个文章变体的生成流程
- 更新输出目录结构，展示所有 4 个文章版本
- 添加微信发布指南，说明如何使用纯文本版本

### 🎯 Benefits

- **微信完美兼容**: 解决 Markdown 在微信公众号不显示的问题
- **多种字数选择**: 5000字完整版 + 1000字精简版，满足不同场景
- **开箱即用**: 无需手动转换格式，直接复制粘贴
- **保留原有功能**: Markdown 版本依然可用于博客、知识库等平台

## [1.4.1] - 2026-03-14

### 📝 Documentation

#### 文档同步更新
- **README.md**: 添加 Exa AI 配置教程和使用示例
- **plugin.json**: 新增关键词 (exa-ai, web-search, mcp, ai-content-creation)
- **wechat-article-writer SKILL.md**: 重写联网搜索章节，详细说明四层优先级搜索机制
- **CHANGELOG.md**: 创建完整的更新日志文档

#### 配置指南优化
- 添加快速开始章节，包含 Exa AI 配置步骤
- 添加联网搜索优先级说明 (Exa AI → WebSearch → 工具内置 → 降级)
- 添加完整的使用示例输出

### 🔧 Changed

- **版本号**: 从 1.4.0 升级到 1.4.1 (小版本迭代)

## [1.4.0] - 2026-03-14

### ✨ Added

#### Exa AI 联网搜索集成
- **高质量搜索**: 集成 Exa AI MCP server，提供 AI 驱动的高质量联网搜索
- **智能降级**: 自动检测联网能力，按优先级选择最优搜索方案
- **跨平台支持**: Claude Code、Cursor、OpenCode 等所有工具均可使用
- **配置简单**: 一行命令即可配置 `claude mcp add exa-search`

#### 微信公众号文章生成器增强
- **自动联网调研**: 使用 Exa AI 自动搜索最新信息，确保内容时效性
- **真实数据支持**: 文章内容基于真实搜索结果，提升可信度
- **智能信息融合**: AI 自动融合搜索结果到文章中
- **完整工作流**: 从调研 → 写作 → 信息图生成 → 发布的全流程自动化

#### 信息图生成器优化
- **动态风格系统**: 三层优先级（用户指定 > LLM选择 > 兜底风格）
- **8种视觉风格**: 科技风、可爱风、手绘风、简约风、教学风、泥塑风、漫画风、Bento风
- **智能布局**: 自动推荐横屏/竖屏布局
- **多语言支持**: 支持中英文风格指定

### 🔧 Changed

- **README.md**: 添加 Exa AI 配置说明和使用指南
- **plugin.json**: 新增 keywords (wechat-article, infographic, exa-ai, web-search, mcp)
- **版本号**: 从 1.3.1 升级到 1.4.0

### 📚 Documentation

- 添加 Exa AI 配置教程
- 添加联网搜索使用说明
- 添加完整的使用示例
- 添加 MCP 配置文档

### 🎯 Skills Updated

- **wechat-article-writer**: 新增 Exa AI 搜索集成，支持自动联网调研
- **infographic-generator**: 优化风格选择系统，新增动态推荐

## [1.3.1] - 2026-03-13

### Added
- Added wechat-article-writer skill for automated WeChat article creation
- Added infographic-generator skill with 8 visual styles
- Added intelligent style selection system

### Changed
- Updated README with new skills documentation
- Enhanced plugin metadata

## [1.3.0] - 2026-03-11

### Added
- Added MVP First methodology skill
- Added Skill Manager for managing and discovering skills
- Added Prompt Enhancer for clarifying vague requests

### Changed
- Improved skill triggering mechanism
- Enhanced documentation structure

## [1.2.0] - 2026-03-08

### Added
- Added DDD Strategic Design skill
- Added DDD Tactical Design skill
- Added comprehensive DDD examples

### Changed
- Updated documentation with DDD concepts
- Improved skill organization

## [1.1.0] - 2026-03-05

### Added
- Added SWOT Analysis skill
- Added strategic planning tools
- Added decision-making frameworks

### Changed
- Enhanced README with more examples
- Improved skill descriptions

## [1.0.0] - 2026-03-01

### Added
- Initial release
- First Principles skill
- Goal-Oriented skill
- PDCA Cycle skill
- Basic documentation and examples

### Features
- Semi-automatic skill triggering
- Cross-platform support (Claude Code, Cursor, OpenCode)
- Markdown-based skill files
- Comprehensive documentation

---

## Release Notes

### Version 1.4.0 - Major Update

This release brings **intelligent web research capabilities** to the methodology-skills plugin, enabling AI to search and incorporate real-time information into content creation.

**Key Highlights**:

1. **Exa AI Integration** - High-quality AI-powered web search
2. **Enhanced Article Writer** - Automatic research integration
3. **Improved Infographic Generator** - Dynamic style selection

**Breaking Changes**: None - Fully backward compatible

**Migration Guide**: No migration needed. To enable Exa AI search:
```bash
claude mcp add exa-search "https://api.exa.ai/mcp?key=YOUR_API_KEY" -t http
```

---

[Unreleased]: https://github.com/konglong87/methodology-skills/compare/v1.4.0...HEAD
[1.4.0]: https://github.com/konglong87/methodology-skills/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/konglong87/methodology-skills/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/konglong87/methodology-skills/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/konglong87/methodology-skills/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/konglong87/methodology-skills/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/konglong87/methodology-skills/releases/tag/v1.0.0