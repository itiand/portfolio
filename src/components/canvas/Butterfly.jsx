import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { createNoise3D } from "simplex-noise";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

const Butterfly = ({ setButterflyPosition, butterflyPosition, offsetX }) => {
  butterflyPosition.z -= offsetX;
  const { camera } = useThree();
  const blueButterfly = useRef();
  const butterfly = useGLTF("./blue_butterfly/scene.gltf");
  const { animations, nodes, scene } = butterfly;
  const { actions, names } = useAnimations(animations, blueButterfly);
  const manualTargetRef = useRef(null);
  const floatingStartTimeRef = useRef(null);

  //start flapping
  useEffect(() => {
    actions["Flying"].reset().fadeIn(0.5).setEffectiveTimeScale(1.8).play();
  }, [actions]);

  const handleCanvasClick = (event) => {
    //get bounding client
    const rect = event.target.getBoundingClientRect();

    //normalize
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1; // subtract rect.left incase the canvas is offset x amount from left
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1; // subtract rect.top incase the canvas is offset y amount from top

    const pointer = new THREE.Vector2(x, y);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, camera);

    //get camera position --> use it for the plane's normal
    const planeNormal = camera.position.clone().normalize().negate();
    const plane = new THREE.Plane(planeNormal, butterflyPosition.x);

    //test if raycaster intersects the plane and store the intersection location to newTargetPosition
    const newTargetPosition = new THREE.Vector3();
    const intersect = raycaster.ray.intersectPlane(plane, newTargetPosition);

    if (intersect) {
      manualTargetRef.current = newTargetPosition;
      // setFloatingStartTime(null);
      floatingStartTimeRef.current = null;
    }
  };

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    canvas.addEventListener("click", handleCanvasClick);

    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
    };
  }, []);

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
    } // outside?

    const frustum = new THREE.Frustum();
    const cameraViewProjectionMatrix = new THREE.Matrix4();
    butterfly.materials.Wings.color.set(1, 0, 12);

    // Every frame or whenever the camera or viewport changes
    camera.updateMatrixWorld(); // make sure the camera matrix is updated
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    cameraViewProjectionMatrix.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse,
    );
    frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

    //IMPLEMENTING BUTTERFLY SENSE OF DIRECTION
    //initial random target
    let target = computeRandomPointWithinFrustum();
    const animate = () => {
      let direction = new THREE.Vector3();
      const currentPosition = new THREE.Vector3().copy(
        blueButterfly.current.position,
      );

      //if an area is clicked
      if (manualTargetRef.current) {
        //if the butterfly is already on the manual target
        if (currentPosition.distanceTo(manualTargetRef.current) < 0.1) {
          if (!floatingStartTimeRef.current) {
            floatingStartTimeRef.current = Date.now();
            console.log("SETTING THE TIME", floatingStartTimeRef.current);
          }

          if (Date.now() - floatingStartTimeRef.current >= 3000) {
            console.log("floattime done", floatingStartTimeRef.current);
            manualTargetRef.current = null; //setManualTargetRef to null

            floatingStartTimeRef.current = null;
            target = computeRandomPointWithinFrustum(); // find a new random target
          } else {
            console.log("floating time exists", floatingStartTimeRef.current);
            //stay on the spot and float around
            const floatRadius = 0.05;
            const elapsedTime =
              (Date.now() - floatingStartTimeRef.current) / 1000; // Time in seconds since floating started
            direction.add(
              new THREE.Vector3(
                Math.sin(elapsedTime) * floatRadius,
                Math.sin(elapsedTime * 1.2) * floatRadius,
                Math.cos(elapsedTime) * floatRadius,
              ),
            );
          }
        } else {
          // keep the target and let it keep flying there
          target = manualTargetRef.current;
        }

        //////////////
        // target = manualTargetRef.current; // END
        // //and if the current butterfly position is getting closer and beyond threshold, clear manualTargetRef
        // if (currentPosition.distanceTo(target) < 1) {
        //   console.log("nulled");
        //   manualTargetRef.current = null;
        // }
      }

      //compute direction to the target from current position
      direction.subVectors(target, currentPosition).normalize();

      //slowdown and apply movement direction
      const moveAmount = 0.02;
      direction.multiplyScalar(moveAmount);

      // apply the noise-based movement to the direction
      direction.x += noise3D(time, 0, time) * 0.009;
      direction.y += noise3D(time, time, 0) * 0.007;
      direction.z += noise3D(0, time, time) * 0.009;

      blueButterfly.current.position.add(direction); //this instead

      // Clamp the butterfly's x-coordinate between 3 and 10
      blueButterfly.current.position.x = THREE.MathUtils.clamp(
        blueButterfly.current.position.x,
        3,
        13,
      );

      // if butterfly reaches the x boundary, set target to opposite boundary
      if (blueButterfly.current.position.x === 13) {
        target.x = 3;
      } else if (blueButterfly.current.position.x === 3) {
        target.x = 13;
      }

      setButterflyPosition(blueButterfly.current.position.clone());

      //ROTATION
      //determine the direction, apply the rotation
      if (
        !manualTargetRef.current ||
        currentPosition.distanceTo(manualTargetRef.current) > 0.1
      ) {
        const rotationY = Math.atan2(direction.z, direction.x) - Math.PI / 2; //calculate the roatation
        blueButterfly.current.rotation.y = rotationY; // apply the rotation
      }

      //change butterfly direction when it is near its target
      if (currentPosition.distanceTo(target) < 1) {
        target = computeRandomPointWithinFrustum();
      }

      const isInside = frustum.containsPoint(blueButterfly.current.position);
      if (!isInside) {
        //redirect the butterfly to a new point within the frustum or adjust its position
        target = computeRandomPointWithinFrustum();
      }

      time += 0.01;
      const animationId = requestAnimationFrame(animate);
      return () => {
        cancelAnimationFrame(animationId);
      };
    };

    animate();
  }, []);

  return (
    <>
      <primitive
        object={scene}
        ref={blueButterfly}
        position={[5, 3, 5 + offsetX]}
        rotation={[0.2, 3, 0]}
        scale={0.2}
      />
      {/* {manualTargetRef.current && (
        <mesh position={manualTargetRef.current}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color="red" />
        </mesh>
      )} */}
    </>
  );
};

export default Butterfly;
