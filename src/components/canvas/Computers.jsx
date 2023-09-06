import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
// import { AxesHelper } from "three";
import * as THREE from "three";

import CanvasLoader from "../Loader";

// const Computers = () => {
//   const computer = useGLTF("./desktop_pc/scene.gltf");
//   return (
//     <mesh>
//       <ambientLight />
//       <hemisphereLight intensity={0.15} groundColor="black"></hemisphereLight>
//       <pointLight intensity={1} />
//       <primitive
//         object={computer.scene}
//         // scale={isMobile ? 0.7 : 0.75}
//         // position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
//         // rotation={[-0.01, -0.2, -0.1]}
//       />
//     </mesh>
//   );
// };

const Computers = ({ isMobile }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  return (
    <primitive
      object={computer.scene}
      scale={isMobile ? 0.7 : 0.75}
      position={isMobile ? [0, -3, -2.2] : [0, -3.1, -1.5]}
      rotation={[-0.01, -0.2, -0.1]}
    />
  );
};

const ComputerCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  return (
    <Canvas
      frameloop="demand"
      shadows
      camera={{
        position: [20, 3, 5],
        fov: 25,
      }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <axesHelper args={[5]} />
      {/*LIGHTS*/}
      <hemisphereLight intensity={1} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputerCanvas;
