/**
 * FortuneTeller 算命计算引擎
 *
 * 融合紫微斗数、生辰八字、盲派、南北派四大派系
 * 进行交叉验证的综合命理推算
 *
 * 设计理念：
 * - 这是一个通用的命理计算引擎，不依赖特定 AI 工具
 * - 可被 Claude、Cursor、OpenCode、OpenClaw、Antigravity、WorkBuddy、Codex、CodeBuddy、QwenCode 等任何 AI 工具调用
 * - 只负责计算，返回标准 JSON 数据结构
 * - 智能分析由 AI 工具基于 prompts/*.md 完成
 */

const InputHandler = require('./lib/input-handler');
const BazilCalculator = require('./lib/bazi-calculator');
const ZiweiCalculator = require('./lib/ziwei-calculator');
const MengpaiCalculator = require('./lib/mengpai-calculator');
const NanbeipaiCalculator = require('./lib/nanbeipai-calculator');
const fs = require('fs');
const path = require('path');

class FortuneTeller {
  constructor() {
    this.inputHandler = new InputHandler();
    this.baziCalc = new BazilCalculator();
    this.ziweiCalc = new ZiweiCalculator();
    this.mengpaiCalc = new MengpaiCalculator();
    this.nanbeipaiCalc = new NanbeipaiCalculator();

    // 加载时代背景数据
    this.eraData = this.loadEraData();
    // 加载prompts
    this.prompts = this.loadPrompts();
  }

  /**
   * 加载时代背景数据
   */
  loadEraData() {
    try {
      const dataPath = path.join(__dirname, 'data', 'era-background.json');
      return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (e) {
      console.warn('警告：无法加载时代背景数据', e.message);
      return {};
    }
  }

  /**
   * 加载LLM prompts
   */
  loadPrompts() {
    const prompts = {};
    const promptsDir = path.join(__dirname, 'prompts');

    const promptFiles = [
      'ziwei-analysis.md',
      'bazi-analysis.md',
      'mengpai-analysis.md',
      'nanbeipai-analysis.md',
      'cross-validation.md'
    ];

    for (const file of promptFiles) {
      const filePath = path.join(promptsDir, file);
      try {
        const key = file.replace('.md', '');
        prompts[key] = fs.readFileSync(filePath, 'utf8');
      } catch (e) {
        console.warn(`警告：无法加载prompt文件 ${file}`, e.message);
      }
    }

    return prompts;
  }

  /**
   * 验证并处理必填输入字段（使用默认值）
   * @param {Object} input - 用户输入
   * @returns {Object} - { valid: boolean, processedInput: Object, missingFields: string[] }
   */
  validateAndProcessInput(input) {
    const missingFields = [];

    // 检查姓名（必填）
    if (!input.name || input.name.trim() === '') {
      missingFields.push('姓名（必填）');
    }

    // 检查性别（必填）
    if (!input.gender || (input.gender !== '男' && input.gender !== '女')) {
      missingFields.push('性别（必填，必须是"男"或"女"）');
    }

    // 检查出生日期（必填）
    if (!input.birthDate) {
      missingFields.push('出生日期（必填）');
    } else {
      if (!input.birthDate.year || input.birthDate.year < 1900 || input.birthDate.year > 2030) {
        missingFields.push('出生年份（必填，1900-2030）');
      }
      if (!input.birthDate.month || input.birthDate.month < 1 || input.birthDate.month > 12) {
        missingFields.push('出生月份（必填，1-12）');
      }
      if (!input.birthDate.day || input.birthDate.day < 1 || input.birthDate.day > 31) {
        missingFields.push('出生日期（必填，1-31）');
      }
    }

    // 如果缺少必填字段，直接返回错误
    if (missingFields.length > 0) {
      return {
        valid: false,
        processedInput: null,
        missingFields
      };
    }

    // 处理非必填字段的默认值
    const processedInput = {
      name: input.name,
      gender: input.gender,
      birthDate: input.birthDate,
      // 出生时辰：未提供时使用默认值12点（中午），用于八字时柱推算
      birthTime: input.birthTime !== undefined && input.birthTime !== null
        ? Math.max(0, Math.min(23, parseInt(input.birthTime, 10)))
        : 12, // 默认12点（中午）
      // 出生地：未提供时使用默认值北京，用于真太阳时计算
      location: (input.location && input.location.trim() !== '')
        ? input.location.trim()
        : '北京', // 默认北京
      // 历法类型：未提供时使用默认值阳历
      calendarType: (input.calendarType === 'lunar' || input.calendarType === 'solar')
        ? input.calendarType
        : 'solar' // 默认阳历
    };

    return {
      valid: true,
      processedInput,
      missingFields: []
    };
  }

  /**
   * 获取缺失字段的提示信息
   */
  getMissingFieldsMessage(missingFields) {
    const messages = [
      '\n⚠️  信息不完整，请补充以下必填信息：\n'
    ];

    const fieldDescriptions = {
      '姓名': '请提供您的姓名，用于报告称呼',
      '性别': '请提供性别（男/女），影响大运顺逆',
      '出生日期': '请提供完整的出生日期（年、月、日）',
      '出生年份': '请提供正确的出生年份（1900-2030）',
      '出生月份': '请提供正确的出生月份（1-12）',
      '出生日期（具体）': '请提供正确的出生日期（1-31）',
      '出生时辰': '请提供出生时辰（24小时制，0-23），例如：14表示下午2点',
      '出生地（用于真太阳时计算）': '请提供出生城市（如：北京、上海、广州），用于计算真太阳时',
      '历法类型（农历lunar/阳历solar）': '请说明是农历还是阳历'
    };

    missingFields.forEach((field, index) => {
      messages.push(`${index + 1}. ${field}`);
      if (fieldDescriptions[field]) {
        messages.push(`   → ${fieldDescriptions[field]}`);
      }
    });

    messages.push('\n请补充完整后再次调用分析。');

    return messages.join('\n');
  }

  /**
   * 主入口：算命分析
   * @param {Object} input - 用户输入
   * @param {string} input.name - 姓名（必填）
   * @param {string} input.gender - 性别（必填，男/女）
   * @param {Object} input.birthDate - 出生日期（必填）
   * @param {number} input.birthDate.year - 年（必填）
   * @param {number} input.birthDate.month - 月（必填）
   * @param {number} input.birthDate.day - 日（必填）
   * @param {number} input.birthTime - 出生时辰（小时，0-23，可选，默认12）
   * @param {string} input.location - 出生地（可选，默认北京）
   * @param {string} input.calendarType - 历法类型（lunar/solar，可选，默认solar）
   */
  async analyze(input) {
    console.log('=== FortuneTeller 算命系统启动 ===');
    console.log('输入信息：', JSON.stringify(input, null, 2));

    // Step 0: 验证并处理输入（使用默认值）
    const validation = this.validateAndProcessInput(input);
    if (!validation.valid) {
      const errorMsg = this.getMissingFieldsMessage(validation.missingFields);
      console.error(errorMsg);
      return {
        success: false,
        error: 'REQUIRED_FIELDS_MISSING',
        missingFields: validation.missingFields,
        message: errorMsg
      };
    }

    const processedInput = validation.processedInput;

    try {
      // Step 1: 输入处理（日期转换+验证2遍+真太阳时）
      console.log('\n[1/5] 处理输入...');
      const finalInput = await this.processInput(processedInput);

      // Step 2: 排盘计算
      console.log('[2/5] 排盘计算...');
      const panpai = this.calculatePanpai(finalInput, processedInput.gender);

      // Step 3: LLM分析准备
      console.log('[3/5] 准备LLM分析...');
      const analysisInput = this.prepareAnalysisInput(finalInput, panpai);

      // Step 4: LLM分析（5轮验证）
      console.log('[4/5] 执行5轮验证分析...');
      const analysis = await this.runAnalysis(panpai, analysisInput, finalInput);

      // Step 5: 生成报告
      console.log('[5/5] 生成报告...');
      const report = this.generateReport(input.name, finalInput, panpai, analysis);

      console.log('\n=== 算命分析完成 ===');

      return {
        success: true,
        input: finalInput,
        panpai,
        analysis,
        report
      };
    } catch (error) {
      console.error('算命分析出错：', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 处理输入：日期转换、验证、真太阳时
   */
  async processInput(input) {
    const { birthDate, birthTime, location, calendarType } = input;

    let solarDate;
    let lunarDate;

    // 阳历/农历转换
    if (calendarType === 'lunar') {
      // 农历转阳历
      solarDate = this.inputHandler.lunarToSolar(
        birthDate.year,
        birthDate.month,
        birthDate.day
      );
      // 验证
      const validation = this.inputHandler.validateDateConversion(
        solarDate.year,
        solarDate.month,
        solarDate.day
      );
      if (!validation.verified) {
        throw new Error('日期转换验证失败');
      }
    } else {
      // 阳历转农历（用户输入的就是阳历）
      solarDate = {
        year: birthDate.year,
        month: birthDate.month,
        day: birthDate.day
      };
      // 验证
      const validation = this.inputHandler.validateDateConversion(
        solarDate.year,
        solarDate.month,
        solarDate.day
      );
      if (!validation.verified) {
        throw new Error('日期验证失败');
      }
      lunarDate = this.inputHandler.solarToLunar(
        solarDate.year,
        solarDate.month,
        solarDate.day
      );
    }

    // 计算真太阳时
    let trueSolarTime = { hour: birthTime, minute: 0 };
    if (location) {
      const cityLongitude = this.inputHandler.getChinaCityLongitude(location);
      if (cityLongitude) {
        trueSolarTime = this.inputHandler.trueSolarTime(cityLongitude, birthTime, 0);
      }
    }

    return {
      name: input.name,
      gender: input.gender,
      originalDate: birthDate,
      calendarType,
      solarDate,
      lunarDate,
      birthTime,
      trueSolarTime,
      location,
      // 构造Date对象用于排盘
      birthDateObj: new Date(solarDate.year, solarDate.month - 1, solarDate.day)
    };
  }

  /**
   * 排盘计算
   */
  calculatePanpai(processedInput, gender) {
    const { birthDateObj, trueSolarTime } = processedInput;
    const hour = trueSolarTime.hour;

    // 八字排盘
    const bazi = this.baziCalc.calculateBazi(birthDateObj, hour, gender);
    bazi.dayun = this.baziCalc.calculateDayun(bazi.day, gender);
    bazi.liunian = this.baziCalc.calculateLiunian(bazi.day, birthDateObj.getFullYear(), 20);
    bazi.strength = this.baziCalc.calculateDayMasterStrength(bazi);

    // 紫微斗数排盘
    const ziwei = this.ziweiCalc.calculateZiwei(birthDateObj, hour, gender);

    // 盲派分析
    const mengpai = this.mengpaiCalc.calculateMengpai(bazi);

    // 南北派分析
    const nanbeipai = this.nanbeipaiCalc.calculateNanbeipai(bazi, ziwei);

    return {
      bazi,
      ziwei,
      mengpai,
      nanbeipai
    };
  }

  /**
   * 准备LLM分析输入
   */
  prepareAnalysisInput(processedInput, panpai) {
    return {
      name: processedInput.name,
      gender: processedInput.gender,
      birthDate: `${processedInput.solarDate.year}年${processedInput.solarDate.month}月${processedInput.solarDate.day}日`,
      location: processedInput.location,
      birthHour: processedInput.trueSolarTime.hour,
      ziweiData: JSON.stringify(panpai.ziwei, null, 2),
      baziData: JSON.stringify(panpai.bazi, null, 2),
      mengpaiData: JSON.stringify(panpai.mengpai, null, 2),
      nanbeipaiData: JSON.stringify(panpai.nanbeipai, null, 2)
    };
  }

  /**
   * 执行5轮验证分析
   *
   * 工作原理：
   * - FortuneTeller 只负责排盘计算（复杂的命理数学运算）
   * - 返回结构化数据给 Claude（LLM）
   * - Claude 使用 prompts/*.md 进行实际的分析推理
   * - 不需要在这里调用外部API，因为 Claude 本身就是 LLM
   *
   * @param {Object} panpai - 排盘数据
   * @param {Object} analysisInput - 分析输入
   * @param {Object} processedInput - 处理后的输入
   * @returns {Object} 分析框架（待 Claude 填充）
   */
  async runAnalysis(panpai, analysisInput, processedInput) {
    // 返回分析框架，Claude 会使用 prompts 进行实际分析
    // prompts 位于 ./prompts/ 目录，包含：
    // - ziwei-analysis.md：紫微斗数分析
    // - bazi-analysis.md：八字命理分析
    // - mengpai-analysis.md：盲派分析
    // - nanbeipai-analysis.md：南北派分析
    // - cross-validation.md：5轮交叉验证

    return {
      // 第1轮：各派系独立分析结果（待Claude填充）
      round1: {
        ziwei: null,
        bazi: null,
        mengpai: null,
        nanbeipai: null,
        note: '待Claude使用prompts/ziwei-analysis.md等进行深度分析'
      },
      // 第2轮：交叉验证结果（待Claude计算）
      round2: {
        crossValidation: null,
        note: '待Claude进行派系交叉验证'
      },
      // 第3轮：自我校验（待Claude执行）
      round3: {
        selfCheck: null,
        note: '待Claude对矛盾点进行自我校验'
      },
      // 第4轮：典籍依据核查（待Claude执行）
      round4: {
        classicsCheck: null,
        note: '待Claude核查典籍依据'
      },
      // 第5轮：一致性确认（待Claude生成）
      round5: {
        consistencyScore: null,
        finalConclusion: null,
        riskWarning: null,
        note: '待Claude生成最终结论'
      },
      // 时代背景分析（已计算）
      eraBackground: this.getEraAnalysis(processedInput.solarDate.year)
    };
  }

  /**
   * 时代背景分析
   * @param {number} birthYear - 出生年份
   */
  getEraAnalysis(birthYear) {
    let era = null;

    // 查找对应的时代背景
    for (const [key, data] of Object.entries(this.eraData)) {
      const [start, end] = key.split('-').map(Number);
      const year = parseInt(birthYear, 10);
      if (year >= start && year <= end) {
        era = data;
        era.period = key;
        break;
      }
    }

    return era || {
      name: '未知时期',
      description: '无法确定时代背景'
    };
  }

  /**
   * 生成报告
   */
  generateReport(name, processedInput, panpai, analysis) {
    const eraAnalysis = analysis.eraBackground;

    return `# ${name} 命理分析报告

## 一、基础信息

- 姓名：${name}
- 性别：${processedInput.gender}
- 出生日期：${processedInput.solarDate.year}年${processedInput.solarDate.month}月${processedInput.solarDate.day}日
- 出生地：${processedInput.location || '北京'}
- 真太阳时：${processedInput.trueSolarTime.hour}时${processedInput.trueSolarTime.minute}分
- 时代背景：${eraAnalysis.name}
- 分析师：算命skills-made by 孔龙
- 生成时间：${new Date().toLocaleString('zh-CN')}

## 二、八字命理

### 四柱
- 年柱：${panpai.bazi.year}
- 月柱：${panpai.bazi.month}
- 日柱：${panpai.bazi.day}
- 时柱：${panpai.bazi.hour}

### 日主
- 日主：${panpai.bazi.dayMaster}（${panpai.bazi.dayMasterYinyang}${panpai.bazi.dayMasterWuxing}）
- 日主强弱：${panpai.bazi.strength.strength}

### 五行分布
- 木：${panpai.bazi.wuxingDistribution.木}
- 火：${panpai.bazi.wuxingDistribution.火}
- 土：${panpai.bazi.wuxingDistribution.土}
- 金：${panpai.bazi.wuxingDistribution.金}
- 水：${panpai.bazi.wuxingDistribution.水}

### 纳音
- 年柱：${panpai.bazi.nayin.year}
- 日柱：${panpai.bazi.nayin.day}

## 三、紫微斗数

### 命宫
- 命宫地支：${panpai.ziwei.mingGongZhi}
- 命宫主星：${panpai.ziwei.gongwei['命宫'].mainStar}

### 四化
- 禄：${panpai.ziwei.sihua.lu}
- 权：${panpai.ziwei.sihua.quan}
- 科：${panpai.ziwei.sihua.ke}
- 忌：${panpai.ziwei.sihua.ji}

## 四、盲派分析

### 调候
- 季节：${panpai.mengpai.tiaohou.season}
- 调候用神：${panpai.mengpai.tiaohou.result}

### 流通
- 流通状态：${panpai.mengpai.liutong.liutongStatus}

### 格局
- 格局类型：${panpai.mengpai.geju.gejuType}
- 格局名称：${panpai.mengpai.geju.gejuName}

## 五、南北派分析

### 南方派用神
${panpai.nanbeipai.uniqueYongshen.nanfang.analysis}

### 北方派用神
${panpai.nanbeipai.uniqueYongshen.beifang.analysis}

### 干支阴阳
${panpai.nanbeipai.ganzhiYinyang.analysis}

## 六、时代背景

### 出生时期
- 时期：${eraAnalysis.name}
- 特征：${eraAnalysis.features ? eraAnalysis.features.join('、') : '无'}
- 机遇：${eraAnalysis.opportunity || '无'}
- 风险：${eraAnalysis.risk || '无'}
- 说明：${eraAnalysis.description || '无'}

## 七、综合分析

**【此部分需要 Claude 基于 prompts 进行深度分析】**

Claude 会：
- 综合四大派系的分析结果
- 进行5轮交叉验证
- 给出一致性评分
- 解释矛盾点
- 提供典籍依据

## 八、人生建议

**【此部分需要 Claude 基于排盘数据进行智能分析】**

Claude 会：
- 根据日主五行分析性格特点
- 根据用神喜忌提供职业建议
- 根据四化飞星分析运势走向
- 根据时代背景给出时代机遇建议
- 结合盲派格局提供人生策略

## 九、免责声明

本报告仅供参考，娱乐而已。

**三分天注定，七分靠打拼。**

一名二运三风水。不要相信宿命论，品德、福报、风水都是宏观命运的一部分。只要心善、努力和乐观，就是好命。加油！

---
*本报告由FortuneTeller算命系统自动生成*

## 报告信息

- **报告生成时间：** ${new Date().toLocaleString('zh-CN')}
- **分析师：** 算命skills-made by 孔龙
- **排盘引擎：** FortuneTeller v1.1.0
- **报告版本：** 1.1.0

---
`;
  }

  /**
   * 简化入口：直接返回排盘结果（不含LLM分析）
   * 非必填字段使用默认值，无需用户授权
   */
  calculate(input) {
    // 同步版本，验证并处理输入（使用默认值）
    const validation = this.validateAndProcessInput(input);
    if (!validation.valid) {
      const errorMsg = this.getMissingFieldsMessage(validation.missingFields);
      console.error(errorMsg);
      return {
        success: false,
        error: 'REQUIRED_FIELDS_MISSING',
        missingFields: validation.missingFields,
        message: errorMsg
      };
    }

    // 验证通过，使用处理后的输入进行排盘计算
    const processedInput = this.processInputSync(validation.processedInput);
    const panpai = this.calculatePanpai(processedInput, validation.processedInput.gender);
    return {
      success: true,
      input: processedInput,
      panpai
    };
  }

  /**
   * 同步处理输入
   */
  processInputSync(input) {
    const { birthDate, birthTime, location, calendarType } = input;

    let solarDate;
    if (calendarType === 'lunar') {
      solarDate = this.inputHandler.lunarToSolar(
        birthDate.year,
        birthDate.month,
        birthDate.day
      );
    } else {
      solarDate = {
        year: birthDate.year,
        month: birthDate.month,
        day: birthDate.day
      };
    }

    let trueSolarTime = { hour: birthTime, minute: 0 };
    if (location) {
      const cityLongitude = this.inputHandler.getChinaCityLongitude(location);
      if (cityLongitude) {
        trueSolarTime = this.inputHandler.trueSolarTime(cityLongitude, birthTime, 0);
      }
    }

    return {
      name: input.name,
      gender: input.gender,
      originalDate: birthDate,
      solarDate,
      birthTime,
      trueSolarTime,
      location,
      birthDateObj: new Date(solarDate.year, solarDate.month - 1, solarDate.day)
    };
  }
}

module.exports = FortuneTeller;