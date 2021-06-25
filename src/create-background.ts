import { vert, frag } from "./shaders";
import {
  DoubleSide,
  PlaneGeometry,
  RawShaderMaterial,
  Color,
  Vector2,
  Mesh,
} from "three";

import type { BufferGeometry } from "three";

type ColorLike = Color | number | string;
type Vector2Like = [x: number, y: number] | Vector2;

export interface StyleOptions {
  color1?: ColorLike;
  color2?: ColorLike;
  aspect?: number;
  grainScale?: number;
  grainTime?: number;
  noiseAlpha?: number;
  smooth?: Vector2Like;
  aspectCorrection?: boolean;
  scale?: number | Vector2Like;
  offset?: Vector2Like;
}

export interface VignetteOptions extends StyleOptions {
  geometry?: BufferGeometry;
}

export function createBackground(opt: VignetteOptions) {
  const geometry = opt.geometry || new PlaneGeometry(2, 2, 1);
  const material = new RawShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    side: DoubleSide,
    uniforms: {
      aspectCorrection: { value: false },
      aspect: { value: 1 },
      grainScale: { value: 0.005 },
      grainTime: { value: 0 },
      noiseAlpha: { value: 0.25 },
      offset: { value: new Vector2(0, 0) },
      scale: { value: new Vector2(1, 1) },
      smooth: { value: new Vector2(0.0, 1.0) },
      color1: { value: new Color("#fff") },
      color2: { value: new Color("#283844") },
    },
    depthTest: false,
  });

  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1;

  const setStyles = style(material);
  setStyles(opt);

  return { mesh, setStyles };
}

const style = (material: RawShaderMaterial) => (opt: StyleOptions) => {
  if (opt.color1) {
    material.uniforms.color1.value.copy(new Color(opt.color1));
  }
  if (opt.color2) {
    material.uniforms.color2.value.copy(new Color(opt.color2));
  }
  if (opt.aspect) {
    material.uniforms.aspect.value = opt.aspect;
  }
  if (opt.grainScale) {
    material.uniforms.grainScale.value = opt.grainScale;
  }
  if (opt.grainTime) {
    material.uniforms.grainTime.value = opt.grainTime;
  }
  if (opt.smooth) {
    const smooth = fromArray(opt.smooth);
    material.uniforms.smooth.value.copy(smooth);
  }
  if (opt.offset) {
    const offset = fromArray(opt.offset);
    material.uniforms.offset.value.copy(offset);
  }
  if (opt.noiseAlpha) {
    material.uniforms.noiseAlpha.value = opt.noiseAlpha;
  }
  if (opt.scale) {
    let scale = opt.scale;
    if (typeof scale === "number") {
      scale = [scale, scale];
    }
    scale = fromArray(scale);
    material.uniforms.scale.value.copy(scale);
  }
  if (typeof opt.aspectCorrection !== "undefined") {
    material.uniforms.aspectCorrection.value = opt.aspectCorrection;
  }
};

const fromArray = (array: Vector2Like) => {
  return array instanceof Vector2 ? array : new Vector2().fromArray(array);
};
