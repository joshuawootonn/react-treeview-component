import { useDroppable } from "@dnd-kit/core";
import classNames from "classnames";
import { useTreeArea } from "lib/useTreeArea";
import { ReactNode } from "react";

type TreeAreaProps = { children: ReactNode };

export const TREE_AREA_ID = "tree-area";

export function TreeArea({ children }: TreeAreaProps) {
  const { isFocused, getTreeAreaProps } = useTreeArea(TREE_AREA_ID);

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
        "min-h-[400px] w-[200px] border-[1.5px] rounded-sm",
        isFocused ? "border-slate-400" : "border-transparent",
        isOver && "bg-green"
      )}
      {...treeAreaProps}
      ref={(element: HTMLElement | null) => {
        setDroppabledNodeRef(element);
        ref(element);
      }}
    >
      {children}
    </ul>
  );
}
