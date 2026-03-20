import {
  SkillsIndex,
  SkillMetadata,
  Recommendation,
  Category,
} from './types.js';

/**
 * Context for context-based recommendation
 */
interface RecommendationContext {
  userQuery: string;
  conversationHistory?: string[];
}

/**
 * SkillRecommender - Recommend skills based on query and context
 */
export class SkillRecommender {
  private readonly WEIGHTS = {
    name: 50, // Highest weight for name matches
    tag: 30, // Medium weight for tag matches
    description: 20, // Lowest weight for description matches
  };

  private readonly COMMON_WORDS = new Set([
    'the',
    'and',
    'or',
    'but',
    'a',
    'an',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'from',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'can',
    'could',
    'will',
    'would',
    'should',
    'may',
    'might',
    'must',
    'i',
    'you',
    'he',
    'she',
    'it',
    'we',
    'they',
    'me',
    'him',
    'her',
    'us',
    'them',
    'my',
    'your',
    'his',
    'her',
    'its',
    'our',
    'their',
    'this',
    'that',
    'these',
    'those',
    'what',
    'which',
    'who',
    'whom',
    'whose',
    'where',
    'when',
    'why',
    'how',
  ]);

  /**
   * Recommend skills based on query
   * @param query - Search query string
   * @param index - Skills index
   * @param topN - Number of top results to return
   * @returns Array of recommendations
   */
  recommendByQuery(
    query: string,
    index: SkillsIndex,
    topN: number = 5
  ): Recommendation[] {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const recommendations: Recommendation[] = [];

    // Score each skill
    for (const skillName in index.skills) {
      const skill = index.skills[skillName];

      // Skip disabled skills
      if (skill.disabled) {
        continue;
      }

      // Determine match type and score
      const matchType = this.determineMatchType(skill, query);
      if (!matchType) {
        continue;
      }

      const score = this.calculateRelevanceScore(skill, query, matchType);

      if (score > 0) {
        recommendations.push({
          skill,
          score,
          reason: this.generateReason(skill.name, query, matchType),
          matchType,
        });
      }
    }

    // Sort by score descending and return top N
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);
  }

  /**
   * Recommend skills based on context (query + conversation history)
   * @param context - Recommendation context
   * @param index - Skills index
   * @param topN - Number of top results to return
   * @returns Array of recommendations
   */
  recommendByContext(
    context: RecommendationContext | null,
    index: SkillsIndex,
    topN: number = 5
  ): Recommendation[] {
    if (!context) {
      return [];
    }

    const { userQuery, conversationHistory = [] } = context;

    // Combine user query and conversation history
    const combinedText = [userQuery, ...conversationHistory].join(' ');

    // Extract keywords from combined text
    const keywords = this.extractKeywords(combinedText);

    if (keywords.length === 0) {
      return [];
    }

    // Score each skill based on keywords
    const recommendations: Recommendation[] = [];

    for (const skillName in index.skills) {
      const skill = index.skills[skillName];

      // Skip disabled skills
      if (skill.disabled) {
        continue;
      }

      let totalScore = 0;
      let bestMatchType: 'name' | 'description' | 'tag' | null = null;

      // Score for each keyword and accumulate
      for (const keyword of keywords) {
        const matchType = this.determineMatchType(skill, keyword);
        if (matchType) {
          const score = this.calculateRelevanceScore(skill, keyword, matchType);
          totalScore = this.accumulateScore(totalScore, score);

          if (score > 0 && (!bestMatchType || score > totalScore)) {
            bestMatchType = matchType;
          }
        }
      }

      if (totalScore > 0 && bestMatchType) {
        recommendations.push({
          skill,
          score: totalScore,
          reason: this.generateReason(skill.name, keywords.join(', '), bestMatchType),
          matchType: bestMatchType,
        });
      }
    }

    // Sort by score descending and return top N
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);
  }

  /**
   * Calculate relevance score for a skill based on match
   * @param skill - Skill metadata
   * @param query - Query string
   * @param matchType - Type of match
   * @returns Score (0-100)
   */
  calculateRelevanceScore(
    skill: SkillMetadata,
    query: string,
    matchType: 'name' | 'description' | 'tag'
  ): number {
    let text = '';
    let weight = 0;

    switch (matchType) {
      case 'name':
        text = skill.name;
        weight = this.WEIGHTS.name;
        break;
      case 'description':
        text = skill.description;
        weight = this.WEIGHTS.description;
        break;
      case 'tag':
        // Check all tags
        for (const tag of skill.tags) {
          if (tag.toLowerCase().includes(query.toLowerCase())) {
            return this.WEIGHTS.tag;
          }
        }
        return 0;
    }

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    // Exact match
    if (lowerText === lowerQuery) {
      return Math.min(weight * 2, 100);
    }

    // Starts with query
    if (lowerText.startsWith(lowerQuery)) {
      return Math.min(weight * 1.5, 100);
    }

    // Contains query
    if (lowerText.includes(lowerQuery)) {
      return weight;
    }

    return 0;
  }

  /**
   * Accumulate scores from multiple matches
   * @param score1 - First score
   * @param score2 - Second score
   * @returns Accumulated score (capped at 100)
   */
  accumulateScore(score1: number, score2: number): number {
    // If first score is 0, don't apply diminishing returns
    if (score1 === 0) {
      return Math.min(score2, 100);
    }

    // Use diminishing returns for accumulation
    const total = score1 + score2 * 0.7;
    return Math.min(total, 100);
  }

  /**
   * Generate reason for recommendation
   * @param skillName - Name of skill
   * @param query - Query string
   * @param matchType - Type of match
   * @returns Reason string
   */
  generateReason(
    skillName: string,
    query: string,
    matchType: 'name' | 'description' | 'tag'
  ): string {
    switch (matchType) {
      case 'name':
        return `name matches "${query}"`;
      case 'tag':
        return `tag matches "${query}"`;
      case 'description':
        return `description contains "${query}"`;
      default:
        return 'match found';
    }
  }

  /**
   * Determine match type for a skill
   * @param skill - Skill metadata
   * @param query - Query string
   * @returns Match type or null if no match
   */
  determineMatchType(
    skill: SkillMetadata,
    query: string
  ): 'name' | 'description' | 'tag' | null {
    const lowerQuery = query.toLowerCase();

    // Check name first (highest priority)
    if (skill.name.toLowerCase().includes(lowerQuery)) {
      return 'name';
    }

    // Check tags
    for (const tag of skill.tags) {
      if (tag.toLowerCase().includes(lowerQuery)) {
        return 'tag';
      }
    }

    // Check description
    if (skill.description.toLowerCase().includes(lowerQuery)) {
      return 'description';
    }

    return null;
  }

  /**
   * Extract keywords from text
   * @param text - Text to extract keywords from
   * @returns Array of keywords
   */
  extractKeywords(text: string): string[] {
    if (!text || text.trim().length === 0) {
      return [];
    }

    // Tokenize and filter
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(
        (word) =>
          word.length > 2 && // Minimum length
          !this.COMMON_WORDS.has(word) && // Not a common word
          !/^\d+$/.test(word) // Not a number
      );

    // Remove duplicates
    return [...new Set(words)];
  }
}