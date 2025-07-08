import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import Slider from './components/UI/Slider';
import Renderer from './lifecycle/Renderer';
import BehaviorManager from './lifecycle/BehaviorManager';

import initialObjectConfigs from '../public/data/objects/apple.json';

import styles from './App.module.scss';

const App = () => {
  const [objectConfigs, setObjectConfigs] = useState(initialObjectConfigs);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  console.log(objectConfigs.attributes.at(1).value);

  return (
    <>
      <div className={styles.container}>

        <div className={styles.galleryContainer}>
          
        </div>

        <main>
          <div className={styles.canvasContainer}>
            <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <OrbitControls enabled={!isDragging} />

              <Suspense fallback={null}>
                <Renderer config={objectConfigs} />
                <BehaviorManager config={objectConfigs} setConfig={setObjectConfigs} />
              </Suspense>
            </Canvas>
          </div>

          <div className={styles.controlUIContainer}>
            
            <Slider
              label="Scale"
              min={0.1}
              max={2}
              step={0.05}
              value={scale}
              onChange={setScale}
            />

          </div>

        </main>

      </div>
    </>
  );
};

export default App;
