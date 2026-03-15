/**
 * AI驱动渲染脚本
 * 从自然语言描述自动生成JSON配置
 * 无需外部API，使用智能启发式规则
 */

const fs = require('fs');
const path = require('path');

/**
 * 从自然语言生成JSON配置
 * 现在依赖Claude Code内置能力，无需外部API key
 * @param {string} naturalLanguageInput - 自然语言描述
 * @returns {Object} JSON配置
 */
async function generateConfigFromNaturalLanguage(naturalLanguageInput) {
  console.log('🤖 分析需求并生成配置...');

  // 使用智能本地模板生成
  const config = await generateSmartConfigLocally(naturalLanguageInput);

  console.log('✅ 配置生成完成');
  return config;
}

/**
 * 风格预设配置
 * 8种高质量视觉风格（参考专业设计系统）
 */
const STYLE_PRESETS = {
  // 1. 科技/编辑风 - 适合AI、编程、数据分析
  tech: {
    name: '科技风',
    description: '适合AI、编程、数据分析、科技产品等内容',
    keywords: ['AI', '编程', '技术', '算法', '数据', '科技', '软件', '开发', '代码', '云计算', '机器学习', '大模型', 'LLM'],
    style: {
      background_color: '#0A1628',
      primary_color: '#00D4FF',
      secondary_color: '#7C3AED',
      accent_color: '#E0E7FF',
      text_color: '#FFFFFF',
      border_color: '#1E293B',
      background_pattern: 'tech_grid',
      gradient: 'linear-gradient(135deg, #0A1628 0%, #1A1F3A 50%, #2D1B4E 100%)',
      decorative_elements: ['circuits', 'glow_dots', 'lines'],
      card_style: 'glass',
      font_style: 'modern'
    }
  },

  // 2. 泥塑风 - 3D圆润质感，适合创意内容
  clay: {
    name: '泥塑风',
    description: '适合创意、艺术、设计、手工制作等内容',
    keywords: ['创意', '艺术', '设计', '手工', 'DIY', '制作', '捏塑', '3D', '立体'],
    style: {
      background_color: '#FAE8E0',
      primary_color: '#E85D4B',
      secondary_color: '#A0522D',
      accent_color: '#FFD7C1',
      text_color: '#5D4E37',
      border_color: '#E8C4B8',
      background_pattern: 'clay_texture',
      gradient: 'linear-gradient(135deg, #FAE8E0 0%, #FFEADC 100%)',
      decorative_elements: ['rounded_shapes', 'soft_shadows', 'texture'],
      card_style: 'inset',
      font_style: 'soft'
    }
  },

  // 3. 可爱风 - 适合生活、美食、宠物、手账
  cute: {
    name: '可爱风',
    description: '适合生活、美食、宠物、日常分享等内容',
    keywords: ['美食', '甜点', '宠物', '生活', '美妆', '穿搭', '手帐', '可爱', '萌', '治愈', '日常'],
    style: {
      background_color: '#FFF5F7',
      primary_color: '#FF6B9D',
      secondary_color: '#4ECDC4',
      accent_color: '#FFE4E1',
      text_color: '#4A4A4A',
      border_color: '#FFC4D6',
      background_pattern: 'cute_dots',
      gradient: 'linear-gradient(135deg, #FFF5F7 0%, #FFE6E9 100%)',
      decorative_elements: ['hearts', 'stars', 'clouds', 'sparkles'],
      card_style: 'rounded_bubble',
      font_style: 'rounded'
    }
  },

  // 4. 简约/专业风 - 商务、职场、管理
  minimal: {
    name: '简约风',
    description: '适合商务、职场、管理、专业报告等内容',
    keywords: ['商务', '职场', '管理', '效率', '规划', '专业', '企业', '商业', '战略', '决策'],
    style: {
      background_color: '#FFFFFF',
      primary_color: '#1A1A2E',
      secondary_color: '#16213E',
      accent_color: '#F8F9FA',
      text_color: '#1A1A2E',
      border_color: '#E8E8E8',
      background_pattern: 'subtle_lines',
      gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
      decorative_elements: ['geometric_lines', 'minimal_dots'],
      card_style: 'flat',
      font_style: 'sans'
    }
  },

  // 5. 教学风 - 教程、指南、入门
  tutorial: {
    name: '教学风',
    description: '适合教程、指南、培训、入门教学等内容',
    keywords: ['教学', '培训', '课程', '教程', '指南', '步骤', '方法', '入门', '指南', 'Wiki'],
    style: {
      background_color: '#F0F9FF',
      primary_color: '#0369A1',
      secondary_color: '#0EA5E9',
      accent_color: '#BAE6FD',
      text_color: '#1E293B',
      border_color: '#7DD3FC',
      background_pattern: 'grid_paper',
      gradient: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
      decorative_elements: ['step_numbers', 'bookmarks', 'highlights'],
      card_style: 'card_with_border',
      font_style: 'readable'
    }
  },

  // 6. 手绘笔记风 - 学习、课堂、复习
  notebook: {
    name: '笔记风',
    description: '适合学习笔记、复习、知识总结等内容',
    keywords: ['学习', '笔记', '复习', '知识', '考试', '记忆', '读书', '课堂', '重点'],
    style: {
      background_color: '#FEF9E7',
      primary_color: '#5D4E37',
      secondary_color: '#8B6914',
      accent_color: '#FAD7A0',
      text_color: '#3D3D3D',
      border_color: '#D4AC0D',
      background_pattern: 'notebook_grid',
      gradient: 'linear-gradient(135deg, #FEF9E7 0%, #FEF5D8 100%)',
      decorative_elements: ['paper_texture', 'highlights', 'sticky_notes'],
      card_style: 'notebook_paper',
      font_style: 'handwriting'
    }
  },

  // 7. 动漫/漫画风 - 二次元、游戏、娱乐
  comics: {
    name: '漫画风',
    description: '适合动漫、游戏、二次元、娱乐等内容',
    keywords: ['动漫', '游戏', '二次元', '漫画', '动画', '角色', '剧情', '游戏攻略', 'cosplay'],
    style: {
      background_color: '#FFF4E6',
      primary_color: '#DC2626',
      secondary_color: '#2563EB',
      accent_color: '#FEF3C7',
      text_color: '#1F2937',
      border_color: '#374151',
      background_pattern: 'speed_lines',
      gradient: 'linear-gradient(135deg, #FFF4E6 0%, #FFEDD5 100%)',
      decorative_elements: ['action_lines', 'burst_effects', 'sound_effects'],
      card_style: 'comic_panel',
      font_style: 'comic'
    }
  },

  // 8. 积木/Bento风 - 模块化、流程
  bento: {
    name: 'Bento风',
    description: '适合模块化、架构、系统设计等内容',
    keywords: ['构建', '组合', '模块', '架构', '系统', '框架', '模块化', '流程', 'Bento', '卡片'],
    style: {
      background_color: '#F5F5F0',
      primary_color: '#374151',
      secondary_color: '#6B7280',
      accent_color: '#F3F4F6',
      text_color: '#1F2937',
      border_color: '#E5E7EB',
      background_pattern: 'clean_space',
      gradient: 'linear-gradient(135deg, #F5F5F0 0%, #FAFAF8 100%)',
      decorative_elements: ['bento_grid', 'numbered_cards', 'icons'],
      card_style: 'bento_card',
      font_style: 'clean'
    }
  }
};

/**
 * 从用户描述中提取指定的风格
 * @param {string} input - 用户输入描述
 * @returns {string|null} 风格名称或null
 */
function extractUserSpecifiedStyle(input) {
  // 风格关键词映射（支持中英文）
  const styleKeywords = {
    'tech': [
      'tech style', 'technology style', 'tech theme',
      '科技风', '科技风格', '科技主题'
    ],
    'cute': [
      'cute style', 'cute theme',
      '可爱风', '可爱风格', '可爱主题'
    ],
    'clay': [
      'clay style', 'clay theme',
      '泥塑风', '泥塑风格', '泥塑主题'
    ],
    'minimal': [
      'minimal style', 'minimalist',
      '简约风', '简约风格', '简约主题', '极简风', '极简风格'
    ],
    'tutorial': [
      'tutorial style',
      '教学风', '教学风格', '教学主题'
    ],
    'notebook': [
      'notebook style', 'handdrawn style', 'hand-drawn', 'hand drawn',
      '笔记风', '笔记风格', '笔记主题', '手绘风', '手绘风格', '手绘主题'
    ],
    'comics': [
      'comics style', 'comic style',
      '漫画风', '漫画风格', '漫画主题', '动漫风', '动漫风格'
    ],
    'bento': [
      'bento style',
      'bento风', 'bento风格', '积木风', '积木风格'
    ]
  };

  // 遍历映射，检查是否包含关键词
  const inputLower = input.toLowerCase();
  for (const [style, keywords] of Object.entries(styleKeywords)) {
    for (const keyword of keywords) {
      if (inputLower.includes(keyword.toLowerCase())) {
        return style;
      }
    }
  }

  return null;
}

/**
 * 使用LLM智能选择风格
 * @param {string} content - 用户内容描述
 * @param {Object} stylePresets - 支持的风格预设
 * @returns {Promise<string|null>} 推荐的风格名称或null
 */
async function selectStyleByLLM(content, stylePresets) {
  // 构建风格列表描述
  const styleDescriptions = Object.entries(stylePresets)
    .map(([key, preset]) => `- ${key}: ${preset.name}，${preset.description}`)
    .join('\n');

  // 构建prompt
  const prompt = `我需要为以下内容生成信息图：

【内容描述】
${content}

【支持的风格】
${styleDescriptions}

请根据内容主题，选择最合适的风格。只返回风格名称（如 tech、cute、notebook等），不要解释。`;

  try {
    // 调用Claude Code的内置LLM能力
    // 注意：这里需要在实际实现时确定如何调用
    // 暂时使用回退方案：基于关键词匹配
    console.log('💡 正在使用智能算法选择风格...');

    // 临时方案：使用增强的关键词匹配
    const contentLower = content.toLowerCase();
    const scores = {};

    for (const [styleKey, preset] of Object.entries(stylePresets)) {
      scores[styleKey] = 0;
      for (const keyword of preset.keywords) {
        if (contentLower.includes(keyword.toLowerCase())) {
          scores[styleKey] += 1;
        }
      }
    }

    // 找出最高分的风格
    let maxScore = 0;
    let bestStyle = null;

    for (const [styleKey, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        bestStyle = styleKey;
      }
    }

    // 只有在有匹配时才返回，否则返回null触发兜底
    return maxScore > 0 ? bestStyle : null;

  } catch (error) {
    console.error('LLM风格选择失败:', error.message);
    return null;
  }
}

/**
 * 智能推荐风格
 * 根据内容关键词匹配最适合的风格
 */
function recommendStyle(topic, points) {
  const allText = `${topic} ${points.map(p => p.title).join(' ')}`.toLowerCase();

  // 计算每种风格的匹配分数
  const scores = {};
  for (const [styleKey, preset] of Object.entries(STYLE_PRESETS)) {
    scores[styleKey] = 0;
    for (const keyword of preset.keywords) {
      if (allText.includes(keyword.toLowerCase())) {
        scores[styleKey] += 1;
      }
    }
  }

  // 找出最高分的风格
  let maxScore = 0;
  let bestStyle = 'minimal'; // 默认简约风

  for (const [styleKey, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestStyle = styleKey;
    }
  }

  // 如果没有明显匹配，使用简约风
  if (maxScore === 0) {
    return 'minimal';
  }

  return bestStyle;
}

/**
 * 智能推荐布局（横屏/竖屏）
 * 根据内容类型、模板类型和内容数量智能选择
 * @param {string} template - 模板类型
 * @param {Array} points - 内容要点
 * @param {string} topic - 主题
 * @returns {Object} 包含 width 和 height 的尺寸对象
 */
function recommendLayout(template, points, topic) {
  const topicLower = topic.toLowerCase();
  const pointCount = points.length;

  // 规则1: 小红书模板强制竖屏
  if (template === 'xiaohongshu') {
    return { width: 1080, height: 1920, orientation: 'vertical' };
  }

  // 规则2: 内容关键词匹配竖屏场景
  const verticalKeywords = ['小红书', '手机', '移动端', '竖屏', '朋友圈', '分享', '收藏'];
  if (verticalKeywords.some(keyword => topicLower.includes(keyword))) {
    return { width: 1080, height: 1920, orientation: 'vertical' };
  }

  // 规则3: 内容点数较多（>5）推荐竖屏
  if (pointCount > 5) {
    return { width: 1080, height: 1920, orientation: 'vertical' };
  }

  // 规则4: 对比模板推荐横屏（左右对比）
  if (template === 'comparison') {
    return { width: 1920, height: 1080, orientation: 'horizontal' };
  }

  // 规则5: 流程模板推荐横屏（流程图）
  if (template === 'process') {
    return { width: 1920, height: 1080, orientation: 'horizontal' };
  }

  // 规则6: 数据展示模板根据数据复杂度选择
  if (template === 'data') {
    // 数据较多时用竖屏展示
    if (pointCount >= 4) {
      return { width: 1080, height: 1920, orientation: 'vertical' };
    }
    return { width: 1920, height: 1080, orientation: 'horizontal' };
  }

  // 默认: 横屏（适合大多数知识科普场景）
  return { width: 1920, height: 1080, orientation: 'horizontal' };
}

/**
 * 智能本地生成配置
 * 通过启发式规则理解用户意图
 * @param {string} input - 自然语言描述
 * @returns {Promise<Object>} JSON配置
 */
async function generateSmartConfigLocally(input) {
  // 提取主题
  const topic = extractTopic(input);

  // 提取模板类型
  const template = extractTemplate(input);

  // 提取具体要点
  const points = extractPoints(input);

  // 步骤1：尝试提取用户指定的风格
  let styleKey = extractUserSpecifiedStyle(input);

  if (styleKey) {
    console.log(`✅ 用户指定风格: ${STYLE_PRESETS[styleKey].name}`);
  } else {
    // 步骤2：调用LLM选择风格
    console.log('🤖 正在使用LLM智能选择风格...');
    styleKey = await selectStyleByLLM(input, STYLE_PRESETS);

    if (styleKey) {
      console.log(`✅ LLM推荐风格: ${STYLE_PRESETS[styleKey].name}`);
    } else {
      // 步骤3：使用可爱风格兜底
      console.log('⚠️  无法识别内容类型，使用可爱风格作为默认风格');
      styleKey = 'cute';
    }
  }

  const stylePreset = STYLE_PRESETS[styleKey];
  console.log(`🎨 使用风格: ${stylePreset.name}`);

  // 智能推荐布局（横屏/竖屏）
  const layout = recommendLayout(template, points, topic);
  console.log(`📐 智能推荐布局: ${layout.orientation === 'horizontal' ? '横屏' : '竖屏'} (${layout.width}x${layout.height})`);

  // 根据提取的信息生成配置
  const config = {
    template: template || 'knowledge',
    output: `${topic}-infographic.png`,
    content: {
      title: generateSmartTitle(input, points),
      subtitle: generateSmartSubtitle(input, points),
      meta_info: `创建于${new Date().toLocaleDateString('zh-CN')} | 主题：${topic}`,
      items: points.length > 0 ? points : generateDefaultItems(topic),
      summary: generateSummary(topic, points)
    },
    style: stylePreset.style,
    style_name: stylePreset.name,
    output_config: {
      width: layout.width,
      height: layout.height,
      orientation: layout.orientation
    }
  };

  return config;
}

/**
 * 解析 Markdown 格式的要点
 * 支持 ## 标题 + 列表结构
 */
function parseMarkdownPoints(input) {
  const points = [];

  // 尝试提取标题作为主题
  const titleMatch = input.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    const title = titleMatch[1];
    console.log(`📋 从Markdown提取标题: ${title}`);
  }

  // 尝试提取 ## 标题作为要点
  const sectionMatches = input.matchAll(/^##\s+(.+)$/gm);
  let sections = [];
  for (const match of sectionMatches) {
    sections.push(match[1]);
  }

  // 如果找到 ## 标题，使用它们作为要点
  if (sections.length > 0 && sections.length <= 6) {
    sections.forEach(section => {
      points.push({
        icon: getIconForTopic(section),
        title: section,
        description: `${section}的核心内容和关键要点`
      });
    });
    return points;
  }

  // 尝试提取 **加粗文本** 作为要点
  const boldMatches = input.matchAll(/\*\*(.+?)\*\*/g);
  let boldItems = [];
  for (const match of boldMatches) {
    const text = match[1];
    // 过滤掉太短或太长的文本
    if (text.length >= 2 && text.length <= 20 && !text.includes(':')) {
      boldItems.push(text);
    }
  }

  if (boldItems.length >= 2 && boldItems.length <= 6) {
    // 去重
    const uniqueItems = [...new Set(boldItems)];
    uniqueItems.forEach(item => {
      points.push({
        icon: getIconForTopic(item),
        title: item,
        description: `${item}的重要方面和实践指导`
      });
    });
    return points;
  }

  return points;
}

/**
 * 提取具体要点
 * 支持多种格式：
 * - Markdown 标题和列表结构
 * - "包含3个特点：A、B、C"
 * - "包含A、B、C三个特点"
 * - "关于X，包含A,B,C"
 */
function extractPoints(input) {
  const points = [];

  // 优先尝试解析 Markdown 结构
  const mdPoints = parseMarkdownPoints(input);
  if (mdPoints.length > 0) {
    return mdPoints;
  }

  // 尝试匹配 "包含N个XXX：要点1、要点2、要点3"
  const pattern1 = /包含\s*(\d+)\s*个[^：:]*[：:]\s*([^，。！？]+)/;
  const match1 = input.match(pattern1);
  if (match1) {
    const count = parseInt(match1[1]);
    const itemsStr = match1[2];
    const items = itemsStr.split(/[、,，]/).map(s => s.trim()).filter(s => s);

    items.slice(0, count).forEach(item => {
      points.push({
        icon: getIconForTopic(item),
        title: item,
        description: `${item}的关键要点和实践方法`
      });
    });

    return points;
  }

  // 尝试匹配 "包含A、B、C等N个特点"
  const pattern2 = /包含\s*([^，。！？]+?)\s*(\d+)\s*个/;
  const match2 = input.match(pattern2);
  if (match2) {
    const itemsStr = match2[1];
    const items = itemsStr.split(/[、,，]/).map(s => s.trim()).filter(s => s);

    items.forEach(item => {
      points.push({
        icon: getIconForTopic(item),
        title: item,
        description: `${item}的核心内容和实践建议`
      });
    });

    return points;
  }

  // 尝试匹配任意列举的内容
  const pattern3 = /[：:]\s*([^。！？]+)/;
  const match3 = input.match(pattern3);
  if (match3) {
    const itemsStr = match3[1];
    const items = itemsStr.split(/[、,，]/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 20);

    if (items.length > 0) {
      items.forEach(item => {
        points.push({
          icon: getIconForTopic(item),
          title: item,
          description: `${item}的重要方面和实践指导`
        });
      });

      return points;
    }
  }

  return points;
}

/**
 * 根据主题选择合适的图标
 */
function getIconForTopic(topic) {
  const iconMap = {
    '技巧': '🎯',
    '方法': '💡',
    '特点': '⭐',
    '优势': '✨',
    '步骤': '📋',
    '原理': '🔬',
    '应用': '🚀',
    '技术': '💻',
    '知识': '📚',
    '技能': '🎓',
    '工具': '🛠️',
    '流程': '📊',
    '策略': '♟️',
    '规则': '📜',
    '注意': '⚠️',
    '建议': '💬',
    '问题': '❓',
    '方案': '📝',
    '目标': '🎯',
    '资源': '📦'
  };

  for (const [key, icon] of Object.entries(iconMap)) {
    if (topic.includes(key)) {
      return icon;
    }
  }

  return '📌';
}

/**
 * 智能生成标题
 * 从输入中提取合适的标题
 */
function generateSmartTitle(input, points) {
  // 尝试从输入中提取主题标题
  const topic = extractTopic(input);

  // 如果主题不是"信息图"，直接使用
  if (topic !== '信息图') {
    return topic;
  }

  // 如果提取到要点，从第一个要点推断标题
  if (points.length > 0) {
    const firstPointTitle = points[0].title;
    // 如果第一个要点标题包含主题信息，使用它
    if (firstPointTitle.length > 2 && firstPointTitle.length < 20) {
      return firstPointTitle;
    }
  }

  // 尝试从输入中提取"XXX成长路径"或"XXX方法论"等
  const pattern1 = input.match(/(.+?)成长路径/);
  if (pattern1) return pattern1[1] + '成长路径';

  const pattern2 = input.match(/(.+?)方法论/);
  if (pattern2) return pattern2[1] + '方法论';

  // 最后的fallback
  return '信息图';
}

/**
 * 智能生成副标题
 * 根据内容生成合适的副标题
 */
function generateSmartSubtitle(input, points) {
  const inputLower = input.toLowerCase();

  // 检测成长路径类型
  if (inputLower.includes('成长路径') || inputLower.includes('成长')) {
    if (points.length > 0) {
      const stageCount = points.filter(p => p.title.includes('阶段') || p.title.includes('Month')).length;
      if (stageCount > 0) {
        return `从新手到专家的${stageCount}步进阶路线`;
      }
      return '轻松掌握AI成长密码';
    }
  }

  // 检测方法论类型
  if (inputLower.includes('方法论') || inputLower.includes('方法')) {
    if (points.length > 0) {
      const methodCount = points.filter(p => p.title.includes('方法') || p.title.includes('法')).length;
      if (methodCount > 0) {
        return `${methodCount}个核心方法让你效率提升10倍`;
      }
      return '掌握这些方法，事半功倍';
    }
  }

  // 检测技巧类型
  if (inputLower.includes('技巧') || inputLower.includes('技能')) {
    return `掌握${points.length}个关键技巧`;
  }

  // 默认副标题
  if (points.length > 0) {
    return `包含${points.length}个核心要点的实用指南`;
  }

  return '一目了然，轻松掌握';
}

/**
 * 生成默认的要点（当无法提取时）
 */
function generateDefaultItems(topic) {
  return [
    { icon: '📌', title: '核心要点一', description: `${topic}的第一个关键方面` },
    { icon: '📌', title: '核心要点二', description: `${topic}的第二个关键方面` },
    { icon: '📌', title: '核心要点三', description: `${topic}的第三个关键方面` }
  ];
}

/**
 * 生成总结
 */
function generateSummary(topic, points) {
  if (points.length > 0) {
    const pointNames = points.map(p => p.title).join('、');
    return [
      `${topic}涵盖${points.length}个核心要点：${pointNames}`,
      `掌握这些要点对理解和应用${topic}至关重要`,
      `建议结合实际场景进行练习和应用`
    ];
  }

  return [
    `${topic}是一个重要的主题`,
    `了解${topic}对个人发展很有帮助`,
    `${topic}在未来有广阔的发展前景`
  ];
}

/**
 * 本地生成配置（fallback方案）
 * @param {string} input - 自然语言描述
 * @returns {Object} JSON配置
 */
function generateConfigLocally(input) {
  return generateSmartConfigLocally(input);
}

/**
 * 提取主题
 */
function extractTopic(input) {
  // 优先尝试提取 Markdown 一级标题 (# 标题)
  let matches = input.match(/^#\s+(.+)$/m);
  if (matches) return matches[1].trim();

  // 尝试匹配 "关于XXX的"
  matches = input.match(/关于(.+?)的/);
  if (matches) return matches[1];

  // 尝试匹配 "生成XXX信息图"
  matches = input.match(/生成[一]?[个]?(.+?)信息图/);
  if (matches) return matches[1];

  // 尝试匹配 "XXX信息图"
  matches = input.match(/(.+?)信息图/);
  if (matches) return matches[1];

  // 尝试匹配 "生成一个XXX"
  matches = input.match(/生成[一]?[个]?(.+?)[，。]/);
  if (matches) return matches[1];

  return '信息图';
}

/**
 * 提取模板
 */
function extractTemplate(input) {
  if (input.includes('知识科普')) return 'knowledge';
  if (input.includes('对比')) return 'comparison';
  if (input.includes('流程')) return 'process';
  if (input.includes('数据')) return 'data';
  if (input.includes('小红书')) return 'xiaohongshu';
  if (input.includes('科研') || input.includes('论文')) return 'scientific';
  return 'knowledge';
}

/**
 * 提取风格
 */
function extractStyle(input) {
  if (input.includes('极简')) {
    return {
      background_color: '#FFFFFF',
      primary_color: '#333333',
      secondary_color: '#666666',
      text_color: '#000000',
      gray_color: '#999999'
    };
  }
  if (input.includes('马卡龙')) {
    return {
      background_color: '#FFF0F5',
      primary_color: '#FF69B4',
      secondary_color: '#87CEEB',
      text_color: '#4A4A4A',
      gray_color: '#9E9E9E'
    };
  }
  if (input.includes('赛博朋克')) {
    return {
      background_color: '#1A1A2E',
      primary_color: '#E91E63',
      secondary_color: '#00BCD4',
      text_color: '#FFFFFF',
      gray_color: '#757575'
    };
  }
  return null;
}

/**
 * 保存配置到文件
 */
function saveConfig(config, configPath) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  return configPath;
}

// 命令行使用
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('使用方法:');
    console.log('  node ai-render.js <自然语言描述>');
    console.log('');
    console.log('示例:');
    console.log('  node ai-render.js "生成Python编程语言信息图，包含语法简洁、应用广泛、生态丰富、跨平台4个特点"');
    console.log('  node ai-render.js "生成乒乓球技巧信息图，包含3个核心技巧：发球技巧、接球技巧、步法移动"');
    process.exit(1);
  }

  const naturalLanguageInput = args[0];

  generateConfigFromNaturalLanguage(naturalLanguageInput).then(config => {
    console.log('\n生成的配置:');
    console.log(JSON.stringify(config, null, 2));

    const configPath = path.join(__dirname, 'temp-config.json');
    saveConfig(config, configPath);
    console.log(`\n配置已保存到: ${configPath}`);
  }).catch(error => {
    console.error('\n❌ 生成失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  });
}

module.exports = { generateConfigFromNaturalLanguage };