import { createContext, useState } from 'react';

const START_Y = 20;

const data = [
  {
    id: crypto.randomUUID(),
    name: 'Alpaca',
    type: 'animal',
    position: [17, START_Y, 0],
    rotation: [0, 0, 0],
  },
  {
    id: crypto.randomUUID(),
    name: 'Bull',
    type: 'animal',
    position: [23, START_Y, 0],
    rotation: [0, 0, 0],
  },
  {
    id: crypto.randomUUID(),
    name: 'Cow',
    type: 'animal',
    position: [24, START_Y, 0],
    rotation: [0, 0, 0],
  },
  {
    id: crypto.randomUUID(),
    name: 'Deer',
    type: 'animal',
    position: [29, START_Y, 0],
    rotation: [0, 0, 0],
  },
  {
    id: crypto.randomUUID(),
    name: 'Donkey',
    type: 'animal',
    position: [14, START_Y, 10],
    rotation: [0, 0, 0],
  },
  {
    id: crypto.randomUUID(),
    name: 'Fox',
    type: 'animal',
    position: [13, START_Y, 22],
    rotation: [0, 0, 0],
  },
  {
    id: crypto.randomUUID(),
    name: 'Horse',
    type: 'animal',
    position: [15, START_Y, 1],
    rotation: [0, 0, 0],
  },
  {
    id: crypto.randomUUID(),
    name: 'Husky',
    type: 'animal',
    position: [67, START_Y, 10],
    rotation: [0, 0, 0],
  },
  {
    id: crypto.randomUUID(),
    name: 'ShibaInu',
    type: 'animal',
    position: [40, START_Y, 22],
    rotation: [0, 0, 0],
  },
  {
    id: crypto.randomUUID(),
    name: 'Stag',
    type: 'animal',
    position: [22, START_Y, 40],
    rotation: [0, 0, 0],
  },
  {
    id: crypto.randomUUID(),
    name: 'WhiteHorse',
    type: 'animal',
    position: [10, START_Y, 10],
    rotation: [0, 0, 0],
  },
  {
    id: crypto.randomUUID(),
    name: 'Wolf',
    type: 'animal',
    position: [4, START_Y, 50],
    rotation: [0, 0, 0],
  },
  {
    id: crypto.randomUUID(),
    name: 'Apatosaurus',
    type: 'dino',
    position: [34, START_Y, 16],
    rotation: [0, 0, 0],
  },
  {
    id: crypto.randomUUID(),
    name: 'Parasaurolophus',
    type: 'dino',
    position: [-15, START_Y, 20],
    rotation: [0, 0, 0],
  },
  {
    id: crypto.randomUUID(),
    name: 'Stegosaurus',
    type: 'dino',
    position: [11, START_Y, 23],
    rotation: [0, 0, 0],
  },
  {
    id: crypto.randomUUID(),
    name: 'TRex',
    type: 'dino',
    position: [-20, START_Y, 18],
    rotation: [0, 0, 0],
  },
  {
    id: crypto.randomUUID(),
    name: 'Triceratops',
    type: 'dino',
    position: [9, START_Y, 44],
    rotation: [0, 0, 0],
  },
  {
    id: crypto.randomUUID(),
    name: 'Velociraptor',
    type: 'dino',
    position: [34, START_Y, 7],
    rotation: [0, 0, 0],
  },
];

export const EditContext = createContext();

export const EditProvider = ({ children }) => {
  const [isEditMode, setEditMode] = useState(false);
  const initialData = localStorage.getItem('objects');

  const [objects, setObjects] = useState(
    initialData ? JSON.parse(initialData) : data
  );
  const [selectedId, setSelectedId] = useState();
  const [draggedPosition, setDraggedPosition] = useState();

  const setObjs = (objects) => {
    setObjects(objects);
    localStorage.setItem('objects', JSON.stringify(objects));
  };

  const transform = () => {
    setObjs(
      objects.map((object) =>
        object.id === selectedId
          ? { ...object, position: draggedPosition }
          : object
      )
    );
  };

  const rotate = (type) => {
    if (type === 'left') {
      setObjs(
        objects.map((obj) => {
          return obj.id === selectedId
            ? {
                ...obj,
                rotation: [
                  obj.rotation[0],
                  obj.rotation[1] - Math.PI / 12,
                  obj.rotation[2],
                ],
              }
            : obj;
        })
      );
    }

    if (type === 'right') {
      setObjs(
        objects.map((obj) => {
          return obj.id === selectedId
            ? {
                ...obj,
                rotation: [
                  obj.rotation[0],
                  obj.rotation[1] + Math.PI / 12,
                  obj.rotation[2],
                ],
              }
            : obj;
        })
      );
    }
  };

  const onObjectClicked = (id) => (e) => {
    e.stopPropagation();
    if (id && id === selectedId && isEditMode) {
      transform();
      setSelectedId(null);
      return;
    }
    setSelectedId(id);
  };

  const onPointMove = (e) => {
    setDraggedPosition(Object.values(e.point));
  };
  const value = {
    selectedId,
    setSelectedId,
    draggedPosition,
    setDraggedPosition,
    objects,
    setObjects,
    isEditMode,
    setEditMode,
    onObjectClicked,
    onPointMove,
    rotate,
  };
  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
};
