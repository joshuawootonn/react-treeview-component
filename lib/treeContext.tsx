import MyApp from "pages/_app";
import React, {
  Dispatch,
  MutableRefObject,
  ReactNode,
  useReducer,
  useRef,
} from "react";
import { MyMap } from "./MyMap";

export type TreeType = {
  getTreeProps: () => {};
  state: ReducerState;
  dispatch: Dispatch<Actions>;
};

function getInitialState(): ReducerState {
  return {
    rootNodeIds: new Set<string>(),
    isOpen: new MyMap<string, boolean>(),
    children: new MyMap<string, string[]>(),
    parent: new MyMap<string, string>(),
    focusableId: null,
    focusedId: null,
    selectedId: null,
  };
}

export const TreeViewContext = React.createContext<TreeViewContextType>({
  getTreeProps: () => ({}),
  state: getInitialState(),
  dispatch: () => {},
  elements: { current: new MyMap<string, HTMLElement>() },
});

export type TreeViewContextType = TreeType & {
  elements: MutableRefObject<MyMap<string, HTMLElement>>;
};

type ReducerState = {
  rootNodeIds: Set<string>;
  isOpen: MyMap<string, boolean>;
  children: MyMap<string, string[]>;
  parent: MyMap<string, string>;
  focusableId?: string | null;
  focusedId?: string | null;
  selectedId?: string | null;
};

export enum TreeActionTypes {
  REGISTER_ROOT_NODE = "REGISTER_ROOT_NODE",
  DEREGISTER_ROOT_NODE = "DEREGISTER_ROOT_NODE",
  REGISTER_NODE = "REGISTER_NODE",
  DEREGISTER_NODE = "DEREGISTER_NODE",
  FOCUS = "FOCUS",
  BLUR = "BLUR",
  SELECT = "SELECT",
  UNSELECT = "UNSELECT",
  SET_FOCUSABLE = "SET_FOCUSABLE",
  OPEN = "OPEN",
  CLOSE = "CLOSE",
}

type Actions =
  | {
      type: TreeActionTypes.REGISTER_ROOT_NODE;
      id: string;
      childrenIds: string[];
    }
  | {
      type: TreeActionTypes.DEREGISTER_ROOT_NODE;
      id: string;
      childrenIds: string[];
    }
  | {
      type: TreeActionTypes.REGISTER_NODE;
      id: string;
      childrenIds: string[];
    }
  | { type: TreeActionTypes.DEREGISTER_NODE; id: string; childrenIds: string[] }
  | { type: TreeActionTypes.FOCUS; id: string }
  | { type: TreeActionTypes.BLUR; id: string }
  | { type: TreeActionTypes.SELECT; id: string }
  | { type: TreeActionTypes.UNSELECT; id: string }
  | { type: TreeActionTypes.SET_FOCUSABLE; id: string }
  | {
      type: TreeActionTypes.OPEN;
      id: string;
    }
  | {
      type: TreeActionTypes.CLOSE;
      id: string;
    };

export function getNextFocusableNode(
  state: ReducerState,
  originalId: string
): string {
  function traverse(id: string, prevId?: string): string {
    const isCurrentOpen = state.isOpen.get(id);
    const currentChildren = state.children.get(id);

    console.log(id, { isCurrentOpen, currentChildren });

    if (
      isCurrentOpen &&
      currentChildren &&
      (currentChildren?.length ?? 0) > 0
    ) {
      console.log({ originalId, id, prevId });
      //enter child @ 0
      if (originalId == id) {
        return currentChildren?.at(0) ?? id;
      }

      //enter child after current
      const currentLocation = currentChildren.findIndex(
        (childId) => childId === prevId
      );

      if (currentLocation !== currentChildren.length - 1) {
        return currentChildren.at(currentLocation + 1) ?? prevId ?? id;
      }
    }

    const isRoot = state.rootNodeIds.has(id);
    // console.log(id, { parentId: id, isRoot });
    if (isRoot) {
      let arr = Array.from(state.rootNodeIds);
      let index = arr.findIndex((ele: any) => id === ele);
      let nextRootNodeId = arr[index + 1];
      // console.log({ nextRootNodeId });

      if (nextRootNodeId == null) return originalId;

      return nextRootNodeId;
    }

    const parent = state.parent.get(id);

    if (parent) {
      return traverse(parent, id);
    }

    return id;
  }

  return traverse(originalId);
}

export function getPreviousFocusableNode(
  state: ReducerState,
  originalId: string
): string {
  const parent = state.parent.get(originalId);
  if (parent) {
    const siblingNodes = state.children.get(parent);

    if (!siblingNodes) {
      throw new Error("shouldn't be here");
      return originalId;
    }
    if (siblingNodes?.at(0) === originalId) {
      return parent;
    } else {
      //enter child after current
      const currentSiblingPosition = siblingNodes?.findIndex(
        (childId) => childId === originalId
      );

      if (currentSiblingPosition != null && currentSiblingPosition !== 0) {
        return traverse(
          siblingNodes.at(currentSiblingPosition - 1) ?? originalId
        );
      }
    }
  }
  let arr = Array.from(state.rootNodeIds);
  let index = arr.findIndex((ele: any) => originalId === ele);
  let prevRootNodeId = arr[index - 1];

  if (prevRootNodeId == null) return originalId;

  if (state.isOpen.get(prevRootNodeId) == true) {
    return traverse(prevRootNodeId);
  }
  return prevRootNodeId;

  function traverse(id: string): string {
    console.log(id);

    const children = state.children.get(id);
    console.log({ children, isOpen: state.isOpen.get(id) == false });

    if (
      children == null ||
      children.length === 0 ||
      state.isOpen.get(id) == null ||
      state.isOpen.get(id) == false
    ) {
      return id;
    }
    return traverse(children.at(children.length - 1) ?? id);
  }
}

function reducer(state: ReducerState, action: Actions): ReducerState {
  let nextRootNodeIds: Set<string>;
  let nextFocusableId: string | undefined | null,
    nextChildren: MyMap<string, string[]>,
    nextParent: MyMap<string, string>;

  switch (action.type) {
    case TreeActionTypes.REGISTER_ROOT_NODE:
      nextRootNodeIds = new Set(state.rootNodeIds);
      nextRootNodeIds.add(action.id);

      const isFirstNode = state.rootNodeIds.size === 0;
      nextFocusableId = isFirstNode ? action.id : state.focusableId;

      nextChildren = new MyMap(state.children).set(
        action.id,
        action.childrenIds
      );
      nextParent = new MyMap(state.parent);
      action.childrenIds.forEach((childId) => {
        nextParent.set(childId, action.id);
      });

      return {
        ...state,
        rootNodeIds: nextRootNodeIds,
        focusableId: nextFocusableId,
        children: nextChildren,
        parent: nextParent,
      };

    case TreeActionTypes.DEREGISTER_ROOT_NODE:
      nextRootNodeIds = new Set(state.rootNodeIds);
      nextRootNodeIds.delete(action.id);

      return {
        ...state,
        rootNodeIds: nextRootNodeIds,
      };

    case TreeActionTypes.REGISTER_NODE:
      nextChildren = new MyMap(state.children).set(
        action.id,
        action.childrenIds
      );

      nextParent = new MyMap(state.parent);
      action.childrenIds.forEach((childId) => {
        nextParent.set(childId, action.id);
      });

      return {
        ...state,
        children: nextChildren,
        parent: nextParent,
      };

    case TreeActionTypes.DEREGISTER_NODE:
      return state;

    case TreeActionTypes.FOCUS:
      return {
        ...state,
        focusedId: action.id,
      };

    case TreeActionTypes.BLUR:
      return {
        ...state,
        focusedId: state.focusedId === action.id ? null : state.focusedId,
      };

    case TreeActionTypes.SET_FOCUSABLE:
      return {
        ...state,
        focusableId: action.id,
      };

    case TreeActionTypes.OPEN:
      return {
        ...state,
        isOpen: new MyMap(state.isOpen).replace(action.id, true),
      };

    case TreeActionTypes.CLOSE:
      return {
        ...state,
        isOpen: new MyMap(state.isOpen).replace(action.id, false),
      };

    case TreeActionTypes.SELECT:
      return {
        ...state,
        selectedId: action.id,
      };

    case TreeActionTypes.UNSELECT:
      return {
        ...state,
        selectedId: null,
      };

    default:
      throw new Error("Reducer received an unknown action");
  }
}

type TreeViewProviderProps = {
  // children: (tree: TreeType) => ReactNode | ReactNode[];
  children: ReactNode;
};

export function TreeViewProvider({ children }: TreeViewProviderProps) {
  const elements = useRef<MyMap<string, HTMLElement>>(new MyMap());
  const [state, dispatch] = useReducer(reducer, getInitialState());
  return (
    <TreeViewContext.Provider value={{ dispatch, elements, state } as any}>
      {children}

      {/* <button
        onClick={() => {
          console.log({ dispatch, ...state });
        }}
      >
        print state
      </button> */}
    </TreeViewContext.Provider>
  );
}
