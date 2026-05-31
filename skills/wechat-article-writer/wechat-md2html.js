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
 *   自然段落标题 → h2（含！？的短行、冒号"主题：说明"、逗号"主题，副标题"）
 */

const path = require('path');
const fs = require('fs');
const { renderArticle, THEMES } = require('./wechat-render.js');

const CHINESE_NUM = /^([一二三四五六七八九十]+)[、.．]\s*/;
const EMOJI_NUM = /^[0-9]️⃣\s*/;
const SHORT_COLON = /^.{8,50}[：:]\s*$/;

// ── 自然段落标题识别 ──
//
// 三层识别，由强到弱：
// 1. 感叹号/问号 → 标题特征最明确，8-30字
// 2. 冒号格式 → "短中文主题词：说明文字"，冒号前3-4字（纯中文），冒号后≥4字，不含逗号
// 3. 逗号格式 → "主题词，说明/副标题"，仅1个逗号，总长≤18字，前后各3-11字，
//    不含情态/被动/否定标记
//
// 共同约束：不以句号/感叹号/问号/分号/省略号结尾；以中文或英文字母开头
const NATURAL_HAS_EXCL_OR_Q = /[！？]/;
const NOT_PLAIN_SENTENCE = /[。.；;！？…]$/;
// 逗号标题排除：情态(会/将/要/能/可)、被动(被/已/即)、否定(不/未/没)、等待
const COMMA_NARRATIVE = /会被|不显示|无法|不能|不会|即可|已被|也要|还需|没有|还未|将要|等待|均可|也能/;
// 冒号前必须是中文，最短3字（排除2字动作标签如"必用""排查"）
const COLON_BEFORE_CJK = /^[一-鿿]{3,4}$/;

function isColonTitle(line) {
  const ci = line.search(/[：:]/);
  if (ci < 0) return false;
  const before = line.slice(0, ci);
  const after = line.slice(ci + 1);
  return (COLON_BEFORE_CJK.test(before) &&
          after.length >= 4 && !line.includes('，'));
}

function isCommaTitle(line) {
  const commas = (line.match(/，/g) || []).length;
  if (commas !== 1) return false;
  const ci = line.indexOf('，');
  const before = line.slice(0, ci);
  const after = line.slice(ci + 1);
  // 状语前缀（...后/时/中/前/下）→ 不是标题
  if (/[后时中前下]$/.test(before) && before.length >= 3) return false;
  // 含专有名词 → 不是标题
  if (/windows|macOS|Codex/i.test(line)) return false;
  return (before.length >= 3 && before.length <= 7 &&
          after.length >= 3 && after.length <= 11 &&
          line.length <= 18 && !COMMA_NARRATIVE.test(line));
}

function isNaturalTitle(line) {
  if (line.length < 8 || line.length > 30) return false;
  if (NOT_PLAIN_SENTENCE.test(line)) return false;
  if (!/^[A-Za-z一-鿿]/.test(line)) return false;

  // 感叹号/问号 → 直接是标题
  if (NATURAL_HAS_EXCL_OR_Q.test(line)) return true;

  // 冒号格式 → 短中文主题词 + 说明
  if (isColonTitle(line)) return true;

  // 逗号格式 → 短标题 + 短副标题
  if (isCommaTitle(line)) return true;

  return false;
}

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

    // 自然段落标题（感叹号/问号/冒号格式）
    if (isNaturalTitle(line)) {
      const prevText = para.join(' ');
      const prevEnds = para.length === 0 || prevText.match(/[。.!！？…]$/) || prevText.length > 30;
      if (prevEnds) {
        flushP(); flushL();
        sections.push({ type: 'h2', text: line });
        continue;
      }
    }

    // 列表项
    if (/^[-·•]\s/.test(line)) { flushP(); list.push(line.replace(/^[-·•]\s*/, '')); continue; }
    if (/^\d+[.、．]\s/.test(line)) { flushP(); list.push(line.replace(/^\d+[.、．]\s*/, '')); continue; }
    if (EMOJI_NUM.test(line)) { flushP(); list.push(line.replace(EMOJI_NUM, '')); continue; }

    // 短行+冒号结尾 → h3
    if (SHORT_COLON.test(line) && para.length === 0 && list.length === 0) { flushP(); flushL(); sections.push({ type: 'h3', text: line }); continue; }

    // "案例N：" → h3
    if (/^案例\d+[：:]/.test(line)) { flushP(); flushL(); sections.push({ type: 'h3', text: line }); continue; }

    // ⚠️/⚠等短行（警告标记开头）
    if (/^[⚠⚡🔥❗❌✅️📌💡⭐]/.test(line) && line.length < 40) {
      flushP(); flushL(); sections.push({ type: 'p', text: line }); continue;
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