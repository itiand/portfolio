import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, Plane } from "@react-three/drei";
import * as THREE from "three";

import Avatar from "./AvatarMe";
import CanvasLoader from "../Loader";
import Butterfly from "./Butterfly";
import PlaneComponent from "./Plane";

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

//TAIWIND BREAKPOINTS
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px

const FovAdjust = ({ controlsRef }) => {
  const { camera } = useThree();

  useEffect(() => {
    const defaultPOV = 25;
    const POVincrement = 2.5;
    function handleResize() {
      const width = window.innerWidth;
      console.log("current width:", width);
      if (width > 1280) {
        camera.fov = defaultPOV;
        console.log("BIGGEST", camera.fov);
      } else if (width > 1024) {
        camera.fov = defaultPOV + POVincrement;
        console.log("lg", camera.fov);
      } else if (width > 768) {
        camera.fov = defaultPOV + POVincrement * 2;
        console.log("md", camera.fov);
      } else if (width > 640) {
        camera.fov = defaultPOV + POVincrement * 3;
        console.log("sm", camera.fov);
      } else {
        camera.fov = defaultPOV + POVincrement * 4;
        console.log("smallest", camera.fov);
      }
    }

    ////LOG CAMERA POSITION
    function logCameraPosition() {
      console.log("Camera Position:", camera.position);
    }
    if (controlsRef.current) {
      controlsRef.current.addEventListener("change", logCameraPosition);
    }
    //////

    camera.addEventListener("change", logCameraPosition);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      camera.removeEventListener("change", logCameraPosition);
    };
  }, [camera, controlsRef]);

  return null;
};

const ComputerCanvas = () => {
  const OFFSET_X = -3.5;
  const spotLightRef = useRef();
  const [isMobile, setIsMobile] = useState(false);
  const [butterflyPosition, setButterflyPosition] = useState(
    new THREE.Vector3(5, 3, 5),
  );

  const controlsRef = useRef();
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
      {/* <axesHelper args={[5]} /> */}

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
          ref={controlsRef}
          // autoRotate
          // enableZoom={false}
          // maxPolarAngle={Math.PI / 2}
          // minPolarAngle={Math.PI / 2}
        />
        {/* <Computers /> */}
        <FovAdjust controlsRef={controlsRef} />
        <Avatar butterflyPosition={butterflyPosition} offsetX={OFFSET_X} />
        <Butterfly
          setButterflyPosition={setButterflyPosition}
          butterflyPosition={butterflyPosition}
          offsetX={OFFSET_X}
        />
        {/* <PlaneComponent butterflyPosition={butterflyPosition} /> */}
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputerCanvas;
