import React from "react";

interface TitleSectionProps {
  title: string;
  subtitle?: string;
  primaryColor: string;
  textColor: string;
  fontFamily?: string;
}

export const TitleSection: React.FC<TitleSectionProps> = ({
  title,
  subtitle,
  primaryColor,
  textColor,
  fontFamily = "Arial, sans-serif"
}) => {
  return (
    <div
      style={{
        padding: "80px 100px 40px",
        textAlign: "center"
      }}
    >
      <h1
        style={{
          fontSize: "72px",
          fontWeight: "bold",
          color: primaryColor,
          margin: 0,
          fontFamily,
          lineHeight: 1.2
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <h2
          style={{
            fontSize: "36px",
            color: textColor,
            marginTop: "20px",
            fontFamily,
            fontWeight: "normal"
          }}
        >
          {subtitle}
        </h2>
      )}
    </div>
  );
};