import { useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

const FairyDustParticles = () => {
  const [particles, setParticles] = useState([]);

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.5,
    map: new THREE.TextureLoader().load("./textures/particles/1.png"),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.7,
  });

  const particleGeometry = new THREE.BufferGeometry();
  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
};

export default FairyDustParticles;
