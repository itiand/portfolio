import { useGLTF } from "@react-three/drei";
import { three } from "maath";
import { useEffect, useState } from "react";
import * as THREE from "three";

const Avatar = () => {
  const { scene } = useGLTF("./readyPlayerMe.glb");

  //hide hands
  scene.traverse((child) => {
    if (child.isMesh && child.name === "Wolf3D_Hands") {
      child.visible = false;
    }
  });

  const [eyeScale, setEyeScale] = useState(new THREE.Vector3(1, 1, 1));
  const [movementDirection, setMovementDirection] = useState(
    new THREE.Vector2(),
  );

  ///head movement
  ////

  //movement direction state depends on the mouse movement
  // on mouse move,  set the new direction from the origin to the mouse direction
  useEffect(() => {
    const handleMouseMove = (event) => {
      //get new direction and normalize the value
      const x = (event.clientX / window.innerWidth) * 2 - 1; // normalize range --> [-1,1]
      const y = (event.clientY / window.innerHeight) * 2 - 1; // normalize range ... [-1, 1]
      setMovementDirection(new THREE.Vector2(x, y));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  //head movement render

  ///end head movement
  ////

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

  //rendering blink effect
  useEffect(() => {
    const leftEye = scene.getObjectByName("LeftEye");
    const rightEye = scene.getObjectByName("RightEye");
    const head = scene.getObjectByName("Head");

    leftEye.scale.copy(eyeScale);
    rightEye.scale.copy(eyeScale);

    // console.log("HEAD ROTATION", head.rotation);
    const rotationAmount = 1;
    console.log("movementDirection", movementDirection);
    head.rotation.x = movementDirection.y;

    head.rotation.y = movementDirection.x;
    // head.rotation.z -= 0.05;
  }, [eyeScale, movementDirection]);
  ///end blink
  ////

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
