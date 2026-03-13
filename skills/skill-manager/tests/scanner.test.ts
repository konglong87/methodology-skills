import { jest } from '@jest/globals';
import { SkillScanner } from '../lib/scanner.js';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('SkillScanner', () => {
  let scanner: SkillScanner;
  let tempDir: string;

  beforeEach(() => {
    scanner = new SkillScanner();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('parseFrontmatter', () => {
    it('should parse valid frontmatter', () => {
      const skillMdPath = path.join(tempDir, 'SKILL.md');
      fs.writeFileSync(skillMdPath, `---
name: test-skill
description: A test skill for testing
---
# Test Skill
Content here`);

      const result = (scanner as any).parseFrontmatter(skillMdPath);

      expect(result.name).toBe('test-skill');
      expect(result.description).toBe('A test skill for testing');
    });

    it('should throw error for missing frontmatter', () => {
      const skillMdPath = path.join(tempDir, 'SKILL.md');
      fs.writeFileSync(skillMdPath, '# Test Skill\nNo frontmatter');

      expect(() => (scanner as any).parseFrontmatter(skillMdPath)).toThrow(
        'No frontmatter found'
      );
    });
  });

  describe('scanDirectory', () => {
    it('should scan skills correctly', async () => {
      // 创建测试 skill
      const skillDir = path.join(tempDir, 'test-skill');
      fs.mkdirSync(skillDir);
      fs.writeFileSync(
        path.join(skillDir, 'SKILL.md'),
        `---
name: test-skill
description: Test description
---
# Test`
      );

      const result = await (scanner as any).scanDirectory(tempDir);

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('test-skill');
      expect(result[0].description).toBe('Test description');
      expect(result[0].disabled).toBe(false);
    });

    it('should detect disabled skills', async () => {
      const skillDir = path.join(tempDir, 'disabled-skill');
      fs.mkdirSync(skillDir);
      fs.writeFileSync(
        path.join(skillDir, 'SKILL.md'),
        `---
name: disabled-skill
description: Disabled skill
---
# Test`
      );
      fs.writeFileSync(path.join(skillDir, '.disabled'), '');

      const result = await (scanner as any).scanDirectory(tempDir);

      expect(result[0].disabled).toBe(true);
    });

    it('should skip directories without SKILL.md', async () => {
      const skillDir = path.join(tempDir, 'no-skill-md');
      fs.mkdirSync(skillDir);
      fs.writeFileSync(path.join(skillDir, 'README.md'), 'Not a skill');

      const result = await (scanner as any).scanDirectory(tempDir);

      expect(result.length).toBe(0);
    });
  });
});