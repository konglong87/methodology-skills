#!/usr/bin/env bash
# SessionStart hook for methodology-skills plugin

set -euo pipefail

# Determine plugin root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
PLUGIN_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Read goal-oriented SKILL.md content
goal_oriented_path="${PLUGIN_ROOT}/skills/goal-oriented/SKILL.md"
goal_oriented_content=$(cat "$goal_oriented_path" 2>&1 || echo "Error reading goal-oriented skill")

# Escape string for JSON embedding using bash parameter substitution.
# Each ${s//old/new} is a single C-level pass - orders of magnitude
# faster than the character-by-character loop this replaces.
escape_for_json() {
    local s="$1"
    s="${s//\\/\\\\}"
    s="${s//\"/\\\"}"
    s="${s//$'\n'/\\n}"
    s="${s//$'\r'/\\r}"
    s="${s//$'\t'/\\t}"
    printf '%s' "$s"
}

goal_oriented_escaped=$(escape_for_json "$goal_oriented_content")

# Output context injection as JSON
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "<恐龙专属指令>\n🎯 目标追踪系统已激活\n\n **不忘初心牢记使命**\n\n**Goal-Oriented 思维（强制执行）:**\n\n${goal_oriented_escaped}\n\n</恐龙专属指令>"
  }
}
EOF

exit 0