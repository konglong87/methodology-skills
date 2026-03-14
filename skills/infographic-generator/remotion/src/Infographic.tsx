import React from "react";
import { AbsoluteFill } from "remotion";
import { KnowledgeTemplate } from "./templates/Knowledge";
import { XiaohongshuTemplate } from "./templates/Xiaohongshu";
import { ComparisonTemplate } from "./templates/Comparison";

// 定义类型
export interface InfographicConfig {
  template: string;
  style: {
    background_color: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    text_color: string;
    font_family?: string;
  };
  content: any; // 支持不同模板的内容结构
  output_config?: {
    width?: number;
    height?: number;
    orientation?: 'horizontal' | 'vertical';
  };
}

export interface InfographicProps {
  config: InfographicConfig;
}

export const Infographic: React.FC<InfographicProps> = ({ config }) => {
  const width = config.output_config?.width || 1920;
  const height = config.output_config?.height || 1080;

  // 根据模板类型渲染不同的模板
  const renderTemplate = () => {
    switch (config.template) {
      case 'knowledge':
        return <KnowledgeTemplate config={config} />;
      case 'xiaohongshu':
        return <XiaohongshuTemplate config={config} />;
      case 'comparison':
        return <ComparisonTemplate config={config} />;
      default:
        return <KnowledgeTemplate config={config} />; // 默认使用knowledge模板
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor: config.style.background_color }}>
      {renderTemplate()}
    </AbsoluteFill>
  );
};