#!/bin/bash
# 技能包自动更新脚本
# 检测是否为 git 安装方式，是则拉取最新版本
# 有本地改动或网络问题则跳过，不影响使用

cd "$(dirname "$0")/.." 2>/dev/null || exit 0
[ -d .git ] || exit 0
git pull --ff-only -q 2>/dev/null && echo "✅ 技能包已更新到最新版本" || true