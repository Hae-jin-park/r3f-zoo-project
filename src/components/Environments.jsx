/* eslint-disable react/no-unknown-property */
import { OrbitControls, useHelper } from '@react-three/drei';
import { Animal } from './Animal';
import { ZooMap } from './ZooMap';
import { Dino } from './Dino';
import { Suspense, useContext, Fragment, useRef } from 'react';
import { EditContext } from '../context/EditContext';
import { useFrame, useThree } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { Rtanny } from './Rtanny';
import * as THREE from 'three';

const START_Y = 20;
export const Environments = () => {
  const { isEditMode, objects, onObjectClicked, onPointMove } =
    useContext(EditContext);
  const { camera } = useThree();
  useFrame(() => {
    if (isEditMode) {
      camera.position.x = 0;
      camera.position.y = 400;
      camera.position.z = 0;
    }
  });

  const lightRef = useRef();
  useHelper(lightRef, THREE.DirectionalLightHelper);
  return (
    <>
      {isEditMode ? (
        <gridHelper
          onPointerMove={onPointMove}
          args={[500, 50]}
          position={[0, START_Y, 0]}
        />
      ) : null}
      <ambientLight intensity={4} />
      <directionalLight
        ref={lightRef}
        castShadow
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-mapsize={[5000, 5000]}
        intensity={4}
        position={[162, 0, 102]}
        target-position={[160, 0, 100]}
      />
      <OrbitControls />
      <Suspense>
        <Physics gravity={[0, -9.81, 0]}>
          <RigidBody
            name="land"
            friction={3}
            type="fixed"
            colliders={'trimesh'}
          >
            <ZooMap />
          </RigidBody>
          {objects.map(({ id, ...object }) => (
            <Fragment key={id}>
              {object.type === 'animal' ? (
                <Animal onClick={onObjectClicked} objectId={id} {...object} />
              ) : (
                <Dino onClick={onObjectClicked} objectId={id} {...object} />
              )}
            </Fragment>
          ))}
          <Rtanny />
        </Physics>
      </Suspense>
      <ZooMap />
    </>
  );
};
