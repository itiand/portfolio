import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { MathUtils } from "three";
import { useFrame } from "@react-three/fiber";

const Avatar = ({ butterflyPosition }) => {
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
  const MAX_ROTATION_Y = THREE.MathUtils.degToRad(90);
  const MAX_ROTATION_X = THREE.MathUtils.degToRad(10);

  ///head movement
  ////
  //movement direction state depends on the mouse movement
  // on mouse move,  set the new direction from the origin to the mouse direction
  useEffect(() => {
    const handleButterflyMove = (butterflyPosition) => {
      //get new direction and normalize the value
      const x = (butterflyPosition.x / window.innerWidth) * 2 - 1; // normalize range --> [-1,1]
      const y = (butterflyPosition.y / window.innerHeight) * 2 - 1; // normalize range ... [-1, 1]
      setMovementDirection(new THREE.Vector2(x, y));
    };

    // window.addEventListener("mousemove", handleButterflyMove);
    // return () => window.removeEventListener("mousemove", handleButterflyMove);
    handleButterflyMove(butterflyPosition);
  }, [butterflyPosition]);
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
    window.addEventListener("click", handleBlink);
    return () => {
      clearInterval(blinkInterval);
      window.removeEventListener("click", handleBlink);
    };
  }, []);
  ///end blink
  ////

  //render effect
  useFrame(() => {
    console.log("MOVEEE", movementDirection.y);
    const leftEye = scene.getObjectByName("LeftEye");
    const rightEye = scene.getObjectByName("RightEye");
    const head = scene.getObjectByName("Head");

    if (leftEye && rightEye) {
      leftEye.scale.copy(eyeScale);
      rightEye.scale.copy(eyeScale);
    }

    if (head) {
      const rotationAmount = 0.3;
      head.rotation.x = movementDirection.y * rotationAmount;
      head.rotation.y = movementDirection.x * rotationAmount;
      head.rotation.z = movementDirection.x * 0.15;
    }

    //body rotation
    scene.rotation.y = THREE.MathUtils.clamp(
      movementDirection.x * 0.5 + 1.2,
      -MAX_ROTATION_Y,
      MAX_ROTATION_Y,
    );

    scene.rotation.x = THREE.MathUtils.clamp(
      -movementDirection.y * 0.02,
      -MAX_ROTATION_X,
      MAX_ROTATION_X,
    );
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
