import {
  useSensor,
  MouseSensor,
  TouchSensor,
  useSensors,
  DragEndEvent,
  DndContext,
} from "@dnd-kit/core";
import { motion } from "framer-motion";
import { data } from "lib/common/initialValue";
import { TreeViewProvider, TreeActionTypes } from "lib/research/treeContext";
import { useEffect } from "react";
import { TreeArea } from "./tree-area";
import { TreeNode } from "./tree-node";

export const InitialResearchTree = () => {
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  // useEffect(() => {
  //   document.addEventListener("focusin", ListenToActiveElement, true);

  //   return () => document.removeEventListener("focusin", ListenToActiveElement);

  //   function ListenToActiveElement() {
  //     console.log("focused: ", document.activeElement);
  //   }
  // }, []);

  const sensors = useSensors(mouseSensor, touchSensor);
  return (
    <motion.div className="flex flex-col justify-start items-start p-12 space-y-12">
      <button> Button before </button>
      <TreeViewProvider initialTree={data}>
        {({ rootNodeIds, dispatch }) => {
          function handleDragEnd(event: DragEndEvent) {
            console.log("end dropping");
            if (event.over && event.over.id != null) {
              const id = event.active.id.toString();
              dispatch({
                type: TreeActionTypes.MOVE,
                id,
                to: event.over.id.toString(),
              });

              dispatch({
                type: TreeActionTypes.SELECT,
                id,
              });
              dispatch({
                type: TreeActionTypes.SET_FOCUSABLE,
                id,
              });
              dispatch({
                type: TreeActionTypes.FOCUS,
                id,
              });
            }
          }
          return (
            <DndContext
              // required to make server and client attributes match
              id={"treeview"}
              sensors={sensors}
              onDragEnd={handleDragEnd}
            >
              <TreeArea>
                {rootNodeIds?.map((id) => {
                  return <TreeNode key={id} id={id} isRoot={true} />;
                })}
              </TreeArea>
            </DndContext>
          );
        }}
      </TreeViewProvider>

      <button> Button after </button>
    </motion.div>
  );
};
