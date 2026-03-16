#!/usr/bin/env node

/**
 * FortuneTeller 命令行界面 - 增强版
 * 使用增强版报告生成器，提供完整的命盘数据和AI分析提示词
 */

const EnhancedReportGenerator = require('./enhanced-report-generator');
const fs = require('fs');
const path = require('path');

class SimpleFortuneCLI {
  constructor() {
    this.generator = new EnhancedReportGenerator();
  }

  async run(argv) {
    const input = argv[2] || '';

    if (input === '--help' || input === '-h' || input === '') {
      this.showUsage();
      return;
    }

    console.log('🔮 FortuneTeller 算命系统启动（增强版 v2.1.0）');
    console.log('═════════════════════════════════════════\n');

    const parsedInput = this.parseInput(input);

    console.log('✓ 输入信息：');
    console.log(`  姓名：${parsedInput.name}`);
    console.log(`  性别：${parsedInput.gender}`);
    console.log(`  出生日期：${parsedInput.birthDate.year}年${parsedInput.birthDate.month}月${parsedInput.birthDate.day}日`);
    console.log(`  历法：${parsedInput.calendarType === 'lunar' ? '农历' : '阳历'}`);
    console.log(`  出生时辰：${parsedInput.birthTime}点`);
    console.log(`  出生地：${parsedInput.location}\n`);

    try {
      const result = await this.generator.generate(parsedInput);

      // 确保output目录存在
      const outputDir = 'output';
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // 输出JSON文件
      const jsonPath = path.join(outputDir, `${parsedInput.name}_命盘数据.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(result.json, null, 2), 'utf-8');

      // 输出Markdown框架文件
      const mdPath = path.join(outputDir, `${parsedInput.name}_分析框架.md`);
      fs.writeFileSync(mdPath, result.markdown, 'utf-8');

      console.log('≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈');
      console.log('✅ 数据生成成功！');
      console.log(`📄 JSON数据：${jsonPath}`);
      console.log(`📄 Markdown框架：${mdPath}\n`);
      console.log('≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈\n');

      console.log('🤖 AI分析提示词：\n');
      console.log(result.prompt);
      console.log('\n≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈\n');

    } catch (error) {
      console.error('❌ 执行出错：', error.message);
      console.error(error.stack);
      process.exit(1);
    }
  }

  parseInput(input) {
    if (!input || input.trim() === '') {
      this.showUsage();
      process.exit(1);
    }

    const parts = input.trim().split(/\s+/);

    // 解析姓名
    const name = parts[0] || '用户';

    // 解析性别
    const gender = parts[1];
    if (!gender || (gender !== '男' && gender !== '女')) {
      console.error('⚠️ 错误：性别必须是"男"或"女"');
      this.showUsage();
      process.exit(1);
    }

    // 解析日期（简化处理）
    let birthDate = { year: 0, month: 0, day: 0 };
    let calendarType = 'solar';
    let birthTime = 12;
    let location = '北京';

    // 寻找年月日
    const yearMatch = parts.join(' ').match(/(\d{4})年/);
    if (!yearMatch) {
      console.error('⚠️ 错误：缺少年份，格式应为：XXXX年');
      this.showUsage();
      process.exit(1);
    }
    birthDate.year = parseInt(yearMatch[1]);

    const monthMatch = parts.join(' ').match(/(\d{1,2})月/);
    if (monthMatch) {
      birthDate.month = parseInt(monthMatch[1]);
    }

    const dayMatch = parts.join(' ').match(/(\d{1,2})日/);
    if (dayMatch) {
      birthDate.day = parseInt(dayMatch[1]);
    }

    // 判断是否是农历
    if (parts.join(' ').includes('农历')) {
      calendarType = 'lunar';
    }

    // 寻找时辰
    for (const part of parts) {
      if (part.includes('点')) {
        birthTime = this.parseBirthTime(part);
        break;
      }
    }

    // 寻找地点
    const keywords = ['农历', '上午', '下午', '早上', '晚上', '凌晨'];
    for (let i = parts.length - 1; i >= 2; i--) {
      if (!keywords.includes(parts[i]) && !parts[i].match(/^\d+/)) {
        location = parts.slice(i).join('');
        break;
      }
    }

    return {
      name,
      gender,
      birthDate,
      birthTime,
      location,
      calendarType
    };
  }

  parseBirthTime(timeStr) {
    let timeStrClean = timeStr.replace(/[上午下午早上晚上]/g, '');
    if (timeStrClean.includes('凌晨')) {
      // 凌晨0-6点
      timeStrClean = timeStrClean.replace('凌晨', '');
    }
    if (timeStr.includes('下午') || timeStr.includes('晚上')) {
      const time = parseInt(timeStrClean.replace(/[^0-9]/g, ''));
      return time + 12;
    }
    const time = parseInt(timeStrClean.replace(/[^0-9]/g, ''));
    return isNaN(time) || time < 0 || time > 23 ? 12 : time;
  }

  showUsage() {
    console.log(`
🔮 FortuneTeller 算命系统 - 增强版 v2.1.0
═════════════════════════════════════════

使用方法：
  用户输入自然语言，例如："张三 男 2025年3月15日 下午2点 北京"

说明：
  - 姓名：必须
  - 性别：必须，男或女
  - 日期：必须，支持格式：2025年3月15日 或 农历十月初六
  - 时辰：可选，默认12点，支持：上午X点、下午X点、晚上X点等
  - 地点：可选，默认北京

输出：
  - JSON数据：命盘数据（四柱、五行、大运等）
  - Markdown框架：分析框架
  - AI提示词：供AI工具生成完整报告（8000-12000字）

═════════════════════════════════════════
`);
  }
}

// 运行
const cli = new SimpleFortuneCLI();
cli.run(process.argv);
