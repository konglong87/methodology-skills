#!/usr/bin/env node
/**
 * Search Command - Search skills by query
 *
 * Usage:
 *   node scripts/search.js <query> [--category <category>] [--tag <tag>] [--limit <n>]
 *
 * Options:
 *   --category: Filter by category
 *   --tag: Filter by tag
 *   --limit: Maximum number of results (default: 10)
 */

import * as path from 'path';
import { fileURLToPath } from 'url';
import { IndexManager } from '../lib/indexer.js';
import { SkillRecommender } from '../lib/recommender.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default paths
const DEFAULT_INDEX_PATH = path.join(__dirname, '..', 'index.json');

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]) {
  const options: {
    query?: string;
    category?: string;
    tag?: string;
    limit: number;
    indexPath?: string;
  } = {
    limit: 10,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--category':
        if (args[i + 1]) {
          options.category = args[++i];
        }
        break;
      case '--tag':
        if (args[i + 1]) {
          options.tag = args[++i];
        }
        break;
      case '--limit':
        if (args[i + 1]) {
          options.limit = parseInt(args[++i], 10);
        }
        break;
      case '--index-path':
        if (args[i + 1]) {
          options.indexPath = args[++i];
        }
        break;
      default:
        if (!options.query && !arg.startsWith('--')) {
          options.query = arg;
        }
    }
  }

  return options;
}

/**
 * Format skill for display
 */
function formatSkill(skill: any, rank: number): string {
  const status = skill.disabled ? '❌' : '✓';
  const tags = skill.tags.length > 0 ? `[${skill.tags.join(', ')}]` : '';
  return `${rank}. ${status} ${skill.name} (${skill.category}) ${tags}`;
}

/**
 * Display search results
 */
function displayResults(results: any[], query: string) {
  if (results.length === 0) {
    console.log(`\nNo results found for "${query}"`);
    return;
  }

  console.log(`\n🔍 Search results for "${query}" (${results.length} found):\n`);

  results.forEach((result, index) => {
    const skill = result.skill;
    console.log(formatSkill(skill, index + 1));
    console.log(`   Score: ${result.score.toFixed(1)}`);
    console.log(`   Reason: ${result.reason}`);
    console.log(`   Description: ${skill.description.substring(0, 100)}...`);
    console.log(`   Path: ${skill.path}`);
    console.log('');
  });
}

/**
 * Filter results by category
 */
function filterByCategory(results: any[], category: string): any[] {
  return results.filter((r) => r.skill.category === category);
}

/**
 * Filter results by tag
 */
function filterByTag(results: any[], tag: string): any[] {
  return results.filter((r) => r.skill.tags.includes(tag));
}

/**
 * Main search function
 */
async function search() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (!options.query) {
    console.error('Error: Query is required');
    console.error('Usage: node scripts/search.js <query> [options]');
    console.error('Options:');
    console.error('  --category <category>  Filter by category');
    console.error('  --tag <tag>           Filter by tag');
    console.error('  --limit <n>           Maximum number of results');
    console.error('  --index-path <path>   Custom index path');
    process.exit(1);
  }

  const indexPath = options.indexPath || DEFAULT_INDEX_PATH;

  // Load index
  const indexManager = new IndexManager(indexPath);
  const index = indexManager.loadIndex();

  if (index.stats.totalSkills === 0) {
    console.error('Error: No skills in index. Run init command first.');
    process.exit(1);
  }

  // Search
  const recommender = new SkillRecommender();
  let results = recommender.recommendByQuery(options.query, index, options.limit);

  // Apply filters
  if (options.category) {
    results = filterByCategory(results, options.category);
  }

  if (options.tag) {
    results = filterByTag(results, options.tag);
  }

  // Display results
  displayResults(results, options.query);
}

// Run search
search().catch((error) => {
  console.error('Error during search:', error);
  process.exit(1);
});