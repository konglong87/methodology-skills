import * as fs from 'fs';
import * as path from 'path';
import {
  SkillsIndex,
  SkillMetadata,
  Category,
  IndexStats,
} from './types.js';

/**
 * IndexManager - Manage skills index file and operations
 */
export class IndexManager {
  private indexPath: string;
  private readonly VERSION = '1.0.0';
  private readonly CATEGORIES: Category[] = [
    '方法论',
    '内容创作',
    '开发工具',
    '数据处理',
    '自动化',
    '多媒体',
    '其他',
  ];

  constructor(indexPath: string) {
    this.indexPath = indexPath;
  }

  /**
   * Load index from file or create empty index
   * @returns Skills index
   */
  loadIndex(): SkillsIndex {
    try {
      if (fs.existsSync(this.indexPath)) {
        const content = fs.readFileSync(this.indexPath, 'utf-8');
        const index = JSON.parse(content) as SkillsIndex;

        // Validate index structure
        if (this.isValidIndex(index)) {
          return index;
        }
      }
    } catch (error) {
      console.warn('Failed to load index, creating new one:', error);
    }

    // Create empty index
    return this.createEmptyIndex();
  }

  /**
   * Save index to file with calculated statistics
   * @param index - Skills index to save
   */
  saveIndex(index: SkillsIndex): void {
    // Calculate and update statistics
    index.stats = this.calculateStats(index);
    index.lastUpdated = new Date().toISOString();

    // Ensure directory exists
    const dir = path.dirname(this.indexPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save to file
    fs.writeFileSync(this.indexPath, JSON.stringify(index, null, 2), 'utf-8');
  }

  /**
   * Update or add skill metadata in index
   * @param index - Skills index
   * @param skillMetadata - Skill metadata to add/update
   */
  updateSkill(index: SkillsIndex, skillMetadata: SkillMetadata): void {
    const skillName = skillMetadata.name;
    const existingSkill = index.skills[skillName];

    if (existingSkill) {
      // Remove from old category if category changed
      if (existingSkill.category !== skillMetadata.category) {
        const oldCategory = existingSkill.category;
        index.categories[oldCategory] = index.categories[oldCategory].filter(
          (name) => name !== skillName
        );
      }
    }

    // Add to new category
    if (!index.categories[skillMetadata.category].includes(skillName)) {
      index.categories[skillMetadata.category].push(skillName);
    }

    // Update skill metadata
    index.skills[skillName] = skillMetadata;

    // Update statistics
    index.stats = this.calculateStats(index);
  }

  /**
   * Remove skill from index
   * @param index - Skills index
   * @param skillName - Name of skill to remove
   */
  removeSkill(index: SkillsIndex, skillName: string): void {
    const skill = index.skills[skillName];

    if (!skill) {
      return; // Skill doesn't exist, nothing to do
    }

    // Remove from category
    const category = skill.category;
    index.categories[category] = index.categories[category].filter(
      (name) => name !== skillName
    );

    // Remove from skills
    delete index.skills[skillName];

    // Update statistics
    index.stats = this.calculateStats(index);
  }

  /**
   * Create empty index with default structure
   * @returns Empty skills index
   */
  private createEmptyIndex(): SkillsIndex {
    const categories: Record<Category, string[]> = {} as Record<
      Category,
      string[]
    >;

    this.CATEGORIES.forEach((cat) => {
      categories[cat] = [];
    });

    return {
      version: this.VERSION,
      lastUpdated: new Date().toISOString(),
      categories,
      skills: {},
      stats: this.calculateEmptyStats(),
    };
  }

  /**
   * Validate index structure
   * @param index - Index to validate
   * @returns True if valid, false otherwise
   */
  private isValidIndex(index: any): index is SkillsIndex {
    return (
      index &&
      typeof index === 'object' &&
      index.version &&
      index.lastUpdated &&
      index.categories &&
      index.skills &&
      index.stats
    );
  }

  /**
   * Calculate statistics from index data
   * @param index - Skills index
   * @returns Calculated statistics
   */
  private calculateStats(index: SkillsIndex): IndexStats {
    const stats: IndexStats = {
      totalSkills: 0,
      enabledSkills: 0,
      disabledSkills: 0,
      categoryCounts: {} as Record<Category, number>,
      tagCounts: {} as Record<string, number>,
    };

    // Initialize category counts
    this.CATEGORIES.forEach((cat) => {
      stats.categoryCounts[cat] = 0;
    });

    // Count skills and categorize
    for (const skillName in index.skills) {
      const skill = index.skills[skillName];
      stats.totalSkills++;

      if (skill.disabled) {
        stats.disabledSkills++;
      } else {
        stats.enabledSkills++;
      }

      // Count by category
      if (stats.categoryCounts[skill.category] !== undefined) {
        stats.categoryCounts[skill.category]++;
      }

      // Count tags
      skill.tags.forEach((tag) => {
        stats.tagCounts[tag] = (stats.tagCounts[tag] || 0) + 1;
      });
    }

    return stats;
  }

  /**
   * Create empty statistics object
   * @returns Empty statistics
   */
  private calculateEmptyStats(): IndexStats {
    const stats: IndexStats = {
      totalSkills: 0,
      enabledSkills: 0,
      disabledSkills: 0,
      categoryCounts: {} as Record<Category, number>,
      tagCounts: {},
    };

    // Initialize category counts
    this.CATEGORIES.forEach((cat) => {
      stats.categoryCounts[cat] = 0;
    });

    return stats;
  }
}