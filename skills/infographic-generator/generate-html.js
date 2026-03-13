/**
 * HTML信息图生成器
 * 生成HTML文件，可以用浏览器打开截图
 */

const fs = require('fs');
const path = require('path');

/**
 * 生成HTML信息图
 * @param {Object} config - 信息图配置
 * @param {string} outputPath - 输出HTML文件路径
 */
function generateHTMLInfographic(config, outputPath = 'infographic.html') {
  const { template, style, content } = config;
  const width = config.output?.width || 1920;
  const height = config.output?.height || 1080;

  // 根据模板选择布局
  let htmlContent;

  if (template === 'knowledge') {
    htmlContent = generateKnowledgeTemplate(style, content, width, height);
  } else if (template === 'xiaohongshu') {
    htmlContent = generateXiaohongshuTemplate(style, content, width, height);
  } else if (template === 'process') {
    htmlContent = generateProcessTemplate(style, content, width, height);
  } else if (template === 'comparison') {
    htmlContent = generateComparisonTemplate(style, content, width, height);
  } else if (template === 'data') {
    htmlContent = generateDataTemplate(style, content, width, height);
  } else if (template === 'scientific') {
    htmlContent = generateScientificTemplate(style, content, width, height);
  } else {
    htmlContent = generateKnowledgeTemplate(style, content, width, height);
  }

  const fullHTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: ${style.font_family || 'Arial, sans-serif'};
      background-color: ${style.background_color};
      color: ${style.text_color};
      overflow: hidden;
    }

    .container {
      width: ${width}px;
      height: ${height}px;
      position: relative;
      overflow: hidden;
    }

${htmlContent.css}
  </style>
</head>
<body>
  <div class="container">
${htmlContent.html}
  </div>
</body>
</html>`;

  fs.writeFileSync(outputPath, fullHTML, 'utf-8');
  console.log(`✅ HTML文件已生成: ${outputPath}`);

  return outputPath;
}

/**
 * 生成知识模板
 */
function generateKnowledgeTemplate(style, content, width, height) {
  const itemsHTML = content.items.map((item, index) => `
    <div class="item">
      <div class="item-number">${index + 1}</div>
      <h3 class="item-title">${item.title}</h3>
      <p class="item-description">${item.description}</p>
    </div>
  `).join('');

  const summaryHTML = content.summary ? `
    <div class="summary">
      <p>${content.summary}</p>
    </div>
  ` : '';

  return {
    css: `
    .title-section {
      padding: 60px 80px 40px;
      text-align: center;
    }

    .main-title {
      font-size: 72px;
      font-weight: bold;
      color: ${style.primary_color};
      line-height: 1.2;
      margin-bottom: 20px;
    }

    .subtitle {
      font-size: 36px;
      color: ${style.text_color};
      font-weight: normal;
    }

    .content-section {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
      padding: 40px 80px;
    }

    .item {
      background-color: rgba(255, 255, 255, 0.1);
      padding: 30px;
      border-radius: 15px;
      border-left: 6px solid ${style.primary_color};
      position: relative;
    }

    .item-number {
      font-size: 48px;
      font-weight: bold;
      color: ${style.primary_color};
      position: absolute;
      top: -10px;
      right: 20px;
      opacity: 0.3;
    }

    .item-title {
      font-size: 36px;
      font-weight: bold;
      color: ${style.primary_color};
      margin-bottom: 15px;
    }

    .item-description {
      font-size: 24px;
      line-height: 1.5;
    }

    .summary {
      margin: 40px 80px 80px;
      padding: 40px;
      background-color: ${style.accent_color};
      border-radius: 15px;
      text-align: center;
    }

    .summary p {
      font-size: 28px;
      line-height: 1.6;
    }
    `,
    html: `
    <div class="title-section">
      <h1 class="main-title">${content.title}</h1>
      ${content.subtitle ? `<h2 class="subtitle">${content.subtitle}</h2>` : ''}
    </div>

    <div class="content-section">
      ${itemsHTML}
    </div>

    ${summaryHTML}
    `
  };
}

/**
 * 生成小红书模板
 */
function generateXiaohongshuTemplate(style, content, width, height) {
  const itemsHTML = content.items.map((item, index) => `
    <div class="xiaohongshu-item">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>
  `).join('');

  const summaryHTML = content.summary ? `
    <div class="xiaohongshu-summary">
      <p>${content.summary}</p>
    </div>
  ` : '';

  return {
    css: `
    .xiaohongshu-container {
      padding: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
    }

    .xiaohongshu-title {
      font-size: 96px;
      font-weight: bold;
      color: ${style.primary_color};
      text-align: center;
      margin-bottom: 60px;
    }

    .xiaohongshu-items {
      display: flex;
      flex-direction: column;
      gap: 40px;
      margin-bottom: 60px;
    }

    .xiaohongshu-item {
      background-color: ${style.accent_color};
      padding: 50px 60px;
      border-radius: 30px;
      border-left: 12px solid ${style.primary_color};
    }

    .xiaohongshu-item h3 {
      font-size: 48px;
      font-weight: bold;
      color: ${style.primary_color};
      margin-bottom: 20px;
    }

    .xiaohongshu-item p {
      font-size: 32px;
      line-height: 1.5;
    }

    .xiaohongshu-summary {
      background-color: ${style.secondary_color};
      padding: 50px;
      border-radius: 20px;
      text-align: center;
    }

    .xiaohongshu-summary p {
      font-size: 36px;
    }
    `,
    html: `
    <div class="xiaohongshu-container">
      <h1 class="xiaohongshu-title">${content.title}</h1>

      <div class="xiaohongshu-items">
        ${itemsHTML}
      </div>

      ${summaryHTML}
    </div>
    `
  };
}

/**
 * 使用Puppeteer截图
 */
async function screenshotHTML(htmlPath, pngPath, width = 1920, height = 1080) {
  const puppeteer = require('puppeteer');

  console.log('📸 使用Puppeteer截图...');

  const browser = await puppeteer.launch({
    headless: 'new'
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height });

  const fileUrl = `file://${htmlPath}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  await page.screenshot({
    path: pngPath,
    fullPage: false
  });

  await browser.close();

  console.log(`✅ 截图完成: ${pngPath}`);
}

/**
 * 完整流程：生成HTML并截图
 */
async function renderInfographic(config, outputPath = 'output.png') {
  const htmlPath = outputPath.replace('.png', '.html');

  console.log('🎨 生成HTML信息图...');
  generateHTMLInfographic(config, htmlPath);

  console.log('📸 截图中...');
  await screenshotHTML(htmlPath, outputPath, config.output?.width || 1920, config.output?.height || 1080);

  return {
    success: true,
    outputPath,
    htmlPath
  };
}

/**
 * 测试
 */
async function testHTMLRender() {
  const testConfig = {
    template: 'knowledge',
    style: {
      background_color: '#f5f5f5',
      primary_color: '#2196F3',
      secondary_color: '#64B5F6',
      accent_color: '#FFEB3B',
      text_color: '#333333'
    },
    content: {
      title: 'Python编程语言',
      subtitle: '简洁优雅 强大易用',
      items: [
        {
          title: '语法简洁',
          description: 'Python的语法设计简洁明了，代码可读性强，易于学习和使用。'
        },
        {
          title: '应用广泛',
          description: '广泛应用于数据分析、人工智能、Web开发、自动化脚本等领域。'
        },
        {
          title: '生态丰富',
          description: '拥有庞大的第三方库和工具生态系统，几乎所有需求都有现成解决方案。'
        },
        {
          title: '跨平台',
          description: '支持Windows、Linux、macOS等主流操作系统，代码可移植性强。'
        }
      ],
      summary: 'Python是一门强大而优雅的编程语言，适合从初学者到专业开发者的各个层次。'
    },
    output: {
      width: 1920,
      height: 1080
    }
  };

  const outputPath = path.join(__dirname, 'test-html-render.png');

  try {
    const result = await renderInfographic(testConfig, outputPath);

    console.log('\n📊 文件信息:');
    const stats = fs.statSync(outputPath);
    console.log(`   大小: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ 渲染失败:', error);
  }
}

if (require.main === module) {
  testHTMLRender();
}

module.exports = {
  generateHTMLInfographic,
  screenshotHTML,
  renderInfographic,
  testHTMLRender
};
/**
 * 生成流程模板
 */
function generateProcessTemplate(style, content, width, height) {
  const itemsHTML = content.items.map((item, index) => `
    <div class="process-step">
      <div class="step-number">步骤 ${index + 1}</div>
      <div class="step-icon">${item.icon}</div>
      <h3 class="step-title">${item.title}</h3>
      <p class="step-description">${item.description}</p>
    </div>
  `).join('');

  const summaryHTML = content.summary ? `
    <div class="process-summary">
      <h3>注意事项</h3>
      <ul>
        ${content.summary.map(point => `<li>${point}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  return {
    css: `
    .process-container {
      padding: 60px 80px;
    }

    .process-title {
      font-size: 64px;
      font-weight: bold;
      color: ${style.primary_color};
      margin-bottom: 20px;
      text-align: center;
    }

    .process-subtitle {
      font-size: 28px;
      color: ${style.gray_color};
      text-align: center;
      margin-bottom: 60px;
    }

    .process-steps {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 30px;
    }

    .process-step {
      flex: 0 0 calc(50% - 15px);
      background: rgba(255, 255, 255, 0.8);
      padding: 30px;
      border-radius: 15px;
      border-left: 5px solid ${style.primary_color};
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .step-number {
      font-size: 18px;
      color: ${style.primary_color};
      font-weight: bold;
      margin-bottom: 15px;
    }

    .step-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .step-title {
      font-size: 32px;
      color: ${style.primary_color};
      margin-bottom: 15px;
      font-weight: bold;
    }

    .step-description {
      font-size: 20px;
      color: ${style.text_color};
      line-height: 1.6;
    }

    .process-summary {
      margin-top: 60px;
      background: ${style.secondary_color}22;
      padding: 40px;
      border-radius: 15px;
    }

    .process-summary h3 {
      font-size: 32px;
      color: ${style.primary_color};
      margin-bottom: 20px;
    }

    .process-summary ul {
      list-style: none;
      padding: 0;
    }

    .process-summary li {
      font-size: 22px;
      color: ${style.text_color};
      padding: 15px 0;
      padding-left: 40px;
      position: relative;
    }

    .process-summary li:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: ${style.primary_color};
      font-weight: bold;
    }
    `,
    html: `
    <div class="process-container">
      <h1 class="process-title">${content.title}</h1>
      <p class="process-subtitle">${content.subtitle || ''}</p>

      <div class="process-steps">
        ${itemsHTML}
      </div>

      ${summaryHTML}
    </div>
    `
  };
}

/**
 * 生成对比模板
 */
function generateComparisonTemplate(style, content, width, height) {
  if (!content.items || content.items.length < 2) {
    return generateKnowledgeTemplate(style, content, width, height);
  }

  const leftItem = content.items[0];
  const rightItem = content.items[1];

  const leftPointsHTML = leftItem.points ? leftItem.points.map(point => `
    <div class="comparison-point">
      <div class="point-label">${point.label}:</div>
      <div class="point-value">${point.value}</div>
    </div>
  `).join('') : '';

  const rightPointsHTML = rightItem.points ? rightItem.points.map(point => `
    <div class="comparison-point">
      <div class="point-label">${point.label}:</div>
      <div class="point-value">${point.value}</div>
    </div>
  `).join('') : '';

  const summaryHTML = content.summary ? `
    <div class="comparison-summary">
      <h3>对比总结</h3>
      <ul>
        ${content.summary.map(point => `<li>${point}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  return {
    css: `
    .comparison-container {
      padding: 60px 80px;
    }

    .comparison-title {
      font-size: 64px;
      font-weight: bold;
      color: ${style.primary_color};
      margin-bottom: 20px;
      text-align: center;
    }

    .comparison-subtitle {
      font-size: 28px;
      color: ${style.gray_color};
      text-align: center;
      margin-bottom: 60px;
    }

    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      margin-bottom: 60px;
    }

    .comparison-item {
      background: rgba(255, 255, 255, 0.8);
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .comparison-item h3 {
      font-size: 42px;
      color: ${style.primary_color};
      margin-bottom: 30px;
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 3px solid ${style.primary_color};
    }

    .comparison-point {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid #eee;
    }

    .point-label {
      font-size: 22px;
      color: ${style.gray_color};
      font-weight: bold;
    }

    .point-value {
      font-size: 24px;
      color: ${style.text_color};
    }

    .comparison-summary {
      background: ${style.secondary_color}22;
      padding: 40px;
      border-radius: 20px;
    }

    .comparison-summary h3 {
      font-size: 32px;
      color: ${style.primary_color};
      margin-bottom: 20px;
    }

    .comparison-summary ul {
      list-style: none;
      padding: 0;
    }

    .comparison-summary li {
      font-size: 22px;
      color: ${style.text_color};
      padding: 15px 0;
      padding-left: 40px;
      position: relative;
    }

    .comparison-summary li:before {
      content: '•';
      position: absolute;
      left: 0;
      color: ${style.primary_color};
      font-weight: bold;
      font-size: 30px;
    }
    `,
    html: `
    <div class="comparison-container">
      <h1 class="comparison-title">${content.title}</h1>
      <p class="comparison-subtitle">${content.subtitle || ''}</p>

      <div class="comparison-grid">
        <div class="comparison-item">
          <h3>${leftItem.title}</h3>
          ${leftPointsHTML}
        </div>

        <div class="comparison-item">
          <h3>${rightItem.title}</h3>
          ${rightPointsHTML}
        </div>
      </div>

      ${summaryHTML}
    </div>
    `
  };
}

/**
 * 生成数据展示模板
 */
function generateDataTemplate(style, content, width, height) {
  const itemsHTML = content.items ? content.items.map((item, index) => `
    <div class="data-item">
      <div class="data-icon">${item.icon || '📊'}</div>
      <h3 class="data-title">${item.title}</h3>
      <p class="data-description">${item.description}</p>
    </div>
  `).join('') : '';

  const summaryHTML = content.summary ? `
    <div class="data-summary">
      <h3>关键发现</h3>
      <ul>
        ${content.summary.map(point => `<li>${point}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  return {
    css: `
    .data-container {
      padding: 60px 80px;
    }

    .data-title {
      font-size: 64px;
      font-weight: bold;
      color: ${style.primary_color};
      margin-bottom: 20px;
      text-align: center;
    }

    .data-subtitle {
      font-size: 28px;
      color: ${style.gray_color};
      text-align: center;
      margin-bottom: 60px;
    }

    .data-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
      margin-bottom: 60px;
    }

    .data-item {
      background: rgba(255, 255, 255, 0.9);
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      text-align: center;
    }

    .data-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .data-title {
      font-size: 32px;
      color: ${style.primary_color};
      margin-bottom: 15px;
      font-weight: bold;
    }

    .data-description {
      font-size: 20px;
      color: ${style.text_color};
      line-height: 1.6;
    }

    .data-summary {
      background: ${style.secondary_color}22;
      padding: 40px;
      border-radius: 20px;
    }

    .data-summary h3 {
      font-size: 32px;
      color: ${style.primary_color};
      margin-bottom: 20px;
    }

    .data-summary ul {
      list-style: none;
      padding: 0;
    }

    .data-summary li {
      font-size: 22px;
      color: ${style.text_color};
      padding: 15px 0;
      padding-left: 40px;
      position: relative;
    }

    .data-summary li:before {
      content: '→';
      position: absolute;
      left: 0;
      color: ${style.primary_color};
      font-weight: bold;
    }
    `,
    html: `
    <div class="data-container">
      <h1 class="data-title">${content.title}</h1>
      <p class="data-subtitle">${content.subtitle || ''}</p>

      <div class="data-grid">
        ${itemsHTML}
      </div>

      ${summaryHTML}
    </div>
    `
  };
}

/**
 * 生成科研图表模板
 */
function generateScientificTemplate(style, content, width, height) {
  const itemsHTML = content.items ? content.items.map((item, index) => `
    <div class="scientific-item">
      <div class="scientific-number">${index + 1}</div>
      <h3 class="scientific-title">${item.title}</h3>
      <p class="scientific-description">${item.description}</p>
    </div>
  `).join('') : '';

  const summaryHTML = content.summary ? `
    <div class="scientific-summary">
      <h3>结论</h3>
      <ul>
        ${content.summary.map(point => `<li>${point}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  return {
    css: `
    .scientific-container {
      padding: 60px 80px;
      background: #FFFFFF;
    }

    .scientific-title {
      font-size: 56px;
      font-weight: bold;
      color: #000000;
      margin-bottom: 15px;
      text-align: center;
    }

    .scientific-subtitle {
      font-size: 24px;
      color: #666666;
      text-align: center;
      margin-bottom: 50px;
      font-style: italic;
    }

    .scientific-items {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
      margin-bottom: 50px;
    }

    .scientific-item {
      background: #F8F9FA;
      padding: 30px;
      border-left: 4px solid #000000;
    }

    .scientific-number {
      font-size: 20px;
      color: #666666;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .scientific-title {
      font-size: 28px;
      color: #000000;
      margin-bottom: 10px;
      font-weight: bold;
    }

    .scientific-description {
      font-size: 18px;
      color: #333333;
      line-height: 1.6;
    }

    .scientific-summary {
      background: #F0F0F0;
      padding: 40px;
      border-radius: 0;
    }

    .scientific-summary h3 {
      font-size: 28px;
      color: #000000;
      margin-bottom: 20px;
      font-weight: bold;
    }

    .scientific-summary ul {
      list-style: none;
      padding: 0;
    }

    .scientific-summary li {
      font-size: 20px;
      color: #333333;
      padding: 12px 0;
      padding-left: 30px;
      position: relative;
    }

    .scientific-summary li:before {
      content: '▪';
      position: absolute;
      left: 0;
      color: #000000;
      font-size: 24px;
    }
    `,
    html: `
    <div class="scientific-container">
      <h1 class="scientific-title">${content.title}</h1>
      <p class="scientific-subtitle">${content.subtitle || ''}</p>

      <div class="scientific-items">
        ${itemsHTML}
      </div>

      ${summaryHTML}
    </div>
    `
  };
}
