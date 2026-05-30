#!/usr/bin/env node
/**
 * wechat-full.js — 公众号文章+配图一站式生成
 *
 * 用法:
 *   node wechat-full.js article.md
 *   node wechat-full.js article.md --theme warm --only-theme
 *   node wechat-full.js article.md -o ./output/
 *
 * 流程:
 *   1. 解析 .md 文件 → 提取文章内容
 *   2. 根据文章内容生成配图 HTML → Playwright 截图 → 4主题PNG
 *   3. 每张截图映射到文章对应 section
 *   4. 生成 WeChat 兼容 HTML（图片已插入对应位置）
 *   5. 同时生成一份"图片位置对照表"，方便用户上传到公众号
 */

const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

// 加载各模块
const { renderArticle, THEMES: WECHAT_THEMES } = require('./wechat-render.js');
const { parseMarkdown } = require('./wechat-md2html.js');

const GEN_DIR = path.join(__dirname, '..', 'infographic-generator');
const RECIPES = JSON.parse(fs.readFileSync(path.join(GEN_DIR, 'theme-recipes.json'), 'utf-8'));
const THEME_IDS = Object.keys(RECIPES.themes);

// ── 从解析出的 article 提取配图页面配置 ───────────────
function buildPageConfig(article, themeId) {
  const h2s = article.sections.filter(s => s.type === 'h2');
  const h3s = article.sections.filter(s => s.type === 'h3');
  const paragraphs = article.sections.filter(s => s.type === 'p');

  // 提取标题：如果 article.title 为空，从第一个 h2 取
  let pageTitle = article.title || '';
  if (!pageTitle && h2s.length > 0) {
    pageTitle = h2s[0].text.replace(/^[一二三四五六七八九十]+[、.．]\s*/, '');
  }
  if (!pageTitle && paragraphs.length > 0) {
    pageTitle = paragraphs[0].text.substring(0, 30);
  }
  pageTitle = pageTitle.replace(/<[^>]+>/g, '');

  // 副标题从第一个段落取
  const sub = (paragraphs[0] || {}).text || '';

  // Hero
  const heroSection = {
    type: 'hero',
    badge: '深度阅读',
    title: pageTitle || '未命名',
    subtitle: sub.length > 120 ? sub.substring(0, 120) + '…' : sub,
  };

  // 用 h2 标题作为 features 卡片（每个 h2 是一章）
  const featItems = h2s.map(h => ({
    icon: '✦',
    title: h.text,
    desc: '',
  }));
  const featSection = featItems.length > 0
    ? { type: 'features', eyebrow: '文章结构', title: '本文脉络', points: featItems }
    : null;

  // 用前 3 个 h3 作为 show 卡片
  const showItems = h3s.slice(0, 3).map(h => ({
    tag: h.text.substring(0, 8).replace(/^\d+[.、．]\s*/, ''),
    title: h.text,
    desc: '',
  }));

  // 取一些段落内容填充描述
  for (let i = 0; i < Math.min(showItems.length, 3); i++) {
    const related = paragraphs.find(p => p.text && p.text.length > 10);
    if (related) showItems[i].desc = related.text.substring(0, 80) + '…';
  }

  const showSection = showItems.length > 0
    ? { type: 'use-cases', eyebrow: '关键概念', title: '核心知识点', cases: showItems }
    : null;

  // CTA
  const ctaSection = {
    type: 'cta',
    title: pageTitle || '',
    subtitle: '感谢阅读',
    button: '关注公众号 →',
  };

  const sections = [heroSection];
  if (featSection && featItems.length > 2) sections.push(featSection);
  if (showSection) sections.push(showSection);
  sections.push(ctaSection);

  return {
    title: article.title || '公众号配图',
    subtitle: '',
    brand: '方法论',
    themeId,
    sections,
  };
}

// ── 从 pageConfig 渲染 HTML ────────────────────────────
function renderPageHTML(config) {
  // 引用 generate-garden-page 的渲染逻辑
  const { renderPage } = require(path.join(GEN_DIR, 'generate-garden-page.js'));
  return renderPage(config);
}

// ── 取截图 ────────────────────────────────────────────
async function takeScreenshots(htmlPath, outputDir, themeFilter) {
  const themes = THEME_IDS.map((id, i) => ({
    id, label: RECIPES.themes[id].name, attr: i === 0 ? '' : id,
  })).filter(t => !themeFilter || themeFilter === t.id);

  const allSections = RECIPES.sectionSelectors || [
    { selector: '.hero', label: 'hero' },
    { selector: '.pain-points, .problem', label: 'pain-points' },
    { selector: '.features', label: 'features' },
    { selector: '.cta-banner, .cta', label: 'cta' },
  ];

  const sc = RECIPES.screenshotDefaults || {};
  const vp = { width: sc.viewport?.width || 750, height: sc.viewport?.height || 1334 };
  const dsf = sc.deviceScaleFactor || 2;

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: vp, deviceScaleFactor: dsf });

  const result = {}; // { themeId: { label: [filePath, ...] } }

  for (const theme of themes) {
    const page = await context.newPage();
    await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    if (theme.attr) {
      await page.evaluate(t => document.body.setAttribute('data-theme', t), theme.attr);
    }
    await page.waitForTimeout(400);

    const dir = path.join(outputDir, theme.id);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    result[theme.id] = {};

    // 全页截图
    const fullPath = path.join(dir, theme.id + '-full.png');
    await page.screenshot({ path: fullPath, fullPage: true });
    result[theme.id].full = path.basename(fullPath);

    // 每个 section 截图
    for (const sec of allSections) {
      try {
        const el = await page.$(sec.selector);
        if (!el) continue;
        const box = await el.boundingBox();
        if (!box) continue;
        const f = path.join(dir, theme.id + '-' + sec.label + '.png');
        await page.screenshot({
          path: f,
          clip: { x: Math.max(0, box.x - 16), y: Math.max(0, box.y - 32), width: Math.min(box.width + 32, vp.width), height: box.height + 64 },
          fullPage: false,
        });
        result[theme.id][sec.label] = path.basename(f);
      } catch (e) { /* skip */ }
    }
    await page.close();
  }
  await browser.close();
  return result;
}

// ── 图片 → 文章映射 ────────────────────────────────────
function buildImageMap(article, screenshotMap, themeId) {
  const theme = screenshotMap[themeId] || screenshotMap[THEME_IDS[0]];
  if (!theme) return [];

  const map = [];
  const h2Indices = article.sections.reduce((a, s, i) => {
    if (s.type === 'h2') a.push(i);
    return a;
  }, []);

  // Hero → 标题下方
  if (theme.hero) {
    map.push({ afterIndex: -1, file: themeId + '/' + theme.hero, label: '文章头图' });
  }

  // features → 第一个 h2 之后
  if (theme.features && h2Indices.length > 0) {
    map.push({ afterIndex: h2Indices[0], file: themeId + '/' + theme.features, label: '文章脉络图' });
  }

  // use-cases → 中间 h2 之后（如果有的话）
  if (theme['use-cases'] && h2Indices.length >= 3) {
    map.push({ afterIndex: h2Indices[2], file: themeId + '/' + theme['use-cases'], label: '概念图' });
  }

  // cta → 文末
  if (theme.cta) {
    map.push({ afterIndex: article.sections.length + 100, file: themeId + '/' + theme.cta, label: '文末引导图' });
  }

  return map;
}

// ── 带图片插入的文章渲染 ──────────────────────────────
function renderArticleWithImages(article, imageMap, screenshotsDir) {
  const themeId = article.theme || 'tech';
  const theme = WECHAT_THEMES[themeId] || WECHAT_THEMES.tech;

  function toStyle(obj, extra) {
    const pairs = [];
    for (const [k, v] of Object.entries(obj || {})) {
      pairs.push(k.replace(/([A-Z])/g, '-$1').toLowerCase() + ': ' + v);
    }
    if (extra) pairs.push(extra);
    return pairs.join('; ');
  }

  // 构建 afterIndex → imageFiles 查表
  const imageLookup = {};
  for (const img of imageMap) {
    if (!imageLookup[img.afterIndex]) imageLookup[img.afterIndex] = [];
    imageLookup[img.afterIndex].push(img);
  }

  const parts = [];

  // 标题
  parts.push('<h1 style="' + toStyle({
    'font-size': '26px', 'font-weight': 'bold', color: '#1a1a1a', 'text-align': 'center',
    margin: '0 0 8px', 'letter-spacing': '1px', 'line-height': '1.3',
  }) + '">' + (article.title || '') + '</h1>');

  // 在标题后插入 hero 图
  if (imageLookup[-1]) {
    for (const img of imageLookup[-1]) {
      parts.push('<p style="' + toStyle(theme.global, 'text-align:center;margin:24px 0') + '">');
      parts.push('  <img src="' + screenshotsDir + '/' + img.file + '" style="max-width:100%;border-radius:4px" alt="' + img.label + '" />');
      parts.push('  <span style="font-size:12px;color:#999;display:block;margin-top:6px">▲ ' + img.label + '</span>');
      parts.push('</p>');
    }
  }

  // 逐个 section
  const SECTION_RENDERERS = {
    h2: (s, t) => '<h2 style="' + toStyle(t.h2) + '">' + s.text + '</h2>',
    h3: (s, t) => '<h3 style="' + toStyle(t.h3) + '">' + s.text + '</h3>',
    p: (s, t) => {
      const styled = (s.text || '').replace(/\*\*(.+?)\*\*/g, (_, txt) =>
        '<strong style="' + toStyle(t.strong) + '">' + txt + '</strong>');
      return '<p style="' + toStyle(t.p) + '">' + styled + '</p>';
    },
    blockquote: (s, t) => '<blockquote style="' + toStyle(t.blockquote) + '">' + s.text + '</blockquote>',
    ul: (s, t) => '<ul style="' + toStyle(t.ul) + '">' +
      (s.items || []).map(item => '<li style="' + toStyle(t.li) + '">' + item + '</li>').join('') + '</ul>',
    highlight: (s, t) => '<div style="' + toStyle(t.highlight) + '">' + s.text + '</div>',
    separator: () => '<hr/>',
    summary: (s, t) => '<div style="' + toStyle(t.summary) + '">' +
      (s.title ? '<div style="' + toStyle(t.summary_title) + '">' + s.title + '</div>' : '') +
      (s.items || []).map(item => '<p style="' + toStyle({ margin: '4px 0', 'font-size': 'inherit', color: 'inherit' }) + '">· ' + item + '</p>').join('') +
      '</div>',
  };

  for (let i = 0; i < article.sections.length; i++) {
    const s = article.sections[i];
    const renderer = SECTION_RENDERERS[s.type];
    if (renderer) {
      parts.push(renderer(s, theme));
    }

    // 检查是否需要在此 section 后插入图片
    if (imageLookup[i]) {
      for (const img of imageLookup[i]) {
        parts.push('<p style="' + toStyle(theme.global, 'text-align:center;margin:24px 0') + '">');
        parts.push('  <img src="' + screenshotsDir + '/' + img.file + '" style="max-width:100%;border-radius:4px" alt="' + img.label + '" />');
        parts.push('  <span style="font-size:12px;color:#999;display:block;margin-top:6px">▲ ' + img.label + '</span>');
        parts.push('</p>');
      }
    }
  }

  // 文末插入 cta 图
  const endKey = article.sections.length + 100;
  if (imageLookup[endKey]) {
    for (const img of imageLookup[endKey]) {
      parts.push('<p style="' + toStyle(theme.global, 'text-align:center;margin:24px 0') + '">');
      parts.push('  <img src="' + screenshotsDir + '/' + img.file + '" style="max-width:100%;border-radius:4px" alt="' + img.label + '" />');
      parts.push('  <span style="font-size:12px;color:#999;display:block;margin-top:6px">▲ ' + img.label + '</span>');
      parts.push('</p>');
    }
  }

  // END 标记
  parts.push('<hr style="' + toStyle(theme.hr) + '" />');
  parts.push('<p style="' + toStyle(theme.global, 'text-align:center;font-size:13px;color:#999;margin:30px 0') + '">— END —</p>');

  const globalStyle = toStyle(theme.global);
  const inner = parts.join('\n\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${article.title || ''}</title>
</head>
<body style="margin:0;padding:0;background:#fff;">

<div style="max-width:680px;margin:0 auto;padding:40px 16px 60px;">
<div style="${globalStyle}">
${inner}
</div>
</div>

</body>
</html>`;
}

// ── 生成插入指南 ───────────────────────────────────────
function buildInsertGuide(imageMap, article) {
  const lines = ['# 图片插入指南', '', '以下图片请上传到微信公众号素材库后，按位置插入：', ''];
  for (const img of imageMap) {
    const pos = img.afterIndex < 0 ? '文章标题下方' :
      (img.afterIndex > article.sections.length ? '文章末尾' :
        '「' + (article.sections[img.afterIndex] || {}).text + '」之后');
    lines.push('- **' + img.label + '**: ' + img.file + ' → 插在 ' + pos);
    lines.push('');
  }
  lines.push('---');
  lines.push('提示：在浏览器中打开 article.html 可预览完整图文混排效果。');
  return lines.join('\n');
}

// ── CLI ────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  if (!args.length || args.includes('--help') || args.includes('-h')) {
    console.log(`wechat-full.js — 公众号文章+配图一站式生成

用法: node wechat-full.js <article.md> [options]

选项:
  --theme <id>      配图主题: linear|apple|stripe|muji (默认全部4种)
  --article-theme   文章主题: tech|product|warm|zen (默认自动推断)
  --title <title>   指定文章标题（覆盖自动解析）
  -o, --output      输出目录 (默认 ./output/)
  --no-screenshots  跳过截图，只生成文章HTML
  --guide-only      只更新插入指南，不重新截图

流程:
  1. 解析 .md → 提取文章结构和内容
  2. 生成配图页面 + 自动截图 (4主题 × N section)
  3. 图片自动插入到文章对应位置
  4. 输出: article.html + screenshots/ + 插入指南.md`);
    process.exit(0);
  }

  const inputPath = path.resolve(args[0]);
  if (!fs.existsSync(inputPath)) { console.error('文件不存在: ' + inputPath); process.exit(1); }

  // 解析参数
  let themeFilter = null; // null = all themes
  let articleTheme = null;
  let forceTitle = null;
  const oi = args.indexOf('-o') !== -1 ? args.indexOf('-o') : args.indexOf('--output');
  const outDir = path.resolve(oi !== -1 && args[oi + 1] ? args[oi + 1] : './output');
  const noScreenshots = args.includes('--no-screenshots');

  const ti = args.indexOf('--theme');
  if (ti !== -1 && args[ti + 1]) themeFilter = args[ti + 1];

  const ati = args.indexOf('--article-theme');
  if (ati !== -1 && args[ati + 1]) articleTheme = args[ati + 1];

  const tti = args.indexOf('--title');
  if (tti !== -1 && args[tti + 1]) forceTitle = args[tti + 1];

  // ── Step 1: 解析文章 ──
  console.log('1/4 解析文章...');
  const text = fs.readFileSync(inputPath, 'utf-8');
  const article = parseMarkdown(text);

  // 修正标题：如果 parser 没拿到，从 h2 取
  if (!article.title || article.title.trim().length === 0) {
    const firstH2 = article.sections.find(s => s.type === 'h2');
    if (firstH2) article.title = firstH2.text.replace(/^[一二三四五六七八九十]+[、.．]\s*/, '');
  }
  if (forceTitle) article.title = forceTitle;
  if (articleTheme) article.theme = articleTheme;
  console.log('   标题: ' + article.title);
  console.log('   sections: ' + article.sections.length + ' 主题: ' + (WECHAT_THEMES[article.theme] || {}).name);

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  let screenshotMap = {};

  if (!noScreenshots) {
    // ── Step 2: 生成配图页面 ──
    console.log('\n2/4 生成配图 HTML...');
    const pageConfig = buildPageConfig(article, themeFilter || THEME_IDS[0]);
    const pageHTML = renderPageHTML(pageConfig);
    const pagePath = path.join(outDir, '_garden.html');
    fs.writeFileSync(pagePath, pageHTML, 'utf-8');
    console.log('   配图页面: ' + pagePath);

    // ── Step 3: 自动截图 ──
    console.log('\n3/4 自动截图...');
    const ssDir = path.join(outDir, 'screenshots');
    screenshotMap = await takeScreenshots(pagePath, ssDir, themeFilter);
    const totalShots = Object.values(screenshotMap).reduce((sum, t) => sum + Object.keys(t).length, 0);
    console.log('   截图数: ' + totalShots + ' 张');

    // 清理临时页面
    fs.unlinkSync(pagePath);
  } else {
    console.log('\n2/4 跳过配图生成 (--no-screenshots)');
    console.log('3/4 跳过截图');
  }

  // ── Step 4: 生成最终文章 ──
  console.log('\n4/4 生成文章...');
  const primaryThemeId = themeFilter || THEME_IDS[0];
  const imageMap = buildImageMap(article, screenshotMap, primaryThemeId);

  // 生成图文混排 HTML
  const screenshotsRelPath = './screenshots';
  const articleHTML = renderArticleWithImages(article, imageMap, screenshotsRelPath);
  const articleOutPath = path.join(outDir, 'article.html');
  fs.writeFileSync(articleOutPath, articleHTML, 'utf-8');

  // 生成插入指南
  const guidePath = path.join(outDir, '插入指南.md');
  fs.writeFileSync(guidePath, buildInsertGuide(imageMap, article), 'utf-8');

  // 同时生成纯文本版（无图，可直接粘贴到公众号）
  const plainHTML = renderArticle(article);
  const plainOutPath = path.join(outDir, 'article-plain.html');
  fs.writeFileSync(plainOutPath, plainHTML, 'utf-8');

  console.log('\n输出文件:');
  console.log('  ' + articleOutPath + '    ← 图文混排（浏览器预览）');
  console.log('  ' + plainOutPath + '      ← 纯文本排版（粘贴到公众号）');
  console.log('  ' + guidePath + '            ← 图片插入指南');
  if (!noScreenshots) {
    console.log('  ' + path.join(outDir, 'screenshots/') + ' ← ' + Object.keys(screenshotMap).length + ' 套配图');
  }
  console.log('\n下一步:');
  console.log('  1. 浏览器打开 article.html 查看图文混排效果');
  console.log('  2. 把 article-plain.html 内容粘贴到公众号编辑器');
  console.log('  3. 参考插入指南把配图上传并插到对应位置');
}

main().catch(err => { console.error(err); process.exit(1); });