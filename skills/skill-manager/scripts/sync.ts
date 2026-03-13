#!/usr/bin/env node
/**
 * Sync Command - Sync index with new/removed skills
 *
 * Usage:
 *   node scripts/sync.js [--dry-run]
 *
 * Options:
 *   --dry-run: Show what would be changed without making changes
 */

import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { SkillScanner } from '../lib/scanner.js';
import { SkillCategorizer } from '../lib/categorizer.js';
import { IndexManager } from '../lib/indexer.js';
import { SyncResult } from '../lib/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default paths
const DEFAULT_SKILLS_DIR = path.join(__dirname, '..', '..', '..');
const DEFAULT_INDEX_PATH = path.join(__dirname, '..', 'index.json');
const DEFAULT_METADATA_PATH = path.join(__dirname, '..', 'metadata.json');

// Simple mock Claude client
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
    dryRun: boolean;
    skillsDir?: string;
    indexPath?: string;
    metadataPath?: string;
  } = {
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--dry-run':
        options.dryRun = true;
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
 * Display sync result
 */
function displaySyncResult(result: SyncResult, dryRun: boolean): void {
  const total = result.added + result.removed + result.updated;

  if (total === 0) {
    console.log('\n✅ Index is up to date - no changes needed');
    return;
  }

  console.log(`\n📊 Sync Summary (${dryRun ? 'DRY RUN' : 'APPLIED'}):`);
  console.log(`  Added:   ${result.added} skills`);
  console.log(`  Removed: ${result.removed} skills`);
  console.log(`  Updated: ${result.updated} skills`);
  console.log(`  Total:   ${total} changes`);

  if (dryRun) {
    console.log('\n⚠️  This was a dry run. No changes were made.');
    console.log('   Run without --dry-run to apply these changes.');
  }
}

/**
 * Display changes
 */
function displayChanges(changes: {
  added: any[];
  removed: string[];
  updated: any[];
}): void {
  if (changes.added.length > 0) {
    console.log('\n➕ Skills to add:');
    changes.added.forEach((skill) => {
      console.log(`  + ${skill.name} (${skill.category})`);
    });
  }

  if (changes.removed.length > 0) {
    console.log('\n➖ Skills to remove:');
    changes.removed.forEach((name) => {
      console.log(`  - ${name}`);
    });
  }

  if (changes.updated.length > 0) {
    console.log('\n🔄 Skills to update:');
    changes.updated.forEach((skill) => {
      console.log(`  ~ ${skill.name} (${skill.category})`);
    });
  }
}

/**
 * Main sync function
 */
async function sync() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  const skillsDir = options.skillsDir || DEFAULT_SKILLS_DIR;
  const indexPath = options.indexPath || DEFAULT_INDEX_PATH;
  const metadataPath = options.metadataPath || DEFAULT_METADATA_PATH;

  console.log('🔄 Syncing skill index...');
  console.log(`  Skills directory: ${skillsDir}`);
  console.log(`  Index path: ${indexPath}`);
  console.log(`  Dry run: ${options.dryRun}`);

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

  // Track changes
  const changes = {
    added: [] as any[],
    removed: [] as string[],
    updated: [] as any[],
  };

  // Find removed skills (in index but not scanned)
  const scannedSkillNames = new Set(scannedSkills.map((s) => s.name));
  for (const skillName of Object.keys(index.skills)) {
    if (!scannedSkillNames.has(skillName)) {
      changes.removed.push(skillName);
      if (!options.dryRun) {
        indexManager.removeSkill(index, skillName);
      }
    }
  }

  // Process scanned skills
  for (const skill of scannedSkills) {
    const existingSkill = index.skills[skill.name];

    if (!existingSkill) {
      // New skill - classify and add
      const classification = await categorizer.classify(skill);
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

      changes.added.push(skillMetadata);
      if (!options.dryRun) {
        indexManager.updateSkill(index, skillMetadata);
      }
    } else if (existingSkill.disabled !== skill.disabled) {
      // Skill disabled status changed
      existingSkill.disabled = skill.disabled;
      changes.updated.push(existingSkill);
      if (!options.dryRun) {
        indexManager.updateSkill(index, existingSkill);
      }
    }
  }

  // Save index (if not dry run)
  if (!options.dryRun && (changes.added.length > 0 || changes.removed.length > 0 || changes.updated.length > 0)) {
    indexManager.saveIndex(index);
    console.log('  ✓ Saved updated index');
  }

  // Display results
  if (options.dryRun || changes.added.length > 0 || changes.removed.length > 0 || changes.updated.length > 0) {
    displayChanges(changes);
  }

  const result: SyncResult = {
    added: changes.added.length,
    removed: changes.removed.length,
    updated: changes.updated.length,
  };

  displaySyncResult(result, options.dryRun);

  if (!options.dryRun) {
    console.log('\n✅ Sync complete!');
  }
}

// Run sync
sync().catch((error) => {
  console.error('Error during sync:', error);
  process.exit(1);
});