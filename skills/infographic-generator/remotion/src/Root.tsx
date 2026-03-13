import { Composition } from "remotion";
import { Infographic, InfographicConfig } from "./Infographic";

// 默认配置（用于Remotion Studio预览）
const defaultConfig: InfographicConfig = {
  template: "knowledge",
  style: {
    background_color: "#F3F4F6",
    primary_color: "#3B82F6",
    secondary_color: "#10B981",
    accent_color: "#F59E0B",
    text_color: "#1F2937",
    font_family: "system-ui"
  },
  content: {
    title: "示例标题",
    subtitle: "示例副标题",
    items: [
      "这是一个示例项目",
      "Remotion支持动态配置",
      "可以从外部传入config"
    ]
  },
  output: {
    width: 1920,
    height: 1080
  }
};

export const RemotionRoot = () => {
  return (
    <Composition
      id="Infographic"
      component={Infographic}
      durationInFrames={1}
      fps={1}  // PNG只需1帧，fps=1更合理
      width={1920}
      height={1080}
      defaultProps={{
        config: defaultConfig
      }}
    />
  );
};