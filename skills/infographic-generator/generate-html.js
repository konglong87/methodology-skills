/**
 * HTML信息图生成器
 * 生成HTML文件，可以用浏览器打开截图
 */

const fs = require('fs');
const path = require('path');

/**
 * 预设风格配置
 */
const PRESET_STYLES = {
  'tech': { // 科技风格
    background_color: '#0A1929',
    primary_color: '#00E5FF',
    secondary_color: '#0288D1',
    accent_color: '#B2EBF2',
    text_color: '#E0F7FA',
    font_family: 'Arial, sans-serif'
  },
  'cute': { // 可爱风格
    background_color: '#FFF9C4',
    primary_color: '#FF6B9D',
    secondary_color: '#FFB3D9',
    accent_color: '#FFE5EC',
    text_color: '#5D4037',
    font_family: 'Arial Rounded MT Bold, Arial, sans-serif'
  },
  'clay': { // 泥塑风格
    background_color: '#E8DCC4',
    primary_color: '#D4A574',
    secondary_color: '#C19A6B',
    accent_color: '#F5E6D3',
    text_color: '#5D4E37',
    font_family: 'Georgia, serif'
  },
  'handdrawn': { // 手绘风格
    background_color: '#FFF8E7',
    primary_color: '#FF6B35',
    secondary_color: '#F7931E',
    accent_color: '#FFE5B4',
    text_color: '#2C1810',
    font_family: 'Comic Sans MS, cursive, sans-serif'
  },

  // 新增：小红书高级风格预设
  'xhs-pink-elegant': { // 小红书粉紫优雅风格
    colorScheme: 'pink-purple',
    cardStyle: 'elegant',
    iconStyle: 'gradient-circle',
    font_family: 'Arial, sans-serif'
  },
  'xhs-blue-modern': { // 小红书蓝绿现代风格
    colorScheme: 'blue-cyan',
    cardStyle: 'modern',
    iconStyle: 'gradient-square',
    font_family: 'Arial, sans-serif'
  },
  'xhs-orange-glass': { // 小红书橙黄玻璃态风格
    colorScheme: 'orange-yellow',
    cardStyle: 'glass',
    iconStyle: 'solid-bg',
    font_family: 'Arial, sans-serif'
  },
  'xhs-green-minimal': { // 小红书绿色简约风格
    colorScheme: 'green-nature',
    cardStyle: 'minimal',
    iconStyle: 'outline',
    font_family: 'Arial, sans-serif'
  },
  'xhs-purple-elegant': { // 小红书紫色优雅风格
    colorScheme: 'purple-elegant',
    cardStyle: 'elegant',
    iconStyle: 'gradient-circle',
    font_family: 'Arial, sans-serif'
  }
};

/**
 * 获取样式配置（支持预设风格名称）
 */
function getStyleConfig(style) {
  if (typeof style === 'string' && PRESET_STYLES[style]) {
    return PRESET_STYLES[style];
  }
  // 确保返回完整的样式配置，合并默认值
  const defaultStyle = PRESET_STYLES['tech'];
  return style ? { ...defaultStyle, ...style } : defaultStyle;
}

/**
 * 判断是否为小红书风格预设
 * @param {string|object} style - 风格配置
 * @returns {boolean}
 */
function isXiaohongshuStyle(style) {
  if (typeof style === 'string') {
    return style.startsWith('xhs-') || style === 'cute';
  }
  if (typeof style === 'object') {
    return !!(style.colorScheme || style.color_scheme || style.cardStyle || style.card_style || style.iconStyle || style.icon_style);
  }
  return false;
}

/**
 * 生成HTML信息图
 * @param {Object} config - 信息图配置
 * @param {string} outputPath - 输出HTML文件路径
 */
function generateHTMLInfographic(config, outputPath = 'infographic.html') {
  const { template, content } = config;
  const width = config.output?.width || 1920;
  // 移除固定高度，改为自适应
  const height = config.output?.height || 'auto';

  // 处理样式（支持预设风格名称）
  const style = getStyleConfig(config.style);

  // 根据模板选择布局
  let htmlContent;

  // 判断是否为小红书模板且使用新样式系统
  const useNewXiaohongshuStyle = template === 'xiaohongshu' && isXiaohongshuStyle(config.style);

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

  const heightStyle = height === 'auto' ? 'height: auto;' : `height: ${height}px;`;

  // 对于小红书新样式，body 背景已在模板中定义
  const bodyStyle = useNewXiaohongshuStyle
    ? 'margin: 0; padding: 0;'
    : `font-family: ${style.font_family || 'Arial, sans-serif'}; background-color: ${style.background_color}; color: ${style.text_color}; overflow-x: hidden;`;

  const fullHTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      ${bodyStyle}
      font-family: 'Noto Sans SC', system-ui, -apple-system, PingFang SC, Microsoft YaHei, sans-serif;
    }

    .container {
      width: ${width}px;
      ${heightStyle}
      position: relative;
      overflow: visible;
      padding-bottom: 120px;
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
 * 生成知识模板（优化版）
 */
function generateKnowledgeTemplate(style, content, width, height) {
  const itemsHTML = content.items.map((item, index) => `
    <div class="item" style="animation-delay: ${index * 0.1}s">
      <div class="item-number">${index + 1}</div>
      ${item.icon ? `<div class="item-icon">${item.icon}</div>` : ''}
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
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap');

    .title-section {
      padding: 80px 80px 50px;
      text-align: center;
      position: relative;
    }

    .main-title {
      font-size: 72px;
      font-weight: 900;
      color: ${style.primary_color};
      line-height: 1.15;
      margin-bottom: 20px;
      letter-spacing: 0.02em;
    }

    .subtitle {
      font-size: 36px;
      color: ${style.text_color};
      font-weight: 400;
      letter-spacing: 0.01em;
      opacity: 0.85;
    }

    .content-section {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
      padding: 40px 80px;
    }

    .item {
      background: ${style.surface_color || 'rgba(255,255,255,0.9)'};
      padding: 35px 40px;
      border-radius: 20px;
      border-left: 8px solid ${style.primary_color};
      position: relative;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .item:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.1);
    }

    .item-number {
      font-size: 56px;
      font-weight: 900;
      color: ${style.primary_color};
      position: absolute;
      top: -5px;
      right: 25px;
      opacity: 0.12;
      line-height: 1;
    }

    .item-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .item-title {
      font-size: 36px;
      font-weight: 700;
      color: ${style.primary_color};
      margin-bottom: 15px;
      line-height: 1.3;
    }

    .item-description {
      font-size: 24px;
      line-height: 1.7;
      color: ${style.text_color || '#333'};
      letter-spacing: 0.005em;
    }

    .summary {
      margin: 40px 80px 80px;
      padding: 50px 60px;
      background: ${style.accent_color};
      border-radius: 24px;
      text-align: center;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      border: 2px solid ${style.border_color || '#e8e8e8'};
    }

    .summary p {
      font-size: 32px;
      line-height: 1.6;
      color: ${style.text_color || '#333'};
      font-weight: 500;
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
 * 生成小红书模板（优化版）
 */
function generateXiaohongshuTemplate(style, content, width, height) {
  // 导入样式系统
  const {
    getXiaohongshuStyle,
    generateDecorationCSS,
    generateIconCSS,
    generateGradientTextCSS
  } = require('./xiaohongshu-styles.js');

  // 解析样式配置（支持旧格式和新格式）
  let colorScheme = 'pink-purple';
  let cardStyle = 'elegant';
  let iconStyle = 'gradient-circle';

  if (typeof style === 'string') {
    // 旧格式：预设风格名称，尝试映射到新格式
    const legacyMapping = {
      'cute': { colorScheme: 'pink-purple', cardStyle: 'elegant', iconStyle: 'gradient-circle' },
      'tech': { colorScheme: 'blue-cyan', cardStyle: 'modern', iconStyle: 'gradient-square' },
      'clay': { colorScheme: 'orange-yellow', cardStyle: 'elegant', iconStyle: 'solid-bg' },
      'handdrawn': { colorScheme: 'green-nature', cardStyle: 'minimal', iconStyle: 'outline' }
    };
    const mapping = legacyMapping[style] || legacyMapping['cute'];
    colorScheme = mapping.colorScheme;
    cardStyle = mapping.cardStyle;
    iconStyle = mapping.iconStyle;
  } else if (typeof style === 'object') {
    // 新格式：对象配置
    colorScheme = style.colorScheme || style.color_scheme || 'pink-purple';
    cardStyle = style.cardStyle || style.card_style || 'elegant';
    iconStyle = style.iconStyle || style.icon_style || 'gradient-circle';
  }

  // 获取完整样式配置
  const fullStyle = getXiaohongshuStyle(colorScheme, cardStyle, iconStyle);
  const { colors, cards, icons } = fullStyle;

  // 生成内容卡片 HTML
  const itemsHTML = content.items.map((item, index) => `
    <div class="content-card" style="
      border-radius: ${cards.border_radius};
      box-shadow: ${cards.shadow};
      padding: ${cards.padding};
      background: ${cards.background};
      ${cards.border ? `border: ${cards.border};` : ''}
      ${cards.backdrop_filter ? `backdrop-filter: ${cards.backdrop_filter};` : ''}
    ">
      <div class="card-icon icon-container">
        <span class="icon">${item.icon || '📋'}</span>
      </div>
      <div class="card-content">
        <h3 class="card-title">${item.title}</h3>
        <p class="card-desc">${item.description}</p>
      </div>
    </div>
  `).join('');

  // 数据展示区（可选）
  const dataHTML = content.data_points ? `
    <div class="data-section" style="
      border-radius: ${cards.border_radius};
      box-shadow: ${cards.shadow};
      background: ${cards.background};
    ">
      ${content.data_points.map(point => `
        <div class="data-item">
          <div class="data-value gradient-text">${point.value}</div>
          <div class="data-label">${point.label}</div>
        </div>
      `).join('')}
    </div>
  ` : '';

  // 互动区（可选）
  const interactionHTML = content.interaction ? `
    <div class="interaction-area">
      <p class="interaction-text">${content.interaction}</p>
    </div>
  ` : '';

  // 生成装饰元素 HTML
  const decorationsHTML = `
    <div class="decoration-circle-1"></div>
    <div class="decoration-circle-2"></div>
    <div class="decoration-circle-3"></div>
  `;

  return {
    css: `
    /* 小红书容器 - 渐变背景 */
    .xiaohongshu-viral-container {
      background: ${colors.gradient_bg};
      min-height: 100%;
      padding: 60px;
      position: relative;
      overflow: hidden;
    }

    /* 装饰元素 */
    ${generateDecorationCSS(colors)}

    /* 标题区域 */
    .title-section {
      text-align: center;
      margin-bottom: 50px;
      position: relative;
      z-index: 1;
    }

    .main-title {
      font-size: 56px;
      font-weight: 900;
      margin-bottom: 15px;
      letter-spacing: 0.02em;
      line-height: 1.15;
    }

    .subtitle {
      font-size: 28px;
      color: ${colors.text_secondary};
      font-weight: 400;
      letter-spacing: 0.01em;
    }

    /* 渐变文字 */
    ${generateGradientTextCSS(colors)}

    /* 内容卡片容器 */
    .content-cards {
      display: grid;
      gap: 30px;
      margin-bottom: 50px;
      position: relative;
      z-index: 1;
    }

    /* 内容卡片 */
    .content-card {
      display: flex;
      align-items: flex-start;
      gap: 25px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      position: relative;
    }

    /* 图标容器 */
    ${generateIconCSS(icons, colors)}

    /* 卡片内容 */
    .card-content {
      flex: 1;
    }

    .card-title {
      font-size: 24px;
      font-weight: 700;
      color: ${colors.text_color};
      margin-bottom: 10px;
      line-height: 1.3;
    }

    .card-desc {
      font-size: 18px;
      color: ${colors.text_secondary};
      line-height: 1.7;
      letter-spacing: 0.005em;
    }

    /* 数据展示区 */
    .data-section {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 25px;
      padding: 40px;
      margin-bottom: 40px;
      position: relative;
      z-index: 1;
    }

    .data-item {
      text-align: center;
    }

    .data-value {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .data-label {
      font-size: 16px;
      color: ${colors.text_secondary};
    }

    /* 互动区 */
    .interaction-area {
      text-align: center;
      padding: 30px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 20px;
      position: relative;
      z-index: 1;
    }

    .interaction-text {
      font-size: 20px;
      color: ${colors.primary_color};
      font-weight: bold;
    }
    `,
    html: `
    <div class="xiaohongshu-viral-container">
      <!-- 装饰元素 -->
      ${decorationsHTML}

      <!-- 标题 -->
      <div class="title-section">
        <h1 class="main-title gradient-text">${content.title}</h1>
        ${content.subtitle ? `<p class="subtitle">${content.subtitle}</p>` : ''}
      </div>

      <!-- 内容卡片 -->
      <div class="content-cards">
        ${itemsHTML}
      </div>

      <!-- 数据展示 -->
      ${dataHTML}

      <!-- 互动区 -->
      ${interactionHTML}
    </div>
    `
  };
}

/**
 * 使用Puppeteer截图（自动检测完整高度，支持Retina）
 */
async function screenshotHTML(htmlPath, pngPath, width = 1920, height = 'auto', options = {}) {
  const puppeteer = require('puppeteer');

  const scale = options.scale || 1;
  const qualityName = options.quality || 'normal';

  console.log(`📸 使用Puppeteer截图 (${scale}x, ${qualityName})...`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new'
    });

    const page = await browser.newPage();

    // 设置视口宽度，高度设为足够大以容纳内容
    // deviceScaleFactor 控制 Retina 渲染质量
    await page.setViewport({
      width,
      height: 5000,
      deviceScaleFactor: scale
    });

    const fileUrl = `file://${htmlPath}`;
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // 自动检测内容高度，并添加缓冲区确保不被截断
    const actualHeight = height === 'auto'
      ? Math.round(await page.evaluate((viewportWidth) => {
          const container = document.querySelector('.container');
          if (!container) {
            return document.body.scrollHeight;
          }

          const children = Array.from(container.children);
          let maxBottom = 0;

          children.forEach(child => {
            const rect = child.getBoundingClientRect();
            const bottom = rect.bottom + window.scrollY;
            if (bottom > maxBottom) {
              maxBottom = bottom;
            }
          });

          const buffer = viewportWidth > 1080 ? 200 : 160;
          return Math.max(maxBottom + buffer, 800);
        }, width))
      : height;

    console.log(`📐 检测到内容高度: ${actualHeight}px`);

    // 重新设置正确的视口高度
    await page.setViewport({ width, height: actualHeight, deviceScaleFactor: scale });

    await page.screenshot({
      path: pngPath,
      fullPage: false
    });

    console.log(`✅ 截图完成: ${pngPath}`);
    return { width, height: actualHeight, scale };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * 完整流程：生成HTML并截图
 */
async function renderInfographic(config, outputPath = 'output.png', options = {}) {
  const htmlPath = path.resolve(outputPath.replace('.png', '.html'));
  const absoluteOutputPath = path.resolve(outputPath);

  const scale = options.scale || (options.quality === 'professional' ? 2 : options.quality === 'retina' ? 3 : 1);

  console.log(`🎨 生成HTML信息图 (${scale}x 缩放)...`);
  generateHTMLInfographic(config, htmlPath);

  console.log('📸 截图中...');
  const dimensions = await screenshotHTML(
    htmlPath,
    absoluteOutputPath,
    config.output?.width || 1920,
    config.output?.height || 'auto',
    { scale, quality: options.quality || 'normal' }
  );

  return {
    success: true,
    outputPath: absoluteOutputPath,
    htmlPath,
    dimensions
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
  // 从命令行参数读取配置
  const args = process.argv.slice(2);

  if (args.length >= 2) {
    // 参数格式：node generate-html.js <template> <json-config> [--output output-path] [--style style-name]
    (async () => {
      const template = args[0];
      const configJSON = args[1];
      const outputIndex = args.indexOf('--output');
      const styleIndex = args.indexOf('--style');

      const outputPath = outputIndex !== -1 && args[outputIndex + 1]
        ? args[outputIndex + 1]
        : 'infographic.png';

      // 支持预设风格名称，默认使用科技风格
      const styleName = styleIndex !== -1 && args[styleIndex + 1]
        ? args[styleIndex + 1]
        : 'tech';

      try {
        // 解析JSON配置
        const content = JSON.parse(configJSON);

        // 构建完整配置（使用预设风格）
        const config = {
          template: template,
          style: styleName, // 支持预设风格名称
          content: content,
          output: {
            width: 1200,
            height: 'auto' // 自适应高度
          }
        };

        console.log(`🎨 使用风格: ${styleName}`);
        console.log('🎨 生成HTML信息图...');
        await renderInfographic(config, outputPath);
      } catch (error) {
        console.error('❌ 解析配置失败:', error.message);
        console.error('请确保第二个参数是有效的JSON字符串');
        process.exit(1);
      }
    })();
  } else {
    // 没有参数时使用测试数据
    testHTMLRender();
  }
}

module.exports = {
  generateHTMLInfographic,
  screenshotHTML,
  renderInfographic,
  testHTMLRender
};
/**
 * 生成流程模板（优化版）
 */
function generateProcessTemplate(style, content, width, height) {
  const itemsHTML = content.items.map((item, index) => `
    <div class="process-step">
      <div class="step-connector">
        <div class="step-circle">${index + 1}</div>
        ${index < content.items.length - 1 ? '<div class="step-line"></div>' : ''}
      </div>
      <div class="step-content">
        <div class="step-icon">${item.icon || '📋'}</div>
        <h3 class="step-title">${item.title}</h3>
        <p class="step-description">${item.description}</p>
      </div>
    </div>
  `).join('');

  const summaryHTML = content.summary ? `
    <div class="process-summary">
      <h3>💡 注意事项</h3>
      <ul>
        ${content.summary.map(point => `<li>${point}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  return {
    css: `
    .process-container {
      padding: 60px 80px;
      font-family: 'Noto Sans SC', system-ui, sans-serif;
    }

    .process-title {
      font-size: 64px;
      font-weight: 900;
      color: ${style.primary_color};
      margin-bottom: 15px;
      text-align: center;
      letter-spacing: 0.02em;
    }

    .process-subtitle {
      font-size: 28px;
      color: ${style.text_color || '#666'};
      text-align: center;
      margin-bottom: 60px;
      opacity: 0.8;
    }

    .process-steps {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .process-step {
      display: flex;
      align-items: flex-start;
      gap: 30px;
      background: ${style.surface_color || 'rgba(255,255,255,0.9)'};
      padding: 30px 40px;
      border-radius: 20px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      border: 1px solid ${style.border_color || '#eee'};
    }

    .step-connector {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 60px;
    }

    .step-circle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${style.primary_color};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .step-line {
      width: 3px;
      flex: 1;
      min-height: 30px;
      background: linear-gradient(180deg, ${style.primary_color}80, transparent);
      margin: 5px 0;
    }

    .step-content {
      flex: 1;
    }

    .step-icon {
      font-size: 40px;
      margin-bottom: 10px;
    }

    .step-title {
      font-size: 32px;
      font-weight: 700;
      color: ${style.primary_color};
      margin-bottom: 10px;
      line-height: 1.3;
    }

    .step-description {
      font-size: 22px;
      color: ${style.text_color || '#333'};
      line-height: 1.7;
      letter-spacing: 0.005em;
    }

    .process-summary {
      margin-top: 50px;
      background: ${style.accent_color || '#f5f5f5'};
      padding: 40px 50px;
      border-radius: 20px;
      border: 1px solid ${style.border_color || '#e8e8e8'};
    }

    .process-summary h3 {
      font-size: 28px;
      color: ${style.primary_color};
      margin-bottom: 20px;
    }

    .process-summary ul {
      list-style: none;
      padding: 0;
    }

    .process-summary li {
      font-size: 20px;
      color: ${style.text_color || '#333'};
      padding: 12px 0;
      padding-left: 35px;
      position: relative;
      line-height: 1.6;
    }

    .process-summary li:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: ${style.primary_color};
      font-weight: bold;
      font-size: 22px;
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
 * 生成对比模板（优化版）
 */
function generateComparisonTemplate(style, content, width, height) {
  // 支持新的数据结构
  const leftItems = content.left_items || [];
  const rightItems = content.right_items || [];
  const leftTitle = content.left_title || '选项A';
  const rightTitle = content.right_title || '选项B';
  const leftIcon = content.left_icon || '';
  const rightIcon = content.right_icon || '';
  const leftPrimary = content.left_primary || style.primary_color;
  const rightPrimary = content.right_primary || style.primary_color;
  const leftBg = content.left_bg || 'rgba(255, 255, 255, 0.8)';
  const rightBg = content.right_bg || 'rgba(255, 255, 255, 0.8)';

  const leftPointsHTML = leftItems.map(item => `
    <div class="comparison-point">
      <div class="point-icon">${item.icon || ''}</div>
      <div class="point-content">
        <div class="point-label">${item.label}:</div>
        <div class="point-value">${item.value}</div>
      </div>
    </div>
  `).join('');

  const rightPointsHTML = rightItems.map(item => `
    <div class="comparison-point">
      <div class="point-icon">${item.icon || ''}</div>
      <div class="point-content">
        <div class="point-label">${item.label}:</div>
        <div class="point-value">${item.value}</div>
      </div>
    </div>
  `).join('');

  const conclusionHTML = content.conclusion ? `
    <div class="comparison-conclusion">
      <p class="conclusion-text">${content.conclusion}</p>
      ${content.recommendation ? `<p class="recommendation-text">${content.recommendation}</p>` : ''}
    </div>
  ` : '';

  return {
    css: `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap');

    .comparison-container {
      padding: 60px 80px;
      font-family: 'Noto Sans SC', system-ui, sans-serif;
    }

    .comparison-title {
      font-size: 64px;
      font-weight: 900;
      color: ${style.primary_color};
      margin-bottom: 15px;
      text-align: center;
      letter-spacing: 0.02em;
    }

    .comparison-subtitle {
      font-size: 28px;
      color: ${style.text_color || '#666'};
      text-align: center;
      margin-bottom: 50px;
      opacity: 0.8;
    }

    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 40px;
      margin-bottom: 50px;
      align-items: start;
    }

    .comparison-item {
      background: ${leftBg};
      padding: 40px;
      border-radius: 24px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.08);
      border: 1px solid ${style.border_color || '#e8e8e8'};
    }

    .comparison-item h3 {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 25px;
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 3px solid;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .comparison-item.right h3 {
      color: ${rightPrimary};
      border-bottom-color: ${rightPrimary};
    }

    .item-icon {
      font-size: 40px;
    }

    .vs-badge {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: ${style.primary_color || '#333'};
      color: #FFFFFF;
      font-size: 24px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      align-self: center;
      flex-shrink: 0;
    }

    .comparison-point {
      display: flex;
      align-items: flex-start;
      padding: 18px 0;
      border-bottom: 1px solid ${style.border_color || '#eee'};
    }

    .comparison-point:last-child {
      border-bottom: none;
    }

    .point-icon {
      font-size: 28px;
      margin-right: 12px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .point-content {
      flex: 1;
    }

    .point-label {
      font-size: 18px;
      font-weight: 600;
      color: ${style.text_secondary || '#666'};
      margin-bottom: 4px;
      letter-spacing: 0.01em;
    }

    .point-value {
      font-size: 20px;
      color: ${style.text_color || '#333'};
      line-height: 1.5;
    }

    .comparison-conclusion {
      background: ${style.accent_color || '#f5f5f5'};
      padding: 40px;
      border-radius: 24px;
      text-align: center;
      border: 1px solid ${style.border_color || '#e8e8e8'};
    }

    .conclusion-text {
      font-size: 24px;
      color: ${style.text_color || '#333'};
      margin-bottom: 15px;
      line-height: 1.6;
    }

    .recommendation-text {
      font-size: 22px;
      color: ${style.primary_color};
      font-weight: 700;
      letter-spacing: 0.01em;
    }
    `,
    html: `
    <div class="comparison-container">
      <h1 class="comparison-title">${content.title}</h1>
      <p class="comparison-subtitle">${content.subtitle || ''}</p>

      <div class="comparison-grid">
        <div class="comparison-item">
          <h3>
            <span class="item-icon">${leftIcon}</span>
            ${leftTitle}
          </h3>
          ${leftPointsHTML}
        </div>

        <div class="vs-badge">VS</div>

        <div class="comparison-item right" style="background: ${rightBg};">
          <h3>
            <span class="item-icon">${rightIcon}</span>
            ${rightTitle}
          </h3>
          ${rightPointsHTML}
        </div>
      </div>

      ${conclusionHTML}
    </div>
    `
  };
}

/**
 * 生成数据展示模板（优化版）
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
      <h3>🔍 关键发现</h3>
      <ul>
        ${content.summary.map(point => `<li>${point}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  return {
    css: `
    .data-container {
      padding: 60px 80px;
      font-family: 'Noto Sans SC', system-ui, sans-serif;
    }

    .data-header-title {
      font-size: 64px;
      font-weight: 900;
      color: ${style.primary_color};
      margin-bottom: 15px;
      text-align: center;
      letter-spacing: 0.02em;
    }

    .data-subtitle {
      font-size: 28px;
      color: ${style.text_color || '#666'};
      text-align: center;
      margin-bottom: 50px;
      opacity: 0.8;
    }

    .data-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 35px;
      margin-bottom: 50px;
    }

    .data-item {
      background: ${style.surface_color || 'rgba(255,255,255,0.95)'};
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      text-align: center;
      border: 1px solid ${style.border_color || '#eee'};
      transition: transform 0.3s ease;
    }

    .data-icon {
      font-size: 56px;
      margin-bottom: 20px;
    }

    .data-item .data-title {
      font-size: 28px;
      font-weight: 700;
      color: ${style.primary_color};
      margin-bottom: 12px;
      line-height: 1.3;
    }

    .data-description {
      font-size: 20px;
      color: ${style.text_color || '#333'};
      line-height: 1.7;
      letter-spacing: 0.005em;
    }

    .data-summary {
      background: ${style.accent_color || '#f5f5f5'};
      padding: 40px 50px;
      border-radius: 20px;
      border: 1px solid ${style.border_color || '#e8e8e8'};
    }

    .data-summary h3 {
      font-size: 28px;
      font-weight: 700;
      color: ${style.primary_color};
      margin-bottom: 20px;
    }

    .data-summary ul {
      list-style: none;
      padding: 0;
    }

    .data-summary li {
      font-size: 20px;
      color: ${style.text_color || '#333'};
      padding: 12px 0;
      padding-left: 35px;
      position: relative;
      line-height: 1.6;
    }

    .data-summary li:before {
      content: '→';
      position: absolute;
      left: 0;
      color: ${style.primary_color};
      font-weight: bold;
      font-size: 22px;
    }
    `,
    html: `
    <div class="data-container">
      <h1 class="data-header-title">${content.title}</h1>
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
 * 生成科研图表模板（优化版）
 */
function generateScientificTemplate(style, content, width, height) {
  const itemsHTML = content.items ? content.items.map((item, index) => `
    <div class="scientific-item">
      <div class="scientific-number">${String(index + 1).padStart(2, '0')}</div>
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
      font-family: 'Noto Sans SC', Georgia, 'Times New Roman', serif;
    }

    .scientific-header-title {
      font-size: 48px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 10px;
      text-align: center;
      letter-spacing: 0.01em;
    }

    .scientific-subtitle {
      font-size: 22px;
      color: #666;
      text-align: center;
      margin-bottom: 50px;
      font-style: italic;
      font-weight: 400;
    }

    .scientific-items {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 25px;
      margin-bottom: 50px;
    }

    .scientific-item {
      background: #F8F9FA;
      padding: 30px 35px;
      border-left: 4px solid ${style.primary_color || '#2C3E50'};
      border-radius: 8px;
      transition: background 0.2s ease;
    }

    .scientific-item:hover {
      background: #F0F1F2;
    }

    .scientific-number {
      font-size: 16px;
      color: #666;
      font-weight: 600;
      margin-bottom: 8px;
      font-family: 'SF Mono', 'Fira Code', monospace;
    }

    .scientific-item .scientific-title {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 10px;
      line-height: 1.3;
    }

    .scientific-description {
      font-size: 17px;
      color: #444;
      line-height: 1.7;
      letter-spacing: 0.005em;
    }

    .scientific-summary {
      background: #F0F0F0;
      padding: 40px 50px;
      border-radius: 8px;
    }

    .scientific-summary h3 {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 20px;
    }

    .scientific-summary ul {
      list-style: none;
      padding: 0;
    }

    .scientific-summary li {
      font-size: 18px;
      color: #444;
      padding: 10px 0;
      padding-left: 28px;
      position: relative;
      line-height: 1.6;
    }

    .scientific-summary li:before {
      content: '▸';
      position: absolute;
      left: 0;
      color: ${style.primary_color || '#2C3E50'};
      font-size: 20px;
    }
    `,
    html: `
    <div class="scientific-container">
      <h1 class="scientific-header-title">${content.title}</h1>
      <p class="scientific-subtitle">${content.subtitle || ''}</p>

      <div class="scientific-items">
        ${itemsHTML}
      </div>

      ${summaryHTML}
    </div>
    `
  };
}
