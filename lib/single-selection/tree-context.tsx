import React, {
  Dispatch,
  MutableRefObject,
  ReactNode,
  RefObject,
  useReducer,
  useRef,
} from "react";
import { MyMap } from "lib/common/MyMap";
import { TreeNodeType } from "lib/common/types";
import { getInitialTreeState } from "./tree-initialization";
import {
  TreeActions,
  treeReducer,
  TreeState,
  TREE_AREA_ID,
} from "./tree-state";

export type TreeViewContextType = {
  state: TreeState;
  dispatch: Dispatch<TreeActions>;
  elements: MutableRefObject<MyMap<string, HTMLElement>>;
};

export const TreeViewContext = React.createContext<TreeViewContextType>({
  state: getInitialTreeState([]),
  dispatch: () => {},
  elements: { current: new MyMap<string, HTMLElement>() },
});

type TreeViewProviderProps = {
  children: ({
    rootNodeIds,
    dispatch,
  }: {
    rootNodeIds: string[];
    dispatch: React.Dispatch<TreeActions>;
    elements: RefObject<MyMap<string, HTMLElement>>;
    state: TreeState;
  }) => ReactNode | ReactNode[];
  initialTree: TreeNodeType[];
};

export function TreeViewProvider({
  children,
  initialTree,
}: TreeViewProviderProps) {
  const elements = useRef<MyMap<string, HTMLElement>>(new MyMap());
  const [state, dispatch] = useReducer(
    treeReducer,
    getInitialTreeState(initialTree)
  );

  return (
    <TreeViewContext.Provider value={{ dispatch, elements, state }}>
      {children({
        rootNodeIds: state.children.get(TREE_AREA_ID) ?? [],
        dispatch,
        elements,
        state,
      })}
    </TreeViewContext.Provider>
  );
}
