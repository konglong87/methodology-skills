/**
 * 技能渲染脚本
 * 封装AI驱动渲染功能，提供统一的技能接口
 */

const { aiRender, generateConfigFromNaturalLanguage } = require('./assets/ai-render.js');
const fs = require('fs');
const path = require('path');

// 安全配置
const MAX_INPUT_LENGTH = 10000; // 最大输入长度
const MAX_OUTPUT_PATH_LENGTH = 500; // 最大输出路径长度
const ALLOWED_OUTPUT_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

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

  // 输入验证
  validateInput(input, outputPath, configPath);

  let config;
  let savedConfigPath = null;

  // 判断输入类型
  if (useConfig || (input.endsWith('.json') && fs.existsSync(input))) {
    // 直接使用JSON配置
    console.log(`📝 输入: JSON配置文件 (${input})`);
    console.log('\n1. 加载JSON配置...');
    config = loadConfig(input);
    savedConfigPath = input;
  } else if (input.endsWith('.md') && fs.existsSync(input)) {
    // 从 Markdown 文件读取内容
    console.log(`📝 输入: Markdown文件 (${input})`);
    console.log('\n1. 读取Markdown文件内容...');
    const mdContent = fs.readFileSync(input, 'utf-8');
    console.log(`2. 生成JSON配置...`);
    config = await generateConfigFromNaturalLanguage(mdContent);

    // 验证生成的配置
    validateConfig(config);

    // 保存JSON配置（如果需要）
    if (saveConfig) {
      savedConfigPath = configPath || path.join(__dirname, 'temp-config.json');
      console.log(`3. 保存配置文件: ${savedConfigPath}`);
      fs.writeFileSync(savedConfigPath, JSON.stringify(config, null, 2), 'utf-8');
    }
  } else {
    // 从自然语言生成JSON配置
    console.log(`📝 输入: ${input}`);
    console.log('\n1. 生成JSON配置...');
    config = await generateConfigFromNaturalLanguage(input);

    // 验证生成的配置
    validateConfig(config);

    // 2. 保存JSON配置（如果需要）
    if (saveConfig) {
      savedConfigPath = configPath || path.join(__dirname, 'temp-config.json');
      console.log(`2. 保存配置文件: ${savedConfigPath}`);
      fs.writeFileSync(savedConfigPath, JSON.stringify(config, null, 2), 'utf-8');
    }
  }

  // 3. 渲染PNG图片（默认生成横版和竖版）
  console.log('3. 渲染PNG图片（横版和竖版）...');

  // 确定基础输出路径
  const baseOutputPath = outputPath || path.join(__dirname, 'output-infographic.png');
  const baseFileName = path.basename(baseOutputPath, '.png');
  const outputDir = path.dirname(baseOutputPath);

  // 生成横版版本
  const horizontalConfig = JSON.parse(JSON.stringify(config));
  horizontalConfig.output_config = { width: 1920, height: 1080, orientation: 'horizontal' };

  const horizontalPath = path.join(outputDir, `${baseFileName}-landscape.png`);
  const horizontalResult = await renderFromConfig(horizontalConfig, horizontalPath);
  console.log(`  ✅ 横版渲染成功！文件: ${horizontalPath}`);

  // 生成竖版版本
  const verticalConfig = JSON.parse(JSON.stringify(config));
  verticalConfig.output_config = { width: 1080, height: 1920, orientation: 'vertical' };

  const verticalPath = path.join(outputDir, `${baseFileName}-portrait.png`);
  const verticalResult = await renderFromConfig(verticalConfig, verticalPath);
  console.log(`  ✅ 竖版渲染成功！文件: ${verticalPath}`);

  console.log('\n✅ 技能渲染完成！');

  return {
    success: true,
    outputPath: horizontalResult.outputPath,
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
  const outputPathFull = path.isAbsolute(outputFile) ? outputFile : path.join(__dirname, outputFile);

  // 优先尝试使用Remotion渲染
  try {
    console.log(`  - 尝试使用Remotion渲染...`);
    const { renderWithRemotion } = require('./remotion/render.js');

    const result = await renderWithRemotion(config, outputPathFull);

    if (result.success) {
      console.log('  ✅ Remotion渲染成功！');
      return { outputPath: outputPathFull, renderer: 'remotion' };
    } else {
      throw new Error(result.error || 'Remotion渲染失败');
    }
  } catch (error) {
    console.log(`  ⚠️  Remotion渲染失败: ${error.message}`);
    console.log(`  - 尝试使用HTML+Puppeteer渲染...`);

    // Remotion失败，使用HTML+Puppeteer渲染作为降级方案
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
      throw new Error(`所有渲染方式都失败了。Remotion错误: ${error.message}, HTML错误: ${htmlError.message}`);
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

/**
 * 验证输入安全性
 * @param {string} input - 输入内容
 * @param {string} outputPath - 输出路径
 * @param {string} configPath - 配置文件路径
 */
function validateInput(input, outputPath, configPath) {
  // 检查输入是否存在
  if (!input || typeof input !== 'string') {
    throw new Error('输入不能为空且必须是字符串');
  }

  // 检查输入长度
  if (input.length > MAX_INPUT_LENGTH) {
    throw new Error(`输入长度超过限制 (${input.length} > ${MAX_INPUT_LENGTH})`);
  }

  // 检查路径遍历攻击
  if (outputPath) {
    validatePath(outputPath, '输出路径');
  }

  if (configPath) {
    validatePath(configPath, '配置文件路径');
  }
}

/**
 * 验证路径安全性（防止路径遍历攻击）
 * @param {string} filePath - 文件路径
 * @param {string} context - 上下文描述
 */
function validatePath(filePath, context) {
  // 检查路径长度
  if (filePath.length > MAX_OUTPUT_PATH_LENGTH) {
    throw new Error(`${context}长度超过限制 (${filePath.length} > ${MAX_OUTPUT_PATH_LENGTH})`);
  }

  // 检查路径遍历攻击
  const normalizedPath = path.normalize(filePath);
  if (normalizedPath.includes('..') || path.isAbsolute(filePath)) {
    throw new Error(`${context}包含非法字符或使用绝对路径: ${filePath}`);
  }

  // 检查文件扩展名
  const ext = path.extname(filePath).toLowerCase();
  if (ext && !ALLOWED_OUTPUT_EXTENSIONS.includes(ext) && ext !== '.json') {
    throw new Error(`${context}使用不允许的扩展名: ${ext}`);
  }
}

/**
 * 验证配置结构
 * @param {Object} config - 配置对象
 */
function validateConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new Error('配置必须是非空对象');
  }

  // 检查必需字段
  if (!config.template) {
    throw new Error('配置缺少必需字段: template');
  }

  if (!config.content) {
    throw new Error('配置缺少必需字段: content');
  }

  // 检查模板名称是否合法
  const allowedTemplates = ['knowledge', 'comparison', 'process', 'data', 'xiaohongshu', 'scientific'];
  if (!allowedTemplates.includes(config.template)) {
    throw new Error(`不支持的模板类型: ${config.template}`);
  }
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
