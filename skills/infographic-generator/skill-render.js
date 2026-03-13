/**
 * 技能渲染脚本
 * 封装AI驱动渲染功能，提供统一的技能接口
 */

const { aiRender, generateConfigFromNaturalLanguage } = require('./assets/ai-render.js');
const fs = require('fs');
const path = require('path');

/**
 * 技能渲染函数
 * @param {string} input - 自然语言描述或JSON配置文件路径
 * @param {Object} options - 选项
 * @param {string} options.outputPath - 输出PNG文件路径（可选）
 * @param {boolean} options.saveConfig - 是否保存JSON配置（默认true）
 * @param {string} options.configPath - JSON配置文件路径（可选）
 * @param {boolean} options.useConfig - 是否直接使用JSON配置（默认false）
 * @returns {Object} 渲染结果
 */
async function skillRender(input, options = {}) {
  const {
    outputPath = null,
    saveConfig = true,
    configPath = null,
    useConfig = false
  } = options;

  console.log('🚀 技能渲染启动...');
  
  let config;
  let savedConfigPath = null;

  // 判断输入类型
  if (useConfig || (input.endsWith('.json') && fs.existsSync(input))) {
    // 直接使用JSON配置
    console.log(`📝 输入: JSON配置文件 (${input})`);
    console.log('\n1. 加载JSON配置...');
    config = loadConfig(input);
    savedConfigPath = input;
  } else {
    // 从自然语言生成JSON配置
    console.log(`📝 输入: ${input}`);
    console.log('\n1. 生成JSON配置...');
    config = await generateConfigFromNaturalLanguage(input);

    // 2. 保存JSON配置（如果需要）
    if (saveConfig) {
      savedConfigPath = configPath || path.join(__dirname, 'temp-config.json');
      console.log(`2. 保存配置文件: ${savedConfigPath}`);
      fs.writeFileSync(savedConfigPath, JSON.stringify(config, null, 2), 'utf-8');
    }
  }

  // 3. 渲染PNG图片
  console.log('3. 渲染PNG图片...');
  const result = await renderFromConfig(config, outputPath);

  console.log('\n✅ 技能渲染完成！');

  return {
    success: true,
    outputPath: result.outputPath,
    configPath: savedConfigPath,
    config: config
  };
}

/**
 * 从JSON文件加载配置
 * @param {string} configPath - JSON配置文件路径
 * @returns {Object} 配置数据
 */
function loadConfig(configPath) {
  try {
    const configData = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configData);
  } catch (error) {
    console.error(`加载配置文件失败: ${error.message}`);
    throw error;
  }
}

/**
 * 从配置渲染PNG图片
 * @param {Object} config - 配置对象
 * @param {string} outputPath - 输出PNG文件路径（可选）
 * @returns {Object} 渲染结果
 */
async function renderFromConfig(config, outputPath) {
  const outputFile = outputPath || config.output || 'output.png';
  const outputPathFull = path.join(__dirname, outputFile);

  // 尝试使用canvas渲染
  try {
    console.log(`  - 尝试使用canvas渲染...`);
    const { renderInfographic, loadTemplate } = require('./assets/example-render.js');

    // 加载模板
    console.log(`  - 加载模板: ${config.template}`);
    const templatePath = path.join(__dirname, 'assets', 'templates', config.template, 'template.json');
    const template = loadTemplate(templatePath);

    // 渲染信息图
    console.log('  - 渲染信息图...');
    const canvas = await renderInfographic(template, config.content, config.style);

    // 保存PNG
    console.log(`  - 保存PNG: ${outputFile}`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPathFull, buffer);

    console.log('  ✅ Canvas渲染成功！');
    return { outputPath: outputPathFull, renderer: 'canvas' };
  } catch (error) {
    console.log(`  ⚠️  Canvas渲染失败: ${error.message}`);
    console.log(`  - 尝试使用HTML+Puppeteer渲染...`);

    // canvas失败，使用HTML+Puppeteer渲染
    try {
      const { renderInfographic } = require('./generate-html');
      const result = await renderInfographic(config, outputPathFull);

      if (result.success) {
        console.log('  ✅ HTML+Puppeteer渲染成功！');
        return { outputPath: outputPathFull, renderer: 'html-puppeteer' };
      } else {
        throw new Error('HTML渲染失败');
      }
    } catch (htmlError) {
      console.error('  ❌ HTML+Puppeteer渲染也失败了！');
      console.error(`  - 错误: ${htmlError.message}`);
      throw new Error(`所有渲染方式都失败了。Canvas错误: ${error.message}, HTML错误: ${htmlError.message}`);
    }
  }
}

/**
 * 批量技能渲染
 * @param {Array<string>} naturalLanguageInputs - 自然语言描述数组
 * @param {Object} options - 选项
 * @returns {Array<Object>} 渲染结果数组
 */
async function batchSkillRender(naturalLanguageInputs, options = {}) {
  console.log(`🚀 批量技能渲染启动，共 ${naturalLanguageInputs.length} 个任务...`);

  const results = [];
  for (let i = 0; i < naturalLanguageInputs.length; i++) {
    console.log(`\n[${i + 1}/${naturalLanguageInputs.length}] 处理任务...`);
    try {
      const result = await skillRender(naturalLanguageInputs[i], {
        ...options,
        outputPath: options.outputPath 
          ? options.outputPath.replace(/\.png$/, `-${i + 1}.png`)
          : null,
        configPath: options.configPath
          ? options.configPath.replace(/\.json$/, `-${i + 1}.json`)
          : null
      });
      results.push(result);
    } catch (error) {
      console.error(`❌ 任务 ${i + 1} 失败:`, error.message);
      results.push({
        success: false,
        error: error.message
      });
    }
  }

  console.log(`\n✅ 批量技能渲染完成！成功: ${results.filter(r => r.success).length}/${results.length}`);
  return results;
}

// 命令行使用
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('使用方法:');
    console.log('  node skill-render.js <输入> [选项]');
    console.log('');
    console.log('输入:');
    console.log('  自然语言描述        如: "请帮我生成一个关于Python编程语言的信息图"');
    console.log('  JSON配置文件路径      如: config/python.json');
    console.log('');
    console.log('选项:');
    console.log('  --output <路径>    指定输出PNG文件路径');
    console.log('  --no-save-config   不保存JSON配置文件');
    console.log('  --config <路径>    指定JSON配置文件路径');
    console.log('  --use-config       直接使用JSON配置文件');
    console.log('');
    console.log('示例:');
    console.log('  # 使用自然语言');
    console.log('  node skill-render.js "请帮我生成一个关于Python编程语言的信息图"');
    console.log('  node skill-render.js "请帮我生成一个关于Python编程语言的信息图" --output output/python.png');
    console.log('  node skill-render.js "请帮我生成一个关于Python编程语言的信息图" --no-save-config');
    console.log('  ');
    console.log('  # 使用JSON配置文件');
    console.log('  node skill-render.js config/python.json');
    console.log('  node skill-render.js config/python.json --output output/python.png');
    console.log('  node skill-render.js config/python.json --use-config');
    process.exit(1);
  }

  // 解析参数
  const input = args[0];
  const options = {
    outputPath: null,
    saveConfig: true,
    configPath: null,
    useConfig: false
  };

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--output' && args[i + 1]) {
      options.outputPath = args[i + 1];
      i++;
    } else if (args[i] === '--no-save-config') {
      options.saveConfig = false;
    } else if (args[i] === '--config' && args[i + 1]) {
      options.configPath = args[i + 1];
      i++;
    } else if (args[i] === '--use-config') {
      options.useConfig = true;
    }
  }

  skillRender(input, options).catch(error => {
    console.error('\n❌ 渲染失败:', error.message);
    process.exit(1);
  });
}

module.exports = { skillRender, batchSkillRender };
