import { Composition } from "remotion";
import { Infographic } from "./Infographic";

export const RemotionRoot = () => {
  return (
    <Composition
      id="Infographic"
      component={Infographic}
      durationInFrames={1}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};