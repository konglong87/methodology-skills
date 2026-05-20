/**
 * 模板预览生成器
 * 生成每个模板的缩略图预览，帮助用户选择
 */

const TEMPLATE_PREVIEWS = {
  knowledge: {
    name: '知识科普',
    description: '概念解释、知识分享、技术介绍',
    icon: '📚',
    previewColors: ['#3776AB', '#FFD43B', '#FFFFFF'],
    layout: '标题 + 2列内容 + 总结'
  },
  comparison: {
    name: '对比分析',
    description: '产品对比、方案评估、优劣分析',
    icon: '⚖️',
    previewColors: ['#4DB33D', '#00758F', '#E8F5E9'],
    layout: '左右对比 + 结论'
  },
  process: {
    name: '流程说明',
    description: '步骤指南、操作流程、工作流',
    icon: '🔄',
    previewColors: ['#1976D2', '#42A5F5', '#E3F2FD'],
    layout: '步骤编号 + 内容 + 提示'
  },
  data: {
    name: '数据展示',
    description: '数据报告、统计结果、调研分析',
    icon: '📊',
    previewColors: ['#1976D2', '#4CAF50', '#FFFFFF'],
    layout: '指标 + 图表 + 洞察'
  },
  xiaohongshu: {
    name: '小红书爆款',
    description: '社交媒体分享、内容营销',
    icon: '🔥',
    previewColors: ['#FF6B9D', '#C084FC', '#FFF5F7'],
    layout: '吸睛标题 + 卡片 + 互动'
  },
  scientific: {
    name: '科研图表',
    description: '学术论文、研究报告、实验数据',
    icon: '🔬',
    previewColors: ['#2C3E50', '#3498DB', '#FFFFFF'],
    layout: '标题 + 数据 + 结论'
  }
};

/**
 * 展示模板预览信息
 * @param {string} filter - 可选过滤条件
 */
function showTemplatePreviews(filter) {
  console.log('\n🎨 可用模板预览:\n');

  const entries = Object.entries(TEMPLATE_PREVIEWS);

  entries.forEach(([id, preview]) => {
    if (filter && !id.includes(filter) && !preview.name.includes(filter)) return;

    console.log(`  ${preview.icon}  ${preview.name}`);
    console.log(`     ID: ${id}`);
    console.log(`     用途: ${preview.description}`);
    console.log(`     布局: ${preview.layout}`);
    console.log(`     配色: ${preview.previewColors.join(' → ')}`);
    console.log('');
  });
}

/**
 * 推荐模板（根据内容描述）
 * @param {string} content - 内容描述
 * @returns {string} 模板ID
 */
function recommendTemplate(content) {
  const lowerContent = content.toLowerCase();

  if (lowerContent.includes('对比') || lowerContent.includes('vs') || lowerContent.includes('比较')) {
    return 'comparison';
  }
  if (lowerContent.includes('流程') || lowerContent.includes('步骤') || lowerContent.includes('操作')) {
    return 'knowledge';
  }
  if (lowerContent.includes('数据') || lowerContent.includes('统计') || lowerContent.includes('指标')) {
    return 'data';
  }
  if (lowerContent.includes('小红书') || lowerContent.includes('爆款') || lowerContent.includes('社交')) {
    return 'xiaohongshu';
  }
  if (lowerContent.includes('论文') || lowerContent.includes('研究') || lowerContent.includes('学术') || lowerContent.includes('科研')) {
    return 'scientific';
  }
  return 'knowledge';
}

module.exports = { showTemplatePreviews, recommendTemplate, TEMPLATE_PREVIEWS };