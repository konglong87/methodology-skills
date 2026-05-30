#!/usr/bin/env node
/**
 * wechat-render.js
 * 结构化文章数据 → 微信公众号兼容HTML（全部行内样式）
 *
 * 用法:
 *   node wechat-render.js article.json > output.html
 *
 * 输入 JSON 结构:
 * {
 *   "title": "文章标题",
 *   "author": "作者",
 *   "theme": "tech|product|warm|zen",
 *   "sections": [
 *     {"type": "h2", "text": "章节标题"},
 *     {"type": "h3", "text": "小节标题"},
 *     {"type": "p", "text": "段落文字..."},
 *     {"type": "blockquote", "text": "引用"},
 *     {"type": "ul", "items": ["要点1", "要点2"]},
 *     {"type": "ol", "items": ["步骤1", "步骤2"]},
 *     {"type": "highlight", "text": "重点强调内容"},
 *     {"type": "code", "text": "行内代码示例", "lang": "javascript"},
 *     {"type": "pre", "text": "多行代码块", "lang": "python"},
 *     {"type": "separator"},
 *     {"type": "summary", "title": "总结", "items": ["要点1", "要点2"]},
 *     {"type": "image", "src": "https://...", "alt": "图片描述"},
 *     {"type": "link", "text": "链接文字", "href": "https://..."}
 *   ]
 * }
 */

const path = require('path');
const fs = require('fs');

// 加载主题
const themesPath = path.join(__dirname, 'wechat-themes.json');
const THEMES = JSON.parse(fs.readFileSync(themesPath, 'utf-8')).themes;

// ── CSS 对象 → 行内 style 字符串 ────────────────────
function toStyle(obj) {
  if (!obj || Object.keys(obj).length === 0) return '';
  const pairs = [];
  for (const [key, value] of Object.entries(obj)) {
    const prop = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    pairs.push(prop + ': ' + value);
  }
  return pairs.join('; ');
}

// ── 渲染单个 HTML 元素 ──────────────────────────────
function el(tag, styleObj, content, extraAttrs) {
  const style = toStyle(styleObj);
  const attrs = style ? ' style="' + style + '"' : '';
  const extra = extraAttrs ? ' ' + extraAttrs : '';
  const inner = Array.isArray(content) ? content.join('\n') : (content || '');
  return '<' + tag + attrs + extra + '>' + inner + '</' + tag + '>';
}

function voidEl(tag, styleObj, extraAttrs) {
  const style = toStyle(styleObj);
  const attrs = style ? ' style="' + style + '"' : '';
  const extra = extraAttrs ? ' ' + extraAttrs : '';
  return '<' + tag + attrs + extra + ' />';
}

// ── 渲染各个 section type ────────────────────────────
function renderSection(sec, theme) {
  switch (sec.type) {

    case 'h2':
      return el('h2', theme.h2, sec.text);

    case 'h3':
      return el('h3', theme.h3, sec.text);

    case 'p': {
      // p 内的 strong 处理：把 **text** 替换为带样式的 strong
      const styled = (sec.text || '')
        .replace(/\*\*(.+?)\*\*/g, (_, txt) => el('strong', theme.strong, txt));
      return el('p', theme.p, styled);
    }

    case 'blockquote':
      return el('blockquote', theme.blockquote, sec.text);

    case 'ul': {
      const items = (sec.items || [])
        .map(item => el('li', theme.li, item))
        .join('');
      return el('ul', theme.ul, items);
    }

    case 'ol': {
      const items = (sec.items || [])
        .map(item => el('li', theme.li, item))
        .join('');
      return el('ol', theme.ol, items);
    }

    case 'highlight':
      return el('div', theme.highlight, sec.text);

    case 'code':
      return el('code', theme.code, sec.text);

    case 'pre': {
      const langAttr = sec.lang ? ' data-lang="' + sec.lang + '"' : '';
      return el('pre', theme.pre, sec.text, langAttr);
    }

    case 'separator':
      return voidEl('hr', theme.hr);

    case 'summary': {
      const title = sec.title ? el('div', theme.summary_title, sec.title) : '';
      const items = (sec.items || [])
        .map(item => {
          const styled = item.replace(/\*\*(.+?)\*\*/g, (_, txt) =>
            el('strong', theme.strong, txt));
          return el('p', { margin: '4px 0', 'font-size': 'inherit', color: 'inherit' }, '· ' + styled);
        })
        .join('');
      return el('div', theme.summary, title + items);
    }

    case 'image': {
      const src = sec.src || '';
      const alt = sec.alt || '';
      return el('div', { 'text-align': 'center', margin: '1.5em 0' },
        voidEl('img', {
          'max-width': '100%',
          display: 'block',
          margin: '0 auto',
        }, 'src="' + src + '" alt="' + alt + '"') +
        (alt ? el('div', { 'font-size': '12px', color: '#999', 'margin-top': '8px', 'text-align': 'center' }, alt) : '')
      );
    }

    case 'link':
      return el('a', {
        color: theme.a ? theme.a.color : '#1e6bb8',
        'text-decoration': 'none',
      }, sec.text, 'href="' + (sec.href || '#') + '"');

    default:
      return '';
  }
}

// ── 完整文章渲染 ─────────────────────────────────────
function renderArticle(config) {
  const themeId = config.theme || 'tech';
  const theme = THEMES[themeId] || THEMES.tech;

  const globalStyle = toStyle(theme.global);

  // 标题区
  const titleBlock = config.title
    ? '<h1 style="' + toStyle({
        'font-size': '26px',
        'font-weight': 'bold',
        color: '#1a1a1a',
        'text-align': 'center',
        margin: '0 0 8px',
        'letter-spacing': '1px',
        'line-height': '1.3',
      }) + '">' + config.title + '</h1>'
    : '';

  const authorBlock = config.author
    ? '<p style="' + toStyle({
        'font-size': '13px',
        color: '#999',
        'text-align': 'center',
        margin: '0 0 30px',
      }) + '">' + config.author + '</p>'
    : '';

  // 按 section 顺序渲染
  const sectionsHTML = (config.sections || [])
    .map(sec => renderSection(sec, theme))
    .filter(Boolean)
    .join('\n\n');

  // 关注引导区
  const footerHTML = config.showFooter !== false
    ? '\n\n' + el('hr', theme.hr) + '\n\n' +
      el('div', {
        'text-align': 'center',
        'font-size': '13px',
        color: '#999',
        margin: '30px 0',
      }, '— END —')
    : '';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${config.title || '微信公众号文章'}</title>
</head>
<body style="margin:0;padding:0;background:#fff;">

<!-- ═══ 从这里开始复制 ═══ -->
<div style="max-width:680px;margin:0 auto;padding:40px 16px 60px;">
<div style="${globalStyle}">

${titleBlock}
${authorBlock}
${sectionsHTML}
${footerHTML}

</div>
</div>
<!-- ═══ 到这里结束复制 ═══ -->

</body>
</html>`;
}

// ── CLI ────────────────────────────────────────────────
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('用法: node wechat-render.js <article.json> [output.html]');
    console.log('  读取 JSON 格式的文章数据，输出 WeChat 兼容 HTML');
    console.log('  如不指定输出文件，则输出到 stdout');
    process.exit(1);
  }

  const cfgPath = path.resolve(args[0]);
  const config = JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
  const html = renderArticle(config);

  if (args[1]) {
    const outPath = path.resolve(args[1]);
    fs.writeFileSync(outPath, html, 'utf-8');
    console.log('已生成: ' + outPath);
  } else {
    console.log(html);
  }
}

module.exports = { renderArticle, THEMES };