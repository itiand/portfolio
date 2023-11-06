import { useGLTF } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

const Avatar = ({ butterflyPosition, offsetX, setOffsetX }) => {
  const gltf = useGLTF("./readyPlayerMe.glb");
  const { scene } = gltf;
  const { camera } = useThree();

  const mixerRef = useRef(null);

  //max body rotation
  const MAX_ROTATION_Y = THREE.MathUtils.degToRad(90);
  const MAX_ROTATION_X = THREE.MathUtils.degToRad(10);
  const DEAD_ZONE = 0.01;

  //states
  const [eyeScale, setEyeScale] = useState(new THREE.Vector3(1, 1, 1));
  const [currentDirection, setCurrentDirection] = useState(new THREE.Vector2());
  const [targetDirection, setTargetDirection] = useState(new THREE.Vector2());
  const [avatarScale, setAvatarScale] = useState(1); //default scale
  const [avatarPosition, setAvatarPosition] = useState([0, -10.5, 0 + offsetX]); // default position

  // //responsive offset
  // useEffect(() => {
  //   const width = window.innerWidth;
  //   if (width < 640) {
  //     //xs (smallest)
  //     console.log("Avatar Component Smallest");
  //   } else if (width < 768) {
  //     //sm
  //   } else if (width < 1024) {
  //     //md
  //     setOffsetX(-2);
  //   } else if (width < 1280) {
  //     // lg
  //     setOffsetX(-2.5);
  //   } else if (width < 1536) {
  //     //xl
  //     setOffsetX(-3);
  //   } else {
  //     //2xl (largest)
  //     setOffsetX(-3.5);
  //   }
  // }, [window.innerWidth]);

  //hide hands
  scene.traverse((child) => {
    if (child.isMesh && child.name === "Wolf3D_Hands") {
      child.visible = false;
    }
  });

  // const [movementDirection, setMovementDirection] = useState(
  //   new THREE.Vector2(),
  // );

  /////blink////
  //blink handle
  const handleBlink = () => {
    setEyeScale(new THREE.Vector3(1, 1, -0.01));
    setTimeout(() => {
      setEyeScale(new THREE.Vector3(1, 1, 1));
    }, 50);
  };

  //blink and eye animation useEffect
  useEffect(() => {
    //blink
    const randomBlinkInterval = Math.random() * 1000 + 3000;
    const blinkInterval = setInterval(handleBlink, randomBlinkInterval);

    //eye animation
    if (gltf && gltf.animations) {
      //if the model has animations
      mixerRef.current = new THREE.AnimationMixer(scene);

      const idleEyesAnimation = gltf.animations.find(
        (clip) => clip.name === "idle_eyes_2",
      );

      if (idleEyesAnimation) {
        const action = mixerRef.current.clipAction(idleEyesAnimation);
        console.log("action", action);
        action.play();
      }
    }
    console.log("gltf", gltf);
    console.log("scene", scene);

    window.addEventListener("click", handleBlink);

    //handle smile
    const wolfHead = scene.getObjectByName("Wolf3D_Head");
    wolfHead.morphTargetInfluences[1] = 0.3;
    wolfHead.morphTargetInfluences[0] = 0.3;
    ///

    return () => {
      clearInterval(blinkInterval);
      window.removeEventListener("click", handleBlink);
    };
  }, []);
  ///end blink
  ////

  ///follow the butterfly
  //movement direction state depends on butterflyposition
  useEffect(() => {
    const handleButterflyMove = (butterflyPosition) => {
      //convert butterfly position to screen space coordinates
      const projectedPosition = butterflyPosition.clone().project(camera);

      const x = projectedPosition.x;
      const y = -projectedPosition.y;

      //get new direction and normalize the value & check if movement is beyond dead zone
      // setMovementDirection(new THREE.Vector2(x, y));
      if (
        Math.abs(x - currentDirection.x) > DEAD_ZONE ||
        Math.abs(y - currentDirection.y) > DEAD_ZONE
      ) {
        setTargetDirection(new THREE.Vector2(x, y));
      }
    };

    handleButterflyMove(butterflyPosition);
  }, [butterflyPosition, camera]);
  ///
  ////

  //render effect
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    const lerpFactor = 0.04;
    currentDirection.lerp(targetDirection, lerpFactor);

    const leftEye = scene.getObjectByName("LeftEye");
    const rightEye = scene.getObjectByName("RightEye");
    const head = scene.getObjectByName("Head");

    if (leftEye && rightEye) {
      leftEye.scale.copy(eyeScale);
      rightEye.scale.copy(eyeScale);
    }

    if (head) {
      const rotationAmount = 0.3;
      head.rotation.x = currentDirection.y * rotationAmount;
      head.rotation.y = currentDirection.x * rotationAmount;
      head.rotation.z = currentDirection.x * 0.13;
    }

    //body rotation
    scene.rotation.y = THREE.MathUtils.clamp(
      currentDirection.x * 0.2 + 1.5,
      -MAX_ROTATION_Y,
      MAX_ROTATION_Y,
    );

    scene.rotation.x = THREE.MathUtils.clamp(
      -currentDirection.y * 0.02,
      -MAX_ROTATION_X,
      MAX_ROTATION_X,
    );
  });

  return (
    <primitive
      object={scene}
      position={[0, -10.5, 0 + offsetX]}
      rotation={[0, 1.5, 0]}
      scale={17}
    />
  );
};

export default Avatar;
