#!/usr/bin/env node
/**
 * List Command - List skills by category
 *
 * Usage:
 *   node scripts/list.js [--category <category>] [--disabled] [--all]
 *
 * Options:
 *   --category: List skills in specific category
 *   --disabled: Include disabled skills
 *   --all: List all skills (including disabled)
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
    disabled: boolean;
    all: boolean;
    indexPath?: string;
  } = {
    disabled: false,
    all: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--category':
        if (args[i + 1]) {
          options.category = args[++i];
        }
        break;
      case '--disabled':
        options.disabled = true;
        break;
      case '--all':
        options.all = true;
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
 * Display category header
 */
function displayCategoryHeader(category: string, count: number): void {
  console.log(`\n📁 ${category} (${count} skills)`);
  console.log('─'.repeat(60));
}

/**
 * Display skill
 */
function displaySkill(skill: any, showDisabled: boolean): void {
  if (!showDisabled && skill.disabled) {
    return;
  }

  const status = skill.disabled ? '❌' : '✓';
  const tags = skill.tags.length > 0 ? `[${skill.tags.join(', ')}]` : '';

  console.log(`  ${status} ${skill.name}`);
  console.log(`     ${skill.description.substring(0, 60)}${skill.description.length > 60 ? '...' : ''}`);
  if (tags) {
    console.log(`     ${tags}`);
  }
}

/**
 * Display all skills
 */
function displayAllSkills(index: any, options: any): void {
  console.log(`\n📚 All Skills (${index.stats.totalSkills} total)`);

  for (const category in index.categories) {
    const skills = index.categories[category];
    if (skills.length === 0) {
      continue;
    }

    displayCategoryHeader(category, skills.length);

    for (const skillName of skills) {
      const skill = index.skills[skillName];
      displaySkill(skill, options.disabled || options.all);
    }
  }
}

/**
 * Display skills in specific category
 */
function displayCategorySkills(index: any, category: string, options: any): void {
  if (!index.categories[category]) {
    console.error(`Error: Category "${category}" not found`);
    console.error('Available categories:', Object.keys(index.categories).join(', '));
    process.exit(1);
  }

  const skills = index.categories[category];
  displayCategoryHeader(category, skills.length);

  for (const skillName of skills) {
    const skill = index.skills[skillName];
    displaySkill(skill, options.disabled || options.all);
  }
}

/**
 * Display category summary
 */
function displayCategorySummary(index: any): void {
  console.log('\n📊 Category Summary:');
  console.log('─'.repeat(40));

  for (const [category, skills] of Object.entries(index.categories)) {
    const skillNames = skills as string[];
    const enabledCount = skillNames.filter((name) => !index.skills[name].disabled).length;
    const disabledCount = skillNames.length - enabledCount;

    if (skillNames.length > 0) {
      console.log(`  ${category}: ${skillNames.length} (${enabledCount} enabled, ${disabledCount} disabled)`);
    }
  }
}

/**
 * Main list function
 */
async function list() {
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

  // Display skills
  if (options.category) {
    displayCategorySkills(index, options.category, options);
  } else {
    displayAllSkills(index, options);
  }

  // Display category summary
  displayCategorySummary(index);

  console.log('\n💡 Tips:');
  console.log('  - Use --category <name> to list skills in a specific category');
  console.log('  - Use --disabled or --all to include disabled skills');
  console.log('  - Use "node scripts/search.js <query>" to search for skills');
}

// Run list
list().catch((error) => {
  console.error('Error during list:', error);
  process.exit(1);
});