import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, useGLTF } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';
import Slider from './components/UI/Slider';


export const GenericGLB = ({ url, position, scale, setIsDragging }) => {
  const { scene } = useGLTF(url);
  const [hovered, setHovered] = useState(false);

  const [{ position: springPos }, api] = useSpring(() => ({
    position,
    config: { friction: 10 },
  }));

  const bind = useDrag(
    ({ active, movement: [x, y] }) => {
      setIsDragging?.(active);
      setHovered(active);
      api.start({
        position: [position[0] + x / 50, position[1] - y / 50, position[2]],
      });
    },
    { eventOptions: { pointer: true } }
  );

  return (
    <a.group position={springPos} {...bind()}>
      <Center scale={scale}>
        <primitive object={scene.clone(true)} />
      </Center>
      {hovered && (
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial color="red" transparent opacity={0.5} />
        </mesh>
      )}
    </a.group>
  );
};

useGLTF.preload('/assets/apple.glb');

const App = () => {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <>
      <div style={{ width: '200px', position: 'absolute', zIndex: 10, padding: '1rem' }}>
        <Slider
          label="Scale"
          min={0.1}
          max={2}
          step={0.05}
          value={scale}
          onChange={setScale}
        />
      </div>

      <Canvas camera={{ position: [0, 2, 10], fov: 50 }} style={{ height: '100vh', width: '100vw' }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls enabled={!isDragging} />

        <Suspense fallback={null}>
          <GenericGLB
            url="/assets/apple.glb"
            position={[-20, 0, 0]}
            scale={scale}
            setIsDragging={setIsDragging}
          />
          <GenericGLB
            url="/assets/apple.glb"
            position={[0, 0, 0]}
            scale={scale}
            setIsDragging={setIsDragging}
          />
          <GenericGLB
            url="/assets/apple.glb"
            position={[20, 0, 0]}
            scale={scale}
            setIsDragging={setIsDragging}
          />
        </Suspense>
      </Canvas>
    </>
  );
};

export default App;
