#!/usr/bin/env node
/**
 * generate-garden-page.js
 * 内容驱动的公众号配图 HTML 生成器。
 * 主题定义统一从 theme-recipes.json 读取，消除重复。
 *
 * 用法:
 *   node generate-garden-page.js output.html config.json
 *
 * 编程方式:
 *   const { renderPage } = require('./generate-garden-page.js');
 *   const html = renderPage(config);
 */

const path = require('path');
const fs = require('fs');

// 从 theme-recipes.json 加载主题 CSS 变量
const recipePath = path.join(__dirname, 'theme-recipes.json');
const RECIPES = JSON.parse(fs.readFileSync(recipePath, 'utf-8'));
const THEME_IDS = Object.keys(RECIPES.themes);

// ── 把 JSON 中的 css 对象转为 CSS 变量块 ──────────────
function themeCSSToVars(cssObj) {
  const map = {
    ground: '--ground',
    surface: '--surface',
    surface2: '--surface-2',
    surface3: '--surface-3',
    border: '--border',
    borderStrong: '--border-strong',
    text: '--text',
    textSecondary: '--text-secondary',
    textMuted: '--text-muted',
    accent: '--accent',
    accentSoft: '--accent-soft',
    accentGradient: '--accent-gradient',
    heroGradient: '--hero-gradient',
    radiusSm: '--radius-sm',
    radiusMd: '--radius',
    radiusLg: '--radius-lg',
    shadowCard: '--shadow',
    shadowLg: '--shadow-lg',
    fontDisplay: '--font-display',
    fontBody: '--font-body',
    fontMono: '--font-mono',
    displayWeight: '--display-weight',
    bodySize: '--body-size',
    bodyLineHeight: '--body-lh',
    sectionGap: '--section-gap',
    transition: '--transition',
  };
  const lines = [];
  for (const [key, cssVar] of Object.entries(map)) {
    if (cssObj[key] !== undefined) {
      lines.push(`  ${cssVar}: ${cssObj[key]};`);
    }
  }
  return lines.join('\n');
}

function buildThemeCSS() {
  const blocks = [];
  for (const id of THEME_IDS) {
    const theme = RECIPES.themes[id];
    const vars = themeCSSToVars(theme.css);
    const selector = id === THEME_IDS[0] ? ':root' : `[data-theme="${id}"]`;
    blocks.push(`/* ${theme.name} */\n${selector} {\n${vars}\n}`);
  }
  return blocks.join('\n\n');
}

// ── 共享 CSS（不依赖主题变量）──────────────────────────
const SHARED_CSS = `
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  font-size: var(--body-size);
  line-height: var(--body-lh);
  background: var(--ground);
  color: var(--text);
  overflow-x: hidden;
  transition: background var(--transition), color var(--transition);
}

/* 主题切换按钮 */
.theme-bar { position: fixed; bottom: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 8px; }
.theme-btn { width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--border); cursor: pointer; transition: all 0.25s ease; font-size: 0; background: var(--surface); }
.theme-btn:hover { transform: scale(1.1); border-color: var(--text-secondary); }
.theme-btn.active { border-color: var(--accent); border-width: 3px; }
.theme-btn.linear { background: #08090A; }
.theme-btn.apple { background: #FFFFFF; border-color: #D2D2D7; }
.theme-btn.stripe { background: #F1ECDE; border-color: #C8BEA4; }
.theme-btn.muji { background: #F4F2EC; border-color: #D9D6CD; }
.theme-label { position: fixed; bottom: 28px; right: 80px; z-index: 9999; font-size: 12px; color: var(--text-secondary); font-family: var(--font-body); background: var(--surface); padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border); pointer-events: none; transition: all var(--transition); }

/* 导航栏 */
nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 18px 40px; display: flex; align-items: center; justify-content: space-between; background: color-mix(in srgb, var(--ground) 85%, transparent); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); transition: all var(--transition); }
.logo { font-family: var(--font-display); font-size: 18px; font-weight: var(--display-weight); letter-spacing: -0.02em; display: flex; align-items: center; gap: 8px; color: var(--text); }
.logo-mark { width: 26px; height: 26px; background: var(--accent); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: white; font-weight: 700; }
.nav-links { display: flex; gap: 28px; list-style: none; }
.nav-links a { color: var(--text-secondary); text-decoration: none; font-size: 13px; font-weight: 500; transition: color var(--transition); font-family: var(--font-body); }
.nav-links a:hover { color: var(--text); }
.nav-cta { background: var(--accent); color: white; padding: 7px 18px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; text-decoration: none; transition: all var(--transition); font-family: var(--font-body); }
.nav-cta:hover { opacity: 0.88; transform: translateY(-1px); }

/* Hero 区 */
.hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 140px 40px 100px; position: relative; }
.hero-bg { position: absolute; inset: 0; background: var(--hero-gradient); pointer-events: none; }
.hero-content { max-width: 780px; position: relative; }
.hero-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--accent-soft); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent); padding: 5px 16px; border-radius: 100px; font-size: 12px; color: var(--accent); margin-bottom: 24px; font-family: var(--font-body); }
.hero h1 { font-family: var(--font-display); font-size: clamp(38px, 6vw, 64px); font-weight: var(--display-weight); letter-spacing: -0.025em; line-height: 1.10; margin-bottom: 20px; color: var(--text); }
.hero h1 em { font-style: italic; color: var(--accent); }
.hero-p { font-size: 17px; color: var(--text-secondary); max-width: 520px; margin: 0 auto 36px; line-height: 1.70; }
.hero-actions { display: flex; gap: 14px; justify-content: center; }
.btn-primary { background: var(--accent); color: white; padding: 13px 30px; border-radius: var(--radius-sm); font-size: 15px; font-weight: 600; border: none; cursor: pointer; transition: all var(--transition); font-family: var(--font-body); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px var(--accent-soft); }
.btn-secondary { background: var(--surface); color: var(--text); padding: 13px 30px; border-radius: var(--radius-sm); font-size: 15px; font-weight: 500; border: 1px solid var(--border); cursor: pointer; transition: all var(--transition); font-family: var(--font-body); }
.btn-secondary:hover { border-color: var(--border-strong); }

/* 统一 section 布局 */
section[class] { max-width: 1100px; margin: 0 auto; padding: 0 40px var(--section-gap); }

/* 通用 section 标题 */
.section-header { text-align: center; margin-bottom: 48px; }
.section-header .eyebrow { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px; font-family: var(--font-body); }
.section-header h2 { font-family: var(--font-display); font-size: clamp(28px, 4vw, 40px); font-weight: var(--display-weight); letter-spacing: -0.02em; margin-bottom: 12px; color: var(--text); }
.section-header p { color: var(--text-secondary); font-size: 15px; max-width: 480px; margin: 0 auto; }

/* 3 列卡片网格 */
.card-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.card-grid-3 .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 32px; transition: all var(--transition); }
.card-grid-3 .card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: var(--shadow); }
.card-grid-3 .card .icon { font-size: 32px; margin-bottom: 18px; display: block; line-height: 1; }
.card-grid-3 .card h3 { font-family: var(--font-display); font-size: 18px; font-weight: var(--display-weight); margin-bottom: 10px; color: var(--text); }
.card-grid-3 .card p { color: var(--text-secondary); font-size: 14px; line-height: 1.65; }
.card-grid-3 .card .tag { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 100px; background: var(--accent-soft); color: var(--accent); margin-bottom: 14px; font-family: var(--font-body); }

/* 4 列步骤网格 */
.steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.steps-grid .step { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 30px; position: relative; transition: all var(--transition); }
.steps-grid .step:hover { border-color: var(--accent); }
.steps-grid .step .num { font-family: var(--font-mono); font-size: 13px; color: var(--accent); display: block; margin-bottom: 14px; font-weight: 600; }
.steps-grid .step h3 { font-family: var(--font-display); font-size: 16px; font-weight: var(--display-weight); margin-bottom: 8px; color: var(--text); }
.steps-grid .step p { color: var(--text-secondary); font-size: 13px; line-height: 1.60; }

/* 演示窗口 */
.showcase-window { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-lg); }
.window-bar { display: flex; align-items: center; gap: 8px; padding: 12px 18px; background: var(--surface-2); border-bottom: 1px solid var(--border); }
.window-dot { width: 12px; height: 12px; border-radius: 50%; }
.window-dot:nth-child(1) { background: #FF5F57; }
.window-dot:nth-child(2) { background: #FEBC2E; }
.window-dot:nth-child(3) { background: #28C840; }
.window-body { padding: 36px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; min-height: 380px; }
.chat-panel { display: flex; flex-direction: column; gap: 12px; }
.chat-msg { padding: 14px 18px; border-radius: var(--radius); font-size: 13px; line-height: 1.55; max-width: 82%; }
.chat-msg.user { background: var(--accent-soft); color: var(--text); align-self: flex-end; border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent); }
.chat-msg.system { background: var(--surface-2); color: var(--text); align-self: flex-start; }
.result-panel { background: var(--surface-2); border-radius: var(--radius); padding: 28px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid var(--border); text-align: center; }
.result-visual { width: 160px; height: 160px; background: var(--accent-gradient, var(--accent)); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; font-size: 48px; color: white; opacity: 0.92; }

/* 4 列数据网格 */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.stats-grid .stat { text-align: center; padding: 36px 20px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); transition: all var(--transition); }
.stats-grid .stat:hover { border-color: var(--accent); }
.stats-grid .stat .number { font-family: var(--font-display); font-size: 40px; font-weight: var(--display-weight); letter-spacing: -0.03em; color: var(--accent); margin-bottom: 6px; }
.stats-grid .stat .label { color: var(--text-secondary); font-size: 13px; }

/* 定价卡片 */
.pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.pricing-grid .plan { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 36px 28px; text-align: center; transition: all var(--transition); }
.pricing-grid .plan.featured { border-color: var(--accent); border-width: 2px; position: relative; }
.pricing-grid .plan.featured::before { content: "推荐"; position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--accent); color: white; padding: 3px 14px; border-radius: 100px; font-size: 11px; font-weight: 600; }
.pricing-grid .plan h3 { font-family: var(--font-display); font-size: 18px; font-weight: var(--display-weight); margin-bottom: 4px; color: var(--text); }
.pricing-grid .plan .price { font-family: var(--font-display); font-size: 36px; font-weight: var(--display-weight); color: var(--text); margin: 16px 0 4px; }
.pricing-grid .plan .price span { font-size: 14px; color: var(--text-secondary); font-weight: 400; }
.pricing-grid .plan .desc { color: var(--text-secondary); font-size: 13px; margin-bottom: 20px; }
.pricing-grid .plan ul { list-style: none; text-align: left; margin-bottom: 24px; }
.pricing-grid .plan ul li { padding: 7px 0; font-size: 13px; color: var(--text-secondary); border-bottom: 1px solid var(--border); }
.pricing-grid .plan ul li:last-child { border-bottom: none; }
.pricing-grid .plan ul li::before { content: "✓ "; color: var(--accent); font-weight: 700; }
.pricing-grid .plan .btn { display: block; width: 100%; padding: 12px; border-radius: var(--radius-sm); font-size: 14px; font-weight: 600; cursor: pointer; transition: all var(--transition); font-family: var(--font-body); background: var(--surface-2); border: 1px solid var(--border); color: var(--text); }
.pricing-grid .plan.featured .btn { background: var(--accent); border-color: var(--accent); color: white; }
.pricing-grid .plan .btn:hover { transform: translateY(-1px); }

/* FAQ */
.faq-item { border-bottom: 1px solid var(--border); padding: 24px 0; }
.faq-item h3 { font-family: var(--font-display); font-size: 16px; font-weight: var(--display-weight); margin-bottom: 10px; color: var(--text); }
.faq-item p { color: var(--text-secondary); font-size: 14px; line-height: 1.70; }

/* CTA 横幅 */
.cta-inner { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 64px 40px; text-align: center; }
.cta-inner h2 { font-family: var(--font-display); font-size: clamp(28px, 4vw, 40px); font-weight: var(--display-weight); letter-spacing: -0.02em; margin-bottom: 14px; color: var(--text); }
.cta-inner p { color: var(--text-secondary); font-size: 16px; max-width: 480px; margin: 0 auto 28px; }

/* Footer */
footer { padding: 40px; text-align: center; border-top: 1px solid var(--border); color: var(--text-muted); font-size: 12px; font-family: var(--font-body); }

/* 响应式 */
@media (max-width: 768px) {
  .card-grid-3, .pricing-grid { grid-template-columns: 1fr; }
  .steps-grid { grid-template-columns: 1fr 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .window-body { grid-template-columns: 1fr; }
  .nav-links { display: none; }
}
`.trim();

// ── 构建主题标签数据 ─────────────────────────────────
function getThemeMeta() {
  return THEME_IDS.map((id, i) => ({
    id,
    name: RECIPES.themes[id].name,
    label: RECIPES.themes[id].name,
    attr: i === 0 ? '' : id,
    isDefault: i === 0,
  }));
}

// ── HTML 片段渲染函数 ─────────────────────────────────
function h(tag, attrs, content) {
  const attrStr = attrs ? ' ' + Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ') : '';
  return `<${tag}${attrStr}>${content}</${tag}>`;
}

function sectionHeader(eyebrow, title, subtitle) {
  let html = '<div class="section-header">';
  if (eyebrow) html += `\n    <div class="eyebrow">${eyebrow}</div>`;
  html += `\n    <h2>${title}</h2>`;
  if (subtitle) html += `\n    <p>${subtitle}</p>`;
  html += '\n  </div>';
  return html;
}

function renderHero(s) {
  return `
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-content">
    ${s.badge ? `<div class="hero-badge">✦ ${s.badge}</div>` : ''}
    <h1>${s.title || ''}</h1>
    ${s.subtitle ? `<p class="hero-p">${s.subtitle}</p>` : ''}
    <div class="hero-actions">
      <button class="btn-primary">了解更多</button>
      <button class="btn-secondary">查看详情 →</button>
    </div>
  </div>
</section>`;
}

function renderPainPoints(s) {
  const icons = ['💭', '🧭', '🔍'];
  const cards = (s.points || []).map((p, i) =>
    `<div class="card"><span class="icon">${icons[i] || '✦'}</span><h3>${typeof p === 'string' ? p : p.title}</h3><p>${typeof p === 'string' ? '' : p.desc || ''}</p></div>`
  ).join('\n');
  return `
<section class="pain-points">
  ${sectionHeader(s.eyebrow || '背景', s.title, s.subtitle)}
  <div class="card-grid-3">${cards}</div>
</section>`;
}

function renderFeatures(s) {
  const cards = (s.points || []).map(p =>
    `<div class="card"><div class="icon">${p.icon || '✦'}</div><h3>${p.title}</h3><p>${p.desc}</p></div>`
  ).join('\n');
  return `
<section class="features" id="features">
  ${sectionHeader(s.eyebrow || '核心要点', s.title, s.subtitle)}
  <div class="card-grid-3">${cards}</div>
</section>`;
}

function renderHowItWorks(s) {
  const steps = (s.steps || []).map((st, i) =>
    `<div class="step"><span class="num">0${i + 1}</span><h3>${st.title}</h3><p>${st.desc}</p></div>`
  ).join('\n');
  return `
<section class="how-it-works" id="how">
  ${sectionHeader(s.eyebrow || '流程', s.title, s.subtitle)}
  <div class="steps-grid">${steps}</div>
</section>`;
}

function renderShowcase(s) {
  const msgs = (s.messages || []).map(m =>
    `<div class="chat-msg ${m.role === 'ai' ? 'system' : 'user'}">${m.text}</div>`
  ).join('\n');
  return `
<section class="showcase" id="showcase">
  ${sectionHeader(s.eyebrow || '演示', s.title, s.subtitle)}
  <div class="showcase-window">
    <div class="window-bar"><div class="window-dot"></div><div class="window-dot"></div><div class="window-dot"></div></div>
    <div class="window-body">
      <div class="chat-panel">${msgs}</div>
      <div class="result-panel"><div class="result-visual">💡</div><p style="color:var(--text-secondary);margin-top:14px;font-size:14px">${s.result || ''}</p></div>
    </div>
  </div>
</section>`;
}

function renderUseCases(s) {
  const cases = (s.cases || []).map(c =>
    `<div class="card"><span class="tag">${c.tag}</span><h3>${c.title}</h3><p>${c.desc}</p></div>`
  ).join('\n');
  return `
<section class="use-cases">
  ${sectionHeader(s.eyebrow || '适用场景', s.title, s.subtitle)}
  <div class="card-grid-3">${cases}</div>
</section>`;
}

function renderStats(s) {
  const items = (s.items || []).map(st =>
    `<div class="stat"><div class="number">${st.number}</div><div class="label">${st.label}</div></div>`
  ).join('\n');
  return `
<section class="stats" id="stats">
  ${sectionHeader(s.eyebrow || '数据', s.title, s.subtitle)}
  <div class="stats-grid">${items}</div>
</section>`;
}

function renderPricing(s) {
  const plans = (s.plans || []).map(p =>
    `<div class="plan${p.featured ? ' featured' : ''}">
  <h3>${p.name}</h3>
  <div class="price">${p.price}<span>${p.period || '/月'}</span></div>
  <p class="desc">${p.desc}</p>
  <ul>${(p.features || []).map(f => `<li>${f}</li>`).join('')}</ul>
  <button class="btn">${p.featured ? '立即试用' : '了解更多'}</button>
</div>`
  ).join('\n');
  return `
<section class="pricing" id="pricing">
  ${sectionHeader(s.eyebrow || '定价', s.title, s.subtitle)}
  <div class="pricing-grid">${plans}</div>
</section>`;
}

function renderFAQ(s) {
  const items = (s.items || []).map(q =>
    `<div class="faq-item"><h3>${q.q}</h3><p>${q.a}</p></div>`
  ).join('\n');
  return `
<section class="faq" id="faq">
  ${sectionHeader(s.eyebrow || '常见问题', s.title, s.subtitle)}
  ${items}
</section>`;
}

function renderCTA(s) {
  return `
<section class="cta-banner">
  <div class="cta-inner">
    <h2>${s.title || '准备好开始了吗？'}</h2>
    <p>${s.subtitle || ''}</p>
    <button class="btn-primary">${s.button || '了解更多 →'}</button>
  </div>
</section>`;
}

// 分发器
const RENDERERS = {
  hero: renderHero,
  'pain-points': renderPainPoints,
  problem: renderPainPoints,
  features: renderFeatures,
  'how-it-works': renderHowItWorks,
  showcase: renderShowcase,
  'use-cases': renderUseCases,
  stats: renderStats,
  pricing: renderPricing,
  faq: renderFAQ,
  cta: renderCTA,
};

function renderSection(s) {
  const fn = RENDERERS[s.type];
  if (fn) return fn(s);
  // 兜底：通用卡片网格
  const cards = (s.points || []).map(p =>
    `<div class="card"><h3>${p.title || p}</h3><p>${p.desc || ''}</p></div>`
  ).join('\n');
  return `
<section class="${s.type || 'generic'}">
  ${sectionHeader(s.eyebrow || '', s.title || '', s.subtitle || '')}
  <div class="card-grid-3">${cards}</div>
</section>`;
}

// ── 主渲染函数 ────────────────────────────────────────
function renderPage(config) {
  const { title, subtitle, brand } = config;
  const sections = config.sections || [];
  const themes = getThemeMeta();
  const defaultThemeId = themes[0].id;
  const defaultThemeName = RECIPES.themes[defaultThemeId].name;

  const themeButtons = themes.map(t =>
    `  <button class="theme-btn ${t.id}${t.isDefault ? ' active' : ''}" data-theme="${t.id}" title="${t.name}"></button>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — ${brand}</title>
<style>
/* ============================================================
   主题 CSS 变量（来自 theme-recipes.json）
   ============================================================ */
${buildThemeCSS()}

/* ============================================================
   共享样式
   ============================================================ */
${SHARED_CSS}
</style>
</head>
<body data-theme="${defaultThemeId}">

<div class="theme-label" id="themeLabel">${defaultThemeName}</div>
<div class="theme-bar">
${themeButtons}
</div>

<nav>
  <div class="logo"><div class="logo-mark">${brand.charAt(0).toUpperCase()}</div>${brand}</div>
  <ul class="nav-links">
    <li><a href="#features">要点</a></li>
    <li><a href="#how">流程</a></li>
    <li><a href="#showcase">演示</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ul>
  <a href="#" class="nav-cta">了解更多</a>
</nav>

${sections.map(renderSection).join('\n\n')}

<footer><p>${brand} · ${subtitle} · © 2026</p></footer>

<script>
(function() {
  var btns = document.querySelectorAll('.theme-btn');
  var label = document.getElementById('themeLabel');
  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      btns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var t = btn.dataset.theme;
      document.body.setAttribute('data-theme', t);
      label.textContent = btn.title;
    });
  });
})();
</script>
</body>
</html>`;
}

// ── CLI ────────────────────────────────────────────────
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('用法: node generate-garden-page.js <output.html> <config.json>');
    console.log('  从 theme-recipes.json 加载主题定义，从 config.json 加载内容');
    process.exit(1);
  }
  const outPath = path.resolve(args[0]);
  const cfgPath = path.resolve(args[1]);
  const config = JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
  const html = renderPage(config);
  fs.writeFileSync(outPath, html, 'utf-8');
  console.log('HTML 已生成: ' + outPath);
}

module.exports = { renderPage, RECIPES, THEME_IDS, getThemeMeta };