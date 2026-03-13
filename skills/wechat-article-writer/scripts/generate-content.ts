#!/usr/bin/env bun
import { readFileSync } from 'fs';
import { join, dirname, basename } from 'path';
import matter from 'gray-matter';
import { loadConfig, getApiKey } from './utils/config-loader';
import { saveWithBackup } from './utils/file-manager';
import { ClaudeAPIClient, generateWithRetry } from './utils/claude-api';

async function generateContent(outlinePath: string) {
  console.log('📝 WeChat Article Writer - Content Generation\n');

  // Step 1: Load outline
  if (!outlinePath.endsWith('outline.md')) {
    console.error('❌ Error: Please provide outline.md file');
    process.exit(1);
  }

  const outlineDir = dirname(outlinePath);
  const outlineContent = readFileSync(outlinePath, 'utf-8');
  const { data: frontmatter, content: outlineBody } = matter(outlineContent);

  console.log(`📋 Outline loaded from: ${outlinePath}`);
  console.log(`   Style: ${frontmatter.style || 'default'}`);
  console.log(`   Voice: ${frontmatter.voice || 'professional'}\n`);

  // Step 2: Load config
  const { config } = loadConfig();
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error('❌ Error: Claude API key not found');
    process.exit(1);
  }

  // Step 3: Load prompt template
  const templatePath = join(__dirname, '..', 'references', 'prompt-templates', 'article-content.md');
  const template = readFileSync(templatePath, 'utf-8');

  // Step 4: Fill template
  const prompt = template
    .replace('{{outline}}', outlineContent)
    .replace(/{{voice}}/g, frontmatter.voice || config.default_voice)
    .replace('{{target_audience}}', config.target_audience || '大众读者');

  // Step 5: Generate content
  console.log('⏳ Generating content...');
  const client = new ClaudeAPIClient(apiKey);

  try {
    const article = await generateWithRetry(client, prompt, {}, 1);

    // Step 6: Save article
    const articlePath = outlinePath.replace('outline.md', 'article.md');
    saveWithBackup(articlePath, article);
    console.log('✓ Article saved');

    // Step 7: Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Content Generation Complete!\n');
    console.log(`Output: ${articlePath}`);
    console.log('\nFiles:');
    console.log('  ✓ article.md');
    console.log('\nNext Steps:');
    console.log(`  → Review article.md`);
    console.log(`  → Run: bun run scripts/generate-infographic.ts ${outlinePath}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Failed to generate content:', error);
    process.exit(1);
  }
}

// CLI
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: bun run scripts/generate-content.ts <outline.md>');
  process.exit(1);
}

generateContent(args[0]);