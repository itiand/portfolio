import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Preload,
  useGLTF,
  useAnimations,
} from "@react-three/drei";
import * as THREE from "three";
import Avatar from "./AvatarMe";

import CanvasLoader from "../Loader";
import { createNoise3D, createNoise2D } from "simplex-noise";

// const Computers = ({ isMobile }) => {
//   const computer = useGLTF("./toon_cat_free/scene.gltf");

//   return (
//     <primitive
//       object={computer.scene}
//       scale={isMobile ? 0.7 : 0.014}
//       position={isMobile ? [0, -3, -2.2] : [0, -3.1, -1.5]}
//       rotation={[-0.01, -0.2, -0.1]}
//     />
//   );
// };

const Butterfly = ({ isMobile }) => {
  const blueButterfly = useRef();
  const { animations, nodes, scene } = useGLTF("./blue_butterfly/scene.gltf");
  const { actions, names } = useAnimations(animations, blueButterfly);

  console.log("animations", animations);
  console.log("actions", actions);
  console.log("names", names);

  useEffect(() => {
    actions["Flying"].reset().fadeIn(0.5).play();
  }, [actions]);

  const noise3D = createNoise3D();
  console.log("noise3D", noise3D);
  const noise2D = createNoise2D();

  let time = 0;

  useEffect(() => {
    const animate = () => {
      // Update the butterfly's position using the updated 3D Simplex noise
      blueButterfly.current.position.x += noise3D(time, 0, time) * 0.09;
      blueButterfly.current.position.y += noise3D(time, time, 0) * 0.007;
      blueButterfly.current.position.z += noise3D(0, time, time) * 0.01;

      time += 0.01;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <primitive
      object={scene}
      ref={blueButterfly}
      position={[5, 3, 5]}
      rotation={[0.2, 3, 0]}
      scale={0.2}
    />
  );
};

const ComputerCanvas = () => {
  const spotLightRef = useRef();
  const [isMobile, setIsMobile] = useState(false);

  return (
    <Canvas
      frameloop="always"
      shadows
      camera={{
        position: [20, 3, 5],
        fov: 25,
      }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <axesHelper args={[5]} />

      {/*LIGHTS*/}
      <hemisphereLight intensity={2} groundColor="purple" />
      <pointLight intensity={1} />
      <ambientLight intensity={0.7} />
      <spotLight intensity={100} position={[-20, 10, 5]} ref={spotLightRef} />
      {/* {spotLightRef.current && (
        <spotLightHelper args={[spotLightRef.current]} />
      )} */}
      {/* <directionalLight /> */}

      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
        // autoRotate
        // enableZoom={false}
        // maxPolarAngle={Math.PI / 2}
        // minPolarAngle={Math.PI / 2}
        />
        {/* <Computers /> */}
        <Avatar />
        <Butterfly />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputerCanvas;
