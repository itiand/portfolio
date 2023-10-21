const PlaneComponent = ({ butterflyPosition }) => {
  const { camera, scene } = useThree();
  const planeRef = useRef();

  useEffect(() => {
    if (planeRef.current && camera) {
      planeRef.current.lookAt(camera.position);
    }
  }, [camera.position]);

  return (
    <Plane
      ref={planeRef}
      position={[butterflyPosition.x, 0, 0]}
      args={[100, 100]}
    >
      <meshStandardMaterial
        attach="material"
        opacity={0.2}
        transparent
        side={THREE.DoubleSide}
      />
    </Plane>
  );
};

export default PlaneComponent;
