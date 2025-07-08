import { useFrame } from '@react-three/fiber';

const BehaviorManager = ({ config, setConfig }) => {
  useFrame((state, delta) => {
    const updatedConfig = config.map(obj => {
      const newAttributes = obj.attributes.map(attr => {
        if (attr.name === 'position') {
          const velocityAttr = obj.attributes.find(a => a.name === 'velocity');
          const velocity = velocityAttr?.value ?? [0, 0, 0];
          const newPosition = attr.value.map((p, i) => p + velocity[i] * delta);
          return { ...attr, value: newPosition };
        }
        return attr;
      });

      return {
        ...obj,
        attributes: newAttributes,
      };
    });

    setConfig(updatedConfig);
  });

  return null;
};

export default BehaviorManager;
