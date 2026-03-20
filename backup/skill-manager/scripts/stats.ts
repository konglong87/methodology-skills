#!/usr/bin/env node
/**
 * Stats Command - Display detailed statistics with visual formatting
 *
 * Usage:
 *   node scripts/stats.js [--category <category>] [--tags]
 *
 * Options:
 *   --category: Show stats for specific category
 *   --tags: Show tag statistics
 */

import * as path from 'path';
import { fileURLToPath } from 'url';
import { IndexManager } from '../lib/indexer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default paths
const DEFAULT_INDEX_PATH = path.join(__dirname, '..', 'index.json');

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]) {
  const options: {
    category?: string;
    tags: boolean;
    indexPath?: string;
  } = {
    tags: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--category':
        if (args[i + 1]) {
          options.category = args[++i];
        }
        break;
      case '--tags':
        options.tags = true;
        break;
      case '--index-path':
        if (args[i + 1]) {
          options.indexPath = args[++i];
        }
        break;
    }
  }

  return options;
}

/**
 * Display visual bar
 */
function displayBar(label: string, value: number, max: number, width: number = 30): void {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const filled = Math.round((value / max) * width);
  const bar = '█'.repeat(filled) + '░'.repeat(width - filled);
  console.log(`  ${label.padEnd(20)} ${bar} ${value} (${percentage.toFixed(1)}%)`);
}

/**
 * Display overall statistics
 */
function displayOverallStats(index: any): void {
  const stats = index.stats;

  console.log('\n📊 Overall Statistics');
  console.log('═'.repeat(60));

  console.log(`  Total Skills:        ${stats.totalSkills}`);
  console.log(`  Enabled Skills:      ${stats.enabledSkills} ✓`);
  console.log(`  Disabled Skills:     ${stats.disabledSkills} ❌`);

  if (stats.totalSkills > 0) {
    console.log('\n  Skill Status:');
    displayBar('Enabled', stats.enabledSkills, stats.totalSkills);
    displayBar('Disabled', stats.disabledSkills, stats.totalSkills);
  }
}

/**
 * Display category statistics
 */
function displayCategoryStats(index: any, categoryFilter?: string): void {
  const stats = index.stats;

  console.log('\n📁 Category Statistics');
  console.log('═'.repeat(60));

  const categories = Object.entries(stats.categoryCounts).filter(([_, count]) => (count as number) > 0);

  if (categoryFilter) {
    // Show specific category
    const categoryStats = categories.find(([cat, _]) => cat === categoryFilter);
    if (!categoryStats) {
      console.log(`  Category "${categoryFilter}" not found or has no skills`);
      return;
    }

    const [category, count] = categoryStats as [string, number];
    console.log(`  ${category}: ${count} skills`);

    // Show skills in category
    const skillNames = index.categories[category];
    console.log('\n  Skills:');
    for (const skillName of skillNames) {
      const skill = index.skills[skillName];
      const status = skill.disabled ? '❌' : '✓';
      console.log(`    ${status} ${skill.name}`);
    }
  } else {
    // Show all categories
    const maxCount = Math.max(...categories.map(([_, count]) => count as number));

    for (const [category, count] of categories) {
      displayBar(category, count as number, maxCount);
    }
  }
}

/**
 * Display tag statistics
 */
function displayTagStats(index: any): void {
  const stats = index.stats;
  const tags = Object.entries(stats.tagCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 15);

  if (tags.length === 0) {
    return;
  }

  console.log('\n🏷️  Tag Statistics (Top 15)');
  console.log('═'.repeat(60));

  const maxCount = tags[0][1] as number;

  for (const [tag, count] of tags) {
    displayBar(tag, count as number, maxCount, 25);
  }
}

/**
 * Display index metadata
 */
function displayIndexMetadata(index: any): void {
  console.log('\nℹ️  Index Information');
  console.log('═'.repeat(60));
  console.log(`  Version:      ${index.version}`);
  console.log(`  Last Updated: ${index.lastUpdated}`);
}

/**
 * Main stats function
 */
async function stats() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  const indexPath = options.indexPath || DEFAULT_INDEX_PATH;

  // Load index
  const indexManager = new IndexManager(indexPath);
  const index = indexManager.loadIndex();

  if (index.stats.totalSkills === 0) {
    console.error('Error: No skills in index. Run init command first.');
    process.exit(1);
  }

  // Display statistics
  displayIndexMetadata(index);
  displayOverallStats(index);
  displayCategoryStats(index, options.category);

  if (options.tags) {
    displayTagStats(index);
  }

  console.log('\n💡 Tips:');
  console.log('  - Use --category <name> to show stats for specific category');
  console.log('  - Use --tags to show tag statistics');
  console.log('  - Use "node scripts/list.js" to browse all skills');
}

// Run stats
stats().catch((error) => {
  console.error('Error during stats:', error);
  process.exit(1);
});