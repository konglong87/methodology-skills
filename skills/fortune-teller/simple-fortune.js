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

    // 检测是否是测试模式
    const isTestMode = input.includes('--test');
    const cleanInput = input.replace('--test', '').trim();

    console.log('🔮 FortuneTeller 算命系统启动（增强版 v2.2.0）');
    console.log('═════════════════════════════════════════\n');

    const parsedInput = this.parseInput(cleanInput);

    console.log('✓ 输入信息：');
    console.log(`  姓名：${parsedInput.name}`);
    console.log(`  性别：${parsedInput.gender}`);
    console.log(`  出生日期：${parsedInput.birthDate.year}年${parsedInput.birthDate.month}月${parsedInput.birthDate.day}日`);
    console.log(`  历法：${parsedInput.calendarType === 'lunar' ? '农历' : '阳历'}`);
    console.log(`  出生时辰：${parsedInput.birthTime}点`);
    console.log(`  出生地：${parsedInput.location}`);
    console.log(`  模式：${isTestMode ? '测试模式' : '正式模式'}\n`);

    try {
      const result = await this.generator.generate(parsedInput);

      // 初始化所有必需的目录
      this.initializeDirectories();

      // 根据模式选择输出目录
      const outputDir = isTestMode ? 'test' : 'output';
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);

      // 生成文件名
      const baseFileName = isTestMode
        ? `test_${parsedInput.name}_${timestamp}`
        : `${parsedInput.name}`;

      // 输出JSON文件
      const jsonPath = path.join(outputDir, `${baseFileName}_命盘数据.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(result.json, null, 2), 'utf-8');

      // 输出Markdown框架文件
      const mdPath = path.join(outputDir, `${baseFileName}_分析框架.md`);
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
      // 生产环境不输出完整堆栈，避免泄露敏感信息
      if (process.env.NODE_ENV === 'development') {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }

  /**
   * 初始化必需的目录结构
   */
  initializeDirectories() {
    const directories = ['test', 'output', 'backup'];
    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 创建目录：${dir}/`);
      }
    });
  }

  parseInput(input) {
    if (!input || input.trim() === '') {
      this.showUsage();
      process.exit(1);
    }

    const inputStr = input.trim();
    const parts = inputStr.split(/\s+/);

    // === 常见城市列表 ===
    const commonCities = [
      '北京', '上海', '广州', '深圳', '天津', '重庆', '成都', '杭州', '南京', '武汉',
      '西安', '苏州', '长沙', '郑州', '青岛', '厦门', '宁波', '福州', '济南', '大连',
      '沈阳', '哈尔滨', '长春', '石家庄', '太原', '合肥', '南昌', '昆明', '贵阳', '南宁',
      '海口', '兰州', '银川', '西宁', '乌鲁木齐', '呼和浩特', '拉萨', '香港', '澳门', '台北'
    ];

    // === 智能提取所有必需信息 ===

    // 1. 提取性别（"男"或"女"）
    let gender = null;
    for (const part of parts) {
      if (part === '男' || part === '女') {
        gender = part;
        break;
      }
    }

    // 2. 提取年份（XXXX年）
    const yearMatch = inputStr.match(/(\d{4})年/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : null;

    // 3. 提取月份（X月）
    const monthMatch = inputStr.match(/(\d{1,2})月/);
    const month = monthMatch ? parseInt(monthMatch[1], 10) : null;

    // 4. 提取日期（X日）
    const dayMatch = inputStr.match(/(\d{1,2})日/);
    const day = dayMatch ? parseInt(dayMatch[1], 10) : null;

    // 5. 提取时辰（X点、上午X点、下午X点等）
    let birthTime = null;
    for (const part of parts) {
      if (part.includes('点')) {
        birthTime = this.parseBirthTime(part);
        break;
      }
    }

    // 6. 提取地点（优先匹配常见城市）
    const keywords = ['男', '女', '农历', '阳历', '上午', '下午', '早上', '晚上', '凌晨', '年', '月', '日', '点'];
    let location = null;
    let locationIndex = -1;

    // 先尝试匹配常见城市
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (commonCities.includes(part)) {
        location = part;
        locationIndex = i;
        break;
      }
    }

    // 如果没有匹配到常见城市，找最后一个非关键词的词
    if (!location) {
      for (let i = parts.length - 1; i >= 0; i--) {
        const part = parts[i];
        if (!keywords.some(kw => part.includes(kw)) &&
            !part.match(/^\d+$/) &&
            !part.includes('点') &&
            !part.match(/\d+年|\d+月|\d+日/)) {
          location = part;
          locationIndex = i;
          break;
        }
      }
    }

    // 7. 提取姓名（第一个非关键词、非数字、非地点的词）
    let name = null;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i !== locationIndex && // 不是地点
          !keywords.some(kw => part === kw) &&
          !part.match(/^\d+.*年|月|日|点/) &&
          !part.match(/^\d+$/) &&
          part !== gender &&
          part !== location) {
        name = part;
        break;
      }
    }

    // 8. 判断是否是农历
    const calendarType = inputStr.includes('农历') ? 'lunar' : 'solar';

    // === 验证所有必需信息 ===

    const missingFields = [];

    if (!name) {
      missingFields.push('姓名');
    }

    if (!gender) {
      missingFields.push('性别（男/女）');
    }

    if (!year) {
      missingFields.push('出生年份（XXXX年）');
    }

    if (!month) {
      missingFields.push('出生月份（X月）');
    }

    if (!day) {
      missingFields.push('出生日期（X日）');
    }

    if (birthTime === null || birthTime === undefined) {
      missingFields.push('出生时辰（X点 或 上午X点、下午X点）');
    }

    if (!location) {
      missingFields.push('出生地点（如：北京、上海）');
    }

    // 如果有缺失字段，显示错误并退出
    if (missingFields.length > 0) {
      console.error('⚠️ 错误：缺少以下必填信息：');
      missingFields.forEach((field, index) => {
        console.error(`   ${index + 1}. ${field}`);
      });
      console.error('\n请提供完整的必填信息，例如：');
      console.error('   张三 男 2002年10月6日 12点 北京');
      console.error('   李四 女 2002年农历十月初六 下午2点 上海');
      console.error('\n必需信息（全部必填）：');
      console.error('   - 姓名');
      console.error('   - 性别（男/女）');
      console.error('   - 出生年份（XXXX年）');
      console.error('   - 出生月份（X月）');
      console.error('   - 出生日期（X日）');
      console.error('   - 出生时辰（X点 或 上午X点、下午X点）');
      console.error('   - 出生地点（如：北京、上海）');
      process.exit(1);
    }

    // === 构建birthDate对象 ===
    const birthDate = { year, month, day };

    // === 验证日期有效性 ===
    if (birthDate.month < 1 || birthDate.month > 12) {
      console.error('⚠️ 错误：月份必须在1-12之间');
      process.exit(1);
    }
    if (birthDate.day < 1 || birthDate.day > 31) {
      console.error('⚠️ 错误：日期必须在1-31之间');
      process.exit(1);
    }

    // === 安全验证：禁止路径遍历字符 ===
    if (name.includes('..') || name.includes('/') || name.includes('\\') || name.includes('\0')) {
      console.error('⚠️ 错误：姓名包含非法字符');
      console.error('   不允许包含：.. / \\ 或空字符');
      process.exit(1);
    }

    // === 验证姓名长度 ===
    if (name.length > 50) {
      console.error('⚠️ 错误：姓名过长（最多50个字符）');
      process.exit(1);
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

  /**
   * 解析出生时辰
   * @param {string} timeStr - 时辰字符串，如"下午3点"、"上午10点"等
   * @returns {number} 0-23的小时数，解析失败返回默认值12
   */
  parseBirthTime(timeStr) {
    // 参数验证：timeStr为null、undefined或非字符串时返回默认值
    if (!timeStr || typeof timeStr !== 'string') {
      return 12; // 默认中午12点
    }

    // 清理字符串，移除"上午"、"下午"等修饰词
    let timeStrClean = timeStr.replace(/[上午下午早上晚上]/g, '');
    if (timeStrClean.includes('凌晨')) {
      // 凌晨0-6点，保持原值
      timeStrClean = timeStrClean.replace('凌晨', '');
    }

    // 提取数字部分
    const numStr = timeStrClean.replace(/[^0-9]/g, '');
    if (!numStr) {
      return 12; // 无法提取数字，返回默认值
    }

    let time = parseInt(numStr, 10); // 明确指定radix为10

    // 处理下午或晚上的时间，需要+12转换成24小时制
    if (timeStr.includes('下午') || timeStr.includes('晚上')) {
      time += 12;
    }

    // 验证时间范围（0-23）
    if (isNaN(time) || time < 0 || time > 23) {
      return 12; // 超出范围，返回默认值
    }

    return time;
  }

  showUsage() {
    console.log(`
🔮 FortuneTeller 算命系统 - 增强版 v2.2.0
═════════════════════════════════════════

使用方法：
  用户输入自然语言，例如："张三 男 2025年3月15日 下午2点 北京"

必填信息（全部必须提供）：
  - 姓名：必须
  - 性别：必须，男或女
  - 日期：必须，支持格式：2025年3月15日 或 农历十月初六
  - 时辰：必须，格式：X点 或 上午X点、下午X点、晚上X点
  - 地点：必须，如：北京、上海、广州等

示例：
  - 张三 男 2025年3月15日 12点 北京
  - 李四 女 2002年农历十月初六 下午2点 上海
  - 王五 男 1990年8月15日 晚上8点 广州

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
