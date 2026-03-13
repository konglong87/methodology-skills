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
  borderColor?: string;
  cardStyle?: string;
  decorativeElements?: string[];
  fontFamily?: string;
  isVertical?: boolean;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  items,
  primaryColor,
  secondaryColor,
  textColor,
  borderColor = "#E8E8E8",
  cardStyle = "flat",
  decorativeElements = [],
  fontFamily = "Arial, sans-serif",
  isVertical = false
}) => {
  // Get card styles based on cardStyle type
  const getCardStyles = (index: number) => {
    const baseStyles: React.CSSProperties = {
      padding: isVertical ? "30px" : "40px",
      borderRadius: "20px",
      position: "relative",
      overflow: "hidden"
    };

    switch (cardStyle) {
      case "glass":
        return {
          ...baseStyles,
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          border: `2px solid rgba(255, 255, 255, 0.2)`,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
        };
      case "rounded_bubble":
        return {
          ...baseStyles,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "30px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
          border: `3px solid ${primaryColor}20`
        };
      case "inset":
        return {
          ...baseStyles,
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.1)"
        };
      case "bento_card":
        return {
          ...baseStyles,
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          border: `1px solid ${borderColor}`
        };
      case "notebook_paper":
        return {
          ...baseStyles,
          backgroundColor: "#FEF9E7",
          borderRadius: "12px",
          border: `2px dashed ${primaryColor}`,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
        };
      case "comic_panel":
        return {
          ...baseStyles,
          backgroundColor: "white",
          borderRadius: "12px",
          border: `4px solid #374151`,
          boxShadow: "6px 6px 0px rgba(0, 0, 0, 0.3)"
        };
      default: // flat
        return {
          ...baseStyles,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderLeft: `8px solid ${primaryColor}`
        };
    }
  };

  // Render decorative elements
  const renderDecorations = (index: number) => {
    const decorations: JSX.Element[] = [];

    decorativeElements.forEach((element, i) => {
      switch (element) {
        case "hearts":
          decorations.push(
            <div key={`heart-${i}`} style={{
              position: "absolute",
              top: "10px",
              right: "15px",
              fontSize: isVertical ? "22px" : "28px",
              opacity: 0.7
            }}>❤️</div>
          );
          break;
        case "stars":
          if (index % 2 === 0) {
            decorations.push(
              <div key={`star-${i}`} style={{
                position: "absolute",
                top: "15px",
                right: "20px",
                fontSize: isVertical ? "20px" : "24px",
                opacity: 0.8
              }}>⭐</div>
            );
          }
          break;
        case "clouds":
          decorations.push(
            <div key={`cloud-${i}`} style={{
              position: "absolute",
              bottom: "-10px",
              right: "-10px",
              fontSize: isVertical ? "32px" : "40px",
              opacity: 0.15
            }}>☁️</div>
          );
          break;
        case "sparkles":
          decorations.push(
            <div key={`sparkle-${i}`} style={{
              position: "absolute",
              top: "20px",
              right: "25px",
              fontSize: isVertical ? "22px" : "26px",
              opacity: 0.9,
              animation: "pulse 2s infinite"
            }}>✨</div>
          );
          break;
        case "circuits":
          decorations.push(
            <div key={`circuit-${i}`} style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              width: "40px",
              height: "2px",
              background: `linear-gradient(90deg, transparent, ${primaryColor})`,
              opacity: 0.3
            }} />
          );
          break;
        case "action_lines":
          decorations.push(
            <div key={`action-${i}`} style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${primaryColor}05 10px, ${primaryColor}05 20px)`
            }} />
          );
          break;
        default:
          break;
      }
    });

    return decorations;
  };

  // 竖屏时使用单列，横屏使用双列
  const gridColumns = isVertical ? "1fr" : "repeat(2, 1fr)";
  const gap = isVertical ? "40px" : "60px";

  return (
    <div
      style={{
        padding: isVertical ? "30px 60px" : "40px 100px",
        display: "grid",
        gridTemplateColumns: gridColumns,
        gap: gap,
        flex: "1" // 让内容区域自动填充剩余空间
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          style={getCardStyles(index)}
        >
          {renderDecorations(index)}

          <div style={{ display: "flex", alignItems: "center", marginBottom: isVertical ? "15px" : "20px" }}>
            {item.icon && (
              <span style={{ fontSize: isVertical ? "36px" : "48px", marginRight: "15px" }}>
                {item.icon}
              </span>
            )}
            <h3
              style={{
                fontSize: isVertical ? "32px" : "42px",
                fontWeight: "bold",
                color: primaryColor,
                margin: 0,
                fontFamily,
                flex: 1
              }}
            >
              {index + 1}. {item.title}
            </h3>
          </div>

          <p
            style={{
              fontSize: isVertical ? "24px" : "28px",
              color: textColor,
              margin: 0,
              fontFamily,
              lineHeight: 1.6,
              position: "relative",
              zIndex: 1
            }}
          >
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
};