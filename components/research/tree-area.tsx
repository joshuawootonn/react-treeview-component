import { useDroppable } from "@dnd-kit/core";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { useTreeArea } from "lib/research/useTreeArea";
import { MouseEvent, ReactNode } from "react";

type TreeAreaProps = { children: ReactNode };

export const TREE_AREA_ID = "tree-area";

export function TreeArea({ children }: TreeAreaProps) {
  const { pasteIntoTreeArea, isFocused, getTreeAreaProps } =
    useTreeArea(TREE_AREA_ID);

  const { isOver, setNodeRef: setDroppabledNodeRef } = useDroppable({
    id: TREE_AREA_ID,
  });

  const { ref, ...treeAreaProps } = getTreeAreaProps();
  return (
    <ul
      role="tree"
      aria-label="File Manager"
      aria-multiselectable="false"
      className={classNames(
        "relative pb-8 h-[400px] w-[300px] border-[1.5px] rounded-sm ",
        isFocused ? "border-slate-400" : "border-slate-100",
        isOver && "bg-slate-400/10"
      )}
      {...treeAreaProps}
      ref={(element: HTMLElement | null) => {
        setDroppabledNodeRef(element);
        ref(element);
      }}
    >
      <AnimatePresence>
        {pasteIntoTreeArea && (
          <motion.button
            onClick={function (event: MouseEvent) {
              event.preventDefault();
              pasteIntoTreeArea();
            }}
            className="absolute top-0 right-0 cursor-pointer select-none border-[1.5px] border-slate-400 px-2 py-1 rounded-sm"
            initial={{
              y: -30,
              x: -5,
              opacity: 0,
            }}
            animate={{
              y: -45,
              opacity: 1,
              transition: {
                y: {
                  duration: 0.25,
                },
                opacity: {
                  duration: 0.2,
                  delay: 0.05,
                },
              },
            }}
            exit={{
              y: -30,
              opacity: 0,
              transition: {
                y: {
                  duration: 0.25,
                },
                opacity: {
                  duration: 0.2,
                },
              },
            }}
          >
            paste
          </motion.button>
        )}
      </AnimatePresence>
      {children}
    </ul>
  );
}
