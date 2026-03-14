/**
 * 小红书信息图样式系统
 * 支持 3 维度配置：配色方案 × 卡片样式 × 图标风格
 */

/**
 * 维度 1：配色方案（Color Scheme）
 * 定义渐变背景、主色调、辅助色等
 */
const COLOR_SCHEMES = {
  // 粉紫配色（默认推荐）
  'pink-purple': {
    name: '粉紫梦幻',
    gradient_bg: 'linear-gradient(135deg, #FFE5EC 0%, #E3F2FD 50%, #F3E5F5 100%)',
    primary_gradient: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)',
    secondary_gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent_gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    primary_color: '#FF6B9D',
    secondary_color: '#667eea',
    accent_color: '#f093fb',
    text_color: '#333333',
    text_secondary: '#666666',
    white: '#FFFFFF'
  },

  // 蓝绿配色
  'blue-cyan': {
    name: '蓝绿清新',
    gradient_bg: 'linear-gradient(135deg, #E3F2FD 0%, #E0F7FA 50%, #E8F5E9 100%)',
    primary_gradient: 'linear-gradient(135deg, #2196F3 0%, #00BCD4 100%)',
    secondary_gradient: 'linear-gradient(135deg, #00ACC1 0%, #00838F 100%)',
    accent_gradient: 'linear-gradient(135deg, #26C6DA 0%, #0097A7 100%)',
    primary_color: '#2196F3',
    secondary_color: '#00ACC1',
    accent_color: '#26C6DA',
    text_color: '#333333',
    text_secondary: '#666666',
    white: '#FFFFFF'
  },

  // 橙黄配色
  'orange-yellow': {
    name: '橙黄活力',
    gradient_bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFFDE7 50%, #FFF8E1 100%)',
    primary_gradient: 'linear-gradient(135deg, #FF9800 0%, #FFC107 100%)',
    secondary_gradient: 'linear-gradient(135deg, #FFB74D 0%, #FFA726 100%)',
    accent_gradient: 'linear-gradient(135deg, #FFA000 0%, #FF8F00 100%)',
    primary_color: '#FF9800',
    secondary_color: '#FFB74D',
    accent_color: '#FFA000',
    text_color: '#333333',
    text_secondary: '#666666',
    white: '#FFFFFF'
  },

  // 绿色自然配色
  'green-nature': {
    name: '绿色自然',
    gradient_bg: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 50%, #FFFDE7 100%)',
    primary_gradient: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
    secondary_gradient: 'linear-gradient(135deg, #66BB6A 0%, #9CCC65 100%)',
    accent_gradient: 'linear-gradient(135deg, #43A047 0%, #7CB342 100%)',
    primary_color: '#4CAF50',
    secondary_color: '#66BB6A',
    accent_color: '#43A047',
    text_color: '#333333',
    text_secondary: '#666666',
    white: '#FFFFFF'
  },

  // 紫色优雅配色
  'purple-elegant': {
    name: '紫色优雅',
    gradient_bg: 'linear-gradient(135deg, #F3E5F5 0%, #EDE7F6 50%, #E8EAF6 100%)',
    primary_gradient: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)',
    secondary_gradient: 'linear-gradient(135deg, #AB47BC 0%, #7E57C2 100%)',
    accent_gradient: 'linear-gradient(135deg, #8E24AA 0%, #5E35B1 100%)',
    primary_color: '#9C27B0',
    secondary_color: '#AB47BC',
    accent_color: '#8E24AA',
    text_color: '#333333',
    text_secondary: '#666666',
    white: '#FFFFFF'
  }
};

/**
 * 维度 2：卡片样式（Card Style）
 * 定义圆角、阴影、内边距、背景等
 */
const CARD_STYLES = {
  // 优雅风格（默认推荐）
  'elegant': {
    name: '优雅风格',
    border_radius: '30px',
    shadow: '0 8px 24px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)',
    shadow_hover: '0 12px 32px rgba(0,0,0,0.15), 0 6px 16px rgba(0,0,0,0.1)',
    padding: '50px',
    background: 'rgba(255, 255, 255, 0.95)',
    border: 'none'
  },

  // 现代风格
  'modern': {
    name: '现代风格',
    border_radius: '20px',
    shadow: '0 12px 32px rgba(0,0,0,0.15), 0 6px 16px rgba(0,0,0,0.1)',
    shadow_hover: '0 16px 40px rgba(0,0,0,0.18), 0 8px 20px rgba(0,0,0,0.12)',
    padding: '40px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },

  // 简约风格
  'minimal': {
    name: '简约风格',
    border_radius: '15px',
    shadow: '0 4px 16px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.05)',
    shadow_hover: '0 6px 20px rgba(0,0,0,0.12), 0 3px 10px rgba(0,0,0,0.08)',
    padding: '35px',
    background: 'rgba(255, 255, 255, 0.98)',
    border: 'none'
  },

  // 玻璃态风格
  'glass': {
    name: '玻璃态风格',
    border_radius: '25px',
    shadow: '0 8px 24px rgba(0,0,0,0.1)',
    shadow_hover: '0 12px 32px rgba(0,0,0,0.15)',
    padding: '45px',
    background: 'rgba(255, 255, 255, 0.85)',
    backdrop_filter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.4)'
  }
};

/**
 * 维度 3：图标风格（Icon Style）
 * 定义图标容器大小、样式、阴影等
 */
const ICON_STYLES = {
  // 渐变圆形（默认推荐）
  'gradient-circle': {
    name: '渐变圆形',
    container_size: '60px',
    border_radius: '50%',
    background: 'use_primary_gradient', // 使用配色方案的主渐变
    shadow: '0 4px 12px rgba(0,0,0,0.15)',
    icon_size: '32px',
    icon_color: '#FFFFFF',
    border: 'none'
  },

  // 描边圆形
  'outline': {
    name: '描边圆形',
    container_size: '55px',
    border_radius: '50%',
    background: 'transparent',
    shadow: 'none',
    icon_size: '28px',
    icon_color: 'use_primary_color', // 使用配色方案的主色
    border: '3px solid use_primary_color'
  },

  // 纯色圆形
  'solid-bg': {
    name: '纯色圆形',
    container_size: '58px',
    border_radius: '50%',
    background: 'use_primary_color',
    shadow: '0 3px 10px rgba(0,0,0,0.2)',
    icon_size: '30px',
    icon_color: '#FFFFFF',
    border: 'none'
  },

  // 渐变方形
  'gradient-square': {
    name: '渐变方形',
    container_size: '55px',
    border_radius: '15px',
    background: 'use_primary_gradient',
    shadow: '0 4px 12px rgba(0,0,0,0.15)',
    icon_size: '28px',
    icon_color: '#FFFFFF',
    border: 'none'
  }
};

/**
 * 装饰元素配置
 */
const DECORATION_STYLES = {
  circles: [
    {
      class: 'decoration-circle-1',
      size: '300px',
      position: { top: '5%', right: '-5%' },
      background: 'use_primary_gradient',
      opacity: '0.08'
    },
    {
      class: 'decoration-circle-2',
      size: '200px',
      position: { bottom: '10%', left: '-3%' },
      background: 'use_secondary_gradient',
      opacity: '0.06'
    },
    {
      class: 'decoration-circle-3',
      size: '150px',
      position: { top: '40%', left: '5%' },
      background: 'use_accent_gradient',
      opacity: '0.05'
    }
  ]
};

/**
 * 合并配置，生成完整的样式配置
 * @param {string} colorScheme - 配色方案名称
 * @param {string} cardStyle - 卡片样式名称
 * @param {string} iconStyle - 图标风格名称
 * @returns {Object} 完整的样式配置对象
 */
function getXiaohongshuStyle(colorScheme = 'pink-purple', cardStyle = 'elegant', iconStyle = 'gradient-circle') {
  const colors = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES['pink-purple'];
  const cards = CARD_STYLES[cardStyle] || CARD_STYLES['elegant'];
  const icons = ICON_STYLES[iconStyle] || ICON_STYLES['gradient-circle'];

  return {
    colors,
    cards,
    icons,
    decorations: DECORATION_STYLES
  };
}

/**
 * 生成装饰元素的 CSS
 * @param {Object} colors - 配色方案对象
 * @returns {string} CSS 字符串
 */
function generateDecorationCSS(colors) {
  return DECORATION_STYLES.circles.map(circle => {
    const bg = circle.background.replace('use_primary_gradient', colors.primary_gradient)
                                .replace('use_secondary_gradient', colors.secondary_gradient)
                                .replace('use_accent_gradient', colors.accent_gradient);

    return `
    .${circle.class} {
      position: absolute;
      width: ${circle.size};
      height: ${circle.size};
      border-radius: 50%;
      background: ${bg};
      opacity: ${circle.opacity};
      top: ${circle.position.top || 'auto'};
      right: ${circle.position.right || 'auto'};
      bottom: ${circle.position.bottom || 'auto'};
      left: ${circle.position.left || 'auto'};
      pointer-events: none;
    }`;
  }).join('\n');
}

/**
 * 生成图标容器的 CSS
 * @param {Object} icons - 图标样式配置
 * @param {Object} colors - 配色方案对象
 * @returns {string} CSS 字符串
 */
function generateIconCSS(icons, colors) {
  let bg = icons.background;
  let iconColor = icons.icon_color;
  let border = icons.border;

  // 替换变量
  if (bg === 'use_primary_gradient') bg = colors.primary_gradient;
  if (bg === 'use_primary_color') bg = colors.primary_color;
  if (iconColor === 'use_primary_color') iconColor = colors.primary_color;
  if (border && border.includes('use_primary_color')) {
    border = border.replace('use_primary_color', colors.primary_color);
  }

  return `
  .icon-container {
    width: ${icons.container_size};
    height: ${icons.container_size};
    border-radius: ${icons.border_radius};
    background: ${bg};
    box-shadow: ${icons.shadow};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: ${border};
  }

  .icon-container .icon {
    font-size: ${icons.icon_size};
    color: ${iconColor};
  }`;
}

/**
 * 生成渐变文字的 CSS
 * @param {Object} colors - 配色方案对象
 * @returns {string} CSS 字符串
 */
function generateGradientTextCSS(colors) {
  return `
  .gradient-text {
    background: ${colors.primary_gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }`;
}

module.exports = {
  COLOR_SCHEMES,
  CARD_STYLES,
  ICON_STYLES,
  DECORATION_STYLES,
  getXiaohongshuStyle,
  generateDecorationCSS,
  generateIconCSS,
  generateGradientTextCSS
};