import { analyzeContent, formatAnalysis } from '../scripts/utils/content-analyzer';
import { ArticleConfig } from '../scripts/utils/config-loader';

/**
 * Test content analyzer with various topics
 */
async function testContentAnalyzer() {
  console.log('=== Testing Content Analyzer ===\n');

  const testTopics = [
    'AI工具推荐:提升10倍效率的5个神器',
    'Go语言微服务架构实践:从零到部署',
    '2024年AI发展趋势与商业应用分析',
    '我的创业之路:从失败到成功的感悟',
    'Notion vs Obsidian:哪个更适合知识管理？',
  ];

  for (const topic of testTopics) {
    console.log(`\n--- Testing: ${topic} ---`);

    const config: ArticleConfig = {
      default_style: 'knowledge',
      default_voice: 'professional',
      target_audience: '',
      infographic_style: 'notion',
      need_title_variants: 3,
      need_summary: true,
    };

    const analysis = analyzeContent(topic, config);

    console.log('Type:', analysis.type);
    console.log('Style:', analysis.style);
    console.log('Framework:', analysis.framework);
    console.log('Audience:', analysis.audience);
    console.log('Key Points:', analysis.keyPoints);
    console.log('Title Hooks:', analysis.titleHooks);
    console.log('Image Opportunities:', analysis.imageOpportunities);

    // Test formatting
    const formatted = formatAnalysis(analysis);
    console.log('\n--- Formatted Output ---');
    console.log(formatted);
  }

  console.log('\n=== All Tests Passed ===');
}

// Run tests
testContentAnalyzer().catch(console.error);