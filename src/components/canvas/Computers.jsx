import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

// import loader from ../loader

const Computers = () => {
  const computer = useGLTF("./desktop_pc/scene.gltf");
  return (
    //mesh
    //hemisphere lights
    //all sorts of light
    //primitive, which is the computer?
    <mesh>
      <ambientLight />
      <pointLight intensity={1} />
      <hemisphereLight intensity={0.15} groundColor="black"></hemisphereLight>
    </mesh>
  );
};

const ComputerCanvas = () => {
  return (
    <Canvas
      frameloop="demand"
      shadows
      camera={{
        position: [20, 3, 5],
        fov: 25,
      }}
    ></Canvas>
  );
};

export default ComputerCanvas;
