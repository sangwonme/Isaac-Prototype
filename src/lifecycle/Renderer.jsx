import React, { useEffect } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import { a, useSpring } from '@react-spring/three';

const Renderer = ({ config }) => {
  const { asset, attributes } = config;
  const { scene } = useGLTF(asset);

  const getAttr = (name, fallback) =>
    attributes.find(attr => attr.name === name)?.value ?? fallback;

  const position = getAttr('position', [0, 0, 0]);
  const scale = getAttr('scale', 1);

  return (
    <primitive object={scene.clone(true)} position={position}/>
  );
};

export default Renderer;
