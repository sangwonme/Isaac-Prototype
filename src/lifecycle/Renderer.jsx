import React from 'react';
import { useGLTF, Center } from '@react-three/drei';
import { a } from '@react-spring/three';
import { useSpring } from '@react-spring/three';

const Renderer = ({ config }) => {
  const { asset, attributes } = config;
  const { scene } = useGLTF(asset);

  const getAttr = (name, fallback) =>
    attributes.find(attr => attr.name === name)?.value ?? fallback;

  const position = getAttr('position', [0, 0, 0]);
  const scale = getAttr('scale', 1);

  const [{ pos }] = useSpring(() => ({
    pos: position,
    config: { friction: 10 },
  }));

  return (
    <a.group position={pos} scale={scale}>
      <Center>
        <primitive object={scene.clone(true)} />
      </Center>
    </a.group>
  );
};

export default Renderer;
