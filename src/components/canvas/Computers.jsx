import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import Avatar from "./AvatarMe";
import CanvasLoader from "../Loader";
import Butterfly from "./Butterfly";
import * as THREE from "three";

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

const ComputerCanvas = () => {
  const spotLightRef = useRef();
  const [isMobile, setIsMobile] = useState(false);
  const [butterflyPosition, setButterflyPosition] = useState(
    new THREE.Vector3(5, 3, 5),
  );

  useEffect(() => {
    console.log("butterflyposition", butterflyPosition);
  }, [butterflyPosition]);

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
        <Butterfly setButterflyPosition={setButterflyPosition} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputerCanvas;
