import React, { ReactNode, useState } from "react";
import { initialValue } from "./initialValue";
import { MyTreeNode } from "./types";

type TreeViewContextType = {
  getTreeItemProps: () => void;
  getTreeNodeProps: () => void;
};

export const TreeViewContext = React.createContext<TreeViewContextType>({
  rootId: initialValue.find((curr) => curr.parentId == null)?.id ?? "0",
  arr: initialValue.map((curr) => curr.id),
  obj: initialValue.reduce(
    (acc, curr) => ({ ...acc, [curr.id]: curr }),
    {}
  ) as Record<string, MyTreeNode>,
  updateNode: (node: MyTreeNode) => {},
  getChildren: (node: MyTreeNode) => [] as MyTreeNode[],
  getTreeItemProps: () => {},
  getTreeNodeProps: () => {},
});

type TreeViewProviderProps = {
  children: ReactNode;
};

export function TreeViewProvider({ children }: TreeViewProviderProps) {
  const [value, setValue] = useState(() => {
    return {
      rootId: initialValue.find((curr) => curr.parentId == null)?.id ?? "0",
      arr: initialValue.map((curr) => curr.id),
      obj: initialValue.reduce(
        (acc, curr) => ({ ...acc, [curr.id]: curr }),
        {}
      ) as Record<string, MyTreeNode>,
    };
  });

  return (
    <TreeViewContext.Provider
      value={{
        ...value,
        updateNode: (node: MyTreeNode) => {
          setValue((prev) => ({
            ...prev,
            obj: { ...prev.obj, [node.id]: node },
          }));
        },
        getChildren: (node: MyTreeNode) => {
          return value.arr
            .map((id) => value.obj[id])
            .filter((treeNode) => treeNode.parentId === node.id);
        },
      }}
    >
      {children}
    </TreeViewContext.Provider>
  );
}
