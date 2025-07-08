import { useFrame } from '@react-three/fiber';

const BehaviorManager = ({ config, setConfig }) => {
  useFrame((state, delta) => {
    const { attributes } = config;
    const position = attributes.find(attr => attr.name === 'position').value;
    const velocity = attributes.find(attr => attr.name === 'velocity').value;

    const newPosition = position.map((p, i) => p + velocity[i] * delta);

    const newAttributes = attributes.map(attr => {
      if (attr.name === 'position') {
        return { ...attr, value: newPosition };
      }
      return attr;
    });

    setConfig({ ...config, attributes: newAttributes });
  });

  return null;
};

export default BehaviorManager;
