#!/usr/bin/env bash
# 技能包自动更新脚本
# 检测是否为 git 安装方式，是则拉取最新版本
# 有本地改动或网络问题则跳过，不影响使用

cd "$(dirname "$0")/.." 2>/dev/null || exit 0
[ -d .git ] || exit 0

# 尝试多种 git 路径（系统 git 可能因 Xcode CLT 缺失而不可用）
for git_bin in /usr/local/bin/git /opt/homebrew/bin/git git; do
  if command -v "$git_bin" &>/dev/null; then
    "$git_bin" pull --ff-only -q 2>/dev/null && echo "✅ 技能包已更新到最新版本" || true
    exit 0
  fi
done

# 所有 git 都不可用，静默跳过
exit 0