/**
 * 技能渲染脚本
 * 封装AI驱动渲染功能，提供统一的技能接口
 * 支持质量预设: draft(1x), normal(1x), professional(2x), retina(3x)
 */

const { aiRender, generateConfigFromNaturalLanguage } = require('./assets/ai-render.js');
const fs = require('fs');
const path = require('path');

// 安全配置
const MAX_INPUT_LENGTH = 10000;
const MAX_OUTPUT_PATH_LENGTH = 500;
const ALLOWED_OUTPUT_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

// 质量预设
const QUALITY_PRESETS = {
  draft: { scale: 1, dpi: 72, label: '草稿' },
  normal: { scale: 1, dpi: 150, label: '标准' },
  professional: { scale: 2, dpi: 300, label: '专业' },
  retina: { scale: 3, dpi: 300, label: 'Retina' }
};

/**
 * 进度条渲染（在终端显示进度）
 * @param {number} current - 当前进度
 * @param {number} total - 总进度
 * @param {string} label - 进度标签
 */
function renderProgressBar(current, total, label) {
  const barWidth = 30;
  const percent = Math.round((current / total) * 100);
  const filled = Math.round((barWidth * current) / total);
  const bar = '█'.repeat(filled) + '░'.repeat(barWidth - filled);
  process.stdout.write(`\r  ${bar} ${percent}% | ${label}`);
  if (current >= total) {
    process.stdout.write('\n');
  }
}

/**
 * 技能渲染函数
 * @param {string} input - 自然语言描述或JSON配置文件路径
 * @param {Object} options - 选项
 * @param {string} options.outputPath - 输出PNG文件路径（可选）
 * @param {boolean} options.saveConfig - 是否保存JSON配置（默认true）
 * @param {string} options.configPath - JSON配置文件路径（可选）
 * @param {boolean} options.useConfig - 是否直接使用JSON配置（默认false）
 * @param {string} options.quality - 质量预设: draft|normal|professional|retina
 * @param {number} options.scale - 自定义缩放比例（覆盖quality设置）
 * @returns {Object} 渲染结果
 */
async function skillRender(input, options = {}) {
  const {
    outputPath = null,
    saveConfig = true,
    configPath = null,
    useConfig = false,
    quality = 'normal',
    scale = null
  } = options;

  // 解析质量设置
  const qualityConfig = QUALITY_PRESETS[quality] || QUALITY_PRESETS.normal;
  const effectiveScale = scale !== null ? scale : qualityConfig.scale;
  console.log(`🎯 质量预设: ${qualityConfig.label} (${quality}), 缩放: ${effectiveScale}x, DPI: ${qualityConfig.dpi}`);

  // 进度追踪
  const totalSteps = 5;
  let currentStep = 0;
  renderProgressBar(++currentStep, totalSteps, '生成配置...');

  console.log('🚀 技能渲染启动...');

  // 输入验证
  validateInput(input, outputPath, configPath);

  let config;
  let savedConfigPath = null;

  // 判断输入类型
  if (useConfig || (input.endsWith('.json') && fs.existsSync(input))) {
    // 直接使用JSON配置
    console.log(`\n📝 输入: JSON配置文件 (${input})`);
    config = loadConfig(input);
    savedConfigPath = input;
  } else if (input.endsWith('.md') && fs.existsSync(input)) {
    // 从 Markdown 文件读取内容
    console.log(`\n📝 输入: Markdown文件 (${input})`);
    const mdContent = fs.readFileSync(input, 'utf-8');
    config = await generateConfigFromNaturalLanguage(mdContent);

    // 验证生成的配置
    validateConfig(config);

    // 保存JSON配置（如果需要）
    if (saveConfig) {
      savedConfigPath = configPath || path.join(__dirname, 'temp-config.json');
      fs.writeFileSync(savedConfigPath, JSON.stringify(config, null, 2), 'utf-8');
    }
  } else {
    // 从自然语言生成JSON配置
    console.log(`\n📝 输入: ${input}`);
    config = await generateConfigFromNaturalLanguage(input);

    // 验证生成的配置
    validateConfig(config);

    // 2. 保存JSON配置（如果需要）
    if (saveConfig) {
      savedConfigPath = configPath || path.join(__dirname, 'temp-config.json');
      fs.writeFileSync(savedConfigPath, JSON.stringify(config, null, 2), 'utf-8');
    }
  }

  renderProgressBar(++currentStep, totalSteps, '配置生成完成');
  renderProgressBar(++currentStep, totalSteps, '布局智能选择...');

  // 确定基础输出路径
  const baseOutputPath = outputPath || path.join(__dirname, 'output-infographic.png');
  const baseFileName = path.basename(baseOutputPath, '.png');
  const outputDir = path.dirname(baseOutputPath);

  // 智能选择渲染方向：根据内容点数量自动决定单版本
  const pointsCount = config.content?.items?.length || 0;
  const shouldRenderBoth = config.output_config?.orientation === 'both' || options.renderBoth === true;
  const isXiaohongshu = config.template === 'xiaohongshu';

  if (shouldRenderBoth) {
    // 双版本：横版+竖版
    currentStep = await renderSingleOrientation(config, baseOutputPath, outputDir, baseFileName, 'landscape', { quality, scale: effectiveScale }, totalSteps, currentStep);
    currentStep = await renderSingleOrientation(config, baseOutputPath, outputDir, baseFileName, 'portrait', { quality, scale: effectiveScale }, totalSteps, currentStep);
  } else {
    // 单版本：智能选择方向
    const orientation = isXiaohongshu || pointsCount > 5 ? 'portrait' : 'landscape';
    currentStep = await renderSingleOrientation(config, baseOutputPath, outputDir, baseFileName, orientation, { quality, scale: effectiveScale }, totalSteps, currentStep);
  }

  renderProgressBar(totalSteps, totalSteps, '完成！');

  // 收集输出文件路径
  const orientation = shouldRenderBoth ? 'landscape' : (isXiaohongshu || pointsCount > 5 ? 'portrait' : 'landscape');
  const outputFilePath = path.join(outputDir, `${baseFileName}-${orientation}.png`);

  console.log('\n✅ 技能渲染完成！');
  console.log(`📊 输出摘要:`);
  console.log(`   - 质量: ${qualityConfig.label} (${effectiveScale}x, ${qualityConfig.dpi}DPI)`);
  console.log(`   - 文件: ${outputFilePath}`);

  return {
    success: true,
    outputPath: outputFilePath,
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
 * 从配置渲染PNG图片（带重试机制）
 * @param {Object} config - 配置对象
 * @param {string} outputPath - 输出PNG文件路径
 * @param {Object} renderOptions - 渲染选项（quality, scale等）
 * @param {number} retryCount - 重试次数
 * @returns {Object} 渲染结果
 */
async function renderFromConfig(config, outputPath, renderOptions = {}, retryCount = 0) {
  const maxRetries = 2;
  const outputFile = outputPath || config.output || 'output.png';
  const outputPathFull = path.isAbsolute(outputFile) ? outputFile : path.join(__dirname, outputFile);

  // 优先尝试使用Remotion渲染
  try {
    console.log(`  - 尝试使用Remotion渲染${retryCount > 0 ? ` (重试 ${retryCount}/${maxRetries})` : ''}...`);
    const { renderWithRemotion } = require('./remotion/render.js');

    const result = await renderWithRemotion(config, outputPathFull, renderOptions);

    if (result.success) {
      console.log('  ✅ Remotion渲染成功！');
      return { outputPath: outputPathFull, renderer: 'remotion', scale: result.scale, resolution: result.resolution };
    } else {
      throw new Error(result.error || 'Remotion渲染失败');
    }
  } catch (error) {
    console.log(`  ⚠️  Remotion渲染失败: ${error.message}`);

    // Remotion失败，自动降级到HTML+Puppeteer
    if (retryCount < maxRetries) {
      console.log(`  - 自动降级到HTML+Puppeteer渲染${retryCount > 0 ? ` (重试 ${retryCount + 1}/${maxRetries})` : ''}...`);
    }

    try {
      const { renderInfographic } = require('./generate-html');
      const result = await renderInfographic(config, outputPathFull, renderOptions);

      if (result.success) {
        console.log('  ✅ HTML+Puppeteer渲染成功！');
        return { outputPath: outputPathFull, renderer: 'html-puppeteer', scale: result.dimensions?.scale || 1 };
      } else {
        throw new Error('HTML渲染失败');
      }
    } catch (htmlError) {
      // 尝试重试
      if (retryCount < maxRetries) {
        console.log(`  ⚠️  渲染失败，${maxRetries - retryCount}次重试机会剩余，重新尝试...`);
        return renderFromConfig(config, outputPath, renderOptions, retryCount + 1);
      }

      console.error('  ❌ 所有渲染方式都失败了！');
      const errorMessages = [
        `Remotion: ${error.message}`,
        `HTML+Puppeteer: ${htmlError.message}`
      ];
      throw new Error(
        `渲染失败。\n  可能的原因:\n` +
        `  1. Remotion依赖未安装 (${error.message})\n` +
        `  2. Puppeteer/Chromium未安装 (${htmlError.message})\n` +
        `  建议: 运行 npm install 安装依赖，或检查 Chromium 安装`
      );
    }
  }
}

/**
 * 渲染单一方向版本
 * @param {Object} config - 配置对象
 * @param {string} baseOutputPath - 基础输出路径
 * @param {string} outputDir - 输出目录
 * @param {string} baseFileName - 基础文件名
 * @param {string} orientation - 'landscape' 或 'portrait'
 * @param {Object} renderOptions - 渲染选项
 * @param {number} totalSteps - 总步骤数
 * @param {number} currentStep - 当前步骤
 * @returns {number} 更新后的步骤数
 */
async function renderSingleOrientation(config, baseOutputPath, outputDir, baseFileName, orientation, renderOptions, totalSteps, currentStep) {
  const dims = orientation === 'landscape' ? { width: 1920, height: 1080 } : { width: 1080, height: 1920 };
  const label = orientation === 'landscape' ? '横版' : '竖版';

  const orientationConfig = JSON.parse(JSON.stringify(config));
  orientationConfig.output_config = { ...dims, orientation };

  const outputPath = path.join(outputDir, `${baseFileName}-${orientation}.png`);
  renderProgressBar(++currentStep, totalSteps, `渲染${label}...`);

  await renderFromConfig(orientationConfig, outputPath, renderOptions);

  return currentStep;
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
          : null,
        quality: options.quality || 'normal',
        scale: options.scale || null
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
    console.log('  --quality <预设>   质量预设: draft|normal|professional|retina (默认: normal)');
    console.log('  --scale <倍数>     自定义缩放倍数 (1-4, 覆盖--quality设置)');
    console.log('  --list-templates   展示所有可用模板预览');
    console.log('  --render-both      同时输出横版和竖版两个版本');
    console.log('');
    console.log('质量预设说明:');
    console.log('  draft        1x缩放, 72DPI, 快速预览');
    console.log('  normal       1x缩放, 150DPI, 日常使用 (默认)');
    console.log('  professional 2x缩放, 300DPI, 高清输出');
    console.log('  retina       3x缩放, 300DPI, 超清输出');
    console.log('');
    console.log('示例:');
    console.log('  # 使用自然语言');
    console.log('  node skill-render.js "请帮我生成一个关于Python编程语言的信息图"');
    console.log('  node skill-render.js "请帮我生成一个关于Python编程语言的信息图" --output output/python.png');
    console.log('  node skill-render.js "请帮我生成一个关于Python编程语言的信息图" --no-save-config');
    console.log('  ');
    console.log('  # 高质量输出');
    console.log('  node skill-render.js "请帮我生成一个关于Python编程语言的信息图" --quality professional');
    console.log('  node skill-render.js "请帮我生成一个关于Python编程语言的信息图" --quality retina');
    console.log('  node skill-render.js "请帮我生成一个关于Python编程语言的信息图" --scale 2');
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
    useConfig: false,
    quality: 'normal',
    scale: null
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
    } else if (args[i] === '--quality' && args[i + 1]) {
      options.quality = args[i + 1];
      i++;
    } else if (args[i] === '--scale' && args[i + 1]) {
      options.scale = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--render-both') {
      options.renderBoth = true;
    } else if (args[i] === '--list-templates') {
      const { showTemplatePreviews } = require('./template-preview');
      showTemplatePreviews();
      process.exit(0);
    }
  }

  skillRender(input, options).catch(error => {
    console.error('\n❌ 渲染失败:', error.message);
    process.exit(1);
  });
}

module.exports = { skillRender, batchSkillRender };
