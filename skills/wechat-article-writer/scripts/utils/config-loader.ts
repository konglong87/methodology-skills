import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as yaml from 'js-yaml';

export interface ArticleConfig {
  default_style: 'knowledge' | 'emotional' | 'tutorial' | 'review';
  default_voice: 'professional' | 'casual' | 'friendly';
  target_audience: string;
  infographic_style: 'notion' | 'warm' | 'minimal' | 'bold';
  need_title_variants: number;
  need_summary: boolean;
  claude_api_key?: string;
}

const DEFAULT_CONFIG: ArticleConfig = {
  default_style: 'knowledge',
  default_voice: 'professional',
  target_audience: '',
  infographic_style: 'notion',
  need_title_variants: 3,
  need_summary: true,
};

const CONFIG_LOCATIONS = [
  // Priority 1: Project-level
  path.join(process.cwd(), '.baoyu-skills/wechat-article-writer/EXTEND.md'),
  // Priority 2: XDG config
  path.join(os.homedir(), '.config/baoyu-skills/wechat-article-writer/EXTEND.md'),
  // Priority 3: User-level
  path.join(os.homedir(), '.baoyu-skills/wechat-article-writer/EXTEND.md'),
];

/**
 * Extract YAML frontmatter from markdown file
 */
function extractFrontmatter(content: string): Record<string, any> | null {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return null;
  }

  try {
    return yaml.load(match[1]) as Record<string, any>;
  } catch (error) {
    console.warn('Warning: Failed to parse YAML frontmatter:', error);
    return null;
  }
}

/**
 * Load config from EXTEND.md file
 */
function loadConfigFile(filePath: string): Partial<ArticleConfig> | null {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const frontmatter = extractFrontmatter(content);

    if (!frontmatter) {
      return null;
    }

    // Filter to only known config fields
    // Note: configKeys are derived from DEFAULT_CONFIG to ensure we only load fields defined in the ArticleConfig interface
    const configKeys = Object.keys(DEFAULT_CONFIG);
    const filteredConfig: Partial<ArticleConfig> = {};

    for (const key of configKeys) {
      if (key in frontmatter) {
        filteredConfig[key as keyof ArticleConfig] = frontmatter[key] as ArticleConfig[keyof ArticleConfig];
      }
    }

    return filteredConfig;
  } catch (error) {
    console.warn(`Warning: Failed to load config from ${filePath}:`, error);
    return null;
  }
}

/**
 * Load config from all EXTEND.md locations in priority order
 * @returns { config: ArticleConfig, source: string | null }
 */
export function loadConfig(): { config: ArticleConfig; source: string | null } {
  let mergedConfig: Partial<ArticleConfig> = {};
  let source: string | null = null;

  // Load configs in priority order (later configs override earlier ones)
  for (const location of CONFIG_LOCATIONS) {
    const config = loadConfigFile(location);
    if (config) {
      mergedConfig = { ...mergedConfig, ...config };
      source = location;
    }
  }

  // Apply defaults
  return { config: { ...DEFAULT_CONFIG, ...mergedConfig }, source };
}

/**
 * Get Claude API key from config or environment
 * Priority: config.claude_api_key → CLAUDE_API_KEY env var → ANTHROPIC_API_KEY env var
 */
export function getApiKey(config?: ArticleConfig): string {
  const apiKey = config?.claude_api_key || process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Claude API key not found. Set it in EXTEND.md, CLAUDE_API_KEY, or ANTHROPIC_API_KEY environment variable.'
    );
  }

  return apiKey;
}