import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { MathUtils } from "three";

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

  //max body rotation
  const MAX_ROTATION_Y = THREE.MathUtils.degToRad(15);
  const MAX_ROTATION_X = THREE.MathUtils.degToRad(10);

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
  ///end head movement
  ////

  /////blink////
  //blink handle
  const handleBlink = () => {
    setEyeScale(new THREE.Vector3(1, 1, -0.01));

    setTimeout(() => {
      setEyeScale(new THREE.Vector3(1, 1, 1));
    }, 50);
  };
  //blink useEffect --> timer
  useEffect(() => {
    const randomBlinkInterval = Math.random() * 1000 + 3000;
    const blinkInterval = setInterval(handleBlink, randomBlinkInterval);

    return () => clearInterval(blinkInterval);
  }, []);
  ///end blink
  ////

  //render effect
  useEffect(() => {
    const leftEye = scene.getObjectByName("LeftEye");
    const rightEye = scene.getObjectByName("RightEye");
    const head = scene.getObjectByName("Head");

    if (leftEye && rightEye) {
      leftEye.scale.copy(eyeScale);
      rightEye.scale.copy(eyeScale);
    }

    // console.log("HEAD ROTATION", head.rotation);
    if (head) {
      const rotationAmount = 0.3;
      head.rotation.x = movementDirection.y * rotationAmount;
      head.rotation.y = movementDirection.x * rotationAmount;
      head.rotation.z = movementDirection.x * 0.15;
    }

    //body rotation
    scene.rotation.y = THREE.MathUtils.clamp(
      movementDirection.x * 0.3,
      -MAX_ROTATION_Y,
      MAX_ROTATION_Y,
    );
    scene.rotation.x = THREE.MathUtils.clamp(
      -movementDirection.y * 0.05,
      -MAX_ROTATION_X,
      MAX_ROTATION_X,
    );
  }, [eyeScale, movementDirection, scene]);

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
