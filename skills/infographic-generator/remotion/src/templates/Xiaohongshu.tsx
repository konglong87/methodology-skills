import React from "react";
import { InfographicConfig } from "../Infographic";

export const XiaohongshuTemplate: React.FC<{ config: InfographicConfig }> = ({ config }) => {
  const { content, style } = config;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <h1
        style={{
          fontSize: "96px",
          fontWeight: "bold",
          color: style.primary_color,
          textAlign: "center",
          margin: "0 0 60px 0",
          fontFamily: style.font_family || "Arial, sans-serif"
        }}
      >
        {content.title}
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          padding: "40px"
        }}
      >
        {content.items.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: style.accent_color,
              padding: "40px 60px",
              borderRadius: "30px",
              borderLeft: `12px solid ${style.primary_color}`
            }}
          >
            <h2
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: style.primary_color,
                margin: "0 0 20px 0",
                fontFamily: style.font_family || "Arial, sans-serif"
              }}
            >
              {item.title}
            </h2>
            <p
              style={{
                fontSize: "32px",
                color: style.text_color,
                margin: 0,
                fontFamily: style.font_family || "Arial, sans-serif",
                lineHeight: 1.5
              }}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {content.summary && (
        <div
          style={{
            marginTop: "60px",
            padding: "40px",
            backgroundColor: style.secondary_color,
            borderRadius: "20px",
            textAlign: "center"
          }}
        >
          <p
            style={{
              fontSize: "36px",
              color: style.text_color,
              margin: 0,
              fontFamily: style.font_family || "Arial, sans-serif"
            }}
          >
            {content.summary}
          </p>
        </div>
      )}
    </div>
  );
};