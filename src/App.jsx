import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import Slider from './components/UI/Slider';
import { GenericGLB } from './utils/GenericGLB';


const objectList = [
  {
    url: '/assets/earth.glb',
    position: [-20, 0, 0],
  },
  {
    url: '/assets/earth.glb',
    position: [0, 0, 0],
  },
  {
    url: '/assets/earth.glb',
    position: [20, 0, 0],
  },
];


objectList.forEach(obj => useGLTF.preload(obj.url));

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
          {objectList.map((obj, index) => (
            <GenericGLB
              key={index}
              url={obj.url}
              position={obj.position}
              scale={scale}
              setIsDragging={setIsDragging}
            />
          ))}
        </Suspense>
      </Canvas>
    </>
  );
};

export default App;
