import React from "react";

interface ContentItem {
  title: string;
  description: string;
  icon?: string;
}

interface ContentSectionProps {
  items: ContentItem[];
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  fontFamily?: string;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  items,
  primaryColor,
  secondaryColor,
  textColor,
  fontFamily = "Arial, sans-serif"
}) => {
  return (
    <div
      style={{
        padding: "40px 100px",
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "60px"
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "40px",
            borderRadius: "20px",
            borderLeft: `8px solid ${primaryColor}`
          }}
        >
          <h3
            style={{
              fontSize: "42px",
              fontWeight: "bold",
              color: primaryColor,
              margin: "0 0 20px 0",
              fontFamily
            }}
          >
            {index + 1}. {item.title}
          </h3>
          <p
            style={{
              fontSize: "28px",
              color: textColor,
              margin: 0,
              fontFamily,
              lineHeight: 1.5
            }}
          >
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
};