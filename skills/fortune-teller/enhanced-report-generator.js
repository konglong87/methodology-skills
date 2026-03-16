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
        baziData.年柱.天干,
        baziData.年柱.地支,
        baziData.节气信息
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
      // 十二长生
      const shierChangsheng = this.baziCalculator.calculateShierChangsheng
        ? this.baziCalculator.calculateShierChangsheng(
            baziData.日主,
            baziData.四柱
          )
        : null;

      // 五行旺相休囚死
      const wuxingWangXiang = this.baziCalculator.calculateWuxingWangXiang
        ? this.baziCalculator.calculateWuxingWangXiang(
            baziData.日主,
            baziData.出生月份
          )
        : null;

      // 大运分析
      const dayunAnalysis = baziData.大运
        ? baziData.大运.map(dayun => {
            return this.baziCalculator.analyzeDayunShengke
              ? this.baziCalculator.analyzeDayunShengke(
                  dayun,
                  baziData.四柱,
                  baziData.日主
                )
              : dayun;
          })
        : [];

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
        四柱: baziData.四柱,
        五行: baziData.五行,
        十神: baziData.十神,
        大运: baziData.大运,
        起运时间: baziData.起运时间,
        日主: baziData.日主
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

    if (baziData.四柱) {
      markdown += `- 年柱：${baziData.四柱.年柱?.天干 || '?'}${baziData.四柱.年柱?.地支 || '?'}\n`;
      markdown += `- 月柱：${baziData.四柱.月柱?.天干 || '?'}${baziData.四柱.月柱?.地支 || '?'}\n`;
      markdown += `- 日柱：${baziData.四柱.日柱?.天干 || '?'}${baziData.四柱.日柱?.地支 || '?'}\n`;
      markdown += `- 时柱：${baziData.四柱.时柱?.天干 || '?'}${baziData.四柱.时柱?.地支 || '?'}\n\n`;
    }

    markdown += `## 二、五行分析\n\n`;
    markdown += `[待AI工具分析...]\n\n`;

    markdown += `## 三、大运分析\n\n`;
    if (enhancedData.dayunAnalysis && enhancedData.dayunAnalysis.length > 0) {
      enhancedData.dayunAnalysis.forEach((dayun, index) => {
        markdown += `### 第${index + 1}步大运：${dayun.天干 || '?'}${dayun.地支 || '?'}\n\n`;
        markdown += `[待AI工具分析...]\n\n`;
      });
    } else {
      markdown += `[待AI工具分析...]\n\n`;
    }

    markdown += `## 四、流年预测\n\n`;
    markdown += `[待AI工具分析...]\n\n`;

    markdown += `## 五、人生指引\n\n`;
    markdown += `[待AI工具分析...]\n\n`;

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
    prompt += `\`\`\`json\n${JSON.stringify(baziData, null, 2)}\n\`\`\`\n\n`;

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