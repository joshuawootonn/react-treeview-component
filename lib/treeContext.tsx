import React from "react";
import { initialValue } from "./initialValue";
import { MyTreeNode } from "./types";

export const TreeViewContext = React.createContext({
  rootId: initialValue.find((curr) => curr.parentId == null)?.id ?? "0",
  arr: initialValue.map((curr) => curr.id),
  obj: initialValue.reduce(
    (acc, curr) => ({ ...acc, [curr.id]: curr }),
    {}
  ) as Record<string, MyTreeNode>,
  updateNode: (node: MyTreeNode) => {},
  getChildren: (node: MyTreeNode) => [] as MyTreeNode[],
});
