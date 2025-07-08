import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getAttr } from '../utils/attribute.js';

const G = 6.67430e-2; // Gravitational constant

const BehaviorManager = ({ config, setConfig }) => {
  useFrame((state, delta) => {
    const updatedConfig = config.map(obj => ({ ...obj, attributes: [...obj.attributes] })); // Deep copy attributes

    // Calculate gravitational forces
    for (let i = 0; i < updatedConfig.length; i++) {
      for (let j = i + 1; j < updatedConfig.length; j++) {
        const obj1 = updatedConfig[i];
        const obj2 = updatedConfig[j];

        const mass1 = getAttr(obj1.attributes, 'mass', 0);
        const mass2 = getAttr(obj2.attributes, 'mass', 0);

        const pos1 = new THREE.Vector3(...getAttr(obj1.attributes, 'position', [0, 0, 0]));
        const pos2 = new THREE.Vector3(...getAttr(obj2.attributes, 'position', [0, 0, 0]));

        const r = pos2.clone().sub(pos1);
        const distance = r.length();


        if (distance === 0) continue; // Avoid division by zero

        const forceMagnitude = (G * mass1 * mass2) / (distance * distance);
        const force = r.normalize().multiplyScalar(forceMagnitude);

        // Apply forces to objects
        const forceAttr1 = obj1.attributes.find(attr => attr.name === 'force');
        const forceAttr2 = obj2.attributes.find(attr => attr.name === 'force');

        if (forceAttr1) {
          forceAttr1.value[0] += force.x;
          forceAttr1.value[1] += force.y;
          forceAttr1.value[2] += force.z;
        }
        if (forceAttr2) {
          forceAttr2.value[0] -= force.x;
          forceAttr2.value[1] -= force.y;
          forceAttr2.value[2] -= force.z;
        }

        console.log(force);


      }
    }

    // Update velocities and positions
    const finalConfig = updatedConfig.map(obj => {
      const newAttributes = obj.attributes.map(attr => {
        if (attr.name === 'velocity') {
          const mass = getAttr(obj.attributes, 'mass', 1);
          const force = getAttr(obj.attributes, 'force', [0, 0, 0]);
          const newVelocity = attr.value.map((v, i) => v + (force[i] / mass) * delta);
          return { ...attr, value: newVelocity };
        } else if (attr.name === 'position') {
          const velocity = getAttr(obj.attributes, 'velocity', [0, 0, 0]);
          const newPosition = attr.value.map((p, i) => p + velocity[i] * delta);
          return { ...attr, value: newPosition };
        } else if (attr.name === 'force') {
          return { ...attr, value: [0, 0, 0] }; // Reset force for next frame
        }
        return attr;
      });

      return {
        ...obj,
        attributes: newAttributes,
      };
    });

    setConfig(finalConfig);
  });

  return null;
};

export default BehaviorManager;
