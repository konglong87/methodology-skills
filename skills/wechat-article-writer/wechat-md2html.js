#!/usr/bin/env node
/**
 * wechat-md2html.js — Markdown/纯文本 → 微信公众号排版HTML 一键转换
 *
 * 用法:
 *   node wechat-md2html.js article.md                  → stdout
 *   node wechat-md2html.js article.md -o output.html   → 文件
 *   node wechat-md2html.js article.md --theme warm     → 指定主题
 *
 * 自动识别中文文章结构:
 *   一、二、… → h2   |   - xxx → ul   |   ▲ 图N → 跳过
 *   1. 2. → h3      |   > xxx → blockquote
 *   **text** → strong (强调色)
 */

const path = require('path');
const fs = require('fs');
const { renderArticle, THEMES } = require('./wechat-render.js');

const CHINESE_NUM = /^([一二三四五六七八九十]+)[、.．]\s*/;
const EMOJI_NUM = /^[0-9]️⃣\s*/;
const SHORT_COLON = /^.{2,30}[：:]\s*$/;

function parseMarkdown(text) {
  const lines = text.split('\n');
  const sections = [];
  let title = '';
  let para = [];
  let list = [];

  function flushP() {
    const j = para.join(' ').trim();
    if (j) sections.push({ type: 'p', text: j });
    para = [];
  }
  function flushL() {
    if (list.length) { sections.push({ type: 'ul', items: [...list] }); list = []; }
  }

  let themeGuess = 'tech';

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line) { flushP(); flushL(); continue; }

    // 标题：第一行
    if (i === 0 && !title && !line.startsWith('#') && !CHINESE_NUM.test(line)) {
      title = line.replace(/^#\s*/, '');
      if (/技术|程序|代码|架构|开发|编程|AI|算法|系统/.test(title)) themeGuess = 'tech';
      else if (/产品|发布|上线|品牌|新功能/.test(title)) themeGuess = 'product';
      else if (/故事|人生|思考|感悟|回忆/.test(title)) themeGuess = 'warm';
      else if (/生活|美学|日常|旅行|美食/.test(title)) themeGuess = 'zen';
      continue;
    }

    // 跳过：图片占位、hashtag
    if (/^▲\s*图/.test(line) || /^!\[/.test(line)) { flushP(); flushL(); continue; }
    if (/^#\S+/.test(line) && line.length < 200 && line.split(/[\s#]+/).length > 3) { flushP(); flushL(); continue; }

    // Markdown 标题
    if (/^###\s/.test(line)) { flushP(); flushL(); sections.push({ type: 'h3', text: line.replace(/^###\s*/, '') }); continue; }
    if (/^##\s/.test(line))  { flushP(); flushL(); sections.push({ type: 'h2', text: line.replace(/^##\s*/, '') }); continue; }
    if (/^#\s/.test(line))   { flushP(); flushL(); if (!title) title = line.replace(/^#\s*/, ''); continue; }

    // 中文序号 → h2
    const mCn = line.match(CHINESE_NUM);
    if (mCn) { flushP(); flushL(); sections.push({ type: 'h2', text: line }); continue; }

    // "快速回顾" → highlight 块
    if (/快速回顾|一句话总结|核心思想|划重点/.test(line) && line.length < 30) {
      flushP(); flushL();
      const hl = []; let j = i + 1;
      while (j < lines.length && lines[j].trim() && !CHINESE_NUM.test(lines[j].trim())) { hl.push(lines[j].trim()); j++; }
      sections.push({ type: 'highlight', text: hl.join('<br/>') });
      i = j - 1; continue;
    }

    // 分隔线
    if (/^(-{3,}|\*{3,})\s*$/.test(line)) { flushP(); flushL(); sections.push({ type: 'separator' }); continue; }

    // Markdown 引用
    if (/^>\s/.test(line)) { flushP(); flushL(); sections.push({ type: 'blockquote', text: line.replace(/^>\s*/, '') }); continue; }

    // 列表项
    if (/^[-·•]\s/.test(line)) { flushP(); list.push(line.replace(/^[-·•]\s*/, '')); continue; }
    if (/^\d+[.、．]\s/.test(line)) { flushP(); list.push(line.replace(/^\d+[.、．]\s*/, '')); continue; }
    if (EMOJI_NUM.test(line)) { flushP(); list.push(line.replace(EMOJI_NUM, '')); continue; }

    // 短行+冒号结尾 → h3
    if (SHORT_COLON.test(line) && para.length === 0 && list.length === 0) { flushP(); flushL(); sections.push({ type: 'h3', text: line }); continue; }

    // "案例N：" → h3
    if (/^案例\d+[：:]/.test(line)) { flushP(); flushL(); sections.push({ type: 'h3', text: line }); continue; }

    // Emoji 开头短行 → h3（跳过非中英文非数字开头的短行）
    const firstChar = line.codePointAt(0);
    if (firstChar && firstChar > 127 && line.length < 40 && line.length > 3) {
      flushP(); flushL(); sections.push({ type: 'h3', text: line }); continue;
    }

    // 普通段落
    para.push(line);
  }

  flushP(); flushL();
  return { title, theme: themeGuess, sections };
}

// ── CLI ──
if (require.main === module) {
  const args = process.argv.slice(2);
  if (!args.length || args.includes('--help') || args.includes('-h')) {
    console.log(`wechat-md2html.js — Markdown → WeChat 排版 HTML

用法: node wechat-md2html.js <article.md> [options]
  --theme tech|product|warm|zen   (默认自动推断)
  -o, --output <file>             (默认 stdout)
  --show-themes`);
    process.exit(0);
  }
  if (args.includes('--show-themes')) {
    for (const [id, t] of Object.entries(THEMES)) console.log('  ' + id + ' — ' + t.name);
    process.exit(0);
  }

  const input = path.resolve(args[0]);
  if (!fs.existsSync(input)) { console.error('not found: ' + input); process.exit(1); }

  const article = parseMarkdown(fs.readFileSync(input, 'utf-8'));

  const ti = args.indexOf('--theme');
  if (ti !== -1 && args[ti + 1]) article.theme = args[ti + 1];

  const oi = args.indexOf('-o') !== -1 ? args.indexOf('-o') : args.indexOf('--output');
  const out = oi !== -1 && args[oi + 1] ? path.resolve(args[oi + 1]) : null;

  const html = renderArticle(article);

  if (out) {
    fs.writeFileSync(out, html, 'utf-8');
    console.log(out);
    console.log('theme: ' + (THEMES[article.theme] || {}).name);
    console.log('sections: ' + article.sections.length);
  } else {
    console.log(html);
  }
}

module.exports = { parseMarkdown };