import {
  ClassificationResult,
  MetadataConfig,
  PredefinedRule,
  RuleMatch,
  SkillBasicInfo,
} from './types.js';

/**
 * Claude Client Interface (supports both mock and real Anthropic SDK)
 */
interface ClaudeClient {
  generate(prompt: string): Promise<string>;
}

/**
 * Skill Categorizer - Classify skills using rules and LLM
 */
export class SkillCategorizer {
  private config: MetadataConfig;
  private claudeClient: ClaudeClient;

  constructor(config: MetadataConfig, claudeClient: ClaudeClient) {
    this.config = config;
    this.claudeClient = claudeClient;
  }

  /**
   * Main classification entry point
   * @param skill - Basic skill information
   * @returns Classification result
   */
  async classify(skill: SkillBasicInfo): Promise<ClassificationResult> {
    // Try rule-based classification first
    const ruleMatch = this.matchRules(skill.name, skill.description);

    if (ruleMatch) {
      return {
        category: ruleMatch.category,
        tags: ruleMatch.tags,
        method: 'rule-based',
        confidence: 1.0,
      };
    }

    // Fall back to LLM classification
    return await this.classifyWithLLM(skill);
  }

  /**
   * Match rules based on keywords in skill name and description
   * @param skillName - Skill name
   * @param skillDescription - Skill description
   * @returns Rule match result or null if no match
   */
  matchRules(skillName: string, skillDescription: string): RuleMatch | null {
    const combinedText = `${skillName} ${skillDescription}`.toLowerCase();

    for (const rule of this.config.rules) {
      for (const keyword of rule.keywords) {
        if (combinedText.includes(keyword.toLowerCase())) {
          return {
            category: rule.category,
            tags: rule.tags,
          };
        }
      }
    }

    return null;
  }

  /**
   * Classify using LLM (private method)
   * @param skill - Basic skill information
   * @returns Classification result
   */
  private async classifyWithLLM(
    skill: SkillBasicInfo
  ): Promise<ClassificationResult> {
    try {
      const prompt = this.buildLLMPrompt(skill);
      const response = await this.claudeClient.generate(prompt);
      const parsed = JSON.parse(response);

      return {
        category: parsed.category || '其他',
        tags: parsed.tags || [],
        method: 'llm-based',
        confidence: parsed.confidence || 0.7,
      };
    } catch (error) {
      // Handle LLM errors gracefully
      console.warn('LLM classification failed:', error);
      return {
        category: '其他',
        tags: [],
        method: 'llm-based',
        confidence: 0.5,
      };
    }
  }

  /**
   * Build prompt for LLM classification
   * @param skill - Basic skill information
   * @returns Prompt string
   */
  private buildLLMPrompt(skill: SkillBasicInfo): string {
    const categoriesList = this.config.categories.join(', ');

    return `Classify the following skill into one of these categories: ${categoriesList}

Skill name: ${skill.name}
Skill description: ${skill.description}

Return a JSON object with:
- category: one of the categories listed above
- tags: array of relevant tags
- confidence: number between 0 and 1

JSON response:`;
  }
}