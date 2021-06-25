import React from "react";
import { Canvas } from "@react-three/fiber";
import Vignette from "react-three-vignette";

export const App = () => {
  return (
    <div className="app">
      <Canvas>
        <Vignette />
        <ambientLight />
        <mesh rotation-x={0.5}>
          <meshPhysicalMaterial color="red" />
          <boxGeometry />
        </mesh>
      </Canvas>
    </div>
  );
};
