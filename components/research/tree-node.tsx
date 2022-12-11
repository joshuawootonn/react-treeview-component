import classNames from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import { useTreeNode } from "lib/research/useTreeNode";
import { Folder, File, Arrow, Ellipse } from "components/common/icons";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { Menu, Transition } from "@headlessui/react";
import { MouseEvent, KeyboardEvent, FocusEvent, Fragment } from "react";

type TreeNodeProps = {
  id: string;
  isRoot: boolean;
};

export function TreeNode({ id }: TreeNodeProps) {
  const {
    isOpen,
    isFocused,
    isSelected,
    getTreeNodeProps,
    children,
    metadata,
    copy,
    paste,
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

  const { ref, tabIndex, ...treeNodeProps } = getTreeNodeProps();

  return (
    <li
      key={id + "div"}
      className={classNames(
        "relative cursor-pointer select-none flex flex-col focus:outline-none",
        isOver && "bg-slate-400/10"
      )}
      aria-expanded={metadata.isFolder && isOpen}
      ref={(element: HTMLElement | null) => {
        setDraggableNodeRef(element);
        setDroppabledNodeRef(element);
        ref(element);
        if (isFocused && element) {
          element.focus();
        }
      }}
      {...listeners}
      {...attributes}
      {...treeNodeProps}
      tabIndex={tabIndex}
      role="treeitem"
    >
      <div
        className={classNames(
          "group flex flex-row items-center border-[1.5px] rounded-sm space-x-2",
          isFocused
            ? "border-slate-400 focus-within:border-transparent"
            : "border-transparent",
          isSelected ? "bg-slate-300" : "bg-transparent"
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
        <span className="font-mono font-medium text-ellipsis whitespace-nowrap overflow-hidden flex-grow">
          {metadata.name}
        </span>

        <Menu
          as="div"
          className={classNames(
            "flex items-center relative text-left opacity-0 focus-within:opacity-100 group-hover:opacity-100",
            isFocused && "opacity-100"
          )}
          onClick={function (event: MouseEvent) {
            event.stopPropagation();
          }}
          onKeyDown={function (event: KeyboardEvent) {
            event.stopPropagation();
          }}
          onBlur={function (event: FocusEvent) {
            event.stopPropagation();
          }}
          onFocus={function (event: FocusEvent) {
            event.stopPropagation();
          }}
        >
          <Menu.Button
            onClick={function (event: MouseEvent) {
              event.stopPropagation();
            }}
            onKeyDown={function (event: KeyboardEvent) {
              event.stopPropagation();
            }}
            tabIndex={tabIndex}
            className="m-1 border-[1.5px] transform rounded-sm border-transparent focus-visible:border-slate-400 focus-visible:outline-none  "
          >
            <Ellipse className="h-5 w-5" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute w-32 left-full top-0 z-10  origin-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={classNames(
                      active ? "bg-slate-100 text-slate-900" : "text-slate-700",
                      "flex items-center w-full px-4 h-8 text-sm"
                    )}
                    onClick={function (event: MouseEvent) {
                      event.stopPropagation();
                      copy();
                    }}
                    onKeyDown={function (event: KeyboardEvent) {
                      event.stopPropagation();
                      console.log("copy - keydown");
                    }}
                  >
                    <span className="font-mono font-medium flex-grow text-left">
                      Copy
                    </span>
                    <span className="text-slate-400 text-xs">
                      ⌘<span className="text-lg leading-none">+</span>C
                    </span>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={classNames(
                      active ? "bg-slate-100 text-slate-900" : "text-slate-700",
                      "flex items-center w-full px-4 h-8 text-sm"
                    )}
                    onClick={function (event: MouseEvent) {
                      event.stopPropagation();
                      paste();
                    }}
                    onKeyDown={function (event: KeyboardEvent) {
                      event.stopPropagation();
                    }}
                  >
                    <span className="font-mono font-medium flex-grow text-left">
                      Paste
                    </span>
                    <span className="text-slate-400 text-xs">
                      ⌘<span className="text-lg leading-none">+</span>P
                    </span>
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
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
