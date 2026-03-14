import React from "react";
import { InfographicConfig } from "../Infographic";

export const ComparisonTemplate: React.FC<{ config: InfographicConfig }> = ({ config }) => {
  const { content, style, output_config } = config;

  // 检测是否为竖屏
  const isVertical = output_config?.orientation === 'vertical';

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: style.background_color || "#FFFFFF",
        fontFamily: style.font_family || "Arial, sans-serif",
        padding: isVertical ? "30px" : "40px"
      }}
    >
      {/* 标题区域 */}
      <div
        style={{
          height: isVertical ? "10%" : "15%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: isVertical ? "15px" : "20px"
        }}
      >
        <h1
          style={{
            fontSize: isVertical ? "36px" : "42px",
            fontWeight: "bold",
            color: style.primary_color || "#333333",
            margin: 0,
            marginBottom: isVertical ? "8px" : "10px"
          }}
        >
          {content.title}
        </h1>
        {content.subtitle && (
          <h2
            style={{
              fontSize: isVertical ? "18px" : "20px",
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
          height: isVertical ? "80%" : "70%",
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "stretch",
          marginBottom: isVertical ? "15px" : "20px",
          gap: isVertical ? "15px" : "0"
        }}
      >
        {/* 左侧 */}
        <div
          style={{
            width: isVertical ? "100%" : "45%",
            backgroundColor: content.left_bg || "#E8F5E9",
            borderRadius: "15px",
            padding: isVertical ? "20px" : "25px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* 左侧标题 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: isVertical ? "15px" : "20px",
              paddingBottom: isVertical ? "12px" : "15px",
              borderBottom: `2px solid ${content.left_primary || "#4DB33D"}`
            }}
          >
            <span style={{ fontSize: isVertical ? "32px" : "40px", marginRight: "10px" }}>
              {content.left_icon}
            </span>
            <h3
              style={{
                fontSize: isVertical ? "24px" : "28px",
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
                  marginBottom: isVertical ? "12px" : "15px",
                  display: "flex",
                  alignItems: "flex-start"
                }}
              >
                <span style={{ fontSize: isVertical ? "28px" : "32px", marginRight: "10px" }}>
                  {item.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: isVertical ? "16px" : "18px",
                      fontWeight: "bold",
                      color: content.left_primary || "#4DB33D",
                      marginBottom: "5px"
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: isVertical ? "14px" : "16px",
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
            width: isVertical ? "100%" : "10%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              width: isVertical ? "50px" : "60px",
              height: isVertical ? "50px" : "60px",
              borderRadius: "50%",
              backgroundColor: style.primary_color || "#333333",
              color: "#FFFFFF",
              fontSize: isVertical ? "20px" : "24px",
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
            width: isVertical ? "100%" : "45%",
            backgroundColor: content.right_bg || "#E3F2FD",
            borderRadius: "15px",
            padding: isVertical ? "20px" : "25px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          {/* 右侧标题 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: isVertical ? "15px" : "20px",
              paddingBottom: isVertical ? "12px" : "15px",
              borderBottom: `2px solid ${content.right_primary || "#00758F"}`
            }}
          >
            <span style={{ fontSize: isVertical ? "32px" : "40px", marginRight: "10px" }}>
              {content.right_icon}
            </span>
            <h3
              style={{
                fontSize: isVertical ? "24px" : "28px",
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
                  marginBottom: isVertical ? "12px" : "15px",
                  display: "flex",
                  alignItems: "flex-start"
                }}
              >
                <span style={{ fontSize: isVertical ? "28px" : "32px", marginRight: "10px" }}>
                  {item.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: isVertical ? "16px" : "18px",
                      fontWeight: "bold",
                      color: content.right_primary || "#00758F",
                      marginBottom: "5px"
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: isVertical ? "14px" : "16px",
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
          height: isVertical ? "10%" : "15%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: style.accent_color || "#F5F5F5",
          borderRadius: "10px",
          padding: isVertical ? "12px" : "15px"
        }}
      >
        <p
          style={{
            fontSize: isVertical ? "16px" : "18px",
            fontWeight: "normal",
            color: style.text_color || "#333333",
            margin: 0,
            marginBottom: isVertical ? "8px" : "10px",
            textAlign: "center"
          }}
        >
          {content.conclusion}
        </p>
        <p
          style={{
            fontSize: isVertical ? "14px" : "16px",
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