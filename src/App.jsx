import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';
import Slider from './components/UI/Slider';

const App = () => {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <>
      <div style={{ width: '200px' }}>
        <Slider
          label="Scale"
          min={0.1}
          max={2}
          step={0.05}
          value={scale}
          onChange={setScale}
        />
      </div>
      <Canvas style={{ height: '100vh', width: '100vw' }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls enabled={!isDragging} />
        <Suspense fallback={null}>
          <DraggableDuck position={[0, 0, 0]} scale={scale} setIsDragging={setIsDragging} />
          <DraggableDuck position={[-2, 0, 0]} scale={scale} setIsDragging={setIsDragging} />
          <DraggableDuck position={[2, 0, 0]} scale={scale} setIsDragging={setIsDragging} />
        </Suspense>
      </Canvas>
    </>
  );
};

const DraggableDuck = ({ position, scale, setIsDragging }) => {
  const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/duck/model.gltf');
  const [hovered, setHovered] = useState(false);
  const [{ position: springPos }, api] = useSpring(() => ({
    position: position,
    config: { friction: 10 },
  }));

  const bind = useDrag(
    ({ active, movement: [x, y] }) => {
      setIsDragging(active);
      setHovered(active);
      api.start({ position: [position[0] + x / 50, position[1] - y / 50, position[2]] });
    },
    { eventOptions: { pointer: true } }
  );

  return (
    <a.group position={springPos} {...bind()} scale={scale}>
      <primitive object={scene.clone()} />
      {hovered && (
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial color="red" transparent opacity={0.5} />
        </mesh>
      )}
    </a.group>
  );
};

useGLTF.preload('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/duck/model.gltf');

export default App;
