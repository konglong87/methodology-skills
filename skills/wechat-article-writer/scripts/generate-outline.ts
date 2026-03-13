#!/usr/bin/env bun
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { loadConfig, getApiKey } from './utils/config-loader';
import { analyzeContent, formatAnalysis } from './utils/content-analyzer';
import { createOutputDir, generateSlug, saveWithBackup, ensureDir } from './utils/file-manager';
import { ClaudeAPIClient, generateWithRetry } from './utils/claude-api';

async function generateOutline(topic: string, options: {
  style?: string;
  voice?: string;
  titleCount?: number;
} = {}) {
  console.log('🎨 WeChat Article Writer - Outline Generation\n');

  // Step 0: Load preferences
  const { config } = loadConfig();
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error('❌ Error: Claude API key not found');
    console.log('Set CLAUDE_API_KEY environment variable or configure in EXTEND.md\n');
    process.exit(1);
  }

  // Step 1: Create output directory
  const slug = generateSlug(topic);
  const outputDir = createOutputDir(join(process.cwd(), 'wechat-articles'), slug);
  console.log(`📁 Output directory: ${outputDir}\n`);

  // Step 2: Save source
  const sourcePath = join(outputDir, 'source.md');
  writeFileSync(sourcePath, topic, 'utf-8');
  console.log('✓ Source saved');

  // Step 3: Analyze content
  const analysis = analyzeContent(topic, config);
  const analysisPath = join(outputDir, 'analysis.md');
  saveWithBackup(analysisPath, formatAnalysis(analysis));
  console.log('✓ Analysis saved');

  // Step 4: Load prompt template
  const templatePath = join(__dirname, '..', 'references', 'prompt-templates', 'article-outline.md');
  const template = readFileSync(templatePath, 'utf-8');

  // Step 5: Fill template
  const prompt = template
    .replace('{{topic}}', topic)
    .replace(/{{style}}/g, options.style || analysis.style)
    .replace('{{framework}}', analysis.framework)
    .replace('{{target_audience}}', analysis.audience)
    .replace('{{title_count}}', String(options.titleCount || config.need_title_variants));

  // Step 6: Generate outline
  console.log('\n⏳ Generating outline...');
  const client = new ClaudeAPIClient(apiKey);

  try {
    const outline = await generateWithRetry(client, prompt, {}, 1);

    // Step 7: Save outline
    const outlinePath = join(outputDir, 'outline.md');
    saveWithBackup(outlinePath, outline);
    console.log('✓ Outline saved');

    // Step 8: Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Outline Generation Complete!\n');
    console.log(`Topic: ${topic}`);
    console.log(`Style: ${analysis.style}`);
    console.log(`Output: ${outputDir}`);
    console.log('\nFiles:');
    console.log('  ✓ source.md');
    console.log('  ✓ analysis.md');
    console.log('  ✓ outline.md');
    console.log('\nNext Steps:');
    console.log(`  → Review outline.md`);
    console.log(`  → Run: bun run scripts/generate-content.ts ${outlinePath}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Failed to generate outline:', error);
    process.exit(1);
  }
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
  } else if (args[i] === '--title-count') {
    options.titleCount = parseInt(args[++i]);
  } else if (!args[i].startsWith('--')) {
    topic = args[i];
  }
}

if (!topic) {
  console.error('Usage: bun run scripts/generate-outline.ts "主题" [--style knowledge] [--voice professional] [--title-count 3]');
  process.exit(1);
}

generateOutline(topic, options);