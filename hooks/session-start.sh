#!/usr/bin/env bash
# SessionStart hook for methodology-skills plugin

set -euo pipefail

# Determine plugin root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
PLUGIN_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Read goal-oriented skill content for reference
goal_oriented_path="${PLUGIN_ROOT}/skills/goal-oriented/SKILL.md"

# Build the mandatory rules content
cat <<'INNEREOF'
# ⚠️ Goal-Oriented 强制执行规则（Iron Law）

## 自动任务检测（强制触发）

**检测标准**：
- 用户消息包含行动指令（实现、修复、重构、优化、分析、设计、完善、开发等）
- 多步骤需求（需要 2+ 步骤完成）
- 涉及代码编写、文件修改、系统设计

**强制动作**（无需询问用户，立即执行）：
```bash
python skills/goal-oriented/tools/goal-tracker.py create \
  --raw "{用户原始表述}" \
  --smart-specific "{提取的具体目标}" \
  --smart-measurable "{可衡量的成功标准}"
```

**例外情况**（不创建目标）：
- 纯信息查询（"什么是XXX"、"XXX怎么用"）
- 简单问答（是/否问题、知识咨询）
- 用户明确表示"只是问问"、"随便聊聊"

如果对话中途演变成任务，必须补创建目标。

---

## 任务执行中（强制调整）

当用户修改需求时（"算了"、"改成"、"加一个"、"另外还要"），立即执行：
```bash
python skills/goal-oriented/tools/goal-tracker.py adjust \
  --file "{目标文件路径}" \
  --reason "{调整原因}" \
  --new-specific "{新目标}" \
  --new-measurable "{新标准}"
```

---

## 任务完成时（强制验证）

**触发时机**：AI 认为"完成了"、"做好了"、准备提交代码、准备结束会话

**强制动作**：
```bash
python skills/goal-oriented/tools/goal-tracker.py verify \
  --file "{目标文件路径}" \
  --ai-assessment "{AI自评完成情况}"
```

**验证结果处理**：
- ✅ 目标达成 → 可标记完成，准备结束会话
- ❌ 目标未达成 → **必须继续执行缺失部分，不得声称"基本完成"**

---

## 违规行为（不可接受）

- ❌ 执行任务但未创建目标
- ❌ 用户调整需求但未更新目标
- ❌ 自称"完成"但未验证
- ❌ 验证失败但声称"基本完成"

**任何违反上述规则的行为都是不可接受的。**

---

## 工具位置

`skills/goal-oriented/tools/goal-tracker.py`

详细文档请查看：`skills/goal-oriented/SKILL.md`
INNEREOF

# Escape string for JSON embedding
escape_for_json() {
    local s="$1"
    s="${s//\\/\\\\}"
    s="${s//\"/\\\"}"
    s="${s//$'\n'/\\n}"
    s="${s//$'\r'/\\r}"
    s="${s//$'\t'/\\t}"
    printf '%s' "$s"
}

mandatory_rules=$(cat <<'INNEREOF'
# ⚠️ Goal-Oriented 强制执行规则（Iron Law）

## 自动任务检测（强制触发）

**检测标准**：
- 用户消息包含行动指令（实现、修复、重构、优化、分析、设计、完善、开发等）
- 多步骤需求（需要 2+ 步骤完成）
- 涉及代码编写、文件修改、系统设计

**强制动作**（无需询问用户，立即执行）：
```bash
python skills/goal-oriented/tools/goal-tracker.py create \
  --raw "{用户原始表述}" \
  --smart-specific "{提取的具体目标}" \
  --smart-measurable "{可衡量的成功标准}"
```

**例外情况**（不创建目标）：
- 纯信息查询（"什么是XXX"、"XXX怎么用"）
- 简单问答（是/否问题、知识咨询）
- 用户明确表示"只是问问"、"随便聊聊"

如果对话中途演变成任务，必须补创建目标。

---

## 任务执行中（强制调整）

当用户修改需求时（"算了"、"改成"、"加一个"、"另外还要"），立即执行：
```bash
python skills/goal-oriented/tools/goal-tracker.py adjust \
  --file "{目标文件路径}" \
  --reason "{调整原因}" \
  --new-specific "{新目标}" \
  --new-measurable "{新标准}"
```

---

## 任务完成时（强制验证）

**触发时机**：AI 认为"完成了"、"做好了"、准备提交代码、准备结束会话

**强制动作**：
```bash
python skills/goal-oriented/tools/goal-tracker.py verify \
  --file "{目标文件路径}" \
  --ai-assessment "{AI自评完成情况}"
```

**验证结果处理**：
- ✅ 目标达成 → 可标记完成，准备结束会话
- ❌ 目标未达成 → **必须继续执行缺失部分，不得声称"基本完成"**

---

## 违规行为（不可接受）

- ❌ 执行任务但未创建目标
- ❌ 用户调整需求但未更新目标
- ❌ 自称"完成"但未验证
- ❌ 验证失败但声称"基本完成"

**任何违反上述规则的行为都是不可接受的。**

---

## 工具位置

`skills/goal-oriented/tools/goal-tracker.py`

详细文档请查看：`skills/goal-oriented/SKILL.md`
INNEREOF
)

mandatory_rules_escaped=$(escape_for_json "$mandatory_rules")

# Output context injection as JSON
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "<EXTREMELY_IMPORTANT>\n\n${mandatory_rules_escaped}\n\n</EXTREMELY_IMPORTANT>"
  }
}
EOF

exit 0