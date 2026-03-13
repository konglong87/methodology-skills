#!/usr/bin/env bun
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import matter from 'gray-matter';
import { spawn } from 'child_process';
import { loadConfig } from './utils/config-loader';
import { ensureDir } from './utils/file-manager';

async function generateInfographic(outlinePath: string) {
  console.log('🖼️  WeChat Article Writer - Infographic Generation\n');

  // Load outline
  const outlineContent = readFileSync(outlinePath, 'utf-8');
  const { content: outlineBody } = matter(outlineContent);
  const outlineDir = dirname(outlinePath);

  // Load config
  const { config } = loadConfig();

  // Create infographic directories
  const infographicDir = join(outlineDir, 'infographic');
  const promptsDir = join(infographicDir, 'prompts');
  ensureDir(infographicDir);
  ensureDir(promptsDir);

  console.log(`📁 Output directory: ${infographicDir}\n`);

  // Simple infographic generation logic
  // In real implementation, this would parse outline and identify opportunities
  const infographicTypes = [
    {
      type: 'concept',
      title: '核心概念图',
      data: {
        concepts: [
          { name: '核心要点1' },
          { name: '核心要点2' },
          { name: '核心要点3' },
        ]
      }
    },
    {
      type: 'comparison',
      title: '对比分析',
      data: {
        headers: ['维度', '方案A', '方案B'],
        rows: [
          ['效率', '高', '中'],
          ['成本', '低', '高'],
          ['学习曲线', '平缓', '陡峭'],
        ]
      }
    }
  ];

  // Generate infographics
  for (let i = 0; i < infographicTypes.length; i++) {
    const { type, title, data } = infographicTypes[i];
    const outputPath = join(infographicDir, `${String(i + 1).padStart(2, '0')}-${type}.png`);

    console.log(`⏳ Generating infographic ${i + 1}/${infographicTypes.length}: ${title}`);

    // Call Python script
    await callPythonGenerator({
      type,
      style: config.infographic_style,
      title,
      output: outputPath,
      data: JSON.stringify(data),
    });

    console.log(`✓ Saved: ${outputPath}\n`);
  }

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Infographic Generation Complete!\n');
  console.log(`Output: ${infographicDir}`);
  console.log(`Generated: ${infographicTypes.length} images`);
  console.log('\nNext Steps:');
  console.log('  → Insert images into article.md');
  console.log('  → Run main workflow for full automation');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

async function callPythonGenerator(options: {
  type: string;
  style: string;
  title: string;
  output: string;
  data: string;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const scriptPath = join(__dirname, '..', 'python', 'infographic_generator.py');
    const args = [
      scriptPath,
      '--type', options.type,
      '--style', options.style,
      '--title', options.title,
      '--output', options.output,
      '--data', options.data,
    ];

    const python = spawn('python3', args);

    python.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Python script exited with code ${code}`));
      }
    });

    python.on('error', (err) => {
      reject(err);
    });
  });
}

// CLI
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: bun run scripts/generate-infographic.ts <outline.md>');
  process.exit(1);
}

generateInfographic(args[0]);