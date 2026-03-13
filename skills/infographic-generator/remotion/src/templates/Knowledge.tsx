import React from "react";
import { InfographicConfig } from "../Infographic";
import { TitleSection } from "../components/TitleSection";
import { ContentSection } from "../components/ContentSection";
import { SummarySection } from "../components/SummarySection";

export const KnowledgeTemplate: React.FC<{ config: InfographicConfig }> = ({ config }) => {
  const { content, style } = config;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <TitleSection
        title={content.title}
        subtitle={content.subtitle}
        primaryColor={style.primary_color}
        textColor={style.text_color}
        fontFamily={style.font_family}
      />
      <ContentSection
        items={content.items}
        primaryColor={style.primary_color}
        secondaryColor={style.secondary_color}
        textColor={style.text_color}
        fontFamily={style.font_family}
      />
      <SummarySection
        summary={content.summary}
        accentColor={style.accent_color}
        textColor={style.text_color}
        fontFamily={style.font_family}
      />
    </div>
  );
};