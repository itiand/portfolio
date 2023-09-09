import { useGLTF } from "@react-three/drei";

const Avatar = () => {
  const { scene } = useGLTF("./readyPlayerMe.glb");

  console.log("scene", scene);

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
