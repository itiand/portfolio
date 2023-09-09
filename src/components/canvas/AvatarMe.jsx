import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";

const Avatar = () => {
  const { scene } = useGLTF("./readyPlayerMe.glb");

  const [eyeScale, setEyeScale] = useState(new THREE.Vector3(1, 1, 1));

  /////blink////
  //handle
  const handleBlink = () => {
    setEyeScale(new THREE.Vector3(1, 1, -0.01));

    setTimeout(() => {
      setEyeScale(new THREE.Vector3(1, 1, 1));
    }, 50);
  };

  //useEffect
  useEffect(() => {
    const randomBlinkInterval = Math.random() * 3000 + 2000;
    const blinkInterval = setInterval(handleBlink, randomBlinkInterval);
    return () => clearInterval;
  }, []);

  //hide hands
  scene.traverse((child) => {
    if (child.isMesh && child.name === "Wolf3D_Hands") {
      child.visible = false;
    }
  });

  return (
    <primitive
      object={scene}
      position={[0, -10.5, 0]}
      rotation={[0, 1.2, 0]}
      scale={17}
    />
  );
};

export default Avatar;
// export default AvatarCanvas;
