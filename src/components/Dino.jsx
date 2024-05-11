/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useAnimations, useGLTF } from '@react-three/drei';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { SkeletonUtils } from 'three-stdlib';
import { EditContext } from '../context/EditContext';
import { RigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Dino = ({ name, objectId, onClick, position, ...props }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(`/models/dinos/${name}.glb`);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions } = useAnimations(animations, group);
  const { isEditMode, selectedId, draggedPosition } = useContext(EditContext);
  const isSelected = objectId === selectedId;

  useEffect(() => {
    actions[`Armature|${name}_Idle`].reset().play();
  });

  useFrame((state) => {
    if (isSelected && !isEditMode) {
      const [offsetX, offsetY, offsetZ] = position;

      const { x, y, z } = group.current.children[0].position;
      const realX = offsetX + x;
      const realY = offsetY + y;
      const realZ = offsetZ + z;
      state.camera.lookAt(realX, realY, realZ);
      state.camera.position.lerp(
        new THREE.Vector3(realX, realY + 20, realZ + 40),
        0.01
      );
    }
  });
  return (
    <>
      {isEditMode ? (
        <group
          scale={[2.5, 2.5, 2.5]}
          onClick={onClick(objectId)}
          position={isSelected ? draggedPosition : position}
          {...props}
          ref={group}
        >
          <mesh>
            <boxGeometry args={[3, 1, 8]} />
            <meshBasicMaterial transparent opacity={0.7} color={'green'} />
          </mesh>
          <primitive object={clone}></primitive>
        </group>
      ) : (
        <group ref={group} position={position}>
          <RigidBody
            {...props}
            colliders={'hull'}
            enabledRotations={[false, false, false]}
          >
            <group onClick={onClick(objectId)}>
              <primitive object={clone}></primitive>
            </group>
          </RigidBody>
        </group>
      )}
    </>
  );
};
