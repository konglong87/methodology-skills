/**
 * AI驱动渲染脚本 - Claude API集成版
 * 从自然语言描述自动生成JSON配置并渲染PNG图片
 */

const fs = require('fs');
const path = require('path');
const { renderInfographic, loadTemplate } = require('./example-render.js');

/**
 * 配置schema - 用于指导AI生成正确格式
 */
const CONFIG_SCHEMA = `
{
  "template": "knowledge|comparison|process|data|xiaohongshu|scientific",
  "style": {
    "background_color": "#十六进制颜色",
    "primary_color": "#十六进制颜色",
    "secondary_color": "#十六进制颜色",
    "text_color": "#十六进制颜色",
    "gray_color": "#十六进制颜色"
  },
  "output": "输出文件名.png",
  "content": {
    "title": "标题",
    "subtitle": "副标题",
    "meta_info": "元信息",
    "items": [
      {
        "icon": "emoji图标",
        "title": "要点标题",
        "description": "要点描述"
      }
    ],
    "summary": ["总结要点1", "总结要点2", "总结要点3"]
  }
}

模板类型说明：
- knowledge: 知识科普，适合概念解释、知识分享
- comparison: 对比分析，适合产品对比、方案评估
- process: 流程说明，适合步骤指南、工作流程
- data: 数据展示，适合数据报告、统计结果
- xiaohongshu: 小红书爆款，适合社交媒体分享
- scientific: 科研图表，适合学术论文、研究数据

风格预设：
- minimal (极简风): background: #FFFFFF, primary: #333333
- macaroon (马卡龙风): background: #FFF0F5, primary: #FF69B4
- cyberpunk (赛博朋克): background: #1A1A2E, primary: #E91E63
- morandi (莫兰迪风): background: #F5F5F5, primary: #8D99AE
- business (商务风): background: #FFFFFF, primary: #1976D2
`;

/**
 * 从自然语言生成JSON配置（使用Claude API）
 * @param {string} naturalLanguageInput - 自然语言描述
 * @returns {Object} JSON配置
 */
async function generateConfigFromNaturalLanguage(naturalLanguageInput) {
  console.log('🤖 调用Claude API分析需求...');

  // 检查API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('⚠️  未找到ANTHROPIC_API_KEY环境变量');
    console.log('📝 使用本地模板生成（功能受限）...');
    return generateConfigLocally(naturalLanguageInput);
  }

  try {
    // 调用Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `你是一个信息图配置生成专家。请根据用户需求生成符合schema的JSON配置。

用户需求：
${naturalLanguageInput}

配置Schema：
${CONFIG_SCHEMA}

请直接输出JSON格式的配置，不要包含任何解释文字。确保JSON格式正确，可以直接解析。`
        }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API调用失败: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    // 提取JSON部分（处理markdown代码块）
    let jsonStr = content;
    if (content.includes('```json')) {
      const match = content.match(/```json\n?([\s\S]*?)\n?```/);
      if (match) jsonStr = match[1];
    } else if (content.includes('```')) {
      const match = content.match(/```\n?([\s\S]*?)\n?```/);
      if (match) jsonStr = match[1];
    }

    // 解析JSON
    const config = JSON.parse(jsonStr);
    console.log('✅ Claude API生成配置成功');

    return config;

  } catch (error) {
    console.error('❌ Claude API调用失败:', error.message);
    console.log('📝 回退到本地模板生成...');
    return generateConfigLocally(naturalLanguageInput);
  }
}

/**
 * 本地生成配置（fallback方案）
 * @param {string} input - 自然语言描述
 * @returns {Object} JSON配置
 */
function generateConfigLocally(input) {
  const topic = extractTopic(input);
  const template = extractTemplate(input);
  const style = extractStyle(input);

  return {
    template: template || 'knowledge',
    output: `${topic}-infographic.png`,
    content: {
      title: topic,
      subtitle: `${topic}的详细介绍`,
      meta_info: `创建于${new Date().toLocaleDateString('zh-CN')} | 主题：${topic}`,
      items: [
        { icon: '📌', title: '特点一', description: `${topic}的第一个重要特点` },
        { icon: '📌', title: '特点二', description: `${topic}的第二个重要特点` },
        { icon: '📌', title: '特点三', description: `${topic}的第三个重要特点` },
        { icon: '📌', title: '特点四', description: `${topic}的第四个重要特点` }
      ],
      summary: [
        `${topic}是一个重要的主题`,
        `了解${topic}对个人发展很有帮助`,
        `${topic}在未来有广阔的发展前景`
      ]
    },
    style: style || {
      background_color: '#F8F9FA',
      primary_color: '#306998',
      secondary_color: '#FFD43B',
      text_color: '#212529',
      gray_color: '#6C757D'
    }
  };
}

/**
 * 提取主题
 */
function extractTopic(input) {
  const matches = input.match(/关于(.+?)的/);
  return matches ? matches[1] : '默认主题';
}

/**
 * 提取模板
 */
function extractTemplate(input) {
  if (input.includes('知识科普')) return 'knowledge';
  if (input.includes('对比')) return 'comparison';
  if (input.includes('流程')) return 'process';
  if (input.includes('数据')) return 'data';
  if (input.includes('小红书')) return 'xiaohongshu';
  if (input.includes('科研') || input.includes('论文')) return 'scientific';
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
  if (input.includes('马卡龙')) {
    return {
      background_color: '#FFF0F5',
      primary_color: '#FF69B4',
      secondary_color: '#87CEEB',
      text_color: '#4A4A4A',
      gray_color: '#9E9E9E'
    };
  }
  if (input.includes('赛博朋克')) {
    return {
      background_color: '#1A1A2E',
      primary_color: '#E91E63',
      secondary_color: '#00BCD4',
      text_color: '#FFFFFF',
      gray_color: '#757575'
    };
  }
  return null;
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
  console.log('🚀 开始AI驱动渲染...');
  console.log(`📝 输入: ${naturalLanguageInput}`);

  // 1. 从自然语言生成JSON配置
  console.log('\n步骤1: 生成JSON配置...');
  const config = await generateConfigFromNaturalLanguage(naturalLanguageInput);

  // 2. 保存JSON配置
  const configPath = path.join(__dirname, 'temp-config.json');
  console.log(`步骤2: 保存配置文件: ${configPath}`);
  saveConfig(config, configPath);

  // 3. 加载模板
  const templateName = config.template || 'knowledge';
  console.log(`步骤3: 加载模板: ${templateName}`);
  const templatePath = path.join(__dirname, 'templates', templateName, 'template.json');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`模板文件不存在: ${templatePath}`);
  }

  const template = loadTemplate(templatePath);

  // 4. 渲染信息图
  console.log('步骤4: 渲染信息图...');
  const canvas = await renderInfographic(template, config.content, config.style);

  // 5. 保存PNG
  const outputFile = outputPath || config.output || 'output.png';
  const outputPathFull = path.join(__dirname, outputFile);

  console.log(`步骤5: 保存PNG: ${outputFile}`);
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
    console.log('环境变量:');
    console.log('  ANTHROPIC_API_KEY - Claude API密钥（可选，不设置则使用本地模板）');
    console.log('');
    console.log('示例:');
    console.log('  # 使用Claude API生成');
    console.log('  export ANTHROPIC_API_KEY=your-api-key');
    console.log('  node ai-render.js "生成Python编程语言信息图，包含语法简洁、应用广泛、生态丰富、跨平台4个特点"');
    console.log('');
    console.log('  # 指定输出路径');
    console.log('  node ai-render.js "生成Python信息图" output/python.png');
    console.log('');
    console.log('  # 不使用API（本地模板）');
    console.log('  node ai-render.js "生成Python信息图"');
    process.exit(1);
  }

  const naturalLanguageInput = args[0];
  const outputPath = args[1];

  aiRender(naturalLanguageInput, outputPath).catch(error => {
    console.error('\n❌ 渲染失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  });
}

module.exports = { aiRender, generateConfigFromNaturalLanguage };