#!/usr/bin/env python3
"""
Goal Tracker Tool - 目标追踪工具

用于自动记录和验证任务目标，防止 AI 执行过程中丢失目标上下文。
"""

import argparse
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional


class GoalTracker:
    """目标追踪器核心类"""

    def __init__(self, project_root: Optional[Path] = None):
        """
        初始化目标追踪器

        Args:
            project_root: 项目根目录，默认自动检测
        """
        if project_root is None:
            # 从脚本位置推导项目根目录
            script_dir = Path(__file__).parent
            project_root = script_dir.parent.parent.parent

        self.project_root = project_root
        self.goals_dir = project_root / "memory" / "goals"
        self.template_path = project_root / "skills" / "goal-oriented" / "templates" / "goal-template.md"

        # 确保目标目录存在
        self.goals_dir.mkdir(parents=True, exist_ok=True)

    def create(self, raw: str, smart_specific: str, smart_measurable: str) -> str:
        """
        创建新目标

        Args:
            raw: 用户原始表述
            smart_specific: SMART 具体目标
            smart_measurable: SMART 可衡量标准

        Returns:
            创建的目标文件路径
        """
        timestamp = datetime.now().strftime("%Y-%m-%d_%H%M")
        # 从具体目标中提取关键词作为文件名
        keywords = self._extract_keywords(smart_specific)
        filename = f"{timestamp}_{keywords}.md"
        goal_path = self.goals_dir / filename

        # 读取模板
        template_content = self._read_template()

        # 替换模板变量
        content = template_content.replace("{用户原始表述，完整保留原文}", raw)
        content = content.replace("{当前最新的具体目标}", smart_specific)
        content = content.replace("{当前最新的衡量标准}", smart_measurable)
        content = content.replace("{资源可行性}", "待评估")
        content = content.replace("{为什么重要}", "待说明")
        content = content.replace("{期望完成时间}", "本次会话")
        content = content.replace("{YYYY-MM-DD HH:MM}", datetime.now().strftime("%Y-%m-%d %H:%M"))
        content = content.replace("{session_id}", "待获取")
        content = content.replace("{版本号}", "1")
        content = content.replace("{时间}", datetime.now().strftime("%Y-%m-%d %H:%M"))
        content = content.replace("{具体目标}", smart_specific)
        content = content.replace("{衡量标准}", smart_measurable)

        # 写入文件
        goal_path.write_text(content, encoding="utf-8")

        return str(goal_path.relative_to(self.project_root))

    def _extract_keywords(self, text: str) -> str:
        """
        从文本中提取关键词作为文件名

        Args:
            text: 输入文本

        Returns:
            提取的关键词（最多20个字符）
        """
        # 简单实现：取前20个非空格字符
        keywords = text.replace(" ", "")[:20]
        return keywords

    def _read_template(self) -> str:
        """读取目标模板文件"""
        if not self.template_path.exists():
            print(f"⚠️  模板文件不存在：{self.template_path}")
            return ""

        return self.template_path.read_text(encoding="utf-8")

    def update(self, file: str, milestone: str) -> dict:
        """
        更新目标里程碑

        Args:
            file: 目标文件路径
            milestone: 里程碑描述

        Returns:
            操作结果字典
        """
        goal_path = self.project_root / file

        if not goal_path.exists():
            print(f"❌ 目标文件不存在：{file}")
            return {"status": "error", "message": "目标文件不存在"}

        # 追加里程碑记录
        with goal_path.open("a", encoding="utf-8") as f:
            f.write(f"\n### 里程碑：{milestone}\n")
            f.write(f"更新时间：{datetime.now().strftime('%Y-%m-%d %H:%M')}\n")

        print(f"✅ 已更新里程碑：{milestone}")

        return {
            "status": "success",
            "file": file,
            "milestone": milestone
        }

    def adjust(self, file: str, reason: str, new_specific: str, new_measurable: str) -> dict:
        """
        调整目标

        Args:
            file: 目标文件路径
            reason: 调整原因
            new_specific: 新的具体目标
            new_measurable: 新的衡量标准

        Returns:
            操作结果字典
        """
        goal_path = self.project_root / file

        if not goal_path.exists():
            print(f"❌ 目标文件不存在：{file}")
            return {"status": "error", "message": "目标文件不存在"}

        # 读取现有内容
        content = goal_path.read_text(encoding="utf-8")

        # 更新版本号
        import re
        version_match = re.search(r"当前版本：(\d+)", content)
        current_version = int(version_match.group(1)) if version_match else 1
        new_version = current_version + 1

        content = re.sub(r"当前版本：\d+", f"当前版本：{new_version}", content)

        # 更新 SMART 目标
        content = re.sub(
            r"\*\*Specific（具体）\*\*: .+",
            f"**Specific（具体）**: {new_specific}",
            content
        )
        content = re.sub(
            r"\*\*Measurable（可衡量）\*\*: .+",
            f"**Measurable（可衡量）**: {new_measurable}",
            content
        )

        # 追加调整历史
        with goal_path.open("a", encoding="utf-8") as f:
            f.write(f"\n### 版本 {new_version}（{datetime.now().strftime('%Y-%m-%d %H:%M')}）\n")
            f.write(f"- **调整原因**: {reason}\n")
            f.write(f"- **SMART-Specific**: {new_specific}\n")
            f.write(f"- **SMART-Measurable**: {new_measurable}\n")

        print(f"✅ 目标已调整")
        print(f"📝 调整原因：{reason}")
        print(f"📊 新版本：{new_version}")

        return {
            "status": "success",
            "file": file,
            "reason": reason,
            "new_version": new_version
        }

    def verify(self, file: str, ai_assessment: str) -> dict:
        """
        验证目标达成情况

        Args:
            file: 目标文件路径
            ai_assessment: AI 自评完成情况

        Returns:
            验证结果字典
        """
        goal_path = self.project_root / file

        if not goal_path.exists():
            print(f"❌ 目标文件不存在：{file}")
            return {"status": "error", "message": "目标文件不存在"}

        # 读取目标文件
        content = goal_path.read_text(encoding="utf-8")

        # 简单实现：输出对比信息
        print(f"📋 目标文件：{file}")
        print(f"🔍 AI 自评：{ai_assessment}")
        print(f"\n💡 请对比原始目标与实际完成情况")

        return {
            "status": "success",
            "file": file,
            "ai_assessment": ai_assessment
        }

    def complete(self, file: str, summary: str) -> dict:
        """
        标记目标完成

        Args:
            file: 目标文件路径
            summary: 完成总结

        Returns:
            操作结果字典
        """
        goal_path = self.project_root / file

        if not goal_path.exists():
            print(f"❌ 目标文件不存在：{file}")
            return {"status": "error", "message": "目标文件不存在"}

        # 读取并更新目标文件
        content = goal_path.read_text(encoding="utf-8")
        content = content.replace("状态：pending", "状态：completed")
        content = content.replace("完成时间：-", f"完成时间：{datetime.now().strftime('%Y-%m-%d %H:%M')}")

        goal_path.write_text(content, encoding="utf-8")

        print(f"✅ 目标已完成：{file}")
        print(f"📅 完成时间：{datetime.now().strftime('%Y-%m-%d %H:%M')}")

        return {
            "status": "success",
            "file": file,
            "summary": summary
        }


def main():
    """主函数"""
    parser = argparse.ArgumentParser(
        description="Goal Tracker Tool - 目标追踪工具",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    subparsers = parser.add_subparsers(dest="command", help="可用命令")

    # create 命令
    create_parser = subparsers.add_parser("create", help="创建新目标")
    create_parser.add_argument("--raw", required=True, help="用户原始表述")
    create_parser.add_argument("--smart-specific", required=True, help="SMART 具体目标")
    create_parser.add_argument("--smart-measurable", required=True, help="SMART 可衡量标准")

    # update 命令
    update_parser = subparsers.add_parser("update", help="更新目标里程碑")
    update_parser.add_argument("--file", required=True, help="目标文件路径")
    update_parser.add_argument("--milestone", required=True, help="里程碑描述")

    # adjust 命令
    adjust_parser = subparsers.add_parser("adjust", help="调整目标")
    adjust_parser.add_argument("--file", required=True, help="目标文件路径")
    adjust_parser.add_argument("--reason", required=True, help="调整原因")
    adjust_parser.add_argument("--new-specific", required=True, help="新的具体目标")
    adjust_parser.add_argument("--new-measurable", required=True, help="新的衡量标准")

    # verify 命令
    verify_parser = subparsers.add_parser("verify", help="验证目标达成情况")
    verify_parser.add_argument("--file", required=True, help="目标文件路径")
    verify_parser.add_argument("--ai-assessment", required=True, help="AI 自评完成情况")

    # complete 命令
    complete_parser = subparsers.add_parser("complete", help="标记目标完成")
    complete_parser.add_argument("--file", required=True, help="目标文件路径")
    complete_parser.add_argument("--summary", required=True, help="完成总结")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    tracker = GoalTracker()

    if args.command == "create":
        goal_path = tracker.create(
            raw=args.raw,
            smart_specific=args.smart_specific,
            smart_measurable=args.smart_measurable
        )
        print(f"✅ 目标已创建：{goal_path}")

    elif args.command == "update":
        result = tracker.update(
            file=args.file,
            milestone=args.milestone
        )

    elif args.command == "adjust":
        result = tracker.adjust(
            file=args.file,
            reason=args.reason,
            new_specific=args.new_specific,
            new_measurable=args.new_measurable
        )

    elif args.command == "verify":
        result = tracker.verify(
            file=args.file,
            ai_assessment=args.ai_assessment
        )

    elif args.command == "complete":
        result = tracker.complete(
            file=args.file,
            summary=args.summary
        )


if __name__ == "__main__":
    main()