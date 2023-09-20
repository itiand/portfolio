import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { MathUtils } from "three";
import { useFrame, useThree } from "@react-three/fiber";

const Avatar = ({ butterflyPosition }) => {
  const { scene } = useGLTF("./readyPlayerMe.glb");
  const { camera } = useThree();

  //max body rotation
  const MAX_ROTATION_Y = THREE.MathUtils.degToRad(90);
  const MAX_ROTATION_X = THREE.MathUtils.degToRad(10);

  //hide hands
  scene.traverse((child) => {
    if (child.isMesh && child.name === "Wolf3D_Hands") {
      child.visible = false;
    }
  });

  const [eyeScale, setEyeScale] = useState(new THREE.Vector3(1, 1, 1));
  const [currentDirection, setCurrentDirection] = useState(new THREE.Vector2());
  const [targetDirection, setTargetDirection] = useState(new THREE.Vector2());

  // const [movementDirection, setMovementDirection] = useState(
  //   new THREE.Vector2(),
  // );

  ///head direction change
  ////
  //movement direction state depends on butterflyposition
  useEffect(() => {
    const handleButterflyMove = (butterflyPosition) => {
      //convert butterfly position to screen space coordinates
      const projectedPosition = butterflyPosition.clone().project(camera);

      const x = projectedPosition.x;
      const y = -projectedPosition.y;
      //get new direction and normalize the value
      // setMovementDirection(new THREE.Vector2(x, y));
      setTargetDirection(new THREE.Vector2(x, y));
    };

    handleButterflyMove(butterflyPosition);
  }, [butterflyPosition, camera]);
  ///
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
