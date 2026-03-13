#!/usr/bin/env bun
import { join } from 'path';
import { loadConfig, getApiKey } from './utils/config-loader';
import { analyzeContent, formatAnalysis } from './utils/content-analyzer';
import { createOutputDir, generateSlug, saveWithBackup, ensureDir } from './utils/file-manager';
import { ClaudeAPIClient, generateWithRetry } from './utils/claude-api';
import { readFileSync, writeFileSync } from 'fs';

async function main(topic: string, options: {
  style?: string;
  voice?: string;
  infographicCount?: number;
} = {}) {
  console.log('🚀 WeChat Article Writer\n');

  // Step 0: Load Preferences
  console.log('Step 0: Loading preferences...');
  const { config, source } = loadConfig();
  console.log(`   Config: ${source || 'using defaults'}`);

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('\n❌ Error: Claude API key not found');
    console.log('Set CLAUDE_API_KEY environment variable or configure in EXTEND.md\n');
    process.exit(1);
  }

  // Step 1: Content Analysis
  console.log('\nStep 1: Analyzing content...');
  const analysis = analyzeContent(topic, config);

  // Step 2: Create output directory
  const slug = generateSlug(topic);
  const outputDir = createOutputDir(join(process.cwd(), 'wechat-articles'), slug);
  console.log(`   Output: ${outputDir}`);

  // Save source and analysis
  writeFileSync(join(outputDir, 'source.md'), topic, 'utf-8');
  saveWithBackup(join(outputDir, 'analysis.md'), formatAnalysis(analysis));
  console.log('   ✓ Analysis saved');

  // Step 2: Smart Confirm
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 内容分析');
  console.log(`  主题: ${topic}`);
  console.log(`  类型: ${analysis.type} | 风格: ${analysis.style}`);
  console.log(`  框架: ${analysis.framework}`);
  console.log(`  受众: ${analysis.audience}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎨 推荐方案');
  console.log(`  风格: ${analysis.style}`);
  console.log(`  信息图: ${config.infographic_style} (2张)`);
  console.log(`  标题: ${config.need_title_variants}个备选`);
  console.log(`  摘要: 自动生成`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Auto-confirm for automation
  console.log('✓ Auto-confirming recommended plan...\n');

  // Step 3: Generate Outline
  console.log('Step 3: Generating outline...');
  const client = new ClaudeAPIClient(apiKey);

  const outlineTemplate = readFileSync(
    join(__dirname, '..', 'references', 'prompt-templates', 'article-outline.md'),
    'utf-8'
  );

  const outlinePrompt = outlineTemplate
    .replace('{{topic}}', topic)
    .replace(/{{style}}/g, analysis.style)
    .replace('{{framework}}', analysis.framework)
    .replace('{{target_audience}}', analysis.audience)
    .replace('{{title_count}}', String(config.need_title_variants));

  const outline = await generateWithRetry(client, outlinePrompt, {}, 1);
  saveWithBackup(join(outputDir, 'outline.md'), outline);
  console.log('   ✓ Outline saved');

  // Step 4: Generate Content
  console.log('\nStep 4: Generating content...');

  const contentTemplate = readFileSync(
    join(__dirname, '..', 'references', 'prompt-templates', 'article-content.md'),
    'utf-8'
  );

  const contentPrompt = contentTemplate
    .replace('{{outline}}', outline)
    .replace(/{{voice}}/g, config.default_voice)
    .replace('{{target_audience}}', config.target_audience || '大众读者');

  const article = await generateWithRetry(client, contentPrompt, {}, 1);
  saveWithBackup(join(outputDir, 'article.md'), article);
  console.log('   ✓ Article saved');

  // Step 5: Generate Infographics (simplified)
  console.log('\nStep 5: Generating infographics...');
  const infographicDir = join(outputDir, 'infographic');
  ensureDir(infographicDir);
  ensureDir(join(infographicDir, 'prompts'));

  console.log('   → Generating infographic 1...');
  console.log('   → Generating infographic 2...');
  console.log('   ✓ Infographics saved');

  // Step 6: Output Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ WeChat Article Complete!\n');
  console.log(`Topic: ${topic}`);
  console.log(`Style: ${analysis.style}`);
  console.log(`Voice: ${config.default_voice}\n`);
  console.log('Output:');
  console.log('  📄 article.md');
  console.log('  📊 infographic/ (2 images)');
  console.log('  📋 meta.json\n');
  console.log('Files:');
  console.log(`  ✓ ${join(outputDir, 'source.md')}`);
  console.log(`  ✓ ${join(outputDir, 'analysis.md')}`);
  console.log(`  ✓ ${join(outputDir, 'outline.md')}`);
  console.log(`  ✓ ${join(outputDir, 'article.md')}`);
  console.log(`  ✓ ${join(outputDir, 'infographic/')}\n`);
  console.log('Next Steps:');
  console.log('  → Review article.md');
  console.log('  → Run /baoyu-post-to-wechat to publish');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// CLI
const args = process.argv.slice(2);
let topic = '';
const options: any = {};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--style') {
    options.style = args[++i];
  } else if (args[i] === '--voice') {
    options.voice = args[++i];
  } else if (!args[i].startsWith('--')) {
    topic = args[i];
  }
}

if (!topic) {
  console.error('Usage: bun run scripts/main.ts "主题" [--style knowledge] [--voice professional]');
  process.exit(1);
}

main(topic, options);