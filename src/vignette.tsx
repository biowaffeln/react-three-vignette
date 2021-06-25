import React, { useEffect } from "react";
import { createBackground, VignetteOptions } from "./create-background";
import { useThree } from "@react-three/fiber";

export const Vignette: React.FC<VignetteOptions> = (props) => {
  const { mesh, setStyles } = React.useMemo(
    () => createBackground(props),
    [props.geometry]
  );

  const initialRender = React.useRef(true);
  useEffect(() => {
    if (!initialRender.current) setStyles(props);
    initialRender.current = false;
  }, [Object.values(props)]);

  const size = useThree((state) => state.size);
  useEffect(() => {
    setStyles({ aspect: size.width / size.height });
  }, [size]);

  return <primitive object={mesh} />;
};

Vignette.defaultProps = {
  aspectCorrection: false,
  aspect: 1,
  grainScale: 0.25,
  grainTime: 0,
  noiseAlpha: 0.25,
  offset: [0, 0],
  scale: 1,
  smooth: [0, 1],
  color1: "#fff",
  color2: "#283844",
};
