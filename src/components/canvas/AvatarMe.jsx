import { useGLTF } from "@react-three/drei";

const Avatar = () => {
  const { scene } = useGLTF("./readyPlayerMe.glb");

  console.log("scene", scene);

  scene.traverse((child) => {
    if (child.isMesh && child.name === "Wolf3D_Hands") {
      child.visible = false;
    }
  });

  return <primitive object={scene} />;
};

export default Avatar;
// export default AvatarCanvas;
