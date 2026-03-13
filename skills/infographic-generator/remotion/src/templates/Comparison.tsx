import React from "react";
import { InfographicConfig } from "../Infographic";

export const ComparisonTemplate: React.FC<{ config: InfographicConfig }> = ({ config }) => {
  const { content, style } = config;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: style.background_color || "#FFFFFF",
        fontFamily: style.font_family || "Arial, sans-serif",
        padding: "40px"
      }}
    >
      {/* 标题区域 */}
      <div
        style={{
          height: "15%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "bold",
            color: style.primary_color || "#333333",
            margin: 0,
            marginBottom: "10px"
          }}
        >
          {content.title}
        </h1>
        {content.subtitle && (
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "normal",
              color: style.secondary_color || "#666666",
              margin: 0
            }}
          >
            {content.subtitle}
          </h2>
        )}
      </div>

      {/* 对比区域 */}
      <div
        style={{
          height: "70%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          marginBottom: "20px"
        }}
      >
        {/* 左侧 */}
        <div
          style={{
            width: "45%",
            backgroundColor: content.left_bg || "#E8F5E9",
            borderRadius: "15px",
            padding: "25px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* 左侧标题 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              paddingBottom: "15px",
              borderBottom: `2px solid ${content.left_primary || "#4DB33D"}`
            }}
          >
            <span style={{ fontSize: "40px", marginRight: "10px" }}>
              {content.left_icon}
            </span>
            <h3
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: content.left_primary || "#4DB33D",
                margin: 0
              }}
            >
              {content.left_title}
            </h3>
          </div>

          {/* 左侧项目 */}
          <div style={{ flex: 1 }}>
            {content.left_items?.map((item: any, index: number) => (
              <div
                key={index}
                style={{
                  marginBottom: "15px",
                  display: "flex",
                  alignItems: "flex-start"
                }}
              >
                <span style={{ fontSize: "32px", marginRight: "10px" }}>
                  {item.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: content.left_primary || "#4DB33D",
                      marginBottom: "5px"
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      color: style.text_color || "#333333"
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VS分隔 */}
        <div
          style={{
            width: "10%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: style.primary_color || "#333333",
              color: "#FFFFFF",
              fontSize: "24px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            VS
          </div>
        </div>

        {/* 右侧 */}
        <div
          style={{
            width: "45%",
            backgroundColor: content.right_bg || "#E3F2FD",
            borderRadius: "15px",
            padding: "25px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* 右侧标题 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              paddingBottom: "15px",
              borderBottom: `2px solid ${content.right_primary || "#00758F"}`
            }}
          >
            <span style={{ fontSize: "40px", marginRight: "10px" }}>
              {content.right_icon}
            </span>
            <h3
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                color: content.right_primary || "#00758F",
                margin: 0
              }}
            >
              {content.right_title}
            </h3>
          </div>

          {/* 右侧项目 */}
          <div style={{ flex: 1 }}>
            {content.right_items?.map((item: any, index: number) => (
              <div
                key={index}
                style={{
                  marginBottom: "15px",
                  display: "flex",
                  alignItems: "flex-start"
                }}
              >
                <span style={{ fontSize: "32px", marginRight: "10px" }}>
                  {item.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: content.right_primary || "#00758F",
                      marginBottom: "5px"
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      color: style.text_color || "#333333"
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 结论区域 */}
      <div
        style={{
          height: "15%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: style.accent_color || "#F5F5F5",
          borderRadius: "10px",
          padding: "15px"
        }}
      >
        <p
          style={{
            fontSize: "18px",
            fontWeight: "normal",
            color: style.text_color || "#333333",
            margin: 0,
            marginBottom: "10px",
            textAlign: "center"
          }}
        >
          {content.conclusion}
        </p>
        <p
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: style.primary_color || "#333333",
            margin: 0,
            textAlign: "center"
          }}
        >
          {content.recommendation}
        </p>
      </div>
    </div>
  );
};