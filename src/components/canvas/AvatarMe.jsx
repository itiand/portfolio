import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";

const Avatar = () => {
  const { scene } = useGLTF("./readyPlayerMe.glb");

  const [eyeScale, setEyeScale] = useState(new THREE.Vector3(1, 1, 1));

  //hide hands
  scene.traverse((child) => {
    if (child.isMesh && child.name === "Wolf3D_Hands") {
      child.visible = false;
    }
  });

  /////blink////
  //handle
  const handleBlink = () => {
    setEyeScale(new THREE.Vector3(1, 1, -0.01));

    setTimeout(() => {
      setEyeScale(new THREE.Vector3(1, 1, 1));
    }, 50);
  };

  //useEffect --> blink timer
  useEffect(() => {
    const randomBlinkInterval = Math.random() * 3000 + 2000;
    const blinkInterval = setInterval(handleBlink, randomBlinkInterval);

    return () => clearInterval(blinkInterval);
  }, []);

  //rendering effect
  useEffect(() => {
    //find the left and right eye
    // if found apply the scale based on the eyeScale state (Vector3)
    //**eyeScale state triggers it */

    const leftEye = scene.getObjectByName("LeftEye");
    const rightEye = scene.getObjectByName("RightEye");

    leftEye.scale.copy(eyeScale);
    rightEye.scale.copy(eyeScale);
  }, [eyeScale]);

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
