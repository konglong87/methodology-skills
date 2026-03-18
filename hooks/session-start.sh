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
    "additionalContext": "<EXTREMELY_IMPORTANT>\nYou have goal-oriented enforcement.\n\n**Below is the full content of your 'methodology-skills:goal-oriented' skill:**\n\n${goal_oriented_escaped}\n\n</EXTREMELY_IMPORTANT>"
  }
}
EOF

exit 0