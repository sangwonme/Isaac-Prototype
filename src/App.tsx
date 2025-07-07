import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useState, Suspense } from 'react';
import * as THREE from 'three';
import Slider from './components/UI/Slider';

const App = () => {
  const [scale, setScale] = useState(1);

  return (
    <>
      <div 
        style={{width: '200px'}}>
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
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls />
        <Suspense fallback={null}>
          <Duck scale={scale} />
        </Suspense>
      </Canvas>
    </>
  );
};

const Duck = ({ scale }: { scale: number }) => {
  const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/duck/model.gltf');
  return <primitive object={scene} scale={scale} />;
};

useGLTF.preload('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/duck/model.gltf');

export default App;
