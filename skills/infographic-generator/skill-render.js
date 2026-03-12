/**
 * 技能渲染脚本
 * 封装AI驱动渲染功能，提供统一的技能接口
 */

const { aiRender, generateConfigFromNaturalLanguage } = require('./assets/ai-render.js');
const fs = require('fs');
const path = require('path');

/**
 * 技能渲染函数
 * @param {string} naturalLanguageInput - 自然语言描述
 * @param {Object} options - 选项
 * @param {string} options.outputPath - 输出PNG文件路径（可选）
 * @param {boolean} options.saveConfig - 是否保存JSON配置（默认true）
 * @param {string} options.configPath - JSON配置文件路径（可选）
 * @returns {Object} 渲染结果
 */
async function skillRender(naturalLanguageInput, options = {}) {
  const {
    outputPath = null,
    saveConfig = true,
    configPath = null
  } = options;

  console.log('🚀 技能渲染启动...');
  console.log(`📝 输入: ${naturalLanguageInput}`);

  // 1. 从自然语言生成JSON配置
  console.log('\n1. 生成JSON配置...');
  const config = await generateConfigFromNaturalLanguage(naturalLanguageInput);

  // 2. 保存JSON配置（如果需要）
  let savedConfigPath = null;
  if (saveConfig) {
    savedConfigPath = configPath || path.join(__dirname, 'temp-config.json');
    console.log(`2. 保存配置文件: ${savedConfigPath}`);
    fs.writeFileSync(savedConfigPath, JSON.stringify(config, null, 2), 'utf-8');
  }

  // 3. 渲染PNG图片
  console.log('3. 渲染PNG图片...');
  const result = await aiRender(naturalLanguageInput, outputPath);

  console.log('\n✅ 技能渲染完成！');

  return {
    success: true,
    outputPath: result.outputPath,
    configPath: savedConfigPath || result.configPath,
    config: config
  };
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
    console.log('  node skill-render.js <自然语言描述> [选项]');
    console.log('');
    console.log('选项:');
    console.log('  --output <路径>    指定输出PNG文件路径');
    console.log('  --no-save-config   不保存JSON配置文件');
    console.log('  --config <路径>    指定JSON配置文件路径');
    console.log('');
    console.log('示例:');
    console.log('  node skill-render.js "请帮我生成一个关于Python编程语言的信息图"');
    console.log('  node skill-render.js "请帮我生成一个关于Python编程语言的信息图" --output output/python.png');
    console.log('  node skill-render.js "请帮我生成一个关于Python编程语言的信息图" --no-save-config');
    process.exit(1);
  }

  // 解析参数
  const naturalLanguageInput = args[0];
  const options = {
    outputPath: null,
    saveConfig: true,
    configPath: null
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
    }
  }

  skillRender(naturalLanguageInput, options).catch(error => {
    console.error('\n❌ 渲染失败:', error.message);
    process.exit(1);
  });
}

module.exports = { skillRender, batchSkillRender };
