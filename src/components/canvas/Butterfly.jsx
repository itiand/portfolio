import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { createNoise3D } from "simplex-noise";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

const Butterfly = () => {
  const { camera } = useThree();
  const blueButterfly = useRef();
  const { animations, nodes, scene } = useGLTF("./blue_butterfly/scene.gltf");
  const { actions, names } = useAnimations(animations, blueButterfly);

  useEffect(() => {
    actions["Flying"].reset().fadeIn(0.5).setEffectiveTimeScale(3).play();
  }, [actions]);

  const noise3D = createNoise3D();

  let time = 0;

  useEffect(() => {
    function computeRandomPointWithinFrustum() {
      const minDist = 2; // the minimum distance from the camera
      const maxDist = 8; // the maximum distance from the camera

      const randomDirection = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      ).normalize();
      const randomDistance = Math.random() * (maxDist - minDist) + minDist;

      randomDirection.multiplyScalar(randomDistance);

      return camera.position.clone().add(randomDirection);
    }

    const frustum = new THREE.Frustum();
    const cameraViewProjectionMatrix = new THREE.Matrix4();

    // Every frame or whenever the camera or viewport changes
    camera.updateMatrixWorld(); // make sure the camera matrix is updated
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    cameraViewProjectionMatrix.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse,
    );
    frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

    //IMPLEMENTING SENSE OF DIRECTION
    //initial target
    let target = new THREE.Vector3(
      Math.random() * 10 - 5,
      Math.random() * 6,
      Math.random() * 10 - 5,
    );

    const animate = () => {
      const currentPosition = new THREE.Vector3().copy(
        blueButterfly.current.position,
      );

      //compute direction to the target from current position
      const direction = new THREE.Vector3()
        .subVectors(target, currentPosition)
        .normalize();

      //slowdown and apply movement direction
      const moveAmount = 0.02;
      direction.multiplyScalar(moveAmount);

      // apply the noise-based movement to the direction
      direction.x += noise3D(time, 0, time) * 0.009;
      direction.y += noise3D(time, time, 0) * 0.007;
      direction.z += noise3D(0, time, time) * 0.009;

      blueButterfly.current.position.add(direction);

      //determine the direction, apply the rotation
      const rotationY = Math.atan2(direction.z, direction.x) - Math.PI / 2; //calculate the roatation
      blueButterfly.current.rotation.y = rotationY; // apply the rotation

      //change butterfly direction when it is near its target
      if (currentPosition.distanceTo(target) < 1) {
        target = new THREE.Vector3(
          Math.random() * 10 - 5,
          Math.random() * 6,
          Math.random() * 10 - 5,
        );
      }

      const isInside = frustum.containsPoint(blueButterfly.current.position);
      if (!isInside) {
        //redirect the butterfly to a new point within the frustum or adjust its position
        target = computeRandomPointWithinFrustum();
      }

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
