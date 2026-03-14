/**
 * JSON配置生成器
 * 用于生成结构化的信息图配置
 */

/**
 * 生成对比矩阵配置
 */
function generateComparisonMatrixConfig(data) {
  const config = {
    template: "comparison",
    output: `${data.title}-comparison-matrix.png`,
    content: {
      title: data.title,
      subtitle: data.subtitle || `${data.title}对比分析`,
      meta_info: `创建于${new Date().toLocaleDateString('zh-CN')} | ${data.meta || '对比分析'}`,
      comparison_data: {
        headers: data.headers,
        rows: data.rows.map(row => ({
          dimension: row.dimension,
          values: row.values
        }))
      },
      summary: data.summary || [
        `${data.title}涵盖${data.rows.length}个对比维度`,
        "选择合适的方案需要根据具体场景和需求",
        "建议结合实际情况进行综合评估"
      ]
    },
    style: data.style || {
      background_color: "#0A1628",
      primary_color: "#00D4FF",
      secondary_color: "#7C3AED",
      accent_color: "#E0E7FF",
      text_color: "#FFFFFF",
      border_color: "#1E293B",
      background_pattern: "tech_grid",
      gradient: "linear-gradient(135deg, #0A1628 0%, #1A1F3A 50%, #2D1B4E 100%)",
      decorative_elements: ["circuits", "glow_dots", "lines"],
      card_style: "glass",
      font_style: "modern"
    },
    style_name: data.styleName || "科技风",
    output_config: {
      width: data.width || 1920,
      height: data.height || 1080,
      orientation: data.orientation || "horizontal"
    }
  };

  return config;
}

/**
 * 生成时间线配置
 */
function generateTimelineConfig(data) {
  const config = {
    template: "process",
    output: `${data.title}-timeline.png`,
    content: {
      title: data.title,
      subtitle: data.subtitle || `${data.title}发展历程`,
      meta_info: `创建于${new Date().toLocaleDateString('zh-CN')} | ${data.meta || '时间线'}`,
      timeline_data: {
        events: data.events.map((event, index) => ({
          date: event.date,
          title: event.title,
          description: event.description,
          highlight: event.highlight || false,
          badge: event.badge
        }))
      },
      summary: data.summary || [
        `${data.title}包含${data.events.length}个关键事件`,
        "时间线展示了重要的发展节点",
        "了解历史有助于把握未来趋势"
      ]
    },
    style: data.style || {
      background_color: "#0A1628",
      primary_color: "#00D4FF",
      secondary_color: "#7C3AED",
      accent_color: "#E0E7FF",
      text_color: "#FFFFFF",
      border_color: "#1E293B",
      background_pattern: "tech_grid",
      gradient: "linear-gradient(135deg, #0A1628 0%, #1A1F3A 50%, #2D1B4E 100%)",
      decorative_elements: ["circuits", "glow_dots", "lines"],
      card_style: "glass",
      font_style: "modern"
    },
    style_name: data.styleName || "科技风",
    output_config: {
      width: data.width || 1920,
      height: data.height || 1080,
      orientation: data.orientation || "horizontal"
    }
  };

  return config;
}

/**
 * 生成知识科普配置
 */
function generateKnowledgeConfig(data) {
  const config = {
    template: "knowledge",
    output: `${data.title}-knowledge.png`,
    content: {
      title: data.title,
      subtitle: data.subtitle || `${data.title}核心要点`,
      meta_info: `创建于${new Date().toLocaleDateString('zh-CN')} | ${data.meta || '知识科普'}`,
      items: data.items.map(item => ({
        icon: item.icon || "📌",
        title: item.title,
        description: item.description
      })),
      summary: data.summary || [
        `${data.title}涵盖${data.items.length}个核心要点`,
        "掌握这些要点对理解主题至关重要",
        "建议结合实际场景进行应用"
      ]
    },
    style: data.style || {
      background_color: "#0A1628",
      primary_color: "#00D4FF",
      secondary_color: "#7C3AED",
      accent_color: "#E0E7FF",
      text_color: "#FFFFFF",
      border_color: "#1E293B",
      background_pattern: "tech_grid",
      gradient: "linear-gradient(135deg, #0A1628 0%, #1A1F3A 50%, #2D1B4E 100%)",
      decorative_elements: ["circuits", "glow_dots", "lines"],
      card_style: "glass",
      font_style: "modern"
    },
    style_name: data.styleName || "科技风",
    output_config: {
      width: data.width || 1920,
      height: data.height || 1080,
      orientation: data.orientation || "horizontal"
    }
  };

  return config;
}

module.exports = {
  generateComparisonMatrixConfig,
  generateTimelineConfig,
  generateKnowledgeConfig
};