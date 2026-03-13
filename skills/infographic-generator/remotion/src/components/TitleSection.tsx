import React from "react";

interface TitleSectionProps {
  title: string;
  subtitle?: string;
  primaryColor: string;
  textColor: string;
  fontFamily?: string;
  gradient?: string;
  decorativeElements?: string[];
  isVertical?: boolean;
}

export const TitleSection: React.FC<TitleSectionProps> = ({
  title,
  subtitle,
  primaryColor,
  textColor,
  fontFamily = "Arial, sans-serif",
  gradient,
  decorativeElements = [],
  isVertical = false
}) => {
  // 生成装饰元素
  const renderDecorations = () => {
    const decorations: JSX.Element[] = [];

    decorativeElements.forEach((element, index) => {
      switch (element) {
        case 'circuits':
          // 科技风电路装饰
          decorations.push(
            <div key={`circuit-${index}`} style={{
              position: 'absolute',
              top: `${10 + index * 15}%`,
              right: '5%',
              width: '60px',
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${primaryColor})`,
              opacity: 0.3
            }} />
          );
          break;
        case 'stars':
          // 可爱风星星
          decorations.push(
            <div key={`star-${index}`} style={{
              position: 'absolute',
              top: `${15 + index * 20}%`,
              left: `${10 + index * 10}%`,
              fontSize: isVertical ? '20px' : '24px',
              opacity: 0.6
            }}>⭐</div>
          );
          break;
        case 'sparkles':
          // 动漫风闪光
          decorations.push(
            <div key={`sparkle-${index}`} style={{
              position: 'absolute',
              top: `${10 + index * 12}%`,
              right: `${8 + index * 8}%`,
              fontSize: isVertical ? '26px' : '32px',
              opacity: 0.7
            }}>✨</div>
          );
          break;
        case 'dots':
          // 简约点阵
          for (let i = 0; i < 3; i++) {
            decorations.push(
              <div key={`dot-${index}-${i}`} style={{
                position: 'absolute',
                top: `${20 + i * 10}%`,
                left: `${5 + i * 3}%`,
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: primaryColor,
                opacity: 0.2
              }} />
            );
          }
          break;
        default:
          break;
      }
    });

    return decorations;
  };

  return (
    <div
      style={{
        padding: isVertical ? "50px 60px 30px" : "80px 100px 40px",
        textAlign: "center",
        position: "relative"
      }}
    >
      {renderDecorations()}

      <h1
        style={{
          fontSize: isVertical ? "52px" : "72px",
          fontWeight: "bold",
          color: primaryColor,
          margin: 0,
          fontFamily,
          lineHeight: 1.2,
          textShadow: decorativeElements.includes('sparkles') ? '2px 2px 8px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <h2
          style={{
            fontSize: isVertical ? "28px" : "36px",
            color: textColor,
            marginTop: isVertical ? "15px" : "20px",
            fontFamily,
            fontWeight: "normal",
            opacity: 0.9
          }}
        >
          {subtitle}
        </h2>
      )}
    </div>
  );
};