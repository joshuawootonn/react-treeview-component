import classNames from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import { useTreeNode } from "lib/useTreeNode";
import { Folder, File, Arrow } from "./icons";
import { useDroppable, useDraggable } from "@dnd-kit/core";

type TreeNodeProps = {
  id: string;
  isRoot: boolean;
};

export function TreeNode({ id, isRoot }: TreeNodeProps) {
  const {
    isOpen,
    isFocused,
    isSelected,
    getTreeNodeProps,
    children,
    metadata,
  } = useTreeNode(id);

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
  } = useDraggable({
    id: id,
  });

  const { isOver, setNodeRef: setDroppabledNodeRef } = useDroppable({
    id,
    disabled: !metadata.isFolder,
  });

  const { ref, ...treeNodeProps } = getTreeNodeProps();

  return (
    <li
      key={id + "div"}
      className={classNames(
        "relative cursor-pointer select-none flex flex-col focus:outline-none",
        isOver && "bg-green"
      )}
      aria-expanded={metadata.isFolder && isOpen}
      ref={(element: HTMLElement | null) => {
        setDraggableNodeRef(element);
        setDroppabledNodeRef(element);
        ref(element);
      }}
      {...listeners}
      {...attributes}
      {...treeNodeProps}
      role="treeitem"
    >
      <div
        className={classNames(
          "flex flex-row items-center border-[1.5px] rounded-sm space-x-2",
          isFocused ? "border-slate-400" : "border-transparent",
          isSelected ? "bg-slate-200" : "bg-transparent"
        )}
      >
        {metadata.isFolder ? (
          <Arrow className="h-4 w-4" isExpanded={isOpen} />
        ) : (
          <div className="h-4 w-4" />
        )}
        {metadata.isFolder ? (
          <Folder isExpanded={isOpen} className="h-5 w-5" />
        ) : (
          <File className="h-5 w-5" />
        )}
        <span className="font-mono font-medium text-ellipsis whitespace-nowrap overflow-hidden">
          {metadata.name}
        </span>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.svg
            viewBox="0 0 3 60"
            fill="none"
            preserveAspectRatio="none"
            width={2}
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-[30px] h-[calc(100%-36px)] bottom-0 left-2.5 transform -translate-x-1/2 stroke-slate-200"
            key={id + "line"}
            stroke="currentColor"
            exit={{
              height: 0,
              transition: {
                duration: 0.25,
                ease: [0.165, 0.84, 0.44, 1],
              },
            }}
          >
            <motion.line
              strokeLinecap="round"
              x1="1"
              x2="1"
              y1="1"
              y2="59"
              strokeWidth={2}
            />
          </motion.svg>
        )}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.ul
            key={id + "ul"}
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  duration: 0.25,
                },
                opacity: {
                  duration: 0.2,
                  delay: 0.05,
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: 0.25,
                },
                opacity: {
                  duration: 0.2,
                },
              },
            }}
            className="[&>li]:ml-4"
          >
            {children?.map((childNodeId) => {
              return (
                <TreeNode
                  key={id + childNodeId}
                  id={childNodeId}
                  isRoot={false}
                />
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}
