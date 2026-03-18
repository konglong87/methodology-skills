# Goal Tracker Tool

目标追踪工具,用于自动记录和验证任务目标。

## 功能

- 自动创建目标文件
- 支持目标动态调整
- 强制验证目标达成情况
- 保留完整的历史记录

## 使用方法

### 1. 创建新目标

```bash
python goal-tracker.py create \
  --raw "用户原始表述" \
  --smart-specific "具体目标" \
  --smart-measurable "衡量标准"
```

### 2. 更新里程碑

```bash
python goal-tracker.py update \
  --file "目标文件路径" \
  --milestone "里程碑描述"
```

### 3. 调整目标

```bash
python goal-tracker.py adjust \
  --file "目标文件路径" \
  --reason "调整原因" \
  --new-specific "新目标" \
  --new-measurable "新标准"
```

### 4. 验证目标

```bash
python goal-tracker.py verify \
  --file "目标文件路径" \
  --ai-assessment "AI自评"
```

### 5. 查看所有目标

```bash
python goal-tracker.py list --status pending
```

### 6. 标记完成

```bash
python goal-tracker.py complete \
  --file "目标文件路径" \
  --summary "完成总结"
```

## 目标文件位置

所有目标文件存储在项目根目录的 `memory/goals/` 目录下。

文件命名格式:`YYYY-MM-DD_HHMM_目标关键词.md`

## 依赖

- Python 3.6+
- 无第三方依赖

## 开发信息

- 创建时间:2026-03-18
- 作者:恐龙创新部
