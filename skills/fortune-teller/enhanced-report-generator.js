const ValidationEngine = require('./lib/validation-engine');
const BaziCalculator = require('./lib/bazi-calculator');
const fs = require('fs');
const path = require('path');

/**
 * 增强报告生成器
 * 职责：协调计算、验证、数据整合、模板渲染
 */
class EnhancedReportGenerator {
  constructor() {
    this.validationEngine = new ValidationEngine();
    this.baziCalculator = new BaziCalculator();
  }

  /**
   * 生成增强报告
   * @param {Object} userInput - 用户输入信息
   * @returns {Object} - 包含 json、markdown、prompt 的结果对象
   */
  async generate(userInput) {
    console.log('[增强报告生成器] 开始生成...');

    try {
      // 1. 计算八字基础数据
      const birthDate = new Date(
        userInput.birthDate.year,
        userInput.birthDate.month - 1,
        userInput.birthDate.day,
        userInput.birthTime
      );

      const baziData = this.baziCalculator.calculateBazi(
        birthDate,
        userInput.birthTime,
        userInput.gender
      );

      // 2. 第1层验证（计算器）
      const layer1Result = this.validationEngine.validateQiyunTime(
        userInput.birthDate,
        userInput.gender,
        baziData.yearGan,
        baziData.yearZhi,
        undefined // 节气信息暂不可用
      );

      // 3. 生成增强分析数据
      const enhancedData = this.generateEnhancedData(baziData);

      // 4. 整合JSON输出
      const jsonOutput = this.buildJsonOutput(
        userInput,
        layer1Result,
        baziData,
        enhancedData
      );

      // 5. 渲染Markdown框架
      const markdownFrame = this.renderMarkdownFrame(baziData, enhancedData);

      // 6. 生成AI提示词
      const aiPrompt = this.generateAIPrompt(userInput, baziData, enhancedData);

      console.log('[增强报告生成器] 生成完成');

      return {
        json: jsonOutput,
        markdown: markdownFrame,
        prompt: aiPrompt
      };
    } catch (error) {
      console.error('[增强报告生成器] 生成失败:', error);
      throw error;
    }
  }

  /**
   * 生成增强分析数据
   */
  generateEnhancedData(baziData) {
    try {
      // 十二长生（针对第一步大运）
      const firstDayun = baziData.dayun && baziData.dayun.length > 0
        ? baziData.dayun[0].ganzhi
        : null;

      const shierChangsheng = firstDayun && this.baziCalculator.calculateShierChangsheng
        ? this.baziCalculator.calculateShierChangsheng(baziData.dayMaster, firstDayun)
        : null;

      // 五行旺相休囚死（暂不实现，方法不存在）
      const wuxingWangXiang = null;

      // 大运分析（暂不实现，方法不存在）
      const dayunAnalysis = baziData.dayun || [];

      return {
        shierChangsheng,
        wuxingWangXiang,
        dayunAnalysis
      };
    } catch (error) {
      console.warn('[增强报告生成器] 增强数据生成失败，使用默认值:', error.message);
      return {
        shierChangsheng: null,
        wuxingWangXiang: null,
        dayunAnalysis: []
      };
    }
  }

  /**
   * 构建JSON输出
   */
  buildJsonOutput(userInput, layer1Result, baziData, enhancedData) {
    return {
      meta: {
        version: '2.1.0',
        mode: 'enhanced',
        generatedAt: new Date().toISOString()
      },
      userInput: userInput,
      validationResults: {
        layer1: layer1Result,
        layer2Prompt: this.loadPrompt('validation-layer2'),
        layer3Prompt: this.loadPrompt('validation-layer3')
      },
      baziData: {
        四柱: {
          年柱: { 天干: baziData.yearGan, 地支: baziData.yearZhi, 完整: baziData.year },
          月柱: { 天干: baziData.monthGan, 地支: baziData.monthZhi, 完整: baziData.month },
          日柱: { 天干: baziData.dayGan, 地支: baziData.dayZhi, 完整: baziData.day },
          时柱: { 天干: baziData.hourGan, 地支: baziData.hourZhi, 完整: baziData.hour }
        },
        五行: baziData.wuxingDistribution,
        日主: baziData.dayMaster,
        日主五行: baziData.dayMasterWuxing,
        日主阴阳: baziData.dayMasterYinyang,
        大运: baziData.dayun,
        纳音: baziData.nayin,
        起运时间: layer1Result.qiyunAge // 使用验证结果中的起运年龄
      },
      enhancedData: enhancedData,
      analysisPrompts: {
        detailedAnalysis: this.loadPrompt('detailed-analysis'),
        careerAdvice: this.loadPrompt('career-advice'),
        dayunDeepDive: this.loadPrompt('dayun-deep-dive'),
        liunianEvents: this.loadPrompt('liunian-events')
      }
    };
  }

  /**
   * 渲染Markdown框架
   */
  renderMarkdownFrame(baziData, enhancedData) {
    let markdown = `# 命理分析框架\n\n`;

    markdown += `## 一、命盘概览\n\n`;
    markdown += `### 四柱八字\n`;

    // 使用实际的数据结构
    markdown += `- 年柱：${baziData.yearGan || '?'}${baziData.yearZhi || '?'}\n`;
    markdown += `- 月柱：${baziData.monthGan || '?'}${baziData.monthZhi || '?'}\n`;
    markdown += `- 日柱：${baziData.dayGan || '?'}${baziData.dayZhi || '?'}\n`;
    markdown += `- 时柱：${baziData.hourGan || '?'}${baziData.hourZhi || '?'}\n\n`;

    markdown += `### 日主信息\n`;
    markdown += `- 日主：${baziData.dayMaster || '?'}\n`;
    markdown += `- 五行：${baziData.dayMasterWuxing || '?'}\n`;
    markdown += `- 阴阳：${baziData.dayMasterYinyang || '?'}\n\n`;

    markdown += `## 二、五行分析\n\n`;
    if (baziData.wuxingDistribution) {
      markdown += `### 五行分布\n`;
      const wuxing = baziData.wuxingDistribution;
      markdown += `- 木：${wuxing.木 || 0}个\n`;
      markdown += `- 火：${wuxing.火 || 0}个\n`;
      markdown += `- 土：${wuxing.土 || 0}个\n`;
      markdown += `- 金：${wuxing.金 || 0}个\n`;
      markdown += `- 水：${wuxing.水 || 0}个\n\n`;
    }

    markdown += `[待AI工具进行五行旺衰分析...]\n\n`;

    markdown += `## 三、大运分析\n\n`;
    if (baziData.dayun && baziData.dayun.length > 0) {
      baziData.dayun.forEach((dayun, index) => {
        markdown += `### 第${index + 1}步大运：${dayun.ganzhi || '?'}\n`;
        markdown += `- 年龄：${dayun.startAge}-${dayun.endAge}岁\n`;
        if (enhancedData.shierChangsheng && index === 0) {
          markdown += `- 十二长生：${enhancedData.shierChangsheng.state || '?'}（${enhancedData.shierChangsheng.meaning || '?'}）\n`;
        }
        markdown += `\n[待AI工具分析...]\n\n`;
      });
    } else {
      markdown += `[待AI工具分析...]\n\n`;
    }

    markdown += `## 四、流年预测\n\n`;
    markdown += `[待AI工具分析...]\n\n`;

    markdown += `## 五、人生指引\n\n`;
    markdown += `[待AI工具分析...]\n\n`;

    markdown += `## 六、纳音五行\n\n`;
    if (baziData.nayin) {
      markdown += `- 年柱纳音：${baziData.nayin.year || '?'}\n`;
      markdown += `- 月柱纳音：${baziData.nayin.month || '?'}\n`;
      markdown += `- 日柱纳音：${baziData.nayin.day || '?'}\n`;
      markdown += `- 时柱纳音：${baziData.nayin.hour || '?'}\n\n`;
    }

    return markdown;
  }

  /**
   * 生成AI提示词
   */
  generateAIPrompt(userInput, baziData, enhancedData) {
    const detailedAnalysisPrompt = this.loadPrompt('detailed-analysis');
    const careerAdvicePrompt = this.loadPrompt('career-advice');
    const dayunDeepDivePrompt = this.loadPrompt('dayun-deep-dive');
    const liunianEventsPrompt = this.loadPrompt('liunian-events');

    let prompt = `# AI分析提示词\n\n`;
    prompt += `你好，我是AI算命助手。请根据以下信息生成一份完整的命理分析报告（8000-12000字）。\n\n`;

    prompt += `## 用户信息\n`;
    prompt += `- 姓名：${userInput.name}\n`;
    prompt += `- 性别：${userInput.gender}\n`;
    prompt += `- 出生日期：${userInput.birthDate.year}年${userInput.birthDate.month}月${userInput.birthDate.day}日\n`;
    prompt += `- 出生时辰：${userInput.birthTime}点\n`;
    prompt += `- 出生地：${userInput.location}\n\n`;

    prompt += `## 命盘数据\n`;
    prompt += `### 四柱八字\n`;
    prompt += `- 年柱：${baziData.yearGan || '?'}${baziData.yearZhi || '?'}\n`;
    prompt += `- 月柱：${baziData.monthGan || '?'}${baziData.monthZhi || '?'}\n`;
    prompt += `- 日柱：${baziData.dayGan || '?'}${baziData.dayZhi || '?'}\n`;
    prompt += `- 时柱：${baziData.hourGan || '?'}${baziData.hourZhi || '?'}\n\n`;

    prompt += `### 日主信息\n`;
    prompt += `- 日主：${baziData.dayMaster || '?'}\n`;
    prompt += `- 五行：${baziData.dayMasterWuxing || '?'}\n`;
    prompt += `- 阴阳：${baziData.dayMasterYinyang || '?'}\n\n`;

    prompt += `### 五行分布\n`;
    if (baziData.wuxingDistribution) {
      const wuxing = baziData.wuxingDistribution;
      prompt += `- 木：${wuxing.木 || 0}个\n`;
      prompt += `- 火：${wuxing.火 || 0}个\n`;
      prompt += `- 土：${wuxing.土 || 0}个\n`;
      prompt += `- 金：${wuxing.金 || 0}个\n`;
      prompt += `- 水：${wuxing.水 || 0}个\n\n`;
    }

    prompt += `### 大运\n`;
    if (baziData.dayun && baziData.dayun.length > 0) {
      baziData.dayun.slice(0, 5).forEach((dayun, index) => {
        prompt += `- 第${index + 1}步：${dayun.ganzhi}（${dayun.startAge}-${dayun.endAge}岁）\n`;
      });
      prompt += `\n`;
    }

    if (enhancedData.shierChangsheng) {
      prompt += `### 第一步大运十二长生\n`;
      prompt += `- 状态：${enhancedData.shierChangsheng.state}\n`;
      prompt += `- 含义：${enhancedData.shierChangsheng.meaning}\n\n`;
    }

    prompt += `## 分析要求\n\n`;
    prompt += `### 1. 详细命理分析\n`;
    prompt += `${detailedAnalysisPrompt}\n\n`;

    prompt += `### 2. 事业建议\n`;
    prompt += `${careerAdvicePrompt}\n\n`;

    prompt += `### 3. 大运深度分析\n`;
    prompt += `${dayunDeepDivePrompt}\n\n`;

    prompt += `### 4. 流年事件预测\n`;
    prompt += `${liunianEventsPrompt}\n\n`;

    prompt += `## 输出格式\n`;
    prompt += `请生成一份完整的Markdown格式报告，包含以下章节：\n`;
    prompt += `1. 命盘概览\n`;
    prompt += `2. 三层验证过程\n`;
    prompt += `3. 命理深度分析\n`;
    prompt += `4. 大运流年分析\n`;
    prompt += `5. 人生指引\n\n`;

    prompt += `**字数要求：8000-12000字**\n`;

    return prompt;
  }

  /**
   * 加载提示词模板
   */
  loadPrompt(templateName) {
    const templatePath = path.join(
      __dirname,
      'prompts',
      'enhanced',
      `${templateName}.md`
    );

    try {
      if (fs.existsSync(templatePath)) {
        return fs.readFileSync(templatePath, 'utf-8');
      }
    } catch (error) {
      console.warn(`[增强报告生成器] 提示词模板 ${templateName} 加载失败:`, error.message);
    }

    return `[提示词模板 ${templateName} 未找到]`;
  }
}

module.exports = EnhancedReportGenerator;