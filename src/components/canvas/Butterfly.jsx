import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { createNoise3D } from "simplex-noise";
import * as THREE from "three";

const Butterfly = ({ isMobile }) => {
  const blueButterfly = useRef();
  const { animations, nodes, scene } = useGLTF("./blue_butterfly/scene.gltf");
  const { actions, names } = useAnimations(animations, blueButterfly);

  useEffect(() => {
    actions["Flying"].reset().fadeIn(0.5).play();
  }, [actions]);

  const noise3D = createNoise3D();

  let time = 0;

  useEffect(() => {
    const animate = () => {
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

export default Butterfly;
