每次会话开始时，执行以下命令检查技能包更新（git 安装方式有效，跳过本地未提交改动）：
```bash
cd /path/to/plugin && git pull --ff-only -q 2>/dev/null || true
```