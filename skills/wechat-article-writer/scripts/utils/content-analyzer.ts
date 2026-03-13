import type { ArticleConfig } from './config-loader';

/**
 * Content analysis result
 */
export interface ContentAnalysis {
  topic: string;
  type: 'tutorial' | 'knowledge' | 'emotional' | 'review';
  style: 'knowledge' | 'emotional' | 'tutorial' | 'review';
  framework: string;
  audience: string;
  keyPoints: string[];
  titleHooks: string[];
  imageOpportunities: string[];
}

/**
 * Content type detection signals (keywords)
 */
const CONTENT_SIGNALS = {
  tutorial: ['教程', '步骤', '指南', 'how-to', '如何', '怎样', '实战', '入门', '进阶'],
  knowledge: ['干货', '工具', '资源', '推荐', '盘点', '必看', '分享', '总结', '解析', '洞察'],
  emotional: ['情感', '故事', '经历', '感悟', '人生', '成长', '思考', '心得', '体验'],
  review: ['对比', '测评', 'vs', '优劣', '比较', '哪个好', '评测', '测评', '对比分析'],
};

/**
 * Framework recommendations for each content type
 */
const FRAMEWORKS = {
  tutorial: 'problem-solution-demo-practice: 问题-解决方案-演示-实践',
  knowledge: 'core-concepts-key-points-best-practices: 核心概念-关键要点-最佳实践',
  emotional: 'background-story-lesson-call-to-action: 背景-故事-启示-行动呼吁',
  review: 'criteria-comparison-verdict: 评测标准-对比分析-结论建议',
};

/**
 * Default key point templates for each content type
 */
const KEY_POINT_TEMPLATES = {
  tutorial: [
    '核心概念理解',
    '工具/环境准备',
    '实施步骤详解',
    '常见问题解决',
    '进阶技巧分享',
  ],
  knowledge: [
    '核心概念定义',
    '关键特性分析',
    '实际应用场景',
    '最佳实践建议',
    '未来发展趋势',
  ],
  emotional: [
    '背景与情境',
    '关键转折点',
    '感悟与收获',
    '行动与改变',
  ],
  review: [
    '评测维度设定',
    '候选方案介绍',
    '详细对比分析',
    '优劣总结',
    '推荐结论',
  ],
};

/**
 * Title hook templates for each content type
 */
const TITLE_HOOK_TEMPLATES = {
  tutorial: [
    '从零开始',
    '完整指南',
    '实战教程',
    '手把手教学',
  ],
  knowledge: [
    '必备知识',
    '深度解析',
    '精华总结',
    '专业分享',
  ],
  emotional: [
    '真实经历',
    '深度感悟',
    '成长故事',
    '心路历程',
  ],
  review: [
    '全方位对比',
    '详细测评',
    '选购指南',
    '专业评测',
  ],
};

/**
 * Image opportunity templates for each content type
 */
const IMAGE_OPPORTUNITY_TEMPLATES = {
  tutorial: [
    '流程图: 完整实施流程',
    '示意图: 核心概念可视化',
    '截图: 关键步骤演示',
    '架构图: 整体结构展示',
  ],
  knowledge: [
    '思维导图: 知识体系结构',
    '对比表: 关键特性对比',
    '数据图表: 趋势与统计',
    '概念图: 核心关系展示',
  ],
  emotional: [
    '场景图: 情境再现',
    '时间线: 成长历程',
    '对比图: 前后变化',
    '插画: 情感表达',
  ],
  review: [
    '对比表: 多维度评分',
    '雷达图: 综合能力对比',
    '优缺点清单: 简洁总结',
    '推荐指数: 评分展示',
  ],
};

/**
 * Detect content type from topic keywords
 * @param topic Content topic or title
 * @returns Detected content type
 */
function detectContentType(topic: string): ContentAnalysis['type'] {
  const lowerTopic = topic.toLowerCase();

  // Count matches for each type
  const scores = {
    tutorial: 0,
    knowledge: 0,
    emotional: 0,
    review: 0,
  };

  for (const [type, keywords] of Object.entries(CONTENT_SIGNALS)) {
    for (const keyword of keywords) {
      if (lowerTopic.includes(keyword.toLowerCase())) {
        scores[type as keyof typeof scores]++;
      }
    }
  }

  // Find type with highest score
  let maxScore = 0;
  let detectedType: ContentAnalysis['type'] = 'knowledge'; // Default to knowledge

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedType = type as ContentAnalysis['type'];
    }
  }

  return detectedType;
}

/**
 * Generate audience description based on config
 * @param config Article configuration
 * @param type Content type
 * @returns Audience description
 */
function generateAudience(config: ArticleConfig, type: ContentAnalysis['type']): string {
  if (config.target_audience && config.target_audience.trim().length > 0) {
    return config.target_audience;
  }

  // Default audience by type
  const defaultAudiences = {
    tutorial: '初学者/入门用户',
    knowledge: '行业从业者/技术爱好者',
    emotional: '追求成长的读者',
    review: '面临选择/对比需求的用户',
  };

  return defaultAudiences[type];
}

/**
 * Generate key points based on type and topic
 * @param type Content type
 * @param topic Content topic
 * @returns Key points array
 */
function generateKeyPoints(type: ContentAnalysis['type'], topic: string): string[] {
  const templates = KEY_POINT_TEMPLATES[type];

  // For now, return templates directly
  // In the future, this could be enhanced with AI to extract topic-specific points
  return [...templates];
}

/**
 * Generate title hooks based on type
 * @param type Content type
 * @param topic Content topic
 * @returns Title hooks array
 */
function generateTitleHooks(type: ContentAnalysis['type'], topic: string): string[] {
  const templates = TITLE_HOOK_TEMPLATES[type];

  // For now, return templates directly
  // In the future, this could be enhanced with AI to generate more specific hooks
  return [...templates];
}

/**
 * Identify image opportunities based on type
 * @param type Content type
 * @param topic Content topic
 * @returns Image opportunities array
 */
function identifyImageOpportunities(type: ContentAnalysis['type'], topic: string): string[] {
  const templates = IMAGE_OPPORTUNITY_TEMPLATES[type];

  // For now, return templates directly
  // In the future, this could be enhanced with AI to identify more specific opportunities
  return [...templates];
}

/**
 * Analyze content and generate comprehensive analysis
 * @param topic Content topic or title
 * @param config Article configuration
 * @returns Content analysis result
 */
export function analyzeContent(topic: string, config: ArticleConfig): ContentAnalysis {
  const type = detectContentType(topic);

  // Use config default_style if set, otherwise use detected type
  const style: ContentAnalysis['style'] = config.default_style || type;

  const framework = FRAMEWORKS[type];
  const audience = generateAudience(config, type);
  const keyPoints = generateKeyPoints(type, topic);
  const titleHooks = generateTitleHooks(type, topic);
  const imageOpportunities = identifyImageOpportunities(type, topic);

  return {
    topic,
    type,
    style,
    framework,
    audience,
    keyPoints,
    titleHooks,
    imageOpportunities,
  };
}

/**
 * Format analysis result as markdown
 * @param analysis Content analysis result
 * @returns Formatted markdown string
 */
export function formatAnalysis(analysis: ContentAnalysis): string {
  const typeLabels = {
    tutorial: '教程型',
    knowledge: '知识型',
    emotional: '情感型',
    review: '评测型',
  };

  const styleLabels = {
    tutorial: '教程风格',
    knowledge: '知识风格',
    emotional: '情感风格',
    review: '评测风格',
  };

  let markdown = '# 内容分析报告\n\n';

  // Basic Information
  markdown += '## 基本信息\n\n';
  markdown += `- **主题**: ${analysis.topic}\n`;
  markdown += `- **内容类型**: ${typeLabels[analysis.type]}\n`;
  markdown += `- **写作风格**: ${styleLabels[analysis.style]}\n`;
  markdown += `- **目标受众**: ${analysis.audience}\n\n`;

  // Framework
  markdown += '## 推荐框架\n\n';
  markdown += `${analysis.framework}\n\n`;

  // Key Points
  markdown += '## 关键要点\n\n';
  markdown += analysis.keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n');
  markdown += '\n\n';

  // Title Hooks
  markdown += '## 标题钩子\n\n';
  markdown += analysis.titleHooks.map((hook, index) => `${index + 1}. ${hook}`).join('\n');
  markdown += '\n\n';

  // Image Opportunities
  markdown += '## 图文机会\n\n';
  markdown += analysis.imageOpportunities.map((opportunity, index) => `${index + 1}. ${opportunity}`).join('\n');
  markdown += '\n\n';

  return markdown;
}