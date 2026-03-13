import React from "react";

interface SummarySectionProps {
  summary?: string;
  accentColor: string;
  textColor: string;
  fontFamily?: string;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  summary,
  accentColor,
  textColor,
  fontFamily = "Arial, sans-serif"
}) => {
  if (!summary) return null;

  return (
    <div
      style={{
        padding: "40px 100px 80px",
        textAlign: "center"
      }}
    >
      <div
        style={{
          backgroundColor: accentColor,
          padding: "40px 60px",
          borderRadius: "20px",
          maxWidth: "1600px",
          margin: "0 auto"
        }}
      >
        <p
          style={{
            fontSize: "32px",
            color: textColor,
            margin: 0,
            fontFamily,
            lineHeight: 1.6
          }}
        >
          {summary}
        </p>
      </div>
    </div>
  );
};