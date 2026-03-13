import React from "react";
import { AbsoluteFill } from "remotion";
import { KnowledgeTemplate } from "./templates/Knowledge";
import { XiaohongshuTemplate } from "./templates/Xiaohongshu";

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
  content: {
    title: string;
    subtitle?: string;
    items: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
    summary?: string;
  };
  output?: {
    width?: number;
    height?: number;
  };
}

export interface InfographicProps {
  config: InfographicConfig;
}

export const Infographic: React.FC<InfographicProps> = ({ config }) => {
  const width = config.output?.width || 1920;
  const height = config.output?.height || 1080;

  // 根据模板类型渲染不同的模板
  const renderTemplate = () => {
    switch (config.template) {
      case 'knowledge':
        return <KnowledgeTemplate config={config} />;
      case 'xiaohongshu':
        return <XiaohongshuTemplate config={config} />;
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