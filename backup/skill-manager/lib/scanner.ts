import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { SkillBasicInfo } from './types.js';

export class SkillScanner {
  /**
   * 解析 SKILL.md 文件的 YAML frontmatter
   */
  parseFrontmatter(skillMdPath: string): { name: string; description: string } {
    const content = fs.readFileSync(skillMdPath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (!frontmatterMatch) {
      throw new Error(`No frontmatter found in ${skillMdPath}`);
    }

    const frontmatter = frontmatterMatch[1];
    const parsed = yaml.load(frontmatter) as Record<string, any>;

    if (!parsed.name || !parsed.description) {
      throw new Error(
        `Missing required fields (name or description) in ${skillMdPath}`
      );
    }

    return {
      name: parsed.name,
      description: parsed.description,
    };
  }

  /**
   * 扫描单个目录，返回技能列表
   */
  private async scanDirectory(dirPath: string): Promise<SkillBasicInfo[]> {
    const skills: SkillBasicInfo[] = [];

    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        // 跳过隐藏文件和目录
        if (entry.name.startsWith('.')) {
          continue;
        }

        const entryPath = path.join(dirPath, entry.name);

        // 处理符号链接
        if (entry.isSymbolicLink()) {
          try {
            const realPath = fs.realpathSync(entryPath);
            const realStat = fs.statSync(realPath);

            // 如果符号链接指向目录，递归扫描
            if (realStat.isDirectory()) {
              const subSkills = await this.scanDirectory(realPath);
              skills.push(...subSkills);
            }
          } catch (error) {
            console.warn(`Failed to resolve symlink ${entryPath}:`, error);
          }
          continue;
        }

        // 只处理目录
        if (!entry.isDirectory()) {
          continue;
        }

        // 检查是否有 SKILL.md 文件
        const skillMdPath = path.join(entryPath, 'SKILL.md');
        if (!fs.existsSync(skillMdPath)) {
          continue;
        }

        try {
          // 解析 frontmatter
          const { name, description } = this.parseFrontmatter(skillMdPath);

          // 检查是否被禁用
          const disabledPath = path.join(entryPath, '.disabled');
          const disabled = fs.existsSync(disabledPath);

          skills.push({
            name,
            description,
            path: entryPath,
            disabled,
          });
        } catch (error) {
          console.warn(`Failed to parse skill at ${entryPath}:`, error);
        }
      }
    } catch (error) {
      console.error(`Failed to scan directory ${dirPath}:`, error);
    }

    return skills;
  }

  /**
   * 扫描所有技能目录
   */
  async scanAll(skillsDir: string): Promise<SkillBasicInfo[]> {
    if (!fs.existsSync(skillsDir)) {
      throw new Error(`Skills directory not found: ${skillsDir}`);
    }

    const allSkills = await this.scanDirectory(skillsDir);
    return allSkills;
  }
}