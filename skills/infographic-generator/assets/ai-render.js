/**
 * AI驱动渲染脚本
 * 从自然语言描述自动生成JSON配置并渲染PNG图片
 */

const fs = require('fs');
const path = require('path');
const { renderInfographic, loadTemplate } = require('./example-render.js');

/**
 * 从自然语言生成JSON配置
 * @param {string} naturalLanguageInput - 自然语言描述
 * @returns {Object} JSON配置
 */
async function generateConfigFromNaturalLanguage(naturalLanguageInput) {
  // 这里应该调用AI API生成JSON配置
  // 由于这是示例代码，我们使用一个简单的模板

  // 解析自然语言输入，提取关键信息
  const topic = extractTopic(naturalLanguageInput);
  const template = extractTemplate(naturalLanguageInput);
  const style = extractStyle(naturalLanguageInput);

  // 生成JSON配置
  const config = {
    template: template || 'knowledge',
    output: `${topic}-infographic.png`,
    content: {
      title: topic,
      subtitle: generateSubtitle(topic),
      meta_info: generateMetaInfo(topic),
      items: generateItems(topic),
      summary: generateSummary(topic)
    },
    style: style || {
      background_color: '#F8F9FA',
      primary_color: '#306998',
      secondary_color: '#FFD43B',
      text_color: '#212529',
      gray_color: '#6C757D'
    }
  };

  return config;
}

/**
 * 提取主题
 */
function extractTopic(input) {
  // 简单实现：从输入中提取主题
  const matches = input.match(/关于(.+?)的/);
  return matches ? matches[1] : '默认主题';
}

/**
 * 提取模板
 */
function extractTemplate(input) {
  if (input.includes('知识科普')) return 'knowledge';
  if (input.includes('SWOT分析')) return 'swot';
  if (input.includes('流程图')) return 'process';
  return 'knowledge';
}

/**
 * 提取风格
 */
function extractStyle(input) {
  if (input.includes('极简')) {
    return {
      background_color: '#FFFFFF',
      primary_color: '#333333',
      secondary_color: '#666666',
      text_color: '#000000',
      gray_color: '#999999'
    };
  }
  return null;
}

/**
 * 生成副标题
 */
function generateSubtitle(topic) {
  return `${topic}的详细介绍`;
}

/**
 * 生成元信息
 */
function generateMetaInfo(topic) {
  return `创建于${new Date().toLocaleDateString('zh-CN')} | 主题：${topic}`;
}

/**
 * 生成内容项
 */
function generateItems(topic) {
  return [
    {
      icon: '📌',
      title: '特点一',
      description: `${topic}的第一个重要特点`
    },
    {
      icon: '📌',
      title: '特点二',
      description: `${topic}的第二个重要特点`
    },
    {
      icon: '📌',
      title: '特点三',
      description: `${topic}的第三个重要特点`
    },
    {
      icon: '📌',
      title: '特点四',
      description: `${topic}的第四个重要特点`
    }
  ];
}

/**
 * 生成总结
 */
function generateSummary(topic) {
  return [
    `${topic}是一个重要的主题`,
    `了解${topic}对个人发展很有帮助`,
    `${topic}在未来有广阔的发展前景`
  ];
}

/**
 * 保存配置到文件
 */
function saveConfig(config, configPath) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  return configPath;
}

/**
 * AI驱动渲染
 */
async function aiRender(naturalLanguageInput, outputPath) {
  console.log('🤖 开始AI驱动渲染...');
  console.log(`📝 输入: ${naturalLanguageInput}`);

  // 1. 从自然语言生成JSON配置
  console.log('\n1. 生成JSON配置...');
  const config = await generateConfigFromNaturalLanguage(naturalLanguageInput);

  // 2. 保存JSON配置
  const configPath = path.join(__dirname, 'temp-config.json');
  console.log(`2. 保存配置文件: ${configPath}`);
  saveConfig(config, configPath);

  // 3. 加载模板
  console.log(`3. 加载模板: ${config.template}`);
  const templatePath = path.join(__dirname, 'templates', config.template, 'template.json');
  const template = loadTemplate(templatePath);

  // 4. 渲染信息图
  console.log('4. 渲染信息图...');
  const canvas = await renderInfographic(template, config.content, config.style);

  // 5. 保存PNG
  const outputFile = outputPath || config.output || 'output.png';
  const outputPathFull = path.join(__dirname, outputFile);

  console.log(`5. 保存PNG: ${outputFile}`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPathFull, buffer);

  console.log('\n✅ 渲染完成！');
  console.log(`📄 输出文件: ${outputPathFull}`);
  console.log(`📄 配置文件: ${configPath}`);

  return { outputPath: outputPathFull, configPath };
}

// 命令行使用
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('使用方法:');
    console.log('  node ai-render.js <自然语言描述> [输出文件路径]');
    console.log('');
    console.log('示例:');
    console.log('  node ai-render.js "请帮我生成一个关于Python编程语言的信息图"');
    console.log('  node ai-render.js "请帮我生成一个关于Python编程语言的信息图" output/python.png');
    process.exit(1);
  }

  const naturalLanguageInput = args[0];
  const outputPath = args[1];

  aiRender(naturalLanguageInput, outputPath).catch(error => {
    console.error('\n❌ 渲染失败:', error.message);
    process.exit(1);
  });
}

module.exports = { aiRender, generateConfigFromNaturalLanguage };
