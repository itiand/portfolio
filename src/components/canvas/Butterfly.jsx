import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { createNoise3D } from "simplex-noise";
import * as THREE from "three";

const Butterfly = ({ isMobile }) => {
  const blueButterfly = useRef();
  const { animations, nodes, scene } = useGLTF("./blue_butterfly/scene.gltf");
  const { actions, names } = useAnimations(animations, blueButterfly);

  useEffect(() => {
    actions["Flying"].reset().fadeIn(0.5).setEffectiveTimeScale(3).play();
  }, [actions]);

  const noise3D = createNoise3D();

  let time = 0;

  useEffect(() => {
    //IMPLEMENTING SENSE OF DIRECTION
    //initial target
    //get position
    //compute direction to the target from current direction
    //apply movenent to direction
    //change butterfly direction when it is near its target
    const animate = () => {
      //get current position
      const currentPosition = {
        x: blueButterfly.current.position.x,
        z: blueButterfly.current.position.z,
      };

      //update butterfly position using noise
      blueButterfly.current.position.x += noise3D(time, 0, time) * 0.09;
      blueButterfly.current.position.y += noise3D(time, time, 0) * 0.007;
      blueButterfly.current.position.z += noise3D(0, time, time) * 0.01;

      //determine the direction
      const dx = blueButterfly.current.position.x - currentPosition.x;
      const dz = blueButterfly.current.position.z - currentPosition.z;
      const rotationY = Math.atan2(dz, dx) - Math.PI / 2; //calculate the roatation
      blueButterfly.current.rotation.y = rotationY; // apply the rotation

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
