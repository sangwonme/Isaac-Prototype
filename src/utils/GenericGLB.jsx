import React, { useState } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import { useSpring, a } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';

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


