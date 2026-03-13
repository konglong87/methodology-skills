import React from "react";

interface SummarySectionProps {
  summary?: string | string[];
  accentColor: string;
  textColor: string;
  borderColor?: string;
  fontFamily?: string;
  isVertical?: boolean;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  summary,
  accentColor,
  textColor,
  borderColor = "#E8E8E8",
  fontFamily = "Arial, sans-serif",
  isVertical = false
}) => {
  if (!summary) return null;

  // Support both string and array formats
  const summaryPoints = Array.isArray(summary) ? summary : [summary];

  return (
    <div
      style={{
        padding: isVertical ? "20px 60px 40px" : "40px 100px 80px",
        textAlign: "center"
      }}
    >
      <div
        style={{
          backgroundColor: accentColor,
          padding: isVertical ? "25px 40px" : "40px 60px",
          borderRadius: "20px",
          maxWidth: isVertical ? "900px" : "1600px",
          margin: "0 auto",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
          border: `2px solid ${borderColor}`
        }}
      >
        {summaryPoints.map((point, index) => (
          <p
            key={index}
            style={{
              fontSize: isVertical ? "24px" : "32px",
              color: textColor,
              margin: index < summaryPoints.length - 1 ? "0 0 12px 0" : 0,
              fontFamily,
              lineHeight: 1.6,
              fontWeight: index === 0 ? "bold" : "normal"
            }}
          >
            {point}
          </p>
        ))}
      </div>
    </div>
  );
};