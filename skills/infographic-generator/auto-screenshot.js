#!/usr/bin/env node
/**
 * auto-screenshot.js
 * 多主题自动截图脚本。主题定义从 theme-recipes.json 读取。
 *
 * 用法:
 *   node auto-screenshot.js <html-file>
 *   node auto-screenshot.js <html-file> --theme dark,light
 *   node auto-screenshot.js <html-file> --sections hero,stats
 *   node auto-screenshot.js <html-file> --full-only
 *   node auto-screenshot.js <html-file> --width 1200 --height 800 --scale 1
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// 从 theme-recipes.json 读取主题配置
const recipePath = path.join(__dirname, 'theme-recipes.json');
const RECIPES = JSON.parse(fs.readFileSync(recipePath, 'utf-8'));
const THEME_IDS = Object.keys(RECIPES.themes);

const ALL_THEMES = THEME_IDS.map((id, i) => ({
  id,
  label: RECIPES.themes[id].name,
  attr: i === 0 ? '' : id,
}));

const ALL_SECTIONS = (RECIPES.sectionSelectors || [
  { selector: '.hero', label: 'hero' },
  { selector: '.pain-points, .problem', label: 'pain-points' },
  { selector: '.features', label: 'features' },
  { selector: '.how-it-works', label: 'how-it-works' },
  { selector: '.showcase', label: 'showcase' },
  { selector: '.use-cases', label: 'use-cases' },
  { selector: '.stats', label: 'stats' },
  { selector: '.pricing', label: 'pricing' },
  { selector: '.faq', label: 'faq' },
  { selector: '.cta-banner, .cta', label: 'cta' },
]);

// ── CLI 参数解析 ──────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`auto-screenshot.js — 多主题自动截图

用法: node auto-screenshot.js <html-file> [options]

选项:
  --theme <ids>        只截指定主题（逗号分隔），如: --theme dark,light
  --sections <labels>  只截指定 sections（逗号分隔），如: --sections hero,stats
  --full-only          只要全页长截图
  --width <px>         viewport 宽度（默认 750）
  --height <px>        viewport 高度（默认 1334）
  --scale <n>          设备缩放比（默认 2）
  --output <dir>       输出目录（默认 html 文件同级 screenshots/）
  --verbose            显示详细日志

示例:
  node auto-screenshot.js page.html
  node auto-screenshot.js page.html --theme dark,light
  node auto-screenshot.js page.html --full-only
  node auto-screenshot.js page.html --width 1200 --height 800 --scale 1`);
    process.exit(0);
  }

  const defaults = RECIPES.screenshotDefaults || {};
  const opts = {
    htmlFile: path.resolve(args[0]),
    themes: ALL_THEMES,
    sections: ALL_SECTIONS,
    fullOnly: false,
    viewport: { width: defaults.viewport?.width || 750, height: defaults.viewport?.height || 1334 },
    deviceScaleFactor: defaults.deviceScaleFactor || 2,
    outputDir: null,
    verbose: false,
  };

  for (let i = 1; i < args.length; i++) {
    switch (args[i]) {
      case '--theme': {
        const ids = args[++i].split(',').map(s => s.trim());
        opts.themes = ALL_THEMES.filter(t => ids.includes(t.id));
        break;
      }
      case '--sections': {
        const labels = args[++i].split(',').map(s => s.trim());
        opts.sections = ALL_SECTIONS.filter(s => labels.includes(s.label));
        break;
      }
      case '--full-only': opts.fullOnly = true; break;
      case '--width': opts.viewport.width = parseInt(args[++i], 10); break;
      case '--height': opts.viewport.height = parseInt(args[++i], 10); break;
      case '--scale': opts.deviceScaleFactor = parseFloat(args[++i]); break;
      case '--output': opts.outputDir = path.resolve(args[++i]); break;
      case '--verbose': opts.verbose = true; break;
    }
  }

  if (!opts.outputDir) {
    opts.outputDir = path.resolve(path.dirname(opts.htmlFile), 'screenshots');
  }
  return opts;
}

// ── 主逻辑 ────────────────────────────────────────────
async function main() {
  const opts = parseArgs();

  if (!fs.existsSync(opts.htmlFile)) {
    console.error('HTML 文件不存在: ' + opts.htmlFile);
    process.exit(1);
  }

  const padX = RECIPES.screenshotDefaults?.sectionPaddingX || 32;
  const padY = RECIPES.screenshotDefaults?.sectionPaddingY || 64;

  console.log('开始截图');
  console.log('  文件: ' + opts.htmlFile);
  console.log('  主题: ' + opts.themes.map(t => t.label).join(', '));
  console.log('  尺寸: ' + opts.viewport.width + '×' + opts.viewport.height + ' @' + opts.deviceScaleFactor + 'x');
  console.log('  输出: ' + opts.outputDir);
  console.log('');

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: opts.viewport,
    deviceScaleFactor: opts.deviceScaleFactor,
  });

  let total = 0;

  for (const theme of opts.themes) {
    const page = await context.newPage();
    await page.goto('file://' + opts.htmlFile, { waitUntil: 'networkidle' });
    await page.waitForTimeout(350);

    // 设置主题
    if (theme.attr) {
      await page.evaluate(t => document.body.setAttribute('data-theme', t), theme.attr);
    } else {
      await page.evaluate(() => document.body.removeAttribute('data-theme'));
    }
    await page.waitForTimeout(450);

    const prefix = theme.id;
    const dir = path.join(opts.outputDir, prefix);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    console.log('[' + theme.label + ']');

    // 1. 全页长截图
    await page.screenshot({ path: path.join(dir, prefix + '-full.png'), fullPage: true });
    console.log('   full-page');
    total++;

    // 2. 首屏截图
    await page.screenshot({ path: path.join(dir, prefix + '-hero-screen.png'), fullPage: false });
    console.log('   hero-screen');
    total++;

    if (!opts.fullOnly) {
      // 3. 逐个 section 截图
      for (const sec of opts.sections) {
        try {
          const el = await page.$(sec.selector);
          if (!el) { if (opts.verbose) console.log('   (' + sec.label + ' 跳过)'); continue; }
          await el.scrollIntoViewIfNeeded();
          await page.waitForTimeout(250);
          const box = await el.boundingBox();
          if (!box) { if (opts.verbose) console.log('   (' + sec.label + ' 无边界)'); continue; }
          await page.screenshot({
            path: path.join(dir, prefix + '-' + sec.label + '.png'),
            clip: {
              x: Math.max(0, box.x - padX / 2),
              y: Math.max(0, box.y - padY / 2),
              width: Math.min(box.width + padX, opts.viewport.width),
              height: box.height + padY,
            },
            fullPage: false,
          });
          console.log('   ' + sec.label);
          total++;
        } catch (e) {
          if (opts.verbose) console.log('   (' + sec.label + ' 失败: ' + e.message.split('\n')[0] + ')');
        }
      }

      // 4. 逐屏分页截图
      const totalHeight = await page.evaluate(() => document.body.scrollHeight);
      const vpHeight = opts.viewport.height;
      const overlap = RECIPES.screenshotDefaults?.screenOverlap || 80;
      const totalScreens = Math.ceil(totalHeight / (vpHeight - overlap));

      for (let i = 0; i < totalScreens; i++) {
        const scrollY = Math.max(0, i * (vpHeight - overlap));
        const remaining = totalHeight - scrollY;
        if (remaining < 30) continue;
        const clipH = Math.min(vpHeight, remaining);
        await page.evaluate(y => window.scrollTo(0, y), scrollY);
        await page.waitForTimeout(250);
        try {
          await page.screenshot({
            path: path.join(dir, prefix + '-screen-' + (i + 1) + '.png'),
            clip: { x: 0, y: scrollY, width: opts.viewport.width, height: clipH },
            fullPage: false,
          });
          console.log('   screen-' + (i + 1));
          total++;
        } catch (e) {
          if (opts.verbose) console.log('   (screen-' + (i + 1) + ' 结束)');
        }
      }
    }

    await page.close();
    console.log('');
  }

  await browser.close();

  // 清理小于 1KB 的空文件
  let cleaned = 0;
  for (const theme of opts.themes) {
    const dir = path.join(opts.outputDir, theme.id);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      const fp = path.join(dir, f);
      if (fs.statSync(fp).size < 1000) { fs.unlinkSync(fp); cleaned++; }
    }
  }

  console.log('完成！共 ' + total + ' 张截图');
  if (cleaned > 0) console.log('清理 ' + cleaned + ' 个空文件');
  console.log('输出目录: ' + opts.outputDir);
}

main().catch(err => {
  console.error('截图失败: ' + err.message);
  process.exit(1);
});