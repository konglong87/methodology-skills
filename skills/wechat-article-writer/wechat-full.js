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
 *   2. 为每个 h2 section 生成独立配图 HTML → Playwright 截图 → 4主题PNG
 *   3. 每张截图映射到文章对应 h2 section
 *   4. 生成 WeChat 兼容 HTML（图片已插入对应位置）
 *   5. 同时生成一份"图片位置对照表"，方便用户上传到公众号
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');
const { chromium } = require('playwright');

// 加载各模块
const { renderArticle, THEMES: WECHAT_THEMES } = require('./wechat-render.js');
const { parseMarkdown } = require('./wechat-md2html.js');

const GEN_DIR = path.join(__dirname, '..', 'infographic-generator');
const RECIPES = JSON.parse(fs.readFileSync(path.join(GEN_DIR, 'theme-recipes.json'), 'utf-8'));
const THEME_IDS = Object.keys(RECIPES.themes);
const DEFAULT_THEME = 'apple'; // 默认明亮风格，非暗黑

// ── 从解析出的 article 提取每个 h2 section 的配图页面配置 ──
function buildSectionPageConfigs(article, themeId) {
  const h2s = article.sections.filter(s => s.type === 'h2');
  const paragraphs = article.sections.filter(s => s.type === 'p');

  // 提取标题
  let pageTitle = article.title || '';
  if (!pageTitle && h2s.length > 0) {
    pageTitle = h2s[0].text.replace(/^[一二三四五六七八九十]+[、.．]\s*/, '');
  }
  if (!pageTitle && paragraphs.length > 0) {
    pageTitle = paragraphs[0].text.substring(0, 30);
  }
  pageTitle = pageTitle.replace(/<[^>]+>/g, '');

  const configs = [];

  // ── Hero 配图 ──
  const sub = (paragraphs[0] || {}).text || '';
  configs.push({
    key: 'hero',
    label: '文章头图',
    config: {
      title: pageTitle || '未命名',
      subtitle: '',
      brand: '方法论',
      themeId,
      sections: [{
        type: 'hero',
        badge: '深度阅读',
        title: pageTitle || '未命名',
        subtitle: sub.length > 120 ? sub.substring(0, 120) + '…' : sub,
      }],
    },
  });

  // ── 每个 h2 section 的配图 ──
  // 先把 sections 按 h2 分组
  const h2Groups = groupSectionsByH2(article.sections);

  for (let gi = 0; gi < h2Groups.length; gi++) {
    const group = h2Groups[gi];
    const h2Text = group.h2.text.replace(/<[^>]+>/g, '');
    const groupH3s = group.children.filter(s => s.type === 'h3');
    const groupPs = group.children.filter(s => s.type === 'p');
    const groupUls = group.children.filter(s => s.type === 'ul');
    const groupHighlights = group.children.filter(s => s.type === 'highlight');

    // section 配图的 hero 区
    const firstP = groupPs.length > 0 ? groupPs[0].text : '';
    const heroSubtitle = firstP.length > 120 ? firstP.substring(0, 120) + '…' : firstP;

    const sectionSections = [{
      type: 'hero',
      badge: '第' + (gi + 1) + '章',
      title: h2Text,
      subtitle: heroSubtitle || '',
    }];

    // features 区：用 h3 作为卡片，填充段落描述
    if (groupH3s.length > 0) {
      const featItems = groupH3s.map(h => {
        // 找最近的段落作为描述
        const h3Idx = article.sections.indexOf(h);
        const nearbyP = article.sections.slice(h3Idx + 1, h3Idx + 4)
          .find(s => s.type === 'p' && s.text && s.text.length > 10);
        const desc = nearbyP ? nearbyP.text.substring(0, 80) + '…' : '';
        return { icon: '✦', title: h.text, desc };
      });
      sectionSections.push({
        type: 'features',
        eyebrow: '核心要点',
        title: h2Text + ' · 关键概念',
        points: featItems,
      });
    } else if (groupUls.length > 0 || groupPs.length > 1) {
      // 没有 h3 时，用列表项或段落要点作为卡片
      const featItems = [];
      for (const ul of groupUls) {
        for (const item of (ul.items || []).slice(0, 4)) {
          featItems.push({ icon: '✦', title: item.substring(0, 30), desc: '' });
        }
      }
      // 如果卡片不够，用段落的关键句补充
      if (featItems.length < 3) {
        for (const p of groupPs.slice(1, 4)) {
          if (p.text && p.text.length > 10) {
            featItems.push({ icon: '✦', title: p.text.substring(0, 30), desc: '' });
          }
        }
      }
      if (featItems.length > 0) {
        sectionSections.push({
          type: 'features',
          eyebrow: '要点速览',
          title: h2Text + ' · 核心要点',
          points: featItems,
        });
      }
    }

    // highlight 区：如果有划重点内容
    if (groupHighlights.length > 0) {
      const hlText = groupHighlights.map(h => h.text).join(' · ');
      sectionSections.push({
        type: 'use-cases',
        eyebrow: '划重点',
        title: '关键提醒',
        cases: [{
          tag: '重点',
          title: '核心要点',
          desc: hlText.substring(0, 80),
        }],
      });
    }

    // CTA 区（简化版）
    sectionSections.push({
      type: 'cta',
      title: h2Text,
      subtitle: '继续阅读 →',
      button: '下一章',
    });

    configs.push({
      key: 'section-' + gi,
      label: h2Text,
      h2Index: group.h2Index,
      config: {
        title: h2Text,
        subtitle: '',
        brand: '方法论',
        themeId,
        sections: sectionSections,
      },
    });
  }

  // ── CTA 配图 ──
  configs.push({
    key: 'cta',
    label: '文末引导图',
    config: {
      title: pageTitle || '',
      subtitle: '',
      brand: '方法论',
      themeId,
      sections: [{
        type: 'cta',
        title: pageTitle || '',
        subtitle: '感谢阅读',
        button: '关注公众号 →',
      }],
    },
  });

  return configs;
}

// ── 按 h2 分组 sections ──────────────────────────────
function groupSectionsByH2(sections) {
  const groups = [];
  let currentGroup = null;

  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    if (s.type === 'h2') {
      if (currentGroup) groups.push(currentGroup);
      currentGroup = { h2: s, h2Index: i, children: [] };
    } else if (currentGroup) {
      currentGroup.children.push(s);
    }
    // h2 之前的 section 不归入任何组（标题、开头段落等）
  }
  if (currentGroup) groups.push(currentGroup);
  return groups;
}

// ── 从 pageConfig 渲染 HTML ────────────────────────────
function renderPageHTML(config) {
  const { renderPage } = require(path.join(GEN_DIR, 'generate-garden-page.js'));
  return renderPage(config);
}

// ── 多页面截图 ────────────────────────────────────────
async function takeMultiPageScreenshots(pageConfigs, outputDir, themeFilter) {
  const themes = THEME_IDS.map((id, i) => ({
    id, label: RECIPES.themes[id].name, attr: i === 0 ? '' : id,
  })).filter(t => !themeFilter || themeFilter === t.id);

  const sc = RECIPES.screenshotDefaults || {};
  const portraitVp = { width: sc.viewport?.width || 750, height: sc.viewport?.height || 1334 };
  const wideVp = sc.wideViewport || { width: 1200, height: 675 };
  const dsf = sc.deviceScaleFactor || 2;

  const browser = await chromium.launch();

  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  // 结果: { key: { themeId: filename } } 竖长图
  // 宽屏图存到 {theme}/wide/ 子目录
  const result = {};

  // ── 竖长图 ──
  {
    const context = await browser.newContext({ viewport: portraitVp, deviceScaleFactor: dsf });

    for (const pc of pageConfigs) {
      result[pc.key] = {};

      const pageHTML = renderPageHTML(pc.config);
      const tmpPath = path.join(path.dirname(outputDir), '_tmp_' + pc.key + '.html');
      fs.writeFileSync(tmpPath, pageHTML, 'utf-8');

      try {
        for (const theme of themes) {
          const page = await context.newPage();
          await page.goto('file://' + tmpPath, { waitUntil: 'networkidle' });
          await page.waitForTimeout(300);
          if (theme.attr) {
            await page.evaluate(t => document.body.setAttribute('data-theme', t), theme.attr);
          }
          await page.waitForTimeout(400);

          const dir = path.join(outputDir, theme.id);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

          const filename = theme.id + '-' + pc.key + '.png';
          await page.screenshot({ path: path.join(dir, filename), fullPage: true });
          result[pc.key][theme.id] = filename;

          await page.close();
        }
      } finally {
        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
      }
    }
    await context.close();
  }

  // ── 宽屏图 ──
  {
    const wideContext = await browser.newContext({ viewport: wideVp, deviceScaleFactor: dsf });

    for (const pc of pageConfigs) {
      const pageHTML = renderPageHTML(pc.config);
      const tmpPath = path.join(path.dirname(outputDir), '_tmp_wide_' + pc.key + '.html');
      fs.writeFileSync(tmpPath, pageHTML, 'utf-8');

      try {
        for (const theme of themes) {
          const page = await wideContext.newPage();
          await page.goto('file://' + tmpPath, { waitUntil: 'networkidle' });
          await page.waitForTimeout(300);
          if (theme.attr) {
            await page.evaluate(t => document.body.setAttribute('data-theme', t), theme.attr);
          }
          await page.waitForTimeout(400);

          const wideDir = path.join(outputDir, theme.id, 'wide');
          if (!fs.existsSync(wideDir)) fs.mkdirSync(wideDir, { recursive: true });

          const filename = theme.id + '-' + pc.key + '-wide.png';
          await page.screenshot({ path: path.join(wideDir, filename), fullPage: true });

          // 记录宽屏图（不影响竖长图的 result 结构）
          if (!result[pc.key].wide) result[pc.key].wide = {};
          result[pc.key].wide[theme.id] = filename;

          await page.close();
        }
      } finally {
        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
      }
    }
    await wideContext.close();
  }

  await browser.close();
  return result;
}

// ── 图片 → 文章映射 ────────────────────────────────────
function buildImageMap(article, screenshotResult, themeId) {
  const map = [];

  // Hero → 标题下方（使用宽屏图）
  const heroScreenshots = screenshotResult['hero'];
  if (heroScreenshots && heroScreenshots.wide && heroScreenshots.wide[themeId]) {
    map.push({ afterIndex: -1, file: themeId + '/wide/' + heroScreenshots.wide[themeId], label: '文章头图' });
  }

  // 每个 h2 section → 对应位置（使用宽屏图）
  const h2Indices = article.sections.reduce((a, s, i) => {
    if (s.type === 'h2') a.push(i);
    return a;
  }, []);

  for (let gi = 0; gi < h2Indices.length; gi++) {
    const key = 'section-' + gi;
    const sectionScreenshots = screenshotResult[key];
    if (sectionScreenshots && sectionScreenshots.wide && sectionScreenshots.wide[themeId]) {
      const h2Text = article.sections[h2Indices[gi]].text.replace(/<[^>]+>/g, '');
      // 标签：优先用章序号，否则用标题前 8 个字
      const prefix = h2Text.match(/^[一二三四五六七八九十]+[、.．]/);
      const label = prefix ? '第' + prefix[0].replace(/[、.．]/, '') + '章 · 配图' : (h2Text.substring(0, 10) + '…配图');
      map.push({ afterIndex: h2Indices[gi], file: themeId + '/wide/' + sectionScreenshots.wide[themeId], label });
    }
  }

  // CTA → 文末（使用宽屏图）
  const ctaScreenshots = screenshotResult['cta'];
  if (ctaScreenshots && ctaScreenshots.wide && ctaScreenshots.wide[themeId]) {
    map.push({ afterIndex: article.sections.length + 100, file: themeId + '/wide/' + ctaScreenshots.wide[themeId], label: '文末引导图' });
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
  2. 为每个 h2 section 生成独立配图页面 + 自动截图 (4主题)
  3. 图片自动插入到文章对应 h2 位置
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

  // 修正标题
  if (!article.title || article.title.trim().length === 0) {
    const firstH2 = article.sections.find(s => s.type === 'h2');
    if (firstH2) article.title = firstH2.text.replace(/^[一二三四五六七八九十]+[、.．]\s*/, '');
  }
  if (forceTitle) article.title = forceTitle;
  if (articleTheme) article.theme = articleTheme;

  const h2Count = article.sections.filter(s => s.type === 'h2').length;
  console.log('   标题: ' + article.title);
  console.log('   sections: ' + article.sections.length + ' h2数: ' + h2Count + ' 主题: ' + (WECHAT_THEMES[article.theme] || {}).name);

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  let screenshotResult = {};

  if (!noScreenshots) {
    // ── Step 2: 为每个 h2 section 生成配图页面 ──
    console.log('\n2/4 生成配图 HTML...');
    const primaryThemeId = themeFilter || DEFAULT_THEME;
    const pageConfigs = buildSectionPageConfigs(article, primaryThemeId);
    console.log('   配图页面数: ' + pageConfigs.length + ' (hero + ' + h2Count + ' section + cta)');

    // ── Step 3: 自动截图 ──
    console.log('\n3/4 自动截图...');
    const ssDir = path.join(outDir, 'screenshots');
    screenshotResult = await takeMultiPageScreenshots(pageConfigs, ssDir, themeFilter);
    const portraitCount = Object.values(screenshotResult).reduce((sum, t) => {
      // 只统计非 wide 的 key（排除 wide 内部键）
      return sum + Object.keys(t).filter(k => k !== 'wide').length;
    }, 0);
    const wideCount = Object.values(screenshotResult).reduce((sum, t) => {
      return sum + (t.wide ? Object.keys(t.wide).length : 0);
    }, 0);
    console.log('   截图数: ' + portraitCount + ' 竖长 + ' + wideCount + ' 宽屏');
  } else {
    console.log('\n2/4 跳过配图生成 (--no-screenshots)');
    console.log('3/4 跳过截图');
  }

  // ── Step 4: 生成最终文章 ──
  console.log('\n4/4 生成文章...');
  const primaryThemeId = themeFilter || DEFAULT_THEME;
  const imageMap = buildImageMap(article, screenshotResult, primaryThemeId);

  // 获取主题配色用于占位符边框颜色
  const themeCSS = (WECHAT_THEMES[article.theme] || WECHAT_THEMES.tech);
  const accentColor = (themeCSS.h2 || {}).color || '#5E6AD2';
  const strongColor = (themeCSS.strong || {}).color || '#e96900';

  // 先生成带真实 <img> 的 HTML（浏览器预览用）
  const screenshotsRelPath = './screenshots';
  let articleHTML = renderArticleWithImages(article, imageMap, screenshotsRelPath);

  // 把 <img ...> 块替换为公众号兼容的占位符，生成 plain 版
  let plainHTML = articleHTML;
  plainHTML = plainHTML.replace(
    /<p style="([^"]*text-align:center[^"]*)">\s*<img src="([^"]+)"[^>]*alt="([^"]*)"[^>]*\/>\s*<span[^>]*>([^<]*)<\/span>\s*<\/p>/g,
    (_, style, src, alt, label) => {
      const fname = src.split('/').pop();
      return `<p style="${style}">
  <span style="display:block;padding:40px 20px;background:${(themeCSS.highlight || themeCSS.blockquote || {}).background || '#f5f5fa'};border:2px dashed ${accentColor};border-radius:8px;text-align:center;color:${strongColor};font-size:15px;font-weight:bold;letter-spacing:1px">📷 ${alt}<br/><span style="font-size:12px;color:${(themeCSS.global || {}).color || '#999'};font-weight:normal">（请上传 ${fname} 后插入此位置）</span></span>
</p>`;
    }
  );

  // article.html 保留真实 img（浏览器预览）
  const articleOutPath = path.join(outDir, 'article.html');
  fs.writeFileSync(articleOutPath, articleHTML, 'utf-8');

  // article-plain.html 用占位符版（可复制粘贴到公众号）
  const plainOutPath = path.join(outDir, 'article-plain.html');
  fs.writeFileSync(plainOutPath, plainHTML, 'utf-8');

  // 生成插入指南
  const guidePath = path.join(outDir, '插入指南.md');
  fs.writeFileSync(guidePath, buildInsertGuide(imageMap, article), 'utf-8');

  console.log('\n输出文件:');
  console.log('  ' + articleOutPath + '    ← 图文混排（浏览器预览）');
  console.log('  ' + plainOutPath + '      ← 纯文本排版（粘贴到公众号）');
  console.log('  ' + guidePath + '            ← 图片插入指南');
  if (!noScreenshots) {
    const themeDir = themeFilter || DEFAULT_THEME;
    console.log('  ' + path.join(outDir, 'screenshots/') + ' ← ' + Object.keys(screenshotResult).length + ' 套配图');
    console.log('  ' + path.join(outDir, 'screenshots/' + themeDir + '/wide/') + ' ← 宽屏版配图 (16:9)');
  }
  // 自动复制 plain HTML 到剪贴板
  try {
    if (os.platform() === 'darwin') {
      execSync('pbcopy', { input: plainHTML });
    } else if (os.platform() === 'linux') {
      execSync('xclip -selection clipboard', { input: plainHTML });
    } else if (os.platform() === 'win32') {
      execSync('clip', { input: plainHTML });
    }
    console.log('\n✅ 排版内容已复制到剪贴板，直接 Cmd+V 粘贴到公众号编辑器即可！');
  } catch (_) {
    console.log('\n⚠️  自动复制失败，请手动打开 article-plain.html 复制内容');
  }

  // 自动在浏览器中打开 article.html 预览
  try {
    if (os.platform() === 'darwin') {
      execSync('open ' + JSON.stringify(articleOutPath));
    } else if (os.platform() === 'linux') {
      execSync('xdg-open ' + JSON.stringify(articleOutPath));
    } else if (os.platform() === 'win32') {
      execSync('start "" ' + JSON.stringify(articleOutPath));
    }
    console.log('\n🌐 已在浏览器中打开 article.html，可直接查看图文混排效果');
  } catch (_) {
    // 静默失败，不影响主流程
  }

  console.log('\n下一步:');
  console.log('  1. Cmd+V 粘贴到公众号编辑器');
  console.log('  2. 参考插入指南把配图上传并插到对应位置');
}

main().catch(err => { console.error(err); process.exit(1); });