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

//change the FOV - to change the size appearance when window size changes
//maybe change scale?
const FovAdjust = ({ controlsRef, setOffsetX, setOffsetY }) => {
  const { camera, size } = useThree();

  useEffect(() => {
    console.log("SIZE", size);

    const defaultPOV = 25;
    const POVincrement = 2.5;

    function handleResize() {
      // const width = window.innerWidth;
      const { width, height } = size;

      console.log("current width:", width);
      console.log("camera aspect", camera.aspect);

      const rightOffset = width * 0.15;

      if (width >= 1536) {
        //2XL biggest
        camera.fov = defaultPOV;
        setOffsetX(-3.5);
      } else if (width >= 1280) {
        //XL
        setOffsetX(-3);
        console.log("xl", camera.fov);
      } else if (width >= 1024) {
        //LG
        setOffsetX(-2.5);
        camera.fov = defaultPOV + POVincrement;
        console.log("lg", camera.fov);
      } else if (width >= 768) {
        //MD
        setOffsetX(-2.2);
        camera.fov = defaultPOV + POVincrement * 2;
        console.log("md", camera.fov);
      } else if (width >= 640) {
        //SM
        setOffsetX(-2.1);
        camera.fov = defaultPOV + POVincrement * 3.5;
        console.log("sm", camera.fov);
      } else {
        //XS
        setOffsetX(-0.8);
        setOffsetY(-3);
        camera.fov = defaultPOV + POVincrement * 2;
        console.log("xs", camera.fov);
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
  }, [camera, controlsRef, window.innerWidth]);

  return null;
};

const ComputerCanvas = () => {
  // const OFFSET_X = -3.5;
  const [OFFSET_X, setOffsetX] = useState(-3.5);
  const [OFFSET_Y, setOffsetY] = useState(0);
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
        position: [
          20.856625066023227, -0.01068391610383157, -0.03152517784785947,
        ], // 20, 3, 5 previously
        fov: 25,
      }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <axesHelper args={[5]} />

      {/*LIGHTS*/}
      <hemisphereLight intensity={2} groundColor="purple" />
      {/* <pointLight intensity={1} /> */}
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
        <FovAdjust
          controlsRef={controlsRef}
          setOffsetX={setOffsetX}
          setOffsetY={setOffsetY}
        />
        <Avatar
          butterflyPosition={butterflyPosition}
          offsetX={OFFSET_X}
          offsetY={OFFSET_Y}
          setOffsetX={setOffsetX}
        />
        <Butterfly
          setButterflyPosition={setButterflyPosition}
          butterflyPosition={butterflyPosition}
          offsetX={OFFSET_X}
          offsetY={OFFSET_Y}
        />
        {/* <PlaneComponent butterflyPosition={butterflyPosition} /> */}
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputerCanvas;
