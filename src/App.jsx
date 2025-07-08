import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Renderer from './lifecycle/Renderer';
import BehaviorManager from './lifecycle/BehaviorManager';
import styles from './App.module.scss';

const App = () => {
  const [objectConfigs, setObjectConfigs] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [scene, setScene] = useState(null);

  // Load scene.json and respective object configs
  useEffect(() => {
    const loadSceneAndObjects = async () => {
      const sceneRes = await fetch('/data/scenes/newtongravity.json');
      const sceneData = await sceneRes.json();
      setScene(sceneData);

      const objectNames = sceneData.objects.map(obj => obj.name);
      const loadedObjects = await Promise.all(
        objectNames.map(async (name) => {
          const objRes = await fetch(`/data/objects/${name}.json`);
          return await objRes.json();
        })
      );

      setObjectConfigs(loadedObjects);
    };

    loadSceneAndObjects();
  }, []);

  return (
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
          {/* UI Panels could go here */}
        </div>
      </main>
    </div>
  );
};

export default App;
