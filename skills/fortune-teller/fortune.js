#!/usr/bin/env node

/**
 * FortuneTeller 命令行界面
 *
 * 用户输入后直接生成文字报告+信息图PNG，无需任何问询环节
 *
 * 使用方法：
 *   node fortune.js "李成 男 2002年农历十月月初六 上午04点 河南安阳"
 *   node fortune.js "张三 女 1990年8月15日 下午15点 北京"
 *
 * 输入格式：
 *   姓名 性别 出生日期 出生时辰 出生地
 *
 * 注意：
 * - 出生日期可以包含"农历"或"阳历"，默认阳历
 * - 出生时辰可以是"上午X点"、"下午X点"、"X点"等格式
 * - 默认值：出生时辰12点，出生地北京，历法阳历
 */

const FullReportGenerator = require('./generate-full-report');

class FortuneCLI {
  constructor() {
    this.generator = new FullReportGenerator();
  }

  /**
   * 解析用户输入
   * @param {string} input - 用户输入的完整字符串
   * @returns {Object} 解析后的输入对象
   */
  parseInput(input) {
    if (!input || input.trim() === '') {
      this.showUsage();
      process.exit(1);
    }

    const parts = input.trim().split(/\s+/);

    // 解析姓名（第一个词）
    const name = parts[0] || '用户';

    // 安全验证：禁止路径遍历字符，防止恶意文件路径
    if (name.includes('..') || name.includes('/') || name.includes('\\') || name.includes('\0')) {
      console.error('⚠️ 错误：姓名包含非法字符');
      console.error('   不允许包含：.. / \\ 或空字符');
      process.exit(1);
    }

    // 验证姓名长度（防止过长的文件名）
    if (name.length > 50) {
      console.error('⚠️ 错误：姓名过长（最多50个字符）');
      process.exit(1);
    }

    // 解析性别（第二个词）
    const gender = parts[1];
    if (!gender || (gender !== '男' && gender !== '女')) {
      console.error('⚠️ 错误：性别必须是"男"或"女"');
      console.log(`输入：${input}`);
      console.log(`姓名：${name}`);
      console.log(`性别：${gender}`);
      this.showUsage();
      process.exit(1);
    }

    // 解析日期
    let birthDateParts = [];
    let calendarType = 'solar'; // 默认阳历
    let birthTimeInput = '';
    let location = '北京'; // 默认出生地

    // 从第3个词开始解析
    for (let i = 2; i < parts.length; i++) {
      const part = parts[i];

      // 判断是否是农历
      if (part.includes('农历')) {
        calendarType = 'lunar';
      }

      // 判断是否是日期（年、月、日）
      // 支持 "2002年"、"2002年农历十月初六"等格式
      if (part.match(/^\d{4}年/) || (part.includes('年') && i === 2)) {
        birthDateParts.push(part);
      } else if (part.match(/^\d{1,2}月$/) || part.includes('月')) {
        birthDateParts.push(part);
      } else if (part.match(/^\d{1,2}日$/) || part.includes('日') || part.includes('初')) {
        birthDateParts.push(part);
      }

      // 判断是否是时辰（必须包含"点"或"时"）
      if (part.includes('点') || part.includes('时')) {
        birthTimeInput = part;
        continue; // 时辰解析后继续，不要中断
      }

      // 判断是否是地点（通常是最后1-2个词）
      // 只有当不是"农历"、"上午"、"下午"等关键词，且位置靠后时才算地点
      const keywords = ['农历', '上午', '下午', '早上', '晚上', '凌晨'];
      if (i >= parts.length - 2 && !keywords.includes(part)) {
        location = parts.slice(i).join('');
        break;
      }
    }

    // 解析年、月、日
    const birthDate = this.parseBirthDate(birthDateParts, calendarType);

    // 解析时辰
    const birthTime = this.parseBirthTime(birthTimeInput);

    return {
      name,
      gender,
      birthDate,
      birthTime,
      location,
      calendarType
    };
  }

  /**
   * 解析出生日期
   * @param {Array<string>} parts - 日期字符串数组
   * @param {string} calendarType - 历法类型（'lunar' 或 'solar'）
   * @returns {Object} 包含 year, month, day 的日期对象
   */
  parseBirthDate(parts, calendarType) {
    if (parts.length === 0) {
      console.error('⚠️ 错误：缺少出生日期');
      console.log('日期应为：XXXX年X月X日（或农历初X、十X等）');
      console.log('例如：2002年10月6日 或 2002年农历十月初六');
      process.exit(1);
    }

    let year, month, day;

    // 合并所有部分，方便处理完整日期字符串
    const fullDateStr = parts.join('');

    // 解析年份（从完整字符串中提取或在单独部分中查找）
    const fullYearMatch = fullDateStr.match(/(\d{4})年/);
    if (fullYearMatch) {
      year = parseInt(fullYearMatch[1], 10);
    } else {
      console.error('⚠️ 错误：缺少或格式错误的年份');
      console.log('年份应为：XXXX年（4位数字）');
      console.log('完整日期字符串是：', fullDateStr);
      console.log('各部分是：', parts);
      process.exit(1);
    }

    // 解析月份
    const fullMonthMatch = fullDateStr.match(/(\d{1,2})月/);
    if (fullMonthMatch) {
      month = parseInt(fullMonthMatch[1], 10);
    } else {
      // 尝试解析中文月份
      const chineseMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '腊月', '十月', '冬月', '腊月', '正'];
      const chineseMonthIndex = parts.findIndex(p => chineseMonths.includes(p) || p.includes('月'));
      if (chineseMonthIndex !== -1) {
        const monthPart = parts[chineseMonthIndex];
        if (monthPart === '正月') month = 1;
        else if (monthPart === '二月') month = 2;
        else if (monthPart === '三月') month = 3;
        else if (monthPart === '四月') month = 4;
        else if (monthPart === '五月') month = 5;
        else if (monthPart === '六月') month = 6;
        else if (monthPart === '七月') month = 7;
        else if (monthPart === '八月') month = 8;
        else if (monthPart === '九月') month = 9;
        else if (monthPart === '十月' || monthPart === '孟冬') month = 10;
        else if (monthPart === '十一月' || monthPart === '冬月' || monthPart === '仲冬') month = 11;
        else if (monthPart === '十二月' || monthPart === '腊月' || monthPart === '季冬') month = 12;
        calendarType = 'lunar'; // 中文月份默认农历
      } else {
        console.error('⚠️ 错误：缺少或格式错误的月份');
        console.log('月份应为：X月 或 正月、二月、腊月等中文月份');
        console.log('完整日期字符串是：', fullDateStr);
        console.log('各部分是：', parts);
        process.exit(1);
      }
    }

    // 解析日
    const fullDayMatch = fullDateStr.match(/(?:\d{1,2}月)?(?:农历[^年年]*?\d{4})?(?:正|二|三|四|五|六|七|八|九|十|十一|十二|腊|冬|孟|仲|季)*月?(初\d+|十\d|二十\d|三十|\d{1,2})/);
    if (fullDayMatch) {
      let dayStr = fullDayMatch[1];
      if (dayStr.includes('初')) {
        day = parseInt(dayStr.substring(1), 10);
      } else if (dayStr === '十') {
        day = 10;
      } else if (dayStr.startsWith('十') && dayStr.length === 2) {
        day = 10 + parseInt(dayStr[1], 10);
      } else if (dayStr === '二十') {
        day = 20;
      } else if (dayStr.startsWith('二十') && dayStr.length === 3) {
        day = 20 + parseInt(dayStr[2], 10);
      } else if (dayStr === '三十') {
        day = 30;
      } else if (dayStr.match(/^\d+$/)) {
        day = parseInt(dayStr, 10);
      } else {
        // 尝试从部分中提取
        const dayPart = parts.find(p => p.match(/^\d{1,2}日$/) || p.match(/^初\d+$/) || p.match(/^十\d$/));
        if (dayPart) {
          let ds = dayPart.replace('日', '');
          if (ds.includes('初')) day = parseInt(ds.substring(1), 10);
          else if (ds === '十') day = 10;
          else if (ds.startsWith('十') && ds.length === 2) day = 10 + parseInt(ds[1], 10);
          else if (ds === '二十') day = 20;
          else if (ds.startsWith('二十') && ds.length === 3) day = 20 + parseInt(ds[2], 10);
          else if (ds === '三十') day = 30;
          else day = parseInt(ds, 10);
        } else {
          console.error('⚠️ 错误：缺少或格式错误的日期');
          console.log('日期应为：X日 或 初X、十X、二十X、三十等中文日期');
          console.log('完整日期字符串是：', fullDateStr);
          console.log('各部分是：', parts);
          process.exit(1);
        }
      }
    } else {
      console.error('⚠️ 错误：缺少或格式错误的日期');
      console.log('日期应为：X日 或 初X、十X、二十X、三十等中文日期');
      console.log('完整日期字符串是：', fullDateStr);
      console.log('各部分是：', parts);
      process.exit(1);
    }

    return { year, month, day };
  }

  /**
   * 解析出生时辰
   * @param {string} timeInput - 时辰字符串，如"下午3点"、"上午10点"等
   * @returns {number} 0-23的小时数，解析失败返回默认值12
   */
  parseBirthTime(timeInput) {
    // 参数验证：timeInput为null、undefined或空字符串时返回默认值
    if (!timeInput || typeof timeInput !== 'string' || timeInput.trim() === '') {
      console.log('⚠️ 未提供出生时辰，使用默认值：12点（中午）');
      return 12;
    }

    // 尝试解析各种时辰格式
    // "上午4点"、"下午2点"、"早上8点"、"晚上20点"、"15点"等
    let timeStr = timeInput.replace(/[上午下午早上晚上]/g, '').replace(/[点点]/g, '').trim();

    // 处理"凌晨4点"格式
    if (timeInput.includes('凌晨')) {
      // 凌晨0-6点，保持原值
    }

    // 提取数字部分
    const numStr = timeStr.replace(/[^0-9]/g, '');
    if (!numStr) {
      console.log('⚠️ 时辰格式错误，使用默认值：12点（中午）');
      return 12;
    }

    let time = parseInt(numStr, 10); // 明确指定radix为10

    // 处理"下午"格式，下午时间要+12
    if (timeInput.includes('下午') || timeInput.includes('晚上')) {
      time += 12;
    }

    // 验证时间范围（0-23）
    if (isNaN(time) || time < 0 || time > 23) {
      console.log('⚠️ 时辰格式错误，使用默认值：12点（中午）');
      return 12;
    }

    return time;
  }

  /**
   * 显示使用说明
   */
  showUsage() {
    console.log(`
🔮 FortuneTeller 算命系统 - 一键生成报告
═════════════════════════════════════════

使用方法：
  node fortune.js "姓名 性别 出生日期 出生时辰 出生地"

输入格式：
  姓名 性别 [农历]出生日期 出生时辰 出生地

示例：
  # 阳历日期
  node fortune.js "李成 男 2002年11月10日 04点 河南安阳"

  # 农历日期
  node fortune.js "李成 男 2002年农历十月初六 上午04点 河南安阳"

  # 不提供时辰（默认12点）
  node fortune.js "张三 女 1990年8月15日 北京"

  # 不提供地点（默认北京）
  node fortune.js "王五 男 1985年3月20日 15点"

说明：
  - 日期格式：年月日（YYYY年X月X日）或中文日期（正月、初X等）
  - 时辰格式：X点、上午X点、下午X点等，默认12点
  - 出生地：城市名，默认北京
  - 农历/阳历：默认阳历，包含"农历"则为农历

输出：
  - 文字报告：Markdown格式，保存在 output/ 目录
  - 信息图：PNG格式，保存在 output/ 目录

═════════════════════════════════════════
`);
  }

  /**
   * 主入口
   */
  async run(argv) {
    const input = argv[2] || '';

    if (input === '--help' || input === '-h' || input === '') {
      this.showUsage();
      return;
    }

    console.log('🔮 FortuneTeller 算命系统启动');
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

      if (result.success) {
        console.log('\n═════════════════════════════════════════');
        console.log('✅ 报告生成成功！');
        console.log('\n📝 文字报告：');
        console.log(`   ${result.markdownReport}`);
        console.log('\n📊 信息图：');
        if (result.infographic) {
          console.log(`   ${result.infographic}`);
        } else {
          console.log('   未生成（infographic-generator未安装）');
        }
        console.log('\n═════════════════════════════════════════');
        console.log('✨ 算命完成！祝你一生平安！🙏\n');
      } else {
        console.error('❌ 报告生成失败：', result.error);
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ 执行出错：', error.message);
      // 生产环境不输出完整堆栈，避免泄露敏感信息
      if (process.env.NODE_ENV === 'development') {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }
}

// 运行
const cli = new FortuneCLI();
cli.run(process.argv);
