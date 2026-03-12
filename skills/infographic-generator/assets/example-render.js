/**
 * 信息图渲染示例脚本
 * 演示如何使用模板和配置生成PNG图片
 */

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// 加载模板配置
function loadTemplate(templatePath) {
  const templateData = fs.readFileSync(templatePath, 'utf-8');
  return JSON.parse(templateData);
}

// 渲染信息图
async function renderInfographic(template, content, style) {
  const { width, height, dpi } = template.output;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 设置背景
  ctx.fillStyle = style.background_color;
  ctx.fillRect(0, 0, width, height);

  // 渲染标题区
  renderTitleArea(ctx, template, content, style, width);

  // 渲染内容区
  renderContentArea(ctx, template, content, style, width);

  // 渲染总结区
  renderSummaryArea(ctx, template, content, style, width);

  return canvas;
}

// 渲染标题区
function renderTitleArea(ctx, template, content, style, width) {
  const titleArea = template.layout.sections[0];
  const { top, left, right } = template.output.padding;
  const y = top + 80;

  // 主标题
  ctx.font = `bold ${titleArea.content.main_title.font_size}px Arial`;
  ctx.fillStyle = style.primary_color;
  ctx.textAlign = 'center';
  ctx.fillText(content.title, width / 2, y);

  // 副标题
  ctx.font = `${titleArea.content.subtitle.font_weight} ${titleArea.content.subtitle.font_size}px Arial`;
  ctx.fillStyle = style.secondary_color;
  ctx.fillText(content.subtitle, width / 2, y + 50);

  // 元信息
  if (content.meta_info) {
    ctx.font = `${titleArea.content.meta_info.font_weight} ${titleArea.content.meta_info.font_size}px Arial`;
    ctx.fillStyle = style.gray_color;
    ctx.fillText(content.meta_info, width / 2, y + 90);
  }
}

// 渲染内容区
function renderContentArea(ctx, template, content, style, width) {
  const contentArea = template.layout.sections[1];
  const { top, left, right } = template.output.padding;
  const startY = top + 250;
  const itemWidth = (width - left - right - contentArea.content.items.spacing) / 2;

  content.items.forEach((item, index) => {
    const x = left + (index % 2) * (itemWidth + contentArea.content.items.spacing);
    const y = startY + Math.floor(index / 2) * 180;

    // 图标
    ctx.font = `${contentArea.content.items.item.icon.size}px Arial`;
    ctx.textAlign = 'left';
    ctx.fillText(item.icon, x, y + 40);

    // 标题
    ctx.font = `bold ${contentArea.content.items.item.title.font_size}px Arial`;
    ctx.fillStyle = style.primary_color;
    ctx.fillText(item.title, x + 70, y + 40);

    // 描述
    ctx.font = `${contentArea.content.items.item.description.font_weight} ${contentArea.content.items.item.description.font_size}px Arial`;
    ctx.fillStyle = style.text_color;
    const words = wrapText(ctx, item.description, itemWidth - 70);
    words.forEach((word, i) => {
      ctx.fillText(word, x + 70, y + 70 + i * 24);
    });
  });
}

// 渲染总结区
function renderSummaryArea(ctx, template, content, style, width) {
  const summaryArea = template.layout.sections[2];
  const { top, left, right, bottom } = template.output.padding;
  const startY = top + 250 + Math.ceil(content.items.length / 2) * 180 + 40;

  ctx.font = `bold ${contentArea.content.items.item.title.font_size}px Arial`;
  ctx.fillStyle = style.primary_color;
  ctx.textAlign = 'left';
  ctx.fillText('总结要点：', left, startY);

  content.summary.forEach((point, index) => {
    const y = startY + 40 + index * 30;
    ctx.font = `${summaryArea.content.points.item.font_size}px Arial`;
    ctx.fillStyle = style.text_color;
    ctx.fillText(`• ${point}`, left + 20, y);
  });
}

// 文本换行
function wrapText(ctx, text, maxWidth) {
  const words = text.split('');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + word).width;
    if (width < maxWidth) {
      currentLine += word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

// 主函数
async function main() {
  // 加载模板
  const templatePath = path.join(__dirname, 'templates/knowledge/template.json');
  const template = loadTemplate(templatePath);

  // 准备内容
  const content = {
    title: 'Python编程语言',
    subtitle: '简洁优雅，功能强大',
    meta_info: '1991年创建 | Guido van Rossum',
    items: [
      {
        icon: '📝',
        title: '语法简洁',
        description: '清晰易读，适合初学者'
      },
      {
        icon: '🚀',
        title: '应用广泛',
        description: '数据分析、AI、Web开发'
      },
      {
        icon: '📦',
        title: '生态丰富',
        description: 'NumPy、Pandas、TensorFlow'
      },
      {
        icon: '🌐',
        title: '跨平台',
        description: 'Windows、Mac、Linux'
      }
    ],
    summary: [
      '适合初学者的入门语言',
      '广泛应用于多个领域',
      '拥有丰富的第三方库'
    ]
  };

  // 选择样式
  const style = template.style.default;

  // 渲染信息图
  const canvas = await renderInfographic(template, content, style);

  // 保存为PNG
  const outputPath = path.join(__dirname, 'output', 'python-infographic.png');
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);

  console.log(`信息图已生成: ${outputPath}`);
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  renderInfographic,
  loadTemplate
};
};
