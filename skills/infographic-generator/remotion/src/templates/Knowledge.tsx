import React from "react";
import { InfographicConfig } from "../Infographic";
import { TitleSection } from "../components/TitleSection";
import { ContentSection } from "../components/ContentSection";
import { SummarySection } from "../components/SummarySection";
import { FONT_STACKS, createFontStyle } from "../styles/typography";

export const KnowledgeTemplate: React.FC<{ config: InfographicConfig }> = ({ config }) => {
  const { content, style, output_config } = config;

  // 检测是否为竖屏
  const isVertical = output_config?.orientation === 'vertical';

  // 智能布局选择：根据内容项数量自动选择最佳列数
  const itemCount = content.items?.length || 0;
  let gridColumns: string;
  if (isVertical) {
    gridColumns = "1fr";
  } else if (itemCount <= 2) {
    gridColumns = "repeat(2, 1fr)";
  } else if (itemCount <= 4) {
    gridColumns = "repeat(2, 1fr)";
  } else {
    gridColumns = "repeat(3, 1fr)";
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: style.gradient || style.background_color,
        fontFamily: style.font_family || FONT_STACKS.sans,
        padding: isVertical ? "0" : "0"
      }}
    >
      <TitleSection
        title={content.title}
        subtitle={content.subtitle}
        primaryColor={style.primary_color}
        textColor={style.text_color}
        fontFamily={style.font_family}
        gradient={style.gradient}
        decorativeElements={style.decorative_elements || []}
        isVertical={isVertical}
      />
      <ContentSection
        items={content.items}
        primaryColor={style.primary_color}
        secondaryColor={style.secondary_color}
        textColor={style.text_color}
        borderColor={style.border_color}
        cardStyle={style.card_style || "flat"}
        decorativeElements={style.decorative_elements || []}
        fontFamily={style.font_family}
        isVertical={isVertical}
      />
      <SummarySection
        summary={content.summary}
        accentColor={style.accent_color}
        textColor={style.text_color}
        borderColor={style.border_color}
        fontFamily={style.font_family}
        isVertical={isVertical}
      />
    </div>
  );
};