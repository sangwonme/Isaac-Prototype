import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { a } from '@react-spring/three';
import * as THREE from 'three';
import { getAttr } from '../utils/attribute.js';

const RenderSingleObject = ({ config }) => {
  const groupRef = useRef();
  const { asset, attributes } = config;
  const { scene } = useGLTF(asset);
  const [normalizedScale, setNormalizedScale] = useState([1, 1, 1]);

  const position = getAttr(attributes, 'position', [0, 0, 0]);
  const desiredSize = getAttr(attributes, 'scale', 1);

  // normalize the size
  useEffect(() => {
    if (!scene) return;

    const clonedScene = scene.clone(true);
    
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxSize = Math.max(size.x, size.y, size.z);
    const scaleFactor = desiredSize / maxSize;

    setNormalizedScale([scaleFactor, scaleFactor, scaleFactor]);
  }, [scene, desiredSize]);

  return (
    <a.group ref={groupRef} position={position} scale={normalizedScale}>
      <primitive object={scene.clone(true)} />
    </a.group>
  );
};

const Renderer = ({ config }) => {
  if (!Array.isArray(config)) return null;

  return (
    <>
      {config.map((objConfig, index) => (
        <RenderSingleObject key={objConfig.name || index} config={objConfig} />
      ))}
    </>
  );
};

export default Renderer;
