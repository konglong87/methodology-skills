#!/usr/bin/env node
/**
 * Init Command - Initialize skill index
 *
 * Usage:
 *   node scripts/init.js [--force] [--category <category>]
 *
 * Options:
 *   --force: Force re-classify all skills
 *   --category: Filter by category
 */

import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { SkillScanner } from '../lib/scanner.js';
import { SkillCategorizer } from '../lib/categorizer.js';
import { IndexManager } from '../lib/indexer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default paths
const DEFAULT_SKILLS_DIR = path.join(__dirname, '..', '..', '..');
const DEFAULT_INDEX_PATH = path.join(__dirname, '..', 'index.json');
const DEFAULT_METADATA_PATH = path.join(__dirname, '..', 'metadata.json');

// Simple mock Claude client (can be replaced with real SDK)
class MockClaudeClient {
  async generate(prompt: string): Promise<string> {
    console.warn('Using mock Claude client - classification will fallback to defaults');
    return JSON.stringify({
      category: '其他',
      tags: [],
      confidence: 0.5,
    });
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]) {
  const options: {
    force: boolean;
    category?: string;
    skillsDir?: string;
    indexPath?: string;
    metadataPath?: string;
  } = {
    force: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--force':
        options.force = true;
        break;
      case '--category':
        if (args[i + 1]) {
          options.category = args[++i];
        }
        break;
      case '--skills-dir':
        if (args[i + 1]) {
          options.skillsDir = args[++i];
        }
        break;
      case '--index-path':
        if (args[i + 1]) {
          options.indexPath = args[++i];
        }
        break;
      case '--metadata-path':
        if (args[i + 1]) {
          options.metadataPath = args[++i];
        }
        break;
    }
  }

  return options;
}

/**
 * Display statistics
 */
function displayStats(stats: any) {
  console.log('\n📊 Statistics:');
  console.log(`  Total Skills: ${stats.totalSkills}`);
  console.log(`  Enabled: ${stats.enabledSkills}`);
  console.log(`  Disabled: ${stats.disabledSkills}`);
  console.log('\n  By Category:');
  for (const [category, count] of Object.entries(stats.categoryCounts)) {
    if ((count as number) > 0) {
      console.log(`    ${category}: ${count}`);
    }
  }
  console.log('\n  Top Tags:');
  const sortedTags = Object.entries(stats.tagCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 10);
  for (const [tag, count] of sortedTags) {
    console.log(`    ${tag}: ${count}`);
  }
}

/**
 * Display skill summary
 */
function displaySkillSummary(skills: any[], action: string) {
  if (skills.length === 0) {
    return;
  }

  console.log(`\n${action} ${skills.length} skills:`);
  skills.forEach((skill) => {
    const status = skill.disabled ? '❌' : '✓';
    console.log(`  ${status} ${skill.name} (${skill.category})`);
  });
}

/**
 * Main init function
 */
async function init() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  const skillsDir = options.skillsDir || DEFAULT_SKILLS_DIR;
  const indexPath = options.indexPath || DEFAULT_INDEX_PATH;
  const metadataPath = options.metadataPath || DEFAULT_METADATA_PATH;

  console.log('🔧 Initializing skill index...');
  console.log(`  Skills directory: ${skillsDir}`);
  console.log(`  Index path: ${indexPath}`);
  console.log(`  Force re-classify: ${options.force}`);

  // Load metadata config
  let metadataConfig;
  try {
    const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
    metadataConfig = JSON.parse(metadataContent);
    console.log(`  ✓ Loaded metadata config`);
  } catch (error) {
    console.error(`  ✗ Failed to load metadata config from ${metadataPath}`);
    process.exit(1);
  }

  // Initialize components
  const scanner = new SkillScanner();
  const claudeClient = new MockClaudeClient();
  const categorizer = new SkillCategorizer(metadataConfig, claudeClient);
  const indexManager = new IndexManager(indexPath);

  // Scan skills
  console.log('\n🔍 Scanning skills...');
  const scannedSkills = await scanner.scanAll(skillsDir);
  console.log(`  ✓ Found ${scannedSkills.length} skills`);

  // Load existing index
  const index = indexManager.loadIndex();
  console.log(`  ✓ Loaded existing index (${index.stats.totalSkills} skills)`);

  // Process each skill
  const addedSkills: any[] = [];
  const updatedSkills: any[] = [];
  const removedSkills: string[] = [];
  const skippedSkills: string[] = [];

  // Find removed skills
  const existingSkillNames = new Set(scannedSkills.map((s) => s.name));
  for (const skillName of Object.keys(index.skills)) {
    if (!existingSkillNames.has(skillName)) {
      removedSkills.push(skillName);
      indexManager.removeSkill(index, skillName);
    }
  }

  // Process scanned skills
  for (const skill of scannedSkills) {
    const existingSkill = index.skills[skill.name];

    // Skip if category filter is set and doesn't match
    if (options.category) {
      const existingCategory = existingSkill?.category;
      // Need to classify first to check category
      const classification = await categorizer.classify(skill);
      if (classification.category !== options.category) {
        skippedSkills.push(skill.name);
        continue;
      }
    }

    // Check if re-classification is needed
    const needsClassification = !existingSkill || options.force;

    if (needsClassification) {
      // Classify skill
      const classification = await categorizer.classify(skill);

      // Create skill metadata
      const skillMetadata = {
        name: skill.name,
        description: skill.description,
        category: classification.category,
        tags: classification.tags,
        path: skill.path,
        metadataPath: path.join(skill.path, 'metadata.json'),
        autoGenerated: true,
        generatedAt: new Date().toISOString(),
        customized: false,
        disabled: skill.disabled,
      };

      // Update index
      indexManager.updateSkill(index, skillMetadata);

      if (existingSkill) {
        updatedSkills.push(skillMetadata);
      } else {
        addedSkills.push(skillMetadata);
      }
    }
  }

  // Save index
  indexManager.saveIndex(index);
  console.log('  ✓ Saved updated index');

  // Display results
  console.log('\n✅ Initialization complete!');
  displaySkillSummary(addedSkills, 'Added');
  displaySkillSummary(updatedSkills, 'Updated');

  if (removedSkills.length > 0) {
    console.log(`\nRemoved ${removedSkills.length} skills:`);
    removedSkills.forEach((name) => {
      console.log(`  - ${name}`);
    });
  }

  if (skippedSkills.length > 0) {
    console.log(`\nSkipped ${skippedSkills.length} skills (category filter):`);
    skippedSkills.forEach((name) => {
      console.log(`  - ${name}`);
    });
  }

  displayStats(index.stats);
}

// Run init
init().catch((error) => {
  console.error('Error during initialization:', error);
  process.exit(1);
});