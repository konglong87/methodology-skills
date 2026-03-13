import { jest } from '@jest/globals';
import { SkillCategorizer } from '../lib/categorizer.js';
import { MetadataConfig, SkillBasicInfo } from '../lib/types.js';

describe('SkillCategorizer', () => {
  let categorizer: SkillCategorizer;
  const mockConfig: MetadataConfig = {
    categories: ['方法论', '内容创作', '开发工具', '数据处理', '自动化', '多媒体', '其他'],
    rules: [
      {
        keywords: ['image', '图片'],
        category: '内容创作',
        tags: ['图片']
      },
      {
        keywords: ['DDD', '领域驱动'],
        category: '方法论',
        tags: ['DDD', '架构']
      }
    ]
  };

  const mockClaudeClient: any = {
    generate: jest.fn()
  };

  beforeEach(() => {
    categorizer = new SkillCategorizer(mockConfig, mockClaudeClient as any);
    mockClaudeClient.generate.mockClear();
  });

  describe('matchRules', () => {
    it('should match rule by keyword', () => {
      const result = (categorizer as any).matchRules(
        'baoyu-image-gen',
        'AI image generation tool'
      );

      expect(result).not.toBeNull();
      expect(result.category).toBe('内容创作');
      expect(result.tags).toContain('图片');
    });

    it('should return null when no rule matches', () => {
      const result = (categorizer as any).matchRules(
        'unknown-skill',
        'Something completely new'
      );

      expect(result).toBeNull();
    });

    it('should match Chinese keywords', () => {
      const result = (categorizer as any).matchRules(
        'ddd-tool',
        '领域驱动设计工具'
      );

      expect(result).not.toBeNull();
      expect(result.category).toBe('方法论');
      expect(result.tags).toContain('DDD');
    });
  });

  describe('classify', () => {
    it('should use rule-based classification when matched', async () => {
      const skill: SkillBasicInfo = {
        name: 'image-tool',
        description: 'Image generation tool',
        path: '/path',
        disabled: false
      };

      const result = await categorizer.classify(skill);

      expect(result.method).toBe('rule-based');
      expect(result.category).toBe('内容创作');
      expect(result.confidence).toBe(1.0);
      expect(mockClaudeClient.generate).not.toHaveBeenCalled();
    });

    it('should use LLM classification when no rule matches', async () => {
      mockClaudeClient.generate.mockResolvedValueOnce(
        JSON.stringify({
          category: '其他',
          tags: ['custom'],
          confidence: 0.85
        })
      );

      const skill: SkillBasicInfo = {
        name: 'unknown-skill',
        description: 'Something new',
        path: '/path',
        disabled: false
      };

      const result = await categorizer.classify(skill);

      expect(result.method).toBe('llm-based');
      expect(result.category).toBe('其他');
      expect(result.confidence).toBe(0.85);
      expect(mockClaudeClient.generate).toHaveBeenCalled();
    });

    it('should handle LLM errors gracefully', async () => {
      mockClaudeClient.generate.mockRejectedValueOnce(new Error('API error'));

      const skill: SkillBasicInfo = {
        name: 'error-skill',
        description: 'Will cause error',
        path: '/path',
        disabled: false
      };

      const result = await categorizer.classify(skill);

      expect(result.category).toBe('其他');
      expect(result.confidence).toBeLessThan(1.0);
    });
  });
});