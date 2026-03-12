/**
 * 自动化渲染脚本
 * 从JSON配置文件自动加载配置并渲染PNG图片
 */

const fs = require('fs');
const path = require('path');
const { renderInfographic, loadTemplate } = require('./example-render.js');

/**
 * 从JSON文件加载配置数据
 * @param {string} configPath - JSON配置文件路径
 * @returns {Object} 配置数据
 */
function loadConfig(configPath) {
  try {
    const configData = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configData);
  } catch (error) {
    console.error(`加载配置文件失败: ${error.message}`);
    process.exit(1);
  }
}

/**
 * 自动渲染信息图
 * @param {string} configPath - JSON配置文件路径
 * @param {string} outputPath - 输出PNG文件路径（可选）
 */
async function autoRender(configPath, outputPath) {
  console.log('开始自动渲染...');

  // 1. 加载配置数据
  console.log(`1. 加载配置文件: ${configPath}`);
  const config = loadConfig(configPath);

  // 2. 加载模板
  console.log(`2. 加载模板: ${config.template}`);
  const templatePath = path.join(__dirname, 'templates', config.template, 'template.json');
  const template = loadTemplate(templatePath);

  // 3. 渲染信息图
  console.log('3. 渲染信息图...');
  const canvas = await renderInfographic(template, config.content, config.style);

  // 4. 保存PNG
  const outputFile = outputPath || config.output || 'output.png';
  const outputPathFull = path.join(__dirname, outputFile);

  console.log(`4. 保存PNG: ${outputFile}`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPathFull, buffer);

  console.log('\n✅ 渲染完成！');
  console.log(`📄 输出文件: ${outputPathFull}`);
}

// 命令行使用
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('使用方法:');
    console.log('  node auto-render.js <配置文件路径> [输出文件路径]');
    console.log('');
    console.log('示例:');
    console.log('  node auto-render.js config/my-infographic.json');
    console.log('  node auto-render.js config/my-infographic.json output/my-image.png');
    process.exit(1);
  }

  const configPath = args[0];
  const outputPath = args[1];

  autoRender(configPath, outputPath).catch(error => {
    console.error('\n❌ 渲染失败:', error.message);
    process.exit(1);
  });
}

module.exports = { autoRender, loadConfig };
