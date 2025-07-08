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

  useEffect(() => {
    const loadSceneAndObjects = async () => {
      try {
        const scenePath = '/data/scenes/newtongravity.json';
        const res = await fetch(scenePath);
        const sceneData = await res.json();
        setScene(sceneData);

        const objectConfigs = await Promise.all(
          sceneData.objects.map(async ({ name }) => {
            const objectPath = `/data/objects/${name}.json`;
            const objRes = await fetch(objectPath);
            return await objRes.json();
          })
        );

        setObjectConfigs(objectConfigs);
      } catch (err) {
        console.error('Failed to load scene or objects:', err);
      }
    };

    loadSceneAndObjects();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.galleryContainer}>{/* Optional gallery */}</div>

      <main>
        <div className={styles.canvasContainer}>
          <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <OrbitControls enabled={!isDragging} />
            <Suspense fallback={null}>
              {objectConfigs.length > 0 && (
                <>
                  <Renderer config={objectConfigs} />
                  <BehaviorManager
                    config={objectConfigs}
                    setConfig={setObjectConfigs}
                  />
                </>
              )}
            </Suspense>
          </Canvas>
        </div>

        <div className={styles.controlUIContainer}>{/* UI here */}</div>
      </main>
    </div>
  );
};

export default App;
